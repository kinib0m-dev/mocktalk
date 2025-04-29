import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function JobEditLoader() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jobs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        {/* Form card */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-32 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t py-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
