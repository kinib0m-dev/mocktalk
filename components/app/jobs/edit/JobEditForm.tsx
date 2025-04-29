"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ArrowLeft, Loader2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { createJobOfferSchema } from "@/lib/utils/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";
import Link from "next/link";

type JobFormValues = z.infer<typeof createJobOfferSchema>;

interface JobEditFormProps {
  job: JobOffer;
}

export function JobEditForm({ job }: JobEditFormProps) {
  const router = useRouter();

  // Initialize form with existing job data
  const form = useForm<JobFormValues>({
    resolver: zodResolver(createJobOfferSchema),
    defaultValues: {
      title: job.title,
      company: job.company || "",
      description: job.description,
      skills: job.skills || [],
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      sourceUrl: job.sourceUrl || "",
      rawContent: job.rawContent || "",
    },
  });

  // Additional form state for tag inputs
  const [skillInput, setSkillInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  // tRPC mutation for updating a job
  const updateJobMutation = trpc.jobs.updateJob.useMutation({
    onSuccess: () => {
      toast.success("Job offer updated successfully");
      utils.jobs.getJobById.invalidate({ id: job.id });
      router.push(`/jobs/${job.id}`);
    },
    onError: (error) => {
      setFormError(error.message || "Failed to update job offer");
      toast.error("Failed to update job offer");
    },
  });

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = form.getValues("skills") || [];
      if (!currentSkills.includes(skillInput.trim())) {
        form.setValue("skills", [...currentSkills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = form.getValues("skills") || [];
    form.setValue(
      "skills",
      currentSkills.filter((s) => s !== skill)
    );
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      const currentResponsibilities = form.getValues("responsibilities") || [];
      if (!currentResponsibilities.includes(responsibilityInput.trim())) {
        form.setValue("responsibilities", [
          ...currentResponsibilities,
          responsibilityInput.trim(),
        ]);
        setResponsibilityInput("");
      }
    }
  };

  const handleRemoveResponsibility = (responsibility: string) => {
    const currentResponsibilities = form.getValues("responsibilities") || [];
    form.setValue(
      "responsibilities",
      currentResponsibilities.filter((r) => r !== responsibility)
    );
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      const currentRequirements = form.getValues("requirements") || [];
      if (!currentRequirements.includes(requirementInput.trim())) {
        form.setValue("requirements", [
          ...currentRequirements,
          requirementInput.trim(),
        ]);
        setRequirementInput("");
      }
    }
  };

  const handleRemoveRequirement = (requirement: string) => {
    const currentRequirements = form.getValues("requirements") || [];
    form.setValue(
      "requirements",
      currentRequirements.filter((r) => r !== requirement)
    );
  };

  // Form submission handler
  const onSubmit = (data: JobFormValues) => {
    setFormError(null);
    updateJobMutation.mutate({
      id: job.id,
      data: {
        ...data,
        // Keep the original rawContent if it exists
        rawContent: job.rawContent || data.rawContent,
      },
    });
  };

  return (
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
            <Link href={`/jobs/${job.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Job</h1>
            <p className="text-muted-foreground">
              Update information for the job offer description
            </p>
          </div>
        </div>

        {formError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Edit the information for this job offer description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Job Title <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. Senior Full Stack Developer"
                              disabled={updateJobMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Company */}
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g. TechInnovate Inc."
                              disabled={updateJobMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Description{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter the main job description..."
                            className="min-h-[100px]"
                            disabled={updateJobMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label htmlFor="skills">Required Skills</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="skills"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        placeholder="e.g. React"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        disabled={updateJobMutation.isPending}
                      />
                      <Button
                        type="button"
                        onClick={handleAddSkill}
                        size="sm"
                        disabled={updateJobMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("skills")?.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-muted"
                            disabled={updateJobMutation.isPending}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {!form.watch("skills")?.length && (
                        <span className="text-sm text-muted-foreground">
                          No skills added yet
                        </span>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="skills"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Responsibilities */}
                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">Responsibilities</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="responsibilities"
                        value={responsibilityInput}
                        onChange={(e) => setResponsibilityInput(e.target.value)}
                        placeholder="e.g. Design and implement web applications"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddResponsibility();
                          }
                        }}
                        disabled={updateJobMutation.isPending}
                      />
                      <Button
                        type="button"
                        onClick={handleAddResponsibility}
                        size="sm"
                        disabled={updateJobMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {form
                        .watch("responsibilities")
                        ?.map((responsibility, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md bg-muted"
                          >
                            <span>{responsibility}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveResponsibility(responsibility)
                              }
                              disabled={updateJobMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      {!form.watch("responsibilities")?.length && (
                        <span className="text-sm text-muted-foreground">
                          No responsibilities added yet
                        </span>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="responsibilities"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Requirements */}
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="requirements"
                        value={requirementInput}
                        onChange={(e) => setRequirementInput(e.target.value)}
                        placeholder="e.g. 5+ years of experience in web development"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRequirement();
                          }
                        }}
                        disabled={updateJobMutation.isPending}
                      />
                      <Button
                        type="button"
                        onClick={handleAddRequirement}
                        size="sm"
                        disabled={updateJobMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {form.watch("requirements")?.map((requirement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md bg-muted"
                        >
                          <span>{requirement}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRequirement(requirement)}
                            disabled={updateJobMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {!form.watch("requirements")?.length && (
                        <span className="text-sm text-muted-foreground">
                          No requirements added yet
                        </span>
                      )}
                    </div>
                    <FormField
                      control={form.control}
                      name="requirements"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Source URL */}
                  <FormField
                    control={form.control}
                    name="sourceUrl"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Source URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. https://linkedin.com/jobs/123456"
                              disabled={updateJobMutation.isPending}
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                              // Ensure value is always a string
                              value={field.value || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Pass empty string to the form but handle null/undefined for Zod
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Link to the original job posting (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  disabled={updateJobMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateJobMutation.isPending}>
                  {updateJobMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
