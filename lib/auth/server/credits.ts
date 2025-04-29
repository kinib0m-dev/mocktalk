import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { getUserCredits } from "@/lib/auth/helpers/credits";

export const creditsRouter = createTRPCRouter({
  // Get user's current question credits
  getUserCredits: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      const credits = await getUserCredits(user.id);
      return credits;
    } catch (error) {
      console.error("Failed to get user credits:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve credit information",
      });
    }
  }),
});
