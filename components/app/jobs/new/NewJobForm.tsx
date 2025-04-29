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
import { Loader2, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { createJobOfferSchema } from "@/lib/utils/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

type JobFormValues = z.infer<typeof createJobOfferSchema>;

interface NewJobFormProps {
  initialData: JobFormValues;
  onBackClick: () => void;
  rawJobOffer: string;
}

export function NewJobForm({
  initialData,
  onBackClick,
  rawJobOffer,
}: NewJobFormProps) {
  const router = useRouter();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(createJobOfferSchema),
    defaultValues: initialData,
  });

  // Additional form state for tag inputs
  const [skillInput, setSkillInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");

  // tRPC mutation for creating a job
  const createJobMutation = trpc.jobs.createJob.useMutation({
    onSuccess: () => {
      toast.success("Job description saved successfully");
      router.push("/jobs");
    },
    onError: (error) => {
      toast.error("Failed to save job description: " + error.message);
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
    console.log("Submitting form data:", data);
    // Ensure rawContent is included
    const submissionData = {
      ...data,
      rawContent: rawJobOffer,
    };
    createJobMutation.mutate(submissionData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Offer Details</CardTitle>
        <CardDescription>
          Review and edit the extracted information or enter details manually.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                          disabled={createJobMutation.isPending}
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
                      <FormLabel>
                        Company <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. TechInnovate Inc."
                          disabled={createJobMutation.isPending}
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
                      Job Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter the main job description..."
                        className="min-h-[100px]"
                        disabled={createJobMutation.isPending}
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
                    disabled={createJobMutation.isPending}
                  />
                  <Button
                    type="button"
                    onClick={handleAddSkill}
                    size="sm"
                    disabled={createJobMutation.isPending}
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
                        disabled={createJobMutation.isPending}
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
                    disabled={createJobMutation.isPending}
                  />
                  <Button
                    type="button"
                    onClick={handleAddResponsibility}
                    size="sm"
                    disabled={createJobMutation.isPending}
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
                          disabled={createJobMutation.isPending}
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
                    disabled={createJobMutation.isPending}
                  />
                  <Button
                    type="button"
                    onClick={handleAddRequirement}
                    size="sm"
                    disabled={createJobMutation.isPending}
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
                        disabled={createJobMutation.isPending}
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
                          disabled={createJobMutation.isPending}
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
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Hidden field for raw content */}
              <input
                type="hidden"
                {...form.register("rawContent")}
                value={rawJobOffer}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBackClick}
              disabled={createJobMutation.isPending}
            >
              Back
            </Button>
            <Button type="submit" disabled={createJobMutation.isPending}>
              {createJobMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Job
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
