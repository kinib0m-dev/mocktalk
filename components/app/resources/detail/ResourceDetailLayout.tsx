"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { trpc } from "@/trpc/client";
import { ResourceDetailLoader } from "./ResourceDetailLoader";
import { ResourceNotFound } from "./ResourceNotFound";
import { ResourceDetailView } from "./ResourceDetailView";

export function ResourceDetailLayout({
  slug,
  id,
}: {
  slug: string;
  id?: string;
}) {
  return (
    <Suspense fallback={<ResourceDetailLoader />}>
      <ErrorBoundary fallback={<ResourceDetailError slug={slug} />}>
        <ResourceDetailContent slug={slug} id={id} />
      </ErrorBoundary>
    </Suspense>
  );
}

function ResourceDetailContent({ slug, id }: { slug: string; id?: string }) {
  // If we have an ID, use it to get the resource
  const { data, isLoading, error } = trpc.resources.getResourceById.useQuery(
    { id: id || "" },
    {
      enabled: !!id,
      retry: 1,
    }
  );

  // Handle loading state
  if (isLoading) {
    return <ResourceDetailLoader />;
  }

  // Handle errors or missing resource
  if (error || !data) {
    return <ResourceNotFound slug={slug} />;
  }

  // Resource found, return detailed view
  return (
    <ResourceDetailView
      resource={data.resource}
      tags={data.tags}
      relatedResources={data.relatedResources}
    />
  );
}

function ResourceDetailError({ slug }: { slug: string }) {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">Error loading resource</h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading the resource &quot;{slug}&quot;. Please
          try again later.
        </p>
      </div>
    </div>
  );
}
