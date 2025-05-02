"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BillingLoader } from "./BillingLoader";
import { BillingView } from "./BillingView";

export function BillingLayout() {
  return (
    <Suspense fallback={<BillingLoader />}>
      <ErrorBoundary fallback={<BillingPageError />}>
        <BillingView />
      </ErrorBoundary>
    </Suspense>
  );
}

function BillingPageError() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-destructive/20 bg-destructive/5">
        <h3 className="text-lg font-semibold mb-2">
          Error loading billing information
        </h3>
        <p className="text-muted-foreground mb-4">
          There was a problem loading your billing information. Please try again
          later.
        </p>
      </div>
    </div>
  );
}
