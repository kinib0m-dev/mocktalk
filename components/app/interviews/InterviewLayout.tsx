"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InterviewViewLoader } from "./InterviewLoader";
import { InterviewView } from "./InterviewView";

export function InterviewLayout() {
  return (
    <Suspense fallback={<InterviewViewLoader />}>
      <ErrorBoundary fallback={<InterviewPageError />}>
        <InterviewLayoutSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function InterviewLayoutSuspense() {
  const { data, isLoading } = trpc.interviews.getAll.useQuery();

  if (isLoading) {
    return <InterviewViewLoader />;
  }

  return <InterviewView interviews={data?.interviews || []} />;
}

function InterviewPageError() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">Error loading interviews</h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading your interviews. Please try again later.
        </p>
      </div>
    </div>
  );
}
