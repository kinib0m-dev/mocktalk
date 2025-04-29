import { z } from "zod";
import { db } from "@/db";
import { jobDescriptions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createJobOfferSchema } from "@/lib/utils/zodSchemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const jobsRouter = createTRPCRouter({
  // Create a new job offer
  createJob: protectedProcedure
    .input(createJobOfferSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      try {
        const [newJob] = await db
          .insert(jobDescriptions)
          .values({
            ...input,
            userId: user.id,
          })
          .returning();

        return { job: newJob };
      } catch (error) {
        console.error("Failed to create job offer:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create job offer",
        });
      }
    }),

  // Get a single job offer by ID
  getJobById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;

      const [job] = await db
        .select()
        .from(jobDescriptions)
        .where(
          and(
            eq(jobDescriptions.id, input.id),
            eq(jobDescriptions.userId, user.id)
          )
        )
        .limit(1);

      if (!job) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Job offer not found",
        });
      }

      return { job };
    }),

  // Get all job offer for current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    const jobs = await db
      .select()
      .from(jobDescriptions)
      .where(eq(jobDescriptions.userId, user.id))
      .orderBy(desc(jobDescriptions.createdAt));

    return { jobs };
  }),

  // Update an existing job offer
  updateJob: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: createJobOfferSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id, data } = input;

      // First check if the job exists and belongs to the user
      const [existingJob] = await db
        .select()
        .from(jobDescriptions)
        .where(
          and(eq(jobDescriptions.id, id), eq(jobDescriptions.userId, user.id))
        )
        .limit(1);

      if (!existingJob) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Job description not found or you don't have permission to update it",
        });
      }

      // Update the job offer
      const [updatedJob] = await db
        .update(jobDescriptions)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(jobDescriptions.id, id))
        .returning();

      return { job: updatedJob };
    }),

  // Delete a job offer
  deleteJob: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { id } = input;

      // First check if the job exists and belongs to the user
      const [existingJob] = await db
        .select()
        .from(jobDescriptions)
        .where(
          and(eq(jobDescriptions.id, id), eq(jobDescriptions.userId, user.id))
        )
        .limit(1);

      if (!existingJob) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Job description not found or you don't have permission to delete it",
        });
      }

      // Delete the job description
      await db.delete(jobDescriptions).where(eq(jobDescriptions.id, id));

      return { success: true, id };
    }),
});
