import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function JobDetailLoader() {
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

        {/* Main content card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Description section */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <Separator />

            {/* Skills section */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-18 rounded-full" />
                <Skeleton className="h-7 w-22 rounded-full" />
              </div>
            </div>

            <Separator />

            {/* Responsibilities section */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            <Separator />

            {/* Requirements section */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
