import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function InterviewViewLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Interviews</h1>
          <p className="text-muted-foreground">
            View and manage your interview practice sessions.
          </p>
        </div>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 gap-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden border-border/40">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-[250px]" />
                      <div className="flex items-center mt-1">
                        <Skeleton className="h-5 w-[100px]" />
                        <span className="mx-2 text-muted-foreground">•</span>
                        <Skeleton className="h-5 w-[80px]" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-2">
                  <Skeleton className="h-5 w-[180px]" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-[100px]" />
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
