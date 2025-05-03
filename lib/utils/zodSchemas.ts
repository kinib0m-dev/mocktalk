import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters required" })
    .regex(/[a-z]/, { message: "At least one lowercase letter required" })
    .regex(/[A-Z]/, { message: "At least one uppercase letter required" })
    .regex(/[0-9]/, { message: "At least one number required" })
    .regex(/(?=.*[!@#$%*^&*\-_])/, {
      message: "At least one special character required",
    }),
});

export const resetSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
});

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters required" })
    .regex(/[a-z]/, { message: "At least one lowercase letter required" })
    .regex(/[A-Z]/, { message: "At least one uppercase letter required" })
    .regex(/[0-9]/, { message: "At least one number required" })
    .regex(/(?=.*[!@#$%*^&*\-_])/, {
      message: "At least one special character required",
    }),
});

// Schema for delete account form
export const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: "Password is required" }),
  confirmation: z.literal("DELETE", {
    message: "Please type DELETE to confirm",
  }),
});

export type DeleteAccountFormValues = z.infer<typeof deleteAccountSchema>;

// --------------------------------- MOCKTALK ---------------------------------

// Enum schemas
export const interviewStatusSchema = z.enum([
  "created",
  "in_progress",
  "completed",
  "cancelled",
]);

export const questionTypeSchema = z.enum([
  "technical",
  "behavioral",
  "situational",
  "role_specific",
  "company_specific",
]);

export const evaluationMetricSchema = z.enum([
  "communication_skills",
  "technical_knowledge",
  "problem_solving",
  "cultural_role_fit",
  "confidence_clarity",
]);

// Job offer schema
export const createJobOfferSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  company: z.string().max(100).optional(),
  description: z.string().min(1, { message: "Description is required" }),
  skills: z.array(z.string()).optional().nullable(),
  responsibilities: z.array(z.string()).optional().nullable(),
  requirements: z.array(z.string()).optional().nullable(),
  sourceUrl: z
    .union([
      z.string().url(),
      z.string().max(0), // Accept empty string
      z.null(),
    ])
    .optional(),
  rawContent: z.string().optional().nullable(),
});

// Job offer schema for parsing without errors
export const jobParserSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  company: z.string().max(100).optional(),
  description: z.string().min(1, { message: "Description is required" }),
  skills: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

// Interview creation schema
export const createInterviewSchema = z.object({
  jobDescriptionId: z
    .string()
    .min(1, { message: "Job description is required" }),
  title: z.string().min(1, { message: "Title is required" }).max(100),
  questionCount: z.number().int().min(3).max(20).default(10),
  systemPrompt: z.string().max(2000).optional().nullable(),
});

// Feedback schema for generating the feedback function
export const feedbackSchema = z.object({
  overallFeedback: z.string(),
  generalStrengths: z.array(z.string()),
  generalImprovements: z.array(z.string()),
  overallScore: z.number().min(0).max(100),

  metrics: z.object({
    communication_skills: z.object({
      score: z.number().min(1).max(10),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      feedback: z.string(),
    }),
    technical_knowledge: z.object({
      score: z.number().min(1).max(10),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      feedback: z.string(),
    }),
    problem_solving: z.object({
      score: z.number().min(1).max(10),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      feedback: z.string(),
    }),
    cultural_role_fit: z.object({
      score: z.number().min(1).max(10),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      feedback: z.string(),
    }),
    confidence_clarity: z.object({
      score: z.number().min(1).max(10),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      feedback: z.string(),
    }),
  }),

  questionFeedback: z.array(
    z.object({
      questionId: z.string(),
      score: z.number().min(1).max(10),
      feedback: z.string(),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      relevanceScore: z.number().min(1).max(10),
      completenessScore: z.number().min(1).max(10),
    })
  ),
});
