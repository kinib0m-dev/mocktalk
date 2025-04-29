import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your interview preparation
            progress.
          </p>
        </div>

        {/* Stats */}
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
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
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 border rounded-md"
                    >
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
