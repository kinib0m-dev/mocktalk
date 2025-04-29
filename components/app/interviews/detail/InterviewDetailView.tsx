import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  Briefcase,
  Building,
  Award,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function InterviewDetailView({
  interview,
  questionsCount,
  feedback,
}: ExtendedInterviewAndFeedback) {
  const router = useRouter();

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "created":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "Not available";
    return format(new Date(date), "MMMM dd, yyyy • h:mm a");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{interview.title}</h1>
        <Badge className={getStatusColor(interview.status)} variant="outline">
          {interview.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Interview Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={18} />
              Interview Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Company:</span>
              <span className="font-medium">
                {interview.company || "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Position:</span>
              <span className="font-medium">
                {interview.position || "Not specified"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created:</span>
              <span className="font-medium">
                {formatDate(interview.createdAt)}
              </span>
            </div>
            {interview.completedAt && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Completed:
                </span>
                <span className="font-medium">
                  {formatDate(interview.completedAt)}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Duration:</span>
              <span className="font-medium">0</span>
            </div>
          </CardContent>
        </Card>

        {/* Questions & Scores Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={18} />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Questions:</span>
              <span className="font-medium">{questionsCount} questions</span>
            </div>

            {interview.status === "completed" && (
              <>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Overall Score:
                  </span>
                  <span className="font-medium">
                    {interview.overallScore
                      ? `${interview.overallScore.toFixed(1)}/10`
                      : "Not scored"}
                  </span>
                </div>

                {/* Score visualization if available */}
                {interview.overallScore && (
                  <div className="mt-4">
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${(interview.overallScore / 10) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Preview Card (if completed) */}
      {interview.status === "completed" && feedback && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Feedback Highlights</CardTitle>
            <CardDescription>
              Key takeaways from your interview performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback.overallFeedback && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {feedback.overallFeedback.length > 200
                    ? `${feedback.overallFeedback.substring(0, 200)}...`
                    : feedback.overallFeedback}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              {feedback.generalStrengths &&
                feedback.generalStrengths.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Key Strengths</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {feedback.generalStrengths
                        .slice(0, 3)
                        .map((strength, i) => (
                          <li key={i} className="mb-1">
                            {strength}
                          </li>
                        ))}
                      {feedback.generalStrengths.length > 3 && (
                        <li>
                          <span className="text-sm text-blue-600">
                            +{feedback.generalStrengths.length - 3} more
                            strengths
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

              {/* Areas for Improvement */}
              {feedback.generalImprovements &&
                feedback.generalImprovements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Areas for Improvement
                    </h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {feedback.generalImprovements
                        .slice(0, 3)
                        .map((improvement, i) => (
                          <li key={i} className="mb-1">
                            {improvement}
                          </li>
                        ))}
                      {feedback.generalImprovements.length > 3 && (
                        <li>
                          <span className="text-sm text-blue-600">
                            +{feedback.generalImprovements.length - 3} more
                            areas
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/interviews/${interview.id}/feedback`)
              }
              className="w-full"
            >
              View Full Feedback
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {interview.status === "created" && (
          <Button
            className="flex-1"
            onClick={() => router.push(`/interviews/${interview.id}/practice`)}
          >
            Start Interview
          </Button>
        )}
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/interviews")}
        >
          Back to Interviews
        </Button>
      </div>
    </div>
  );
}
