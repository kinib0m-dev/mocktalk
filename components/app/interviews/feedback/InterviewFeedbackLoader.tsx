"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  ArrowLeft,
  MessageSquare,
  Clock,
  BookOpen,
  BarChart,
  CheckCircle2,
  AlertTriangle,
  LineChart,
} from "lucide-react";
import Link from "next/link";

export function InterviewFeedbackLoader() {
  return (
    <div className="container max-w-5xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/interviews">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Interview Feedback
          </h1>
          <p className="text-muted-foreground">
            Detailed analysis and feedback on your interview performance
          </p>
        </div>
      </div>

      {/* Overview stats cards - Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Average Question Score
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Relevance</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-4 w-24 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main content tabs - Skeleton */}
      <Tabs defaultValue="summary">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="summary" disabled>
            Summary
          </TabsTrigger>
          <TabsTrigger value="metrics" disabled>
            Skill Metrics
          </TabsTrigger>
          <TabsTrigger value="questions" disabled>
            Question Analysis
          </TabsTrigger>
          <TabsTrigger value="transcript" disabled>
            Full Transcript
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab - Skeleton */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Key Strengths
                  </h3>
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Skeleton className="h-6 w-6 rounded-md mt-0.5" />
                          <Skeleton className="h-6 w-full" />
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Skeleton className="h-6 w-6 rounded-md mt-0.5" />
                          <Skeleton className="h-6 w-full" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Performance by Question Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Top Scoring Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(2)
                  .fill(0)
                  .map((_, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-md" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export button - Skeleton */}
      <div className="flex justify-end mt-6">
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
