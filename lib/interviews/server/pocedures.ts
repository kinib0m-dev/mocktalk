import { z } from "zod";
import { db } from "@/db";
import {
  interviews,
  interviewQuestions,
  interviewFeedback,
  metricScores,
  questionFeedback,
  jobDescriptions,
  interviewTranscripts,
} from "@/db/schema";
import { eq, and, like, desc, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { questionTypeSchema } from "@/lib/utils/zodSchemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import {
  deductQuestionCredits,
  getUserCredits,
} from "@/lib/auth/helpers/credits";
import { generateInterviewQuestions } from "../questionGenerator";

export const interviewsRouter = createTRPCRouter({
  // Generate a new interview session
  generateInterview: protectedProcedure
    .input(
      z.object({
        jobOfferId: z.string(),
        title: z.string().min(1),
        questionCount: z.number().int().min(3).max(7),
        selectedTypes: z.array(questionTypeSchema).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { jobOfferId, title, questionCount, selectedTypes } = input;

      try {
        // 1. Check if user has enough credits
        const credits = await getUserCredits(user.id);

        if (credits.remainingQuestions < questionCount) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Not enough question credits. You have ${credits.remainingQuestions} remaining but need ${questionCount}.`,
          });
        }

        // 2. Get job description
        const [job] = await db
          .select()
          .from(jobDescriptions)
          .where(
            and(
              eq(jobDescriptions.id, jobOfferId),
              eq(jobDescriptions.userId, user.id)
            )
          )
          .limit(1);

        if (!job) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Job offer description not found",
          });
        }

        // 3. Handle duplicate titles - find existing titles with same base name
        let finalTitle = title;
        const existingTitles = await db
          .select({ title: interviews.title })
          .from(interviews)
          .where(
            and(
              eq(interviews.userId, user.id),
              like(interviews.title, `${title}%`)
            )
          );

        if (existingTitles.length > 0) {
          // Check if exact title exists
          const exactTitleExists = existingTitles.some(
            (t) => t.title === title
          );

          if (exactTitleExists) {
            // Find how many variants exist
            const patternRegex = new RegExp(`^${title} - \\((\\d+)\\)$`);
            let maxNum = 0;

            existingTitles.forEach((entry) => {
              const match = entry.title.match(patternRegex);
              if (match && match[1]) {
                const num = parseInt(match[1], 10);
                if (num > maxNum) maxNum = num;
              }
            });

            // Use the next number in sequence
            finalTitle = `${title} - (${maxNum + 1})`;
          }
        }

        // 4. Create interview session with final title
        const [interview] = await db
          .insert(interviews)
          .values({
            userId: user.id,
            jobDescriptionId: jobOfferId,
            title: finalTitle,
            status: "created",
            questionCount,
          })
          .returning();

        // 5. Generate questions
        const generatedQuestions = await generateInterviewQuestions(
          job,
          questionCount,
          selectedTypes
        );

        // 6. Save generated questions
        if (generatedQuestions.length > 0) {
          await db.insert(interviewQuestions).values(
            generatedQuestions.map((q, index) => ({
              interviewId: interview.id,
              jobDescriptionId: jobOfferId,
              content: q.question,
              type: q.type,
              order: index,
              explanation: q.explanation,
              expectedAnswer: q.answerFramework,
              difficulty: q.difficulty,
            }))
          );
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate interview questions",
          });
        }

        // 7. Deduct credits from user
        await deductQuestionCredits(user.id, questionCount);

        return { interview };
      } catch (error) {
        console.error("Failed to generate interview:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate interview",
        });
      }
    }),

  // Get all interviews for current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Join with jobDescriptions to get company info
      const userInterviews = await db
        .select({
          id: interviews.id,
          title: interviews.title,
          status: interviews.status,
          completedAt: interviews.completedAt,
          overallScore: interviews.overallScore,
          duration: interviews.duration,
          questionCount: interviews.questionCount,
          createdAt: interviews.createdAt,
          updatedAt: interviews.updatedAt,
          // Include company information from job descriptions
          company: jobDescriptions.company,
          position: jobDescriptions.title,
        })
        .from(interviews)
        .leftJoin(
          jobDescriptions,
          eq(interviews.jobDescriptionId, jobDescriptions.id)
        )
        .where(eq(interviews.userId, user.id))
        .orderBy(desc(interviews.createdAt));

      return { interviews: userInterviews };
    } catch (error) {
      console.error("Failed to get user interviews:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve interviews",
      });
    }
  }),

  // Get a single interview by ID
  getInterviewById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      try {
        // Modified to join with jobDescriptions to get company and role info
        const [interview] = await db
          .select({
            id: interviews.id,
            title: interviews.title,
            status: interviews.status,
            completedAt: interviews.completedAt,
            overallScore: interviews.overallScore,
            duration: interviews.duration,
            questionCount: interviews.questionCount,
            createdAt: interviews.createdAt,
            updatedAt: interviews.updatedAt,
            userId: interviews.userId,
            jobDescriptionId: interviews.jobDescriptionId,
            // Include company information from job descriptions
            company: jobDescriptions.company,
            position: jobDescriptions.title,
          })
          .from(interviews)
          .leftJoin(
            jobDescriptions,
            eq(interviews.jobDescriptionId, jobDescriptions.id)
          )
          .where(and(eq(interviews.id, id), eq(interviews.userId, user.id)))
          .limit(1);

        if (!interview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Interview not found",
          });
        }

        // Get questions count for this interview (without fetching full questions)
        const questionsCount = await db
          .select({ count: count() })
          .from(interviewQuestions)
          .where(eq(interviewQuestions.interviewId, id));

        // Get basic feedback if interview is completed
        let feedback = null;
        if (interview.status === "completed") {
          const [interviewFeedbackResult] = await db
            .select({
              id: interviewFeedback.id,
              interviewId: interviewFeedback.interviewId,
              overallFeedback: interviewFeedback.overallFeedback,
              generalStrengths: interviewFeedback.generalStrengths,
              generalImprovements: interviewFeedback.generalImprovements,
              createdAt: interviewFeedback.createdAt,
              updatedAt: interviewFeedback.updatedAt,
            })
            .from(interviewFeedback)
            .where(eq(interviewFeedback.interviewId, id))
            .limit(1);

          feedback = interviewFeedbackResult;
        }

        return {
          interview,
          questionsCount: questionsCount[0]?.count || 0,
          feedback,
        };
      } catch (error) {
        console.error("Failed to get interview details:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve interview details",
        });
      }
    }),

  // Get an interview with all questions for practice
  getInterviewForPractice: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      try {
        // Get the interview data with job description info
        const [interview] = await db
          .select({
            id: interviews.id,
            title: interviews.title,
            status: interviews.status,
            completedAt: interviews.completedAt,
            overallScore: interviews.overallScore,
            duration: interviews.duration,
            questionCount: interviews.questionCount,
            createdAt: interviews.createdAt,
            updatedAt: interviews.updatedAt,
            userId: interviews.userId,
            jobDescriptionId: interviews.jobDescriptionId,
            // Include company information from job descriptions
            company: jobDescriptions.company,
            position: jobDescriptions.title,
          })
          .from(interviews)
          .leftJoin(
            jobDescriptions,
            eq(interviews.jobDescriptionId, jobDescriptions.id)
          )
          .where(and(eq(interviews.id, id), eq(interviews.userId, user.id)))
          .limit(1);

        if (!interview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Interview not found",
          });
        }

        // Get all interview questions for this interview
        const questions = await db
          .select({
            id: interviewQuestions.id,
            content: interviewQuestions.content,
            type: interviewQuestions.type,
            order: interviewQuestions.order,
            explanation: interviewQuestions.explanation,
            expectedAnswer: interviewQuestions.expectedAnswer,
            difficulty: interviewQuestions.difficulty,
            createdAt: interviewQuestions.createdAt,
          })
          .from(interviewQuestions)
          .where(eq(interviewQuestions.interviewId, id))
          .orderBy(interviewQuestions.order);

        return {
          interview,
          questions,
        };
      } catch (error) {
        console.error("Failed to get interview for practice:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve interview for practice",
        });
      }
    }),

  // Get comprehensive feedback for an interview
  getInterviewFeedback: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      try {
        // First check if the interview exists and belongs to the user
        const [interview] = await db
          .select()
          .from(interviews)
          .where(and(eq(interviews.id, id), eq(interviews.userId, user.id)))
          .limit(1);

        if (!interview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Interview not found or you don't have permission to access it",
          });
        }

        // Check if interview is completed
        if (interview.status !== "completed") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Feedback is only available for completed interviews",
          });
        }

        // 1. Get overall interview feedback
        const [overallFeedback] = await db
          .select()
          .from(interviewFeedback)
          .where(eq(interviewFeedback.interviewId, id))
          .limit(1);

        if (!overallFeedback) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Interview feedback not found",
          });
        }

        // 2. Get metric scores with performance breakdown
        const metricEvaluations = await db
          .select()
          .from(metricScores)
          .where(eq(metricScores.interviewId, id))
          .orderBy(metricScores.metric);

        // 3. Get question-specific feedback
        const questionDetails = await db
          .select({
            feedback: questionFeedback,
            question: {
              id: interviewQuestions.id,
              content: interviewQuestions.content,
              type: interviewQuestions.type,
              order: interviewQuestions.order,
              expectedAnswer: interviewQuestions.expectedAnswer,
            },
          })
          .from(questionFeedback)
          .innerJoin(
            interviewQuestions,
            eq(questionFeedback.questionId, interviewQuestions.id)
          )
          .where(eq(questionFeedback.interviewId, id))
          .orderBy(interviewQuestions.order);

        // 4. Calculate additional helpful stats
        const averageQuestionScore =
          questionDetails.length > 0
            ? questionDetails.reduce(
                (sum, q) => sum + (q.feedback.score || 0),
                0
              ) / questionDetails.length
            : 0;

        const averageRelevanceScore =
          questionDetails.length > 0
            ? questionDetails.reduce(
                (sum, q) => sum + (q.feedback.relevanceScore || 0),
                0
              ) / questionDetails.length
            : 0;

        const averageCompletenessScore =
          questionDetails.length > 0
            ? questionDetails.reduce(
                (sum, q) => sum + (q.feedback.completenessScore || 0),
                0
              ) / questionDetails.length
            : 0;

        // 5. Group strengths and improvements by question type
        const strengthsByType: Record<QuestionType, string[]> = {
          technical: [],
          behavioral: [],
          situational: [],
          role_specific: [],
          company_specific: [],
        };

        const improvementsByType: Record<QuestionType, string[]> = {
          technical: [],
          behavioral: [],
          situational: [],
          role_specific: [],
          company_specific: [],
        };

        questionDetails.forEach((q) => {
          const type = q.question.type as QuestionType;

          if (q.feedback.strengths && q.feedback.strengths.length > 0) {
            strengthsByType[type].push(...q.feedback.strengths);
          }

          if (q.feedback.improvements && q.feedback.improvements.length > 0) {
            improvementsByType[type].push(...q.feedback.improvements);
          }
        });

        const [transcriptRecord] = await db
          .select()
          .from(interviewTranscripts)
          .where(eq(interviewTranscripts.interviewId, id))
          .limit(1);

        const transcript: InterviewTranscript | null = transcriptRecord
          ? {
              ...transcriptRecord,
              fullTranscript: transcriptRecord.fullTranscript as
                | { role: string; content: string }[]
                | null,
            }
          : null;

        if (!transcript) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Transcript not found for this interview",
          });
        }

        return {
          interviewId: id,
          overallFeedback,
          metricEvaluations,
          questionFeedback: questionDetails,
          stats: {
            overallScore: interview.overallScore,
            averageQuestionScore,
            averageRelevanceScore,
            averageCompletenessScore,
            duration: interview.duration,
          },
          analysis: {
            strengthsByQuestionType: strengthsByType,
            improvementsByQuestionType: improvementsByType,
          },
          fullTranscript: transcript,
        };
      } catch (error) {
        console.error("Failed to get interview feedback:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve interview feedback",
        });
      }
    }),

  // Delete an interview
  deleteInterview: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      try {
        // First check if the interview exists and belongs to the user
        const [existingInterview] = await db
          .select()
          .from(interviews)
          .where(and(eq(interviews.id, id), eq(interviews.userId, user.id)))
          .limit(1);

        if (!existingInterview) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Interview not found or you don't have permission to delete it",
          });
        }

        // Sequential deletions instead of transaction

        // Delete question feedback
        try {
          await db
            .delete(questionFeedback)
            .where(eq(questionFeedback.interviewId, id));
        } catch (error) {
          // Table might not exist or other error, continue with other deletions
          console.log("Skip questionFeedback deletion:", error);
        }

        // Delete metric scores
        try {
          await db.delete(metricScores).where(eq(metricScores.interviewId, id));
        } catch (error) {
          // Table might not exist or other error, continue with other deletions
          console.log("Skip metricScores deletion:", error);
        }

        // Delete interview feedback
        try {
          await db
            .delete(interviewFeedback)
            .where(eq(interviewFeedback.interviewId, id));
        } catch (error) {
          // Table might not exist or other error, continue with other deletions
          console.log("Skip interviewFeedback deletion:", error);
        }

        // Delete interview questions
        try {
          await db
            .delete(interviewQuestions)
            .where(eq(interviewQuestions.interviewId, id));
        } catch (error) {
          // Table might not exist or other error, continue with other deletions
          console.log("Skip interviewQuestions deletion:", error);
        }

        // Finally, delete the interview itself
        await db.delete(interviews).where(eq(interviews.id, id));

        return { success: true, id };
      } catch (error) {
        console.error("Failed to delete interview:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete interview and related data",
        });
      }
    }),
});
