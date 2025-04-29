"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { InterviewNotFound } from "../InterviewNotFound";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InterviewFeedbackLoader } from "./InterviewFeedbackLoader";
import { InterviewFeedbackView } from "./InterviewFeedbackView";

export function InterviewFeedbackLayout({ id }: { id: string }) {
  return (
    <Suspense fallback={<InterviewFeedbackLoader />}>
      <ErrorBoundary fallback={<InterviewFeedbackError id={id} />}>
        <InterviewFeedbackLayoutSuspense id={id} />
      </ErrorBoundary>
    </Suspense>
  );
}

function InterviewFeedbackLayoutSuspense({ id }: { id: string }) {
  const { data, error, isLoading } =
    trpc.interviews.getInterviewFeedback.useQuery(
      { id },
      {
        retry: 1, // Only retry once to avoid unnecessary retries on genuine 404s
        retryDelay: 500,
      }
    );

  if (isLoading) {
    return <InterviewFeedbackLoader />;
  }

  if (error) {
    if (error.data?.code === "NOT_FOUND") {
      return <InterviewNotFound />;
    }
    return <InterviewFeedbackError id={id} />;
  }

  if (!isLoading && !data?.interviewId) {
    return <InterviewNotFound />;
  }

  if (data?.interviewId && data.overallFeedback) {
    return (
      <InterviewFeedbackView
        interviewId={data.interviewId}
        overallFeedback={data.overallFeedback}
        metricEvaluations={data.metricEvaluations}
        questionFeedback={data.questionFeedback}
        stats={data.stats}
        analysis={data.analysis}
        transcript={data.fullTranscript}
      />
    );
  }

  return null;
}

function InterviewFeedbackError({ id }: { id: string }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">
          Error loading interview feedback
        </h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading the interview feedback with ID: {id}.
          Please try again later.
        </p>
        <Button variant="outline" asChild>
          <Link href="/interviews">Return to Interviews List</Link>
        </Button>
      </div>
    </div>
  );
}
