"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { getScoreBgColor } from "./MetricSocreCard";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function formatQuestionType(type: QuestionType): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function QuestionFeedbackCard({ item }: { item: QuestionWithFeedback }) {
  const [showExpectedAnswer, setShowExpectedAnswer] = useState(false);

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              Question {item.question.order + 1}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {formatQuestionType(item.question.type)}
              </Badge>
              {item.feedback.score && (
                <Badge className={getScoreBgColor(item.feedback.score)}>
                  Score: {item.feedback.score.toFixed(1)}/10
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/40 rounded-md">
          <p className="font-medium">{item.question.content}</p>
        </div>

        {item.feedback.feedback && (
          <div>
            <h4 className="text-sm font-medium mb-2">Feedback</h4>
            <p className="text-sm text-muted-foreground">
              {item.feedback.feedback}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {item.feedback.strengths && item.feedback.strengths.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Strengths
              </h4>
              <ul className="text-sm space-y-1">
                {item.feedback.strengths.map((strength, idx) => (
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

          {item.feedback.improvements &&
            item.feedback.improvements.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Areas to Improve
                </h4>
                <ul className="text-sm space-y-1">
                  {item.feedback.improvements.map((improvement, idx) => (
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

        {item.feedback.relevanceScore && item.feedback.completenessScore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Relevance</span>
                <span className="text-sm font-medium">
                  {item.feedback.relevanceScore.toFixed(1)}/10
                </span>
              </div>
              <Progress
                value={(item.feedback.relevanceScore / 10) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Completeness</span>
                <span className="text-sm font-medium">
                  {item.feedback.completenessScore.toFixed(1)}/10
                </span>
              </div>
              <Progress
                value={(item.feedback.completenessScore / 10) * 100}
                className="h-2"
              />
            </div>
          </div>
        )}

        {item.question.expectedAnswer && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowExpectedAnswer(!showExpectedAnswer)}
              className="w-full flex justify-between items-center"
            >
              <span>Expected Answer Framework</span>
              {showExpectedAnswer ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showExpectedAnswer && (
              <div className="mt-3 p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
                {item.question.expectedAnswer}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
