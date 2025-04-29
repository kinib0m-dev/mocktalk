"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Calendar,
  FileText,
  ChevronRight,
  PlayCircle,
  BarChart,
  Trash2,
  Loader2,
  Building,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { useInterviews } from "@/hooks/use-interviews";

export function InterviewCard({
  id,
  title,
  status,
  completedAt,
  overallScore,
  questionCount,
  createdAt,
  company,
  position,
}: ExtendedInterview) {
  const { deleteInterview, isLoading } = useInterviews();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const getStatusBadge = (status: InterviewStatus) => {
    switch (status) {
      case "created":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Not Started
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        );
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Handle interview deletion with dialog confirmation
  const handleDelete = () => {
    deleteInterview.mutate({ id: id });
  };

  return (
    <>
      <Card className="group overflow-hidden border-border/40 hover:border-border transition-all">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                <Link href={`/interviews/${id}`} className="hover:underline">
                  {title}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                {getStatusBadge(status)}
                <span className="mx-2">•</span>
                <span>{questionCount} questions</span>
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-70 group-hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/interviews/${id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  {status === "created" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/interviews/${id}/practice`}>
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Interview
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {status === "completed" && (
                    <DropdownMenuItem asChild>
                      <Link href={`/interviews/${id}/feedback`}>
                        <BarChart className="mr-2 h-4 w-4" />
                        View Feedback
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={isLoading.delete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {/* Company information */}
            {company && (
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{company}</span>
              </div>
            )}

            {/* Position information */}
            {position && (
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{position}</span>
              </div>
            )}

            {/* Creation date */}
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Created: {formatDate(createdAt)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <div>
            {status === "completed" && (
              <div className="flex items-center">
                <span className="font-medium">
                  Score: {overallScore ? overallScore.toFixed(1) : "N/A"}
                </span>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Completed {completedAt ? formatDate(completedAt) : "N/A"}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {status === "created" && (
              <Button size="sm" asChild>
                <Link href={`/interviews/${id}/practice`}>
                  Start
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
            {status === "completed" && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/interviews/${id}/feedback`}>
                  View Feedback
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-center">
            <DialogTitle>Delete Interview?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Deleting this interview will permanently remove it and all related
              data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between gap-2">
            <Button
              variant="secondary"
              disabled={isLoading.delete}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading.delete}
            >
              {isLoading.delete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Interview"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
