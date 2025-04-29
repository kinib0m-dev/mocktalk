import { db } from "@/db";
import {
  interviews,
  metricScores,
  questionFeedback,
  interviewQuestions,
} from "@/db/schema";
import { eq, and, avg, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const analyticsRouter = createTRPCRouter({
  // Get overall analytics data
  getOverviewStats: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Get total interviews count
      const totalInterviewsResult = await db
        .select({ count: count() })
        .from(interviews)
        .where(eq(interviews.userId, user.id));

      const totalInterviews = totalInterviewsResult[0]?.count || 0;

      // Get completed interviews count
      const completedInterviewsResult = await db
        .select({ count: count() })
        .from(interviews)
        .where(
          and(
            eq(interviews.userId, user.id),
            eq(interviews.status, "completed")
          )
        );

      const completedInterviews = completedInterviewsResult[0]?.count || 0;

      // Get average score across all completed interviews
      const averageScoreResult = await db
        .select({ average: avg(interviews.overallScore) })
        .from(interviews)
        .where(
          and(
            eq(interviews.userId, user.id),
            eq(interviews.status, "completed")
          )
        );

      const averageScore = averageScoreResult[0]?.average || 0;

      // Get total questions answered
      const totalQuestionsResult = await db
        .select({ count: count() })
        .from(interviewQuestions)
        .innerJoin(
          interviews,
          eq(interviewQuestions.interviewId, interviews.id)
        )
        .where(
          and(
            eq(interviews.userId, user.id),
            eq(interviews.status, "completed")
          )
        );

      const totalQuestions = totalQuestionsResult[0]?.count || 0;

      return {
        totalInterviews,
        completedInterviews,
        completionRate:
          totalInterviews > 0
            ? (completedInterviews / totalInterviews) * 100
            : 0,
        averageScore,
        totalQuestions,
      };
    } catch (error) {
      console.error("Failed to get overview stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve analytics data",
      });
    }
  }),

  // Get user-specific stats for profile page
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Get total interviews count
      const totalInterviewsResult = await db
        .select({ count: count() })
        .from(interviews)
        .where(eq(interviews.userId, user.id));

      const totalInterviews = totalInterviewsResult[0]?.count || 0;

      // Get completed interviews count
      const completedInterviewsResult = await db
        .select({ count: count() })
        .from(interviews)
        .where(
          and(
            eq(interviews.userId, user.id),
            eq(interviews.status, "completed")
          )
        );

      const completedInterviews = completedInterviewsResult[0]?.count || 0;

      // Get average score across all completed interviews
      const averageScoreResult = await db
        .select({ average: avg(interviews.overallScore) })
        .from(interviews)
        .where(
          and(
            eq(interviews.userId, user.id),
            eq(interviews.status, "completed")
          )
        );

      const averageScore = averageScoreResult[0]?.average || 0;

      // Get total questions answered
      const totalQuestionsResult = await db
        .select({ count: count() })
        .from(interviewQuestions)
        .innerJoin(
          interviews,
          eq(interviewQuestions.interviewId, interviews.id)
        )
        .where(eq(interviews.userId, user.id));

      const totalQuestions = totalQuestionsResult[0]?.count || 0;

      return {
        totalInterviews,
        completedInterviews,
        completionRate:
          totalInterviews > 0
            ? (completedInterviews / totalInterviews) * 100
            : 0,
        averageScore,
        totalQuestions,
      };
    } catch (error) {
      console.error("Failed to get user stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve user statistics",
      });
    }
  }),

  // Get performance by metric type
  getMetricPerformance: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Get average scores grouped by metric type
      const metricScoresResult = await db
        .select({
          metric: metricScores.metric,
          averageScore: avg(metricScores.score),
          count: count(),
        })
        .from(metricScores)
        .innerJoin(interviews, eq(metricScores.interviewId, interviews.id))
        .where(eq(interviews.userId, user.id))
        .groupBy(metricScores.metric);

      return { metricScores: metricScoresResult };
    } catch (error) {
      console.error("Failed to get metric performance:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve metric performance data",
      });
    }
  }),

  // Get performance by question type
  getQuestionTypePerformance: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Get average scores grouped by question type
      const questionTypeScoresResult = await db
        .select({
          questionType: interviewQuestions.type,
          averageScore: avg(questionFeedback.score),
          averageRelevance: avg(questionFeedback.relevanceScore),
          averageCompleteness: avg(questionFeedback.completenessScore),
          count: count(),
        })
        .from(questionFeedback)
        .innerJoin(
          interviewQuestions,
          eq(questionFeedback.questionId, interviewQuestions.id)
        )
        .innerJoin(interviews, eq(questionFeedback.interviewId, interviews.id))
        .where(eq(interviews.userId, user.id))
        .groupBy(interviewQuestions.type);

      return { questionTypeScores: questionTypeScoresResult };
    } catch (error) {
      console.error("Failed to get question type performance:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve question type performance data",
      });
    }
  }),

  // Get performance trend over time
  getPerformanceTrend: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Get interview scores over time
      const performanceTrendResult = await db
        .select({
          id: interviews.id,
          title: interviews.title,
          score: interviews.overallScore,
          completedAt: interviews.completedAt,
        })
        .from(interviews)
        .where(
          and(
            eq(interviews.userId, user.id),
            eq(interviews.status, "completed")
          )
        )
        .orderBy(interviews.completedAt);

      return { performanceTrend: performanceTrendResult };
    } catch (error) {
      console.error("Failed to get performance trend:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve performance trend data",
      });
    }
  }),

  // Get most common strengths and improvements
  getStrengthsAndImprovements: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Get all feedback entries
      const feedbackEntriesResult = await db
        .select({
          interviewId: metricScores.interviewId,
          metric: metricScores.metric,
          strengths: metricScores.strengths,
          improvements: metricScores.improvements,
        })
        .from(metricScores)
        .innerJoin(interviews, eq(metricScores.interviewId, interviews.id))
        .where(eq(interviews.userId, user.id));

      // Process strengths
      const strengthsMap: Record<string, number> = {};
      feedbackEntriesResult.forEach((entry) => {
        if (entry.strengths) {
          entry.strengths.forEach((strength) => {
            strengthsMap[strength] = (strengthsMap[strength] || 0) + 1;
          });
        }
      });

      // Process improvements
      const improvementsMap: Record<string, number> = {};
      feedbackEntriesResult.forEach((entry) => {
        if (entry.improvements) {
          entry.improvements.forEach((improvement) => {
            improvementsMap[improvement] =
              (improvementsMap[improvement] || 0) + 1;
          });
        }
      });

      // Sort strengths and improvements by frequency
      const topStrengths = Object.entries(strengthsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([text, count]) => ({ text, count }));

      const topImprovements = Object.entries(improvementsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([text, count]) => ({ text, count }));

      return { topStrengths, topImprovements };
    } catch (error) {
      console.error("Failed to get strengths and improvements:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve strengths and improvements data",
      });
    }
  }),
});
