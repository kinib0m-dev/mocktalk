"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ResourcesView } from "./ResourcesView";
import { ResourcesLoader } from "./ResourcesLoader";

export function ResourcesLayout() {
  return (
    <Suspense fallback={<ResourcesLoader />}>
      <ErrorBoundary fallback={<ResourcesPageError />}>
        <ResourcesView />
      </ErrorBoundary>
    </Suspense>
  );
}

function ResourcesPageError() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">Error loading resources</h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading the resources. Please try again later.
        </p>
      </div>
    </div>
  );
}
