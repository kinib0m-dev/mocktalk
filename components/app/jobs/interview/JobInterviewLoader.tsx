import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export function JobInterviewLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Generate Interview
            </h1>
            <div className="text-muted-foreground">
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>

        {/* Interview Form Card Skeleton */}
        <div className="mx-auto w-full rounded-lg border bg-card text-card-foreground shadow">
          {/* Card Header */}
          <div className="flex flex-col space-y-1.5 p-6">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-5 w-80 mt-1" />
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Question Count Field */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-5 w-full" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-4 w-48 mt-1" />
            </div>

            {/* Question Types */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between p-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
