"use server";

import { db } from "@/db";
import {
  interviewFeedback,
  interviews,
  metricScores,
  questionFeedback,
  interviewTranscripts,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateObject } from "ai";
import { gemini } from "@/lib/utils/google";
import { feedbackSchema } from "@/lib/utils/zodSchemas";

interface CreateFeedbackParams {
  interviewId: string;
  transcript: { role: string; content: string }[];
  questions: InterviewQuestion[];
}

export async function createFeedbackAction(params: CreateFeedbackParams) {
  const { interviewId, transcript, questions } = params;

  try {
    // Store the transcript first
    await db.insert(interviewTranscripts).values({
      interviewId,
      fullTranscript: transcript, // Store the entire transcript as JSON
      participantCount: 2, // Default is interviewer + candidate
    });

    // Format transcript for AI processing
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content} \n`
      )
      .join("");

    // Format questions for AI prompt
    const formattedQuestions = questions
      .map(
        (q) =>
          `Question ${q.order}: [${q.type}] ${q.content}\nQuestion ID: ${q.id}`
      )
      .join("\n\n");

    // Generate structured feedback using Gemini AI
    const { object: feedbackData } = await generateObject({
      model: gemini("gemini-2.0-flash-001", {
        structuredOutputs: true,
      }),
      schema: feedbackSchema,
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.

Interview Questions:
${formattedQuestions}

Interview Transcript:
${formattedTranscript}

Analyze the candidate's performance and provide detailed feedback in the following areas:

1. Overall feedback and general assessment - What were the candidate's major strengths and areas for improvement?

2. Score the candidate in these specific metric areas (1-10 scale):
   - Communication Skills: Clarity, articulation, structured responses
   - Technical Knowledge: Understanding of key concepts for the role
   - Problem-Solving: Ability to analyze problems and propose solutions
   - Cultural & Role Fit: Alignment with company values and job role
   - Confidence & Clarity: Confidence in responses, engagement, and clarity

3. For each question in the interview:
   - Provide specific feedback on their answer
   - Note strengths and improvements
   - Score the relevance of their answer (1-10)
   - Score the completeness of their answer (1-10)

Be thoughtful, specific, and constructive in your feedback. The candidate should understand exactly what they did well and how they can improve.`,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories and provide detailed, actionable feedback.",
    });

    // Update interview status to completed
    await db
      .update(interviews)
      .set({
        status: "completed",
        completedAt: new Date(),
        overallScore: feedbackData.overallScore,
      })
      .where(eq(interviews.id, interviewId));

    // Insert overall interview feedback
    const [feedback] = await db
      .insert(interviewFeedback)
      .values({
        interviewId,
        overallFeedback: feedbackData.overallFeedback,
        generalStrengths: feedbackData.generalStrengths,
        generalImprovements: feedbackData.generalImprovements,
      })
      .returning();

    // Insert metric scores
    const metricEntries = Object.entries(feedbackData.metrics);
    for (const [metric, data] of metricEntries) {
      // Type guard to ensure metric is a valid EvaluationMetric
      const isValidMetric = (metric: string): metric is EvaluationMetric => {
        return [
          "communication_skills",
          "technical_knowledge",
          "problem_solving",
          "cultural_role_fit",
          "confidence_clarity",
        ].includes(metric);
      };

      if (isValidMetric(metric)) {
        await db.insert(metricScores).values({
          interviewId,
          metric: metric,
          score: data.score,
          strengths: data.strengths,
          improvements: data.improvements,
          feedback: data.feedback,
        });
      } else {
        console.warn(`Skipping invalid metric: ${metric}`);
      }
    }

    // Insert question feedback
    for (const qFeedback of feedbackData.questionFeedback) {
      await db.insert(questionFeedback).values({
        questionId: qFeedback.questionId,
        interviewId,
        score: qFeedback.score,
        feedback: qFeedback.feedback,
        strengths: qFeedback.strengths,
        improvements: qFeedback.improvements,
        relevanceScore: qFeedback.relevanceScore,
        completenessScore: qFeedback.completenessScore,
      });
    }

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return {
      success: false,
    };
  }
}
