"use client";

import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Award,
  BarChart,
  BookOpen,
  CheckCircle2,
  LineChart,
  MessageSquare,
  Users,
} from "lucide-react";

export function getMetricIcon(metric: EvaluationMetric) {
  switch (metric) {
    case "communication_skills":
      return <MessageSquare className="h-5 w-5" />;
    case "technical_knowledge":
      return <BookOpen className="h-5 w-5" />;
    case "problem_solving":
      return <LineChart className="h-5 w-5" />;
    case "cultural_role_fit":
      return <Users className="h-5 w-5" />;
    case "confidence_clarity":
      return <BarChart className="h-5 w-5" />;
    default:
      return <Award className="h-5 w-5" />;
  }
}

export function getScoreBgColor(score: number): string {
  if (score >= 8) return "bg-green-100 text-green-800";
  if (score >= 6) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
}

export function formatMetricName(metric: EvaluationMetric): string {
  return metric
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function MetricScoreCard({ metric }: { metric: MetricEvaluation }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border">
      <div className="bg-primary/10 p-2 rounded-full">
        {getMetricIcon(metric.metric)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{formatMetricName(metric.metric)}</h3>
          <Badge className={getScoreBgColor(metric.score)}>
            {metric.score.toFixed(1)}/10
          </Badge>
        </div>
        {metric.feedback && (
          <p className="text-sm text-muted-foreground mb-4">
            {metric.feedback}
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metric.strengths && metric.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Strengths
              </h4>
              <ul className="text-sm space-y-1">
                {metric.strengths.map((strength, idx) => (
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
          {metric.improvements && metric.improvements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Areas to Improve
              </h4>
              <ul className="text-sm space-y-1">
                {metric.improvements.map((improvement, idx) => (
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
      </div>
    </div>
  );
}
