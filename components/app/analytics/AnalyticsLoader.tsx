import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View insights and performance data from your interview practice
            sessions.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Performance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metrics Performance */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Question Type Performance */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-56" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strengths and Improvements */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-64" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-5 w-48" />
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
