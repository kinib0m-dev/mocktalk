"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  CheckCircle2,
  MessageSquare,
  LineChart,
  AlertTriangle,
  Clock,
  ChevronRight,
  BookOpen,
  BarChart,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  formatQuestionType,
  QuestionFeedbackCard,
} from "./QuestionFeedbackCard";
import {
  formatMetricName,
  getMetricIcon,
  getScoreBgColor,
  MetricScoreCard,
} from "./MetricSocreCard";

function formatDuration(durationInSeconds: number | null): string {
  if (!durationInSeconds) return "N/A";

  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;

  if (minutes === 0) {
    return `${seconds} sec`;
  }

  return `${minutes} min ${seconds} sec`;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-amber-600";
  return "text-red-600";
}

export function InterviewFeedbackView({
  interviewId,
  overallFeedback,
  metricEvaluations,
  questionFeedback,
  stats,
  analysis,
  transcript,
}: InterviewFeedbackResponse) {
  const [activeTab, setActiveTab] = useState("summary");

  // Sort questions by order
  const sortedQuestions = [...questionFeedback].sort(
    (a, b) => a.question.order - b.question.order
  );

  // Sort metrics by score (highest first)
  const sortedMetrics = [...metricEvaluations].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="container max-w-5xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/interviews/${interviewId}`}>
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

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${stats.overallScore ? getScoreColor(stats.overallScore) : ""}`}
            >
              {stats.overallScore ? stats.overallScore.toFixed(1) : "N/A"}/10
            </div>
            <Progress
              value={stats.overallScore ? (stats.overallScore / 10) * 100 : 0}
              className="h-2 mt-2"
            />
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
            <div
              className={`text-2xl font-bold ${getScoreColor(stats.averageQuestionScore)}`}
            >
              {stats.averageQuestionScore.toFixed(1)}/10
            </div>
            <Progress
              value={(stats.averageQuestionScore / 10) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Relevance</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getScoreColor(stats.averageRelevanceScore)}`}
            >
              {stats.averageRelevanceScore.toFixed(1)}/10
            </div>
            <Progress
              value={(stats.averageRelevanceScore / 10) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.duration ? formatDuration(stats.duration) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total interview time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="metrics">Skill Metrics</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
          <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Overall Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {overallFeedback.overallFeedback && (
                <div className="bg-muted/40 p-4 rounded-md text-muted-foreground">
                  {overallFeedback.overallFeedback}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {overallFeedback.generalStrengths &&
                  overallFeedback.generalStrengths.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        Key Strengths
                      </h3>
                      <ul className="space-y-2">
                        {overallFeedback.generalStrengths.map(
                          (strength, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Badge className="bg-green-100 text-green-800 mt-0.5">
                                {idx + 1}
                              </Badge>
                              <span>{strength}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {overallFeedback.generalImprovements &&
                  overallFeedback.generalImprovements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-2">
                        {overallFeedback.generalImprovements.map(
                          (improvement, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Badge className="bg-amber-100 text-amber-800 mt-0.5">
                                {idx + 1}
                              </Badge>
                              <span>{improvement}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
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
              <Accordion type="single" collapsible className="space-y-2">
                {Object.entries(analysis.strengthsByQuestionType).map(
                  ([type, strengths]) => {
                    const improvements =
                      analysis.improvementsByQuestionType[
                        type as QuestionType
                      ] || [];
                    if (strengths.length === 0 && improvements.length === 0)
                      return null;

                    return (
                      <AccordionItem
                        key={type}
                        value={type}
                        className="border rounded-md px-4"
                      >
                        <AccordionTrigger className="py-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-normal">
                              {formatQuestionType(type as QuestionType)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
                            {strengths.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  Strengths
                                </h4>
                                <ul className="text-sm space-y-1">
                                  {strengths.map((strength, idx) => (
                                    <li
                                      key={idx}
                                      className="ml-5 list-disc text-muted-foreground"
                                    >
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {improvements.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                                  Areas to Improve
                                </h4>
                                <ul className="text-sm space-y-1">
                                  {improvements.map((improvement, idx) => (
                                    <li
                                      key={idx}
                                      className="ml-5 list-disc text-muted-foreground"
                                    >
                                      {improvement}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }
                )}
              </Accordion>
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
                {sortedMetrics.slice(0, 2).map((metric) => (
                  <div key={metric.id} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(metric.metric)}
                        <span className="font-medium">
                          {formatMetricName(metric.metric)}
                        </span>
                      </div>
                      <Badge className={getScoreBgColor(metric.score)}>
                        {metric.score.toFixed(1)}/10
                      </Badge>
                    </div>
                    <Progress
                      value={(metric.score / 10) * 100}
                      className="h-2"
                    />
                    {metric.feedback && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {metric.feedback.length > 150
                          ? `${metric.feedback.substring(0, 150)}...`
                          : metric.feedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setActiveTab("metrics")}
              >
                View All Metrics
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Skill Metrics Evaluation
              </CardTitle>
              <CardDescription>
                Detailed assessment of your performance across key skill areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedMetrics.map((metric) => (
                  <MetricScoreCard key={metric.id} metric={metric} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Question-by-Question Analysis
              </CardTitle>
              <CardDescription>
                Detailed feedback for each question in your interview
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="px-6 py-2 space-y-4">
                  {sortedQuestions.map((item) => (
                    <QuestionFeedbackCard key={item.question.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transcript Tab */}
        <TabsContent value="transcript">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Full Interview Transcript
              </CardTitle>
              <CardDescription>
                Complete conversation transcript of your interview session
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="px-6 py-4 space-y-4">
                  {transcript.fullTranscript &&
                  transcript.fullTranscript.length > 0 ? (
                    transcript.fullTranscript.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 p-3 rounded-lg ${
                          message.role === "assistant"
                            ? "bg-slate-100"
                            : message.role === "user"
                              ? "bg-primary/10 ml-auto"
                              : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="bg-primary/20 text-primary p-2 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                            IR
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="text-xs font-medium">
                              {message.role === "assistant"
                                ? "Interviewer"
                                : message.role === "user"
                                  ? "You"
                                  : "System"}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <div className="bg-primary/20 text-primary p-2 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                            YOU
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No transcript available
                      </h3>
                      <p className="text-muted-foreground">
                        The transcript for this interview session is not
                        available.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
