"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { InterviewNotFound } from "../InterviewNotFound";
import { InterviewDetailLoader } from "./InterviewDetailLoader";
import { InterviewDetailView } from "./InterviewDetailView";

export function InterviewDetailLayout({ id }: { id: string }) {
  return (
    <Suspense fallback={<InterviewDetailLoader />}>
      <ErrorBoundary fallback={<InterviewDetailError id={id} />}>
        <InterviewDetailLayoutSuspense id={id} />
      </ErrorBoundary>
    </Suspense>
  );
}

function InterviewDetailLayoutSuspense({ id }: { id: string }) {
  const { data, error, isLoading } = trpc.interviews.getInterviewById.useQuery(
    { id },
    {
      retry: 1, // Only retry once to avoid unnecessary retries on genuine 404s
      retryDelay: 500,
    }
  );

  if (isLoading) {
    return <InterviewDetailLoader />;
  }

  if (error) {
    if (error.data?.code === "NOT_FOUND") {
      return <InterviewNotFound />;
    }
    return <InterviewDetailError id={id} />;
  }

  if (!isLoading && !data?.interview) {
    return <InterviewNotFound />;
  }

  if (data?.interview) {
    return (
      <InterviewDetailView
        interview={data.interview}
        feedback={data.feedback}
        questionsCount={data.questionsCount}
      />
    );
  }

  return null;
}

function InterviewDetailError({ id }: { id: string }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">
          Error loading interview details
        </h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading the interview description with ID: {id}.
          Please try again later.
        </p>
        <Button variant="outline" asChild>
          <Link href="/interviews">Return to Interviews List</Link>
        </Button>
      </div>
    </div>
  );
}
