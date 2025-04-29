"use client";

import { trpc } from "@/trpc/client";
import { useState, useEffect } from "react";

export function useAnalytics() {
  const [isLoading, setIsLoading] = useState({
    overview: false,
    metrics: false,
    questionTypes: false,
    trend: false,
    feedback: false,
  });

  // Get overview stats
  const overviewStats = trpc.analytics.getOverviewStats.useQuery();

  // Get metric performance
  const metricPerformance = trpc.analytics.getMetricPerformance.useQuery();

  // Get question type performance
  const questionTypePerformance =
    trpc.analytics.getQuestionTypePerformance.useQuery();

  // Get performance trend
  const performanceTrend = trpc.analytics.getPerformanceTrend.useQuery();

  // Get strengths and improvements
  const strengthsAndImprovements =
    trpc.analytics.getStrengthsAndImprovements.useQuery();

  // Update loading states based on query statuses
  useEffect(() => {
    setIsLoading({
      overview: overviewStats.isLoading,
      metrics: metricPerformance.isLoading,
      questionTypes: questionTypePerformance.isLoading,
      trend: performanceTrend.isLoading,
      feedback: strengthsAndImprovements.isLoading,
    });
  }, [
    overviewStats.isLoading,
    metricPerformance.isLoading,
    questionTypePerformance.isLoading,
    performanceTrend.isLoading,
    strengthsAndImprovements.isLoading,
  ]);

  return {
    isLoading,
    data: {
      overview: overviewStats.data,
      metrics: metricPerformance.data,
      questionTypes: questionTypePerformance.data,
      performanceTrend: performanceTrend.data,
      strengthsAndImprovements: strengthsAndImprovements.data,
    },
    isError: {
      overview: overviewStats.isError,
      metrics: metricPerformance.isError,
      questionTypes: questionTypePerformance.isError,
      trend: performanceTrend.isError,
      feedback: strengthsAndImprovements.isError,
    },
    refetch: {
      overview: overviewStats.refetch,
      metrics: metricPerformance.refetch,
      questionTypes: questionTypePerformance.refetch,
      trend: performanceTrend.refetch,
      feedback: strengthsAndImprovements.refetch,
    },
  };
}
