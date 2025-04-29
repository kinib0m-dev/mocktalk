import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Award, Calendar, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface InterviewPerformanceCardProps {
  id: string;
  title: string;
  score: number;
  completedAt: Date;
}

export function InterviewPerformanceCard({
  id,
  title,
  score,
  completedAt,
}: InterviewPerformanceCardProps) {
  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card className="overflow-hidden border-border/40 hover:border-border transition-all">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              <Link href={`/interviews/${id}`} className="hover:underline">
                {title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span>
                {format(new Date(completedAt), "MMM d, yyyy • h:mm a")}
              </span>
            </CardDescription>
          </div>
          <Badge className="bg-green-100 text-green-800">Completed</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          <div className="flex items-center">
            <span className="font-medium">Score:</span>
            <span className={`text-lg font-bold ml-2 ${getScoreColor(score)}`}>
              {score.toFixed(1)}/10
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button size="sm" variant="outline" asChild className="ml-auto">
          <Link href={`/interviews/${id}/feedback`}>
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            View Feedback
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
