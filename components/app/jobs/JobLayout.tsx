"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { JobsView } from "./JobsView";
import { JobViewLoader } from "./JobViewLoader";

export function JobLayout() {
  return (
    <Suspense fallback={<JobViewLoader />}>
      <ErrorBoundary fallback={<JobPageError />}>
        <JobLayoutSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function JobLayoutSuspense() {
  const { data, isLoading } = trpc.jobs.getAll.useQuery();

  if (isLoading) {
    return <JobViewLoader />;
  }

  return <JobsView jobs={data?.jobs || []} />;
}

function JobPageError() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">Error loading jobs</h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading your job descriptions. Please try again
          later.
        </p>
      </div>
    </div>
  );
}
