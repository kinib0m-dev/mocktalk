import { db } from "@/db";
import { interviews, jobDescriptions, questionFeedback } from "@/db/schema";
import { eq, and, desc, count, avg, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const dashboardRouter = createTRPCRouter({
  // Get dashboard stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
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

      // Get job offers count
      const jobOffersResult = await db
        .select({ count: count() })
        .from(jobDescriptions)
        .where(eq(jobDescriptions.userId, user.id));

      const jobOffers = jobOffersResult[0]?.count || 0;

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

      // Get number of questions answered
      const questionsAnsweredResult = await db
        .select({ count: count() })
        .from(questionFeedback)
        .innerJoin(interviews, eq(questionFeedback.interviewId, interviews.id))
        .where(eq(interviews.userId, user.id));

      const questionsAnswered = questionsAnsweredResult[0]?.count || 0;

      return {
        totalInterviews,
        completedInterviews,
        jobOffers,
        averageScore,
        questionsAnswered,
      };
    } catch (error) {
      console.error("Failed to get dashboard stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve dashboard statistics",
      });
    }
  }),

  // Get recent activity
  getRecentActivity: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      // Get recent interviews
      const recentInterviews = await db
        .select({
          id: interviews.id,
          type: sql<string>`'interview'`.as("type"),
          title: interviews.title,
          status: interviews.status,
          company: jobDescriptions.company,
          position: jobDescriptions.title,
          date: interviews.updatedAt,
          completedAt: interviews.completedAt,
          overallScore: interviews.overallScore,
        })
        .from(interviews)
        .leftJoin(
          jobDescriptions,
          eq(interviews.jobDescriptionId, jobDescriptions.id)
        )
        .where(eq(interviews.userId, user.id))
        .orderBy(desc(interviews.updatedAt))
        .limit(5);

      // Get recent job descriptions
      const recentJobs = await db
        .select({
          id: jobDescriptions.id,
          type: sql<string>`'job'`.as("type"),
          title: jobDescriptions.title,
          company: jobDescriptions.company,
          date: jobDescriptions.updatedAt,
        })
        .from(jobDescriptions)
        .where(eq(jobDescriptions.userId, user.id))
        .orderBy(desc(jobDescriptions.updatedAt))
        .limit(5);

      // Combine and sort the results
      const recentActivity = [...recentInterviews, ...recentJobs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return {
        recentActivity: recentActivity.slice(0, 5),
      };
    } catch (error) {
      console.error("Failed to get recent activity:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve recent activity",
      });
    }
  }),
});
