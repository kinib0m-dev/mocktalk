"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function InterviewPracticeLoader() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Interview header skeleton */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="w-full">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Interview conversation skeleton */}
      <Card className="mb-6 border-2">
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4">
            <div className="flex flex-col gap-4">
              {/* Interviewer message skeleton */}
              <div className="flex gap-3 p-3 rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>

              {/* User message skeleton */}
              <div className="flex gap-3 p-3 rounded-lg ml-auto">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>

              {/* Interviewer message skeleton */}
              <div className="flex gap-3 p-3 rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4 flex justify-center">
          <Button size="lg" disabled className="w-60 font-medium opacity-70">
            <Mic className="mr-2 h-4 w-4" />
            Start Interview
          </Button>
        </CardFooter>
      </Card>

      {/* Question list skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {/* Generate 3 question skeletons */}
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-3 rounded-md border">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-5 w-full mt-2" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
