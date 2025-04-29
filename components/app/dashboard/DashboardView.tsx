"use client";

import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Briefcase,
  Clock,
  FileText,
  MessageSquare,
  Plus,
  Award,
  PlayCircle,
  Activity,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { DashboardLoader } from "./DashboardLoader";

export function DashboardView() {
  const { data: statData, isLoading: isStatsLoading } =
    trpc.dashboard.getStats.useQuery();
  const { data: activityData, isLoading: isActivityLoading } =
    trpc.dashboard.getRecentActivity.useQuery();
  const { data: creditsData, isLoading: isCreditsLoading } =
    trpc.credits.getUserCredits.useQuery();

  const isLoading = isStatsLoading || isActivityLoading || isCreditsLoading;

  if (isLoading) {
    return <DashboardLoader />;
  }

  // Format status label
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "created":
        return <Badge variant="outline">Not Started</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Calculate the completion rate
  const completionRate = statData?.totalInterviews
    ? Math.round(
        (statData.completedInterviews / statData.totalInterviews) * 100
      )
    : 0;

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
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statData?.totalInterviews || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {statData?.completedInterviews || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Job Offers</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statData?.jobOffers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Saved job descriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statData?.averageScore
                  ? Math.round(Number(statData.averageScore) * 10) / 10
                  : 0}
                /10
              </div>
              <p className="text-xs text-muted-foreground">
                From completed interviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Credits</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {creditsData?.remainingQuestions || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Questions remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Interview Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {statData?.completedInterviews || 0} of{" "}
                {statData?.totalInterviews || 0} interviews completed
              </p>
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityData?.recentActivity &&
              activityData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {activityData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-md hover:border-primary transition-colors"
                    >
                      <div className="space-y-1">
                        <Link
                          href={
                            activity.type === "job"
                              ? `/jobs/${activity.id}`
                              : `/interviews/${activity.id}`
                          }
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {activity.title}
                        </Link>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {activity.company && (
                            <>
                              <span>{activity.company}</span>
                              <span className="mx-1">•</span>
                            </>
                          )}
                          <span>{formatDate(activity.date)}</span>
                        </div>
                      </div>
                      <div>
                        {activity.type === "interview" ? (
                          getStatusBadge(activity.status as string)
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-primary/90"
                          >
                            Job
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No recent activity yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Start by adding a job offer or creating an interview
                  </p>
                </div>
              )}

              <div className="mt-4">
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href="/interviews">
                    View All Interviews
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/jobs/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Job Offer
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link href="/jobs">
                    <Briefcase className="mr-2 h-4 w-4" />
                    View Job Offers
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link href="/interviews">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Interviews
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full">
                  <Link href="/analytics">
                    <BarChart className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/resources">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Check Resources
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
