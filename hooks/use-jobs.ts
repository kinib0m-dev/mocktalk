"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";
import { toast } from "sonner";

export const useJobs = () => {
  const [isLoading, setIsLoading] = useState({
    create: false,
    update: false,
    delete: false,
  });

  const utils = trpc.useUtils();

  // Get all jobs
  const getAll = () => {
    return trpc.jobs.getAll.useQuery();
  };

  // Get a single job by ID
  const getJobById = (id: string) => {
    return trpc.jobs.getJobById.useQuery(
      { id },
      {
        enabled: !!id,
      }
    );
  };

  // Create a new job
  const createJob = trpc.jobs.createJob.useMutation({
    onMutate: () => {
      setIsLoading((prev) => ({ ...prev, create: true }));
    },
    onSuccess: async () => {
      toast.success("Job description created successfully!");
      // Invalidate related queries
      await utils.jobs.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create job description");
    },
    onSettled: () => {
      setIsLoading((prev) => ({ ...prev, create: false }));
    },
  });

  // Update a job
  const updateJob = trpc.jobs.updateJob.useMutation({
    onMutate: () => {
      setIsLoading((prev) => ({ ...prev, update: true }));
    },
    onSuccess: async (data) => {
      toast.success("Job description updated successfully!");
      // Invalidate related queries
      await utils.jobs.getJobById.invalidate({ id: data.job.id });
      await utils.jobs.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update job description");
    },
    onSettled: () => {
      setIsLoading((prev) => ({ ...prev, update: false }));
    },
  });

  // Delete a job
  const deleteJob = trpc.jobs.deleteJob.useMutation({
    onMutate: () => {
      setIsLoading((prev) => ({ ...prev, delete: true }));
    },
    onSuccess: async () => {
      toast.success("Job description deleted successfully!");
      // Invalidate related queries
      await utils.jobs.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete job description");
    },
    onSettled: () => {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    },
  });

  return {
    isLoading,
    getAll,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
  };
};
