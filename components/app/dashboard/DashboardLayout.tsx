"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DashboardView } from "./DashboardView";
import { DashboardLoader } from "./DashboardLoader";

export function DashboardLayout() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <ErrorBoundary fallback={<DashboardPageError />}>
        <DashboardLayoutSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function DashboardLayoutSuspense() {
  const { data: statsData, isLoading: isStatsLoading } =
    trpc.dashboard.getStats.useQuery();
  const { data: activityData, isLoading: isActivityLoading } =
    trpc.dashboard.getRecentActivity.useQuery();
  const { data: creditsData, isLoading: isCreditsLoading } =
    trpc.credits.getUserCredits.useQuery();

  const isLoading = isStatsLoading || isActivityLoading || isCreditsLoading;

  if (isLoading) {
    return <DashboardLoader />;
  }

  return <DashboardView />;
}

function DashboardPageError() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">Error loading dashboard</h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading your dashboard data. Please try again
          later.
        </p>
      </div>
    </div>
  );
}
