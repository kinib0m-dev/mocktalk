"use client";

import { trpc } from "@/trpc/client";

export function useCredits() {
  const { data: credits, isLoading: isLoadingCredits } =
    trpc.credits.getUserCredits.useQuery();

  const hasEnoughCredits = (count: number) => {
    if (!credits || isLoadingCredits) return false;
    return credits.remainingQuestions >= count;
  };

  return {
    credits,
    isLoading: isLoadingCredits,
    hasEnoughCredits,
  };
}
