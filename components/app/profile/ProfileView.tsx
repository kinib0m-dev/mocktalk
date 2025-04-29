"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Calendar,
  Clock,
  Award,
  PieChart,
  Briefcase,
  MessageSquare,
  User,
  Mail,
  Shield,
  Settings,
  CreditCard,
  Lock,
} from "lucide-react";
import { trpc } from "@/trpc/client";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useCredits } from "@/hooks/use-credits";
import { getUserLoginActivity } from "@/lib/auth/auth.actions";

// Activity type definition
interface LoginActivity {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  createdAt: Date;
}

export function ProfileView() {
  const [activeTab, setActiveTab] = useState("stats");
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);

  // Fetch user session data
  const { data: session } = trpc.auth.getSession.useQuery();

  // Fetch question credits
  const { credits, isLoading: isLoadingCredits } = useCredits();

  // Fetch statistics data
  const { data: statsData, isLoading: isLoadingStats } =
    trpc.analytics.getUserStats.useQuery();

  // Fetch login activity
  useEffect(() => {
    const fetchLoginActivity = async () => {
      const result = await getUserLoginActivity(session?.user?.id || "", 5);
      if (result.success && result.activities) {
        // Type cast to ensure compatibility with LoginActivity
        setLoginActivities(result.activities as LoginActivity[]);
      }
    };

    if (session?.user?.id) {
      fetchLoginActivity();
    }
  }, [session?.user?.id]);

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Calculate interview completion rate
  const completionRate = statsData?.totalInterviews
    ? (
        (statsData.completedInterviews / statsData.totalInterviews) *
        100
      ).toFixed(0)
    : "0";

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              View and manage your personal information
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>

        {/* Main Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={session?.user?.image || undefined}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback>
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 w-full text-center">
                <h3 className="text-xl font-semibold">
                  {session?.user?.name || "User"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email}
                </p>
                {/* Safe check for isOAuth property with type guard */}
                {session?.user &&
                  typeof session.user === "object" &&
                  "isOAuth" in session.user &&
                  Boolean(session.user.isOAuth) && (
                    <Badge variant="outline" className="mx-auto">
                      Google Account
                    </Badge>
                  )}
              </div>

              <div className="border-t w-full pt-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Account Status
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Two-Factor Auth
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        session?.user &&
                        typeof session.user === "object" &&
                        "isTwoFactorEnabled" in session.user &&
                        Boolean(session.user.isTwoFactorEnabled)
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }
                    >
                      {session?.user &&
                      typeof session.user === "object" &&
                      "isTwoFactorEnabled" in session.user &&
                      Boolean(session.user.isTwoFactorEnabled)
                        ? "Enabled"
                        : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Question Credits
                    </span>
                    <span className="font-medium">
                      {isLoadingCredits
                        ? "Loading..."
                        : credits?.remainingQuestions || 0}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/billing">Buy More Credits</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Content Area */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4">
                {/* Performance Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      Interview Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Interviews Count */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            Total Interviews
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {isLoadingStats
                              ? "Loading..."
                              : statsData?.totalInterviews || 0}
                          </span>
                        </div>
                        <Progress
                          value={
                            isLoadingStats ? 0 : statsData?.totalInterviews || 0
                          }
                          max={Math.max(
                            isLoadingStats
                              ? 100
                              : statsData?.totalInterviews || 10,
                            1
                          )}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          {isLoadingStats
                            ? "Loading..."
                            : `${statsData?.completedInterviews || 0} completed`}
                        </p>
                      </div>

                      {/* Completion Rate */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <PieChart className="h-4 w-4 mr-2 text-muted-foreground" />
                            Completion Rate
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {completionRate}%
                          </span>
                        </div>
                        <Progress
                          value={parseInt(completionRate)}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          Percentage of interviews completed
                        </p>
                      </div>

                      {/* Average Score */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                            Average Score
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {isLoadingStats
                              ? "Loading..."
                              : statsData?.averageScore
                                ? parseFloat(
                                    statsData.averageScore.toString()
                                  ).toFixed(1)
                                : "0"}
                            /10
                          </span>
                        </div>
                        <Progress
                          value={
                            isLoadingStats
                              ? 0
                              : statsData?.averageScore
                                ? parseFloat(
                                    statsData.averageScore.toString()
                                  ) * 10
                                : 0
                          }
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground">
                          From all completed interviews
                        </p>
                      </div>

                      {/* Questions Answered */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                            Questions Answered
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {isLoadingStats
                              ? "Loading..."
                              : statsData?.totalQuestions || 0}
                          </span>
                        </div>
                        <Progress value={100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Total questions practiced
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Credit Usage Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Credits Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Available Credits</span>
                      <span className="font-medium text-xl">
                        {isLoadingCredits
                          ? "Loading..."
                          : credits?.remainingQuestions || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Credits Used</span>
                      <span>
                        {isLoadingCredits
                          ? "Loading..."
                          : credits?.totalQuestionsUsed || 0}
                      </span>
                    </div>
                    {credits?.lastCreditUpdate && (
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Last Updated</span>
                        <span>
                          {format(
                            new Date(credits.lastCreditUpdate),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                    )}
                    <Button variant="outline" asChild className="w-full mt-2">
                      <Link href="/billing">Manage Credits</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                {/* Recent Activity Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Recent Login Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loginActivities.length > 0 ? (
                      <div className="space-y-4">
                        {loginActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-4"
                          >
                            <div
                              className={`p-2 rounded-full ${activity.success ? "bg-green-100" : "bg-red-100"}`}
                            >
                              <Shield
                                className={`h-5 w-5 ${activity.success ? "text-green-600" : "text-red-600"}`}
                              />
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex justify-between">
                                <h4 className="text-sm font-medium">
                                  {activity.success
                                    ? "Successful login"
                                    : "Failed login attempt"}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(activity.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                IP: {activity.ipAddress}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {activity.userAgent}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium mb-1">
                          No recent activity
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Your login activity will appear here when available
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                {/* Security Information Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Account Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email Verification */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Email Verification
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Status
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800"
                          >
                            Verified
                          </Badge>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          Two-Factor Authentication
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Status
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              session?.user &&
                              typeof session.user === "object" &&
                              "isTwoFactorEnabled" in session.user &&
                              Boolean(session.user.isTwoFactorEnabled)
                                ? "bg-green-100 text-green-800"
                                : "bg-amber-100 text-amber-800"
                            }
                          >
                            {session?.user &&
                            typeof session.user === "object" &&
                            "isTwoFactorEnabled" in session.user &&
                            Boolean(session.user.isTwoFactorEnabled)
                              ? "Enabled"
                              : "Disabled"}
                          </Badge>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          Password
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Last changed
                          </span>
                          <span className="text-sm">Unknown</span>
                        </div>
                      </div>

                      {/* Account Creation */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Account Age
                        </h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Created on
                          </span>
                          <span className="text-sm">Unknown</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/settings">
                          <Settings className="mr-2 h-4 w-4" />
                          Manage Security Settings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
