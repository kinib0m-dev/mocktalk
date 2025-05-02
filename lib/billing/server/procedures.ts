import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {
  createQuestionPackageCheckoutSession,
  createResumePackageCheckoutSession,
  getQuestionPackage,
  getResumePackage,
} from "@/lib/utils/stripe";
import { db } from "@/db";
import { paymentHistory } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const billingRouter = createTRPCRouter({
  // Get available question packages
  getQuestionPackages: protectedProcedure.query(async () => {
    const packages = [
      getQuestionPackage("kickstart"),
      getQuestionPackage("momentum"),
      getQuestionPackage("accelerator"),
      getQuestionPackage("summit"),
    ].filter(Boolean);

    return { packages };
  }),

  // Get available resume packages
  getResumePackages: protectedProcedure.query(async () => {
    const packages = [
      getResumePackage("resume-single"),
      getResumePackage("resume-bundle-small"),
      getResumePackage("resume-bundle-large"),
    ].filter(Boolean);

    return { packages };
  }),

  // Create checkout session for question packages
  createQuestionPackageCheckout: protectedProcedure
    .input(z.object({ packageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { packageId } = input;

      try {
        const session = await createQuestionPackageCheckoutSession(
          packageId,
          user.id
        );

        if (!session) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create checkout session",
          });
        }

        return { url: session.url };
      } catch (error) {
        console.error("Error creating checkout session:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create checkout session",
        });
      }
    }),

  // Create checkout session for resume packages
  createResumePackageCheckout: protectedProcedure
    .input(z.object({ packageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { packageId } = input;

      try {
        const session = await createResumePackageCheckoutSession(
          packageId,
          user.id
        );

        if (!session) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create checkout session",
          });
        }

        return { url: session.url };
      } catch (error) {
        console.error("Error creating checkout session:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Failed to create checkout session",
        });
      }
    }),

  // Get payment history for user
  getPaymentHistory: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      const payments = await db
        .select()
        .from(paymentHistory)
        .where(eq(paymentHistory.userId, user.id))
        .orderBy(desc(paymentHistory.createdAt));

      return { payments };
    } catch (error) {
      console.error("Error retrieving payment history:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve payment history",
      });
    }
  }),

  // Get payment details by ID
  getPaymentById: protectedProcedure
    .input(z.object({ paymentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const { paymentId } = input;

      try {
        const [payment] = await db
          .select()
          .from(paymentHistory)
          .where(
            and(
              eq(paymentHistory.id, paymentId),
              eq(paymentHistory.userId, user.id)
            )
          )
          .limit(1);

        if (!payment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Payment not found",
          });
        }

        return { payment };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error retrieving payment details:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve payment details",
        });
      }
    }),
});
