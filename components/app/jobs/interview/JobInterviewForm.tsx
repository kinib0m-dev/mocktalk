"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { useCredits } from "@/hooks/use-credits";
import { useInterviews } from "@/hooks/use-interviews";
import { Skeleton } from "@/components/ui/skeleton";

// Define the allowed question types
const QuestionTypeEnum = z.enum([
  "technical",
  "behavioral",
  "situational",
  "role_specific",
  "company_specific",
]);

// Type aliases to make the code cleaner
type QuestionType = z.infer<typeof QuestionTypeEnum>;

// Form schema with proper typing
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  questionCount: z.number().min(3).max(7),
  selectedTypes: z
    .array(QuestionTypeEnum)
    .min(1, "Select at least one question type"),
});

// Infer the form values type from the schema
type FormValues = z.infer<typeof formSchema>;

interface JobInterviewFormProps {
  job: JobOffer;
}

export function JobInterviewForm({ job }: JobInterviewFormProps) {
  const router = useRouter();
  const { generateNewInterview, isLoading } = useInterviews();
  const { credits, hasEnoughCredits } = useCredits();

  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: "technical", label: "Technical" },
    { value: "behavioral", label: "Behavioral" },
    { value: "situational", label: "Situational" },
    { value: "role_specific", label: "Role-specific" },
    { value: "company_specific", label: "Company-specific" },
  ];

  const defaultValues: FormValues = {
    title: `${job.title} Interview`,
    questionCount: 5,
    selectedTypes: ["technical", "behavioral"],
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const questionCount = form.watch("questionCount");
  const selectedTypes = form.watch("selectedTypes");

  const onSubmit = async (values: FormValues) => {
    if (!hasEnoughCredits(values.questionCount)) {
      toast.error("Not enough question credits");
      return;
    }

    const result = await generateNewInterview({
      jobOfferId: job.id,
      title: values.title,
      questionCount: values.questionCount,
      selectedTypes: values.selectedTypes,
    });

    if (result && result.interview) {
      router.push(`/interviews/${result.interview.id}`);
    }
  };
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/jobs/${job.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Generate Interview
            </h1>
            <p className="text-muted-foreground">
              Practice your interview skills for {job.title}
            </p>
          </div>
        </div>
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle>Generate Interview Practice</CardTitle>
            <CardDescription>
              Configure your practice interview session for this job.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 px-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter a title for this interview session"
                          disabled={isLoading.start}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="questionCount"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Number of Questions</FormLabel>
                      <div className="space-y-2">
                        <Slider
                          min={3}
                          max={7}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isLoading.start}
                          className="w-full"
                        />
                        <div className="flex justify-between">
                          <span>3</span>
                          <span className="font-medium">
                            {field.value} questions
                          </span>
                          <span>7</span>
                        </div>
                      </div>
                      {credits?.remainingQuestions ? (
                        <p className="text-sm text-muted-foreground mt-1">
                          You have {credits.remainingQuestions} questions
                          remaining
                        </p>
                      ) : (
                        <Skeleton className="mt-1 h-2 w-[50pxß]" />
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectedTypes"
                  render={() => (
                    <FormItem className="mb-6">
                      <FormLabel>Question Types</FormLabel>
                      <div className="space-y-3 mt-2">
                        {questionTypes.map((type) => (
                          <FormField
                            key={type.value}
                            control={form.control}
                            name="selectedTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={type.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        type.value
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              type.value,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== type.value
                                              )
                                            );
                                      }}
                                      disabled={isLoading.start}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {type.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {credits?.remainingQuestions &&
                  !hasEnoughCredits(questionCount) && (
                    <Alert variant="destructive">
                      <AlertTitle>Not enough question credits</AlertTitle>
                      <AlertDescription>
                        You need{" "}
                        {questionCount - (credits.remainingQuestions || 0)} more
                        question credits to generate this interview.
                        <Button variant="outline" asChild className="ml-2 mt-2">
                          <Link href="/billing">Buy Questions</Link>
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
              </CardContent>

              <CardFooter className="flex justify-between px-6 py-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading.start}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isLoading.start ||
                    !hasEnoughCredits(questionCount) ||
                    selectedTypes.length === 0
                  }
                  className="min-w-[140px]"
                >
                  {isLoading.start ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Generate Interview
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
