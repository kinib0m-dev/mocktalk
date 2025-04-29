"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";

interface GenerateInterviewParams {
  jobOfferId: string;
  title: string;
  questionCount: number;
  selectedTypes: QuestionType[];
}

export function useInterviews() {
  const [isLoading, setIsLoading] = useState({
    start: false,
    delete: false,
  });

  const utils = trpc.useUtils();

  // Get all interviews
  const getAll = () => {
    return trpc.interviews.getAll.useQuery();
  };

  // Get a single interview by ID
  const getInterviewById = (id: string) => {
    return trpc.interviews.getInterviewById.useQuery(
      { id },
      {
        enabled: !!id,
      }
    );
  };

  // Start a new interview
  const generateInterview = trpc.interviews.generateInterview.useMutation({
    onMutate: () => {
      setIsLoading((prev) => ({ ...prev, start: true }));
    },
    onSuccess: async (data) => {
      toast.success("Interview generated successfully!");
      // Invalidate related queries
      await utils.interviews.getAll.invalidate();
      await utils.credits.getUserCredits.invalidate();
      return data.interview;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate interview");
    },
    onSettled: () => {
      setIsLoading((prev) => ({ ...prev, start: false }));
    },
  });

  const generateNewInterview = async (params: GenerateInterviewParams) => {
    try {
      const result = await generateInterview.mutateAsync(params);
      return result;
    } catch (error) {
      // Error already handled by onError
      console.log(error);
      return null;
    }
  };

  // Delete an interview
  const deleteInterview = trpc.interviews.deleteInterview.useMutation({
    onMutate: () => {
      setIsLoading((prev) => ({ ...prev, delete: true }));
    },
    onSuccess: async () => {
      toast.success("Interview deleted successfully!");
      // Invalidate related queries
      await utils.interviews.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete interview");
    },
    onSettled: () => {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    },
  });

  return {
    isLoading,
    getAll,
    getInterviewById,
    generateNewInterview,
    deleteInterview,
  };
}
