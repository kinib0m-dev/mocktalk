import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InterviewDetailLoader() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-6 w-28" />
      </div>

      {/* Main cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Interview Details Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Questions & Scores Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Preview Card */}
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              {[1, 2, 3].map((item) => (
                <div
                  key={`strength-${item}`}
                  className="flex items-start gap-2 mb-1"
                >
                  <Skeleton className="h-2 w-2 mt-1 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>

            {/* Areas for Improvement */}
            <div>
              <Skeleton className="h-4 w-48 mb-2" />
              {[1, 2, 3].map((item) => (
                <div
                  key={`improvement-${item}`}
                  className="flex items-start gap-2 mb-1"
                >
                  <Skeleton className="h-2 w-2 mt-1 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}
