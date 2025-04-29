"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InterviewNotFound } from "../InterviewNotFound";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InterviewPracticeLoader } from "./InterviewPracticeLoader";
import { InterviewPracticeView } from "./InterviewPracticeView";

export function InterviewPracticeLayout({ id }: { id: string }) {
  return (
    <Suspense fallback={<InterviewPracticeLoader />}>
      <ErrorBoundary fallback={<InterviewPracticeError id={id} />}>
        <InterviewPracticeLayoutSuspense id={id} />
      </ErrorBoundary>
    </Suspense>
  );
}

function InterviewPracticeLayoutSuspense({ id }: { id: string }) {
  const { data, error, isLoading } =
    trpc.interviews.getInterviewForPractice.useQuery(
      { id },
      {
        retry: 1, // Only retry once to avoid unnecessary retries on genuine 404s
        retryDelay: 500,
      }
    );

  if (isLoading) {
    return <InterviewPracticeLoader />;
  }

  if (error) {
    if (error.data?.code === "NOT_FOUND") {
      return <InterviewNotFound />;
    }
    return <InterviewPracticeError id={id} />;
  }

  if (!isLoading && !data?.interview) {
    return <InterviewNotFound />;
  }

  if (data?.interview && data.questions) {
    return (
      <InterviewPracticeView
        interview={data.interview}
        questions={data.questions}
      />
    );
  }

  return null;
}

function InterviewPracticeError({ id }: { id: string }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">
          Error loading interview practice
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
