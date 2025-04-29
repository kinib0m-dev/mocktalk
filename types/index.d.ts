// Existing interface definitions
interface FormWrapperProps {
  children: React.ReactNode;
  label: string;
  showSocials?: boolean;
  buttonLabel: string;
  buttonHref: string;
}

interface SubmitButtonProps {
  text: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  className?: string;
  isPending: boolean;
}

// New interface definitions for MockTalk

// Enum Types
type InterviewStatus = "created" | "in_progress" | "completed" | "cancelled";
type QuestionType =
  | "technical"
  | "behavioral"
  | "situational"
  | "role_specific"
  | "company_specific";
type EvaluationMetric =
  | "communication_skills"
  | "technical_knowledge"
  | "problem_solving"
  | "cultural_role_fit"
  | "confidence_clarity";
type MessageRole = "system" | "user" | "assistant";

// User related types
interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  isTwoFactorEnabled: boolean;
}

// Job Offer types
interface JobOffer {
  id: string;
  userId: string;
  title: string;
  company: string | null;
  description: string;
  skills: string[] | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
  sourceUrl: string | null;
  rawContent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interview Session types
interface Interview {
  id: string;
  title: string;
  status: InterviewStatus;
  completedAt: Date | null;
  overallScore: number | null;
  questionCount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Extended Interview Session types
interface ExtendedInterview extends Interview {
  company: string | null;
  position: string | null;
}

interface InterviewFeedback {
  id: string;
  interviewId: string;
  overallFeedback: string | null;
  generalStrengths: string[] | null;
  generalImprovements: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interview with feedback and question count
interface ExtendedInterviewAndFeedback {
  interview: ExtendedInterview;
  questionsCount: number;
  feedback: InterviewFeedback | null;
}

type InterviewQuestion = {
  id: string;
  content: string;
  type: QuestionType;
  order: number;
  explanation: string | null;
  expectedAnswer: string | null;
  difficulty: number | null;
  createdAt: Date;
};

interface MetricScore {
  id: string;
  interviewId: string;
  metric: EvaluationMetric;
  score: number;
  strengths: string[] | null;
  improvements: string[] | null;
  feedback: string | null;
  createdAt: Date;
}

interface QuestionFeedback {
  id: string;
  questionId: string;
  interviewId: string;
  score: number | null;
  feedback: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
  relevanceScore: number | null;
  completenessScore: number | null;
  createdAt: Date;
}

type SortOption = "newest" | "oldest" | "alphabetical" | "company";

type JobFormValues = z.infer<typeof createJobOfferSchema>;

/**
 * Question type enum values
 */
type QuestionType =
  | "technical"
  | "behavioral"
  | "situational"
  | "role_specific"
  | "company_specific";

/**
 * Evaluation metric enum values
 */
type EvaluationMetric =
  | "communication_skills"
  | "technical_knowledge"
  | "problem_solving"
  | "cultural_role_fit"
  | "confidence_clarity";

/**
 * Overall feedback for an interview
 */
interface OverallFeedback {
  id: string;
  interviewId: string;
  overallFeedback: string | null;
  generalStrengths: string[] | null;
  generalImprovements: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Metric-specific evaluation
 */
interface MetricEvaluation {
  id: string;
  interviewId: string;
  metric: EvaluationMetric;
  score: number;
  strengths: string[] | null;
  improvements: string[] | null;
  feedback: string | null;
  createdAt: Date;
}

/**
 * Question data
 */
interface QuestionData {
  id: string;
  content: string;
  type: QuestionType;
  order: number;
  expectedAnswer: string | null;
}

/**
 * Feedback for a specific question
 */
interface QuestionFeedback {
  id: string;
  questionId: string;
  interviewId: string;
  score: number | null;
  feedback: string | null;
  strengths: string[] | null;
  improvements: string[] | null;
  relevanceScore: number | null;
  completenessScore: number | null;
  createdAt: Date;
}

/**
 * Combined question data with its feedback
 */
interface QuestionWithFeedback {
  feedback: QuestionFeedback;
  question: QuestionData;
}

/**
 * Performance statistics
 */
interface PerformanceStats {
  overallScore: number | null;
  averageQuestionScore: number;
  averageRelevanceScore: number;
  averageCompletenessScore: number;
  duration: number | null;
}

/**
 * Categorized feedback analysis
 */
interface FeedbackAnalysis {
  strengthsByQuestionType: Record<QuestionType, string[]>;
  improvementsByQuestionType: Record<QuestionType, string[]>;
}

interface InterviewTranscript {
  id: string;
  interviewId: string;
  participantCount: number | null;
  fullTranscript: { role: string; content: string }[] | null;
  createdAt: Date;
}

/**
 * Complete interview feedback response
 */
interface InterviewFeedbackResponse {
  interviewId: string;
  overallFeedback: OverallFeedback;
  metricEvaluations: MetricEvaluation[];
  questionFeedback: QuestionWithFeedback[];
  stats: PerformanceStats;
  analysis: FeedbackAnalysis;
  transcript: InterviewTranscript;
}

interface LoginActivityRecord {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  createdAt: Date;
}

interface ActivityResponse {
  success: boolean;
  activities?: LoginActivityRecord[];
  message?: string;
}

type ResourceCategory =
  | "guides"
  | "questions"
  | "frameworks"
  | "industry"
  | "career"
  | "templates";

type ResourceType = "article" | "video" | "guide" | "template";

interface Resource {
  id: string;
  title: string;
  description: string;
  content: string | null;
  category: ResourceCategory;
  type: ResourceType;
  iconName: string;
  url: string;
  isFeatured: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}
