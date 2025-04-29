"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building,
  Edit,
  Trash2,
  MessageSquare,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  FileText,
  GraduationCap,
  Clock,
} from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { toast } from "sonner";

interface JobDetailViewProps {
  job: JobOffer;
}

export function JobDetailView({ job }: JobDetailViewProps) {
  const router = useRouter();
  const { deleteJob, isLoading } = useJobs();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteJob.mutate(
      { id: job.id },
      {
        onSuccess: () => {
          toast.success("Job description deleted successfully");
          setIsDeleteDialogOpen(false);
          router.push("/jobs");
        },
      }
    );
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          {/* Header with back button and title */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-muted"
            >
              <Link href="/jobs">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
              <div className="flex items-center mt-1 text-muted-foreground gap-2">
                <Building className="h-4 w-4" />
                <span>{job.company || "No company specified"}</span>
                <span className="text-muted-foreground/50">•</span>
                <Clock className="h-4 w-4" />
                <span>Added {formatDate(job.createdAt)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/jobs/${job.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/jobs/${job.id}/interview`}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Generate Interview
                </Link>
              </Button>
            </div>
          </div>

          {/* Main content card */}
          <Card className="overflow-hidden border-border/40">
            <CardHeader className="border-b pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Briefcase className="h-5 w-5 text-primary" />
                Job Details
              </CardTitle>
              {job.createdAt.toString() !== job.updatedAt.toString() && (
                <CardDescription className="text-xs">
                  Last updated {formatDate(job.updatedAt)}
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Description section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Description
                </h3>
                <div className="bg-muted/30 p-4 rounded-lg whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              <Separator />

              {/* Skills section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills && job.skills.length > 0 ? (
                    job.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 hover:bg-primary/20 text-primary"
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">
                      No skills specified
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              {/* Responsibilities section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Responsibilities
                </h3>
                {job.responsibilities && job.responsibilities.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="pl-2">
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground italic">
                    No responsibilities specified
                  </span>
                )}
              </div>

              <Separator />

              {/* Requirements section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Requirements
                </h3>
                {job.requirements && job.requirements.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="pl-2">
                        {requirement}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-muted-foreground italic">
                    No requirements specified
                  </span>
                )}
              </div>

              {/* Source URL if available */}
              {job.sourceUrl && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <ExternalLink className="h-5 w-5 text-primary" />
                      Source
                    </h3>
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Original Job Posting
                      </a>
                    </Button>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="border-t p-4 flex justify-end">
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isLoading.delete}
                size="sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Job
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Job?</DialogTitle>
            <DialogDescription>
              Deleting this job will permanently remove it. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading.delete}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading.delete}
            >
              {isLoading.delete ? "Deleting..." : "Delete Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
