"use client";

import { useState } from "react";
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
  Building,
  FileText,
  ChevronRight,
  Edit,
  Trash2,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useJobs } from "@/hooks/use-jobs";

export function JobCard({
  id,
  title,
  company,
  description,
  skills,
  responsibilities,
  requirements,
  createdAt,
}: JobOffer) {
  const { deleteJob, isLoading } = useJobs();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle job deletion with dialog confirmation
  const handleDelete = () => {
    deleteJob.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Job offer deleted successfully");
          setIsDeleteDialogOpen(false);
        },
      }
    );
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Get a count of responsibilities and requirements for info display
  const requirementsCount = requirements?.length || 0;
  const responsibilitiesCount = responsibilities?.length || 0;

  return (
    <>
      <Card className="group overflow-hidden border-border/40 hover:border-primary/30 hover:shadow-sm transition-all h-full flex flex-col">
        <CardHeader className="pb-0 flex justify-between">
          <div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              <Link href={`/jobs/${id}`} className="hover:underline">
                {title}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building className="h-4 w-4 mr-1" />
              {company || "No company specified"}
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
                  <Link href={`/jobs/${id}`} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/jobs/${id}/edit`} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/jobs/${id}/interview`}
                    className="cursor-pointer"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Generate Interview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={isLoading.delete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-3 flex-grow">
          <div className="space-y-4">
            {/* Description preview */}
            <p className="text-sm text-muted-foreground">
              {description.length > 120
                ? description.substring(0, 120) + "..."
                : description}
            </p>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills && skills.length > 0 ? (
                  skills.slice(0, 5).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/5 text-primary/90"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No skills specified
                  </span>
                )}
                {skills && skills.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{skills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Job details stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase">
                  Added
                </div>
                <div>{formatDate(createdAt)}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase">
                  Responsibilities
                </div>
                <div>
                  {responsibilitiesCount > 0
                    ? `${responsibilitiesCount} items`
                    : "None"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase">
                  Requirements
                </div>
                <div>
                  {requirementsCount > 0
                    ? `${requirementsCount} items`
                    : "None"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end items-center pt-4 pb-4 mt-auto">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/jobs/${id}`}>View Details</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/jobs/${id}/interview`}>
                Generate
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="text-center">
            <DialogTitle>Delete Job?</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Deleting this job will permanently remove it. This action cannot
              be undone.
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
              {isLoading.delete ? "Deleting..." : "Delete Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
