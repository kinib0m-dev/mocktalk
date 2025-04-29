// hooks/use-resources.ts
"use client";

import { trpc } from "@/trpc/client";
import { useState } from "react";

export function useResources() {
  const [isLoading, setIsLoading] = useState({
    resources: false,
    bookmarking: false,
  });

  // Get all resources
  const getAllResources = () => {
    return trpc.resources.getAllResources.useQuery();
  };

  // Get featured resources
  const getFeaturedResources = () => {
    return trpc.resources.getFeaturedResources.useQuery();
  };

  // Get a single resource by ID
  const getResourceById = (id: string) => {
    return trpc.resources.getResourceById.useQuery(
      { id },
      {
        enabled: !!id,
      }
    );
  };

  // Get user bookmarked resources
  const getUserBookmarks = () => {
    return trpc.resources.getUserBookmarks.useQuery();
  };

  // Mutation for bookmarking a resource
  const bookmarkResource = trpc.resources.bookmarkResource.useMutation({
    onMutate: () => {
      setIsLoading((prev) => ({ ...prev, bookmarking: true }));
    },
    onSettled: () => {
      setIsLoading((prev) => ({ ...prev, bookmarking: false }));
    },
  });

  // Mutation for removing a bookmark
  const removeBookmark = trpc.resources.removeBookmark.useMutation({
    onMutate: () => {
      setIsLoading((prev) => ({ ...prev, bookmarking: true }));
    },
    onSettled: () => {
      setIsLoading((prev) => ({ ...prev, bookmarking: false }));
    },
  });

  return {
    isLoading,
    getAllResources,
    getFeaturedResources,
    getResourceById,
    getUserBookmarks,
    bookmarkResource,
    removeBookmark,
  };
}
