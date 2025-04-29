import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResourceDetailLoader() {
  return (
    <div className="container max-w-4xl mx-auto p-6">
      {/* Header skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      {/* Main content card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <div className="flex space-x-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-5/6 mb-6" />

            <Skeleton className="h-6 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-4/5 mb-6" />

            <Skeleton className="h-6 w-36 mb-3" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-3/4 mb-6" />
          </div>
        </CardContent>
      </Card>

      {/* Related resources section */}
      <div className="mb-6">
        <Skeleton className="h-7 w-44 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="py-3">
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="py-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
