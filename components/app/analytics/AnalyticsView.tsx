"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  CheckCircle,
  Clock,
  Users,
  Award,
  TrendingUp,
  BarChart2,
  BookOpen,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Legend,
} from "recharts";

interface AnalyticsData {
  overview?: {
    totalInterviews: number;
    completedInterviews: number;
    completionRate: number;
    averageScore: number | string | null;
    totalQuestions: number;
  };
  metrics?: {
    metricScores: Array<{
      metric: string;
      averageScore: number | string | null;
      count: number;
    }>;
  };
  questionTypes?: {
    questionTypeScores: Array<{
      questionType: string;
      averageScore: number | string | null;
      averageRelevance: number | string | null;
      averageCompleteness: number | string | null;
      count: number;
    }>;
  };
  performanceTrend?: {
    performanceTrend: Array<{
      id: string;
      title: string;
      score: number | string | null;
      completedAt: Date | null;
    }>;
  };
  strengthsAndImprovements?: {
    topStrengths: Array<{
      text: string;
      count: number;
    }>;
    topImprovements: Array<{
      text: string;
      count: number;
    }>;
  };
}

interface AnalyticsViewProps {
  data: AnalyticsData;
}

export function AnalyticsView({ data }: AnalyticsViewProps) {
  const isMobile = useIsMobile();

  // Format metric name for display
  const formatMetricName = (metric: string): string => {
    return metric
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Format question type for display
  const formatQuestionType = (type: string): string => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Format the performance trend data for the chart
  const trendData =
    data.performanceTrend?.performanceTrend.map((item) => ({
      name: item.completedAt
        ? format(new Date(item.completedAt), "MMM d")
        : "Unknown",
      score:
        typeof item.score === "string"
          ? parseFloat(item.score)
          : Number(item.score || 0),
      title: item.title,
    })) || [];

  // Format the metric scores data for the chart
  const metricData =
    data.metrics?.metricScores.map((item) => ({
      name: formatMetricName(item.metric),
      score:
        typeof item.averageScore === "string"
          ? parseFloat(item.averageScore)
          : Number(item.averageScore || 0),
      fullMark: 10,
    })) || [];

  // Format the question type scores data for the chart
  const questionTypeData =
    data.questionTypes?.questionTypeScores.map((item) => ({
      name: formatQuestionType(item.questionType),
      score:
        typeof item.averageScore === "string"
          ? parseFloat(item.averageScore)
          : Number(item.averageScore || 0),
      relevance:
        typeof item.averageRelevance === "string"
          ? parseFloat(item.averageRelevance)
          : Number(item.averageRelevance || 0),
      completeness:
        typeof item.averageCompleteness === "string"
          ? parseFloat(item.averageCompleteness)
          : Number(item.averageCompleteness || 0),
    })) || [];

  // Chart colors
  const colors = {
    primary: "#0090ff",
    secondary: "#0072cc",
    accent: "#ff9e3d",
    muted: "#6b7280",
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View insights and performance data from your interview practice
            sessions.
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Interviews
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview?.totalInterviews || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.overview?.completedInterviews || 0} completed
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview?.completionRate
                  ? `${Math.round(data.overview.completionRate)}%`
                  : "0%"}
              </div>
              <Progress
                value={data.overview?.completionRate || 0}
                className="h-2 mt-2"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Average Score
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview?.averageScore
                  ? Math.round(Number(data.overview.averageScore) * 10) / 10
                  : "0"}
                /10
              </div>
              <p className="text-xs text-muted-foreground">
                From completed interviews
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                Questions Answered
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview?.totalQuestions || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total questions practiced
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart
                    data={trendData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      tick={{ fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}/10`, "Score"]}
                      labelFormatter={(label) =>
                        `Interview: ${trendData.find((item) => item.name === label)?.title || label}`
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={colors.primary}
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No data yet</h3>
                  <p className="text-muted-foreground">
                    Complete at least one interview to see your performance
                    trend.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Metrics Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Skills Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metricData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={metricData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        domain={[0, 10]}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        width={150}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value}/10`, "Score"]}
                      />
                      <Bar dataKey="score" fill={colors.primary} barSize={20} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No data yet</h3>
                    <p className="text-muted-foreground">
                      Complete at least one interview to see your skills
                      performance.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Question Type Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Question Type Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {questionTypeData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart
                      data={questionTypeData}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        domain={[0, 10]}
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: isMobile ? 10 : 12 }}
                        width={isMobile ? 100 : 150}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="score"
                        name="Overall Score"
                        fill={colors.primary}
                        barSize={20}
                      />
                      <Bar
                        dataKey="relevance"
                        name="Answer Relevance"
                        fill={colors.secondary}
                        barSize={20}
                      />
                      <Bar
                        dataKey="completeness"
                        name="Answer Completeness"
                        fill={colors.accent}
                        barSize={20}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No data yet</h3>
                    <p className="text-muted-foreground">
                      Complete at least one interview to see your question type
                      performance.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Strengths and Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Top Strengths & Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.strengthsAndImprovements?.topStrengths.length ||
            data.strengthsAndImprovements?.topImprovements.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Top Strengths
                  </h3>
                  <ul className="space-y-3">
                    {data.strengthsAndImprovements?.topStrengths.map(
                      (strength, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                            {strength.count}
                          </Badge>
                          <span>{strength.text}</span>
                        </li>
                      )
                    )}
                    {data.strengthsAndImprovements?.topStrengths.length ===
                      0 && (
                      <li className="text-muted-foreground italic">
                        No strengths data available yet
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-3">
                    {data.strengthsAndImprovements?.topImprovements.map(
                      (improvement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                            {improvement.count}
                          </Badge>
                          <span>{improvement.text}</span>
                        </li>
                      )
                    )}
                    {data.strengthsAndImprovements?.topImprovements.length ===
                      0 && (
                      <li className="text-muted-foreground italic">
                        No improvement data available yet
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No feedback data yet
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Complete at least one interview to see your strengths and
                  areas for improvement.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
