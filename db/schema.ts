import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  uuid,
  boolean,
  pgEnum,
  real,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ------------------------------------ AUTH ------------------------------------
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  isTwoFactorEnabled: boolean("is_two_factor_enabled").default(false),

  // Account lockout fields
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lastFailedLoginAttempt: timestamp("last_failed_login_attempt", {
    mode: "date",
  }),
  lockedUntil: timestamp("locked_until", { mode: "date" }),

  // Session revocation field
  securityVersion: integer("security_version").default(1),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const verificationTokens = pgTable(
  "verification_token",
  {
    id: uuid("id").notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.id, verificationToken.token],
      }),
    },
  ]
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (passwordResetTokens) => [
    {
      compositePk: primaryKey({
        columns: [passwordResetTokens.id, passwordResetTokens.token],
      }),
    },
  ]
);

export const twoFactorTokens = pgTable(
  "two_factor_tokens",
  {
    id: uuid("id").notNull().defaultRandom(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (twoFactorTokens) => [
    {
      compositePk: primaryKey({
        columns: [twoFactorTokens.id, twoFactorTokens.token],
      }),
    },
  ]
);

export const twoFactorConfirmation = pgTable(
  "two_factor_confirmation",
  {
    id: uuid("id").notNull().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (twoFactorConfirmation) => [
    {
      compositePk: primaryKey({
        columns: [twoFactorConfirmation.userId],
      }),
    },
  ]
);

// Login activity tracking table
export const loginActivities = pgTable("login_activities", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  success: boolean("success").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ------------------------------------ MOCKTALK ------------------------------------

// Enums for interview-related data
export const interviewStatusEnum = pgEnum("interview_status", [
  "created",
  "in_progress",
  "completed",
  "cancelled",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "technical",
  "behavioral",
  "situational",
  "role_specific",
  "company_specific",
]);

export const evaluationMetricEnum = pgEnum("evaluation_metric", [
  "communication_skills",
  "technical_knowledge",
  "problem_solving",
  "cultural_role_fit",
  "confidence_clarity",
]);

// Job offer descriptions
export const jobDescriptions = pgTable("job_descriptions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  company: text("company"),
  description: text("description").notNull(),
  skills: text("skills").array(),
  responsibilities: text("responsibilities").array(),
  requirements: text("requirements").array(),
  sourceUrl: text("source_url"),
  rawContent: text("raw_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Interview sessions
export const interviews = pgTable(
  "interviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobDescriptionId: text("job_description_id")
      .notNull()
      .references(() => jobDescriptions.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    status: interviewStatusEnum("status").default("created").notNull(),
    completedAt: timestamp("completed_at", { mode: "date" }),
    overallScore: real("overall_score"),
    duration: integer("duration"),
    questionCount: integer("question_count").default(5),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      // Add a composite unique constraint on userId + title
      userTitleUnique: uniqueIndex("user_title_unique_idx").on(
        table.userId,
        table.title
      ),
    };
  }
);

// Pre-generated interview questions
export const interviewQuestions = pgTable("interview_questions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  jobDescriptionId: text("job_description_id")
    .notNull()
    .references(() => jobDescriptions.id, { onDelete: "cascade" }),
  interviewId: text("interview_id").references(() => interviews.id, {
    onDelete: "cascade",
  }),
  content: text("content").notNull(),
  type: questionTypeEnum("type").notNull(),
  order: integer("order").notNull(),
  explanation: text("explanation"),
  expectedAnswer: text("expected_answer"),
  difficulty: integer("difficulty"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Complete interview feedback and transcript
export const interviewFeedback = pgTable("interview_feedback", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  interviewId: text("interview_id")
    .notNull()
    .references(() => interviews.id, { onDelete: "cascade" }),
  overallFeedback: text("overall_feedback"), // General feedback text
  generalStrengths: text("general_strengths").array(),
  generalImprovements: text("general_improvements").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feedback per evaluation metric
export const metricScores = pgTable("metric_scores", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  interviewId: text("interview_id")
    .notNull()
    .references(() => interviews.id, { onDelete: "cascade" }),
  metric: evaluationMetricEnum("metric").notNull(),
  score: real("score").notNull(), // 1-10 scale
  strengths: text("strengths").array(),
  improvements: text("improvements").array(),
  feedback: text("feedback"), // Detailed feedback for this metric
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Question-specific feedback
export const questionFeedback = pgTable("question_feedback", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  questionId: text("question_id")
    .notNull()
    .references(() => interviewQuestions.id, { onDelete: "cascade" }),
  interviewId: text("interview_id")
    .notNull()
    .references(() => interviews.id, { onDelete: "cascade" }),
  score: real("score"), // Optional score for this specific question
  feedback: text("feedback"), // Feedback on the specific response
  strengths: text("strengths").array(),
  improvements: text("improvements").array(),
  relevanceScore: integer("relevance_score"), // How relevant the answer was to the question (1-10)
  completenessScore: integer("completeness_score"), // How complete the answer was (1-10)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const interviewTranscripts = pgTable("interview_transcripts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  interviewId: text("interview_id")
    .notNull()
    .references(() => interviews.id, { onDelete: "cascade" }),
  fullTranscript: jsonb("full_transcript").notNull(), // Store as JSON
  participantCount: integer("participant_count").default(2),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ------------------------------------ PAYMENTS ------------------------------------

// User question credits system
export const userQuestionCredits = pgTable("user_question_credits", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  remainingQuestions: integer("remaining_questions").notNull().default(3), // Start with 3 free
  totalQuestionsUsed: integer("total_questions_used").notNull().default(0),
  lastCreditUpdate: timestamp("last_credit_update").defaultNow().notNull(),
});

// ------------------------------------ RESOURCES ------------------------------------

// Resource related types
export const resourceTypeEnum = pgEnum("resource_type", [
  "article",
  "video",
  "guide",
  "template",
]);

export const resourceCategoryEnum = pgEnum("resource_category", [
  "guides",
  "questions",
  "frameworks",
  "industry",
  "career",
  "templates",
]);

// Resources table
export const resources = pgTable("resources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  category: resourceCategoryEnum("category").notNull(),
  type: resourceTypeEnum("type").notNull(),
  iconName: text("icon_name").notNull(), // Store icon name as string
  url: text("url").notNull(),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resource tags for improved searchability
export const resourceTags = pgTable("resource_tags", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  resourceId: text("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

// User bookmarked resources
export const userBookmarkedResources = pgTable("user_bookmarked_resources", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  resourceId: text("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Resource views tracking (for analytics)
export const resourceViews = pgTable("resource_views", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  resourceId: text("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});
