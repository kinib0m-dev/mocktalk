"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { JobInterviewLoader } from "./JobInterviewLoader";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JobNotFound } from "../JobNotFound";
import { JobInterviewForm } from "./JobInterviewForm";

export function JobInterviewLayout({ id }: { id: string }) {
  return (
    <Suspense fallback={<JobInterviewLoader />}>
      <ErrorBoundary fallback>
        <JobInterviewLayoutSuspense id={id} />
      </ErrorBoundary>
    </Suspense>
  );
}

function JobInterviewLayoutSuspense({ id }: { id: string }) {
  const { data, error, isLoading } = trpc.jobs.getJobById.useQuery(
    { id },
    {
      retry: 1, // Only retry once to avoid unnecessary retries on genuine 404s
      retryDelay: 500,
    }
  );

  if (isLoading) {
    return <JobInterviewLoader />;
  }

  if (error) {
    if (error.data?.code === "NOT_FOUND") {
      return <JobNotFound text="view" />;
    }
    return <JobInterviewError id={id} />;
  }

  if (!isLoading && !data?.job) {
    return <JobNotFound text="view" />;
  }

  if (data?.job) {
    return <JobInterviewForm job={data.job} />;
  }

  return null;
}

function JobInterviewError({ id }: { id: string }) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">
          Error loading job details
        </h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading the job description with ID: {id}. Please
          try again later.
        </p>
        <Button variant="outline" asChild>
          <Link href="/jobs">Return to Jobs List</Link>
        </Button>
      </div>
    </div>
  );
}
