"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AnalyticsView } from "./AnalyticsView";
import { AnalyticsLoader } from "./AnalyticsLoader";

export function AnalyticsLayout() {
  return (
    <Suspense fallback={<AnalyticsLoader />}>
      <ErrorBoundary fallback={<AnalyticsPageError />}>
        <AnalyticsLayoutSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function AnalyticsLayoutSuspense() {
  const overviewStats = trpc.analytics.getOverviewStats.useQuery();
  const metricPerformance = trpc.analytics.getMetricPerformance.useQuery();
  const questionTypePerformance =
    trpc.analytics.getQuestionTypePerformance.useQuery();
  const performanceTrend = trpc.analytics.getPerformanceTrend.useQuery();
  const strengthsAndImprovements =
    trpc.analytics.getStrengthsAndImprovements.useQuery();

  const isLoading =
    overviewStats.isLoading ||
    metricPerformance.isLoading ||
    questionTypePerformance.isLoading ||
    performanceTrend.isLoading ||
    strengthsAndImprovements.isLoading;

  if (isLoading) {
    return <AnalyticsLoader />;
  }

  const analyticsData = {
    overview: overviewStats.data,
    metrics: metricPerformance.data,
    questionTypes: questionTypePerformance.data,
    performanceTrend: performanceTrend.data,
    strengthsAndImprovements: strengthsAndImprovements.data,
  };

  return <AnalyticsView data={analyticsData} />;
}

function AnalyticsPageError() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">Error loading analytics</h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading your analytics data. Please try again
          later.
        </p>
      </div>
    </div>
  );
}
