import { gemini } from "@/lib/utils/google";
import { generateText } from "ai";

// Define the QuestionType enum to match your schema
type QuestionType =
  | "technical"
  | "behavioral"
  | "situational"
  | "role_specific"
  | "company_specific";

type JobOffer = {
  id: string;
  title: string;
  company: string | null;
  description: string;
  skills: string[] | null;
  responsibilities: string[] | null;
  requirements: string[] | null;
};

// Define an interface for raw parsed questions from AI response
interface RawQuestion {
  question: string;
  explanation: string;
  answerFramework: string;
  difficulty?: number;
}

type GeneratedQuestion = {
  question: string;
  explanation: string;
  answerFramework: string;
  type: QuestionType;
  difficulty: number;
};

export async function generateInterviewQuestions(
  job: JobOffer,
  count: number,
  selectedTypes: QuestionType[]
): Promise<GeneratedQuestion[]> {
  // Determine how many questions to generate per type
  const distribution = distributeQuestions(count, selectedTypes);

  let allQuestions: GeneratedQuestion[] = [];

  // Generate questions for each type
  for (const type of Object.keys(distribution) as QuestionType[]) {
    const typeCount = distribution[type];
    if (typeCount <= 0) continue;

    const prompt = createQuestionPrompt(job, type, typeCount);

    try {
      const { text: responseText } = await generateText({
        model: gemini("gemini-2.0-flash-001"),
        prompt,
        temperature: 0.7,
        maxTokens: 2000,
      });

      const questions = parseQuestionsFromResponse(responseText);

      // Add type to each question with defensive handling
      const questionsWithType = questions.map((q) => {
        // Ensure q has the necessary properties
        const validQuestion: RawQuestion = {
          question:
            typeof q.question === "string" ? q.question : "Default question",
          explanation:
            typeof q.explanation === "string"
              ? q.explanation
              : "No explanation provided",
          answerFramework:
            typeof q.answerFramework === "string"
              ? q.answerFramework
              : "No answer framework provided",
          difficulty:
            typeof q.difficulty === "number" ? q.difficulty : undefined,
        };

        return {
          ...validQuestion,
          type,
          difficulty:
            validQuestion.difficulty || calculateDifficulty(validQuestion),
        };
      });

      // Only take the requested number for this type
      const limitedQuestions = questionsWithType.slice(0, typeCount);
      allQuestions = [...allQuestions, ...limitedQuestions];
    } catch (error) {
      console.error(`Error generating ${type} questions:`, error);
      // Continue with other types if one fails
    }
  }

  // Final check to ensure we don't exceed the requested count
  if (allQuestions.length > count) {
    allQuestions = allQuestions.slice(0, count);
  }

  return allQuestions;
}

function createQuestionPrompt(
  job: JobOffer,
  type: QuestionType,
  count: number
): string {
  const {
    title,
    company,
    description,
    skills,
    responsibilities,
    requirements,
  } = job;

  return `
  You are an expert AI interview coach and hiring strategist with deep experience in talent acquisition and technical assessment across industries.

Your task is to generate exactly ${count} **unique** and **role-relevant** ${type} interview questions for a **${title}** position${company ? ` at ${company}` : ""}.

The goal is to create high-quality, challenging, but fair interview questions that allow interviewers to effectively evaluate a candidate's qualifications, critical thinking, and fit for the role.

Context for the position:
- **Job Description:** ${description}
${skills?.length ? `- **Required Skills:** ${skills.join(", ")}` : ""}
${responsibilities?.length ? `- **Responsibilities:** ${responsibilities.join(", ")}` : ""}
${requirements?.length ? `- **Requirements:** ${requirements.join(", ")}` : ""}

For **each question**, return an object containing:
1. **"question"** – the interview question itself
2. **"explanation"** – what the question aims to evaluate in the candidate
3. **"answerFramework"** – a structured outline of what a strong answer should include

Format Instructions:
- Return your response as a **JSON array** of objects
- Each object must have exactly the following fields: "question",  "explanation", "answerFramework"
- Do **not** include any additional text, notes, or formatting outside the array
- Generate **exactly ${count}** questions — no more, no less

Example output:
[
  {
    "question": "Describe a situation where you had to solve a complex problem.",
    "explanation": "This question tests the candidate’s problem-solving abilities and logical reasoning.",
    "answerFramework": "Use the STAR method: Situation, Task, Action, Result. Emphasize analytical thinking, collaboration, and outcome."
  },
  ...
]

  `;
}

function parseQuestionsFromResponse(responseText: string): RawQuestion[] {
  try {
    // Clean up the response if needed (remove markdown, etc.)
    let jsonText = responseText;
    if (jsonText.includes("```json")) {
      jsonText = jsonText.replace(/```json\s*/, "").replace(/\s*```\s*$/, "");
    } else if (jsonText.includes("```")) {
      jsonText = jsonText.replace(/```\s*/, "").replace(/\s*```\s*$/, "");
    }

    const parsedData = JSON.parse(jsonText);

    // Validate parsed data is an array
    if (!Array.isArray(parsedData)) {
      return [
        {
          question: "Fallback question due to parsing error",
          explanation: "The AI response was not in the expected format",
          answerFramework: "Please try again with a different prompt",
        },
      ];
    }

    // Validate each question has the required fields and handle alternative field names
    return parsedData.map((item) => {
      // Check for alternative field names for answerFramework
      const answerFramework =
        item.answerFramework ||
        item.answer_framework ||
        item.sampleAnswer ||
        item.sample_answer ||
        item.answer ||
        item.framework ||
        "No answer framework provided";

      return {
        question:
          typeof item.question === "string"
            ? item.question
            : "Default question",
        explanation:
          typeof item.explanation === "string"
            ? item.explanation
            : "No explanation provided",
        answerFramework:
          typeof answerFramework === "string"
            ? answerFramework
            : "No answer framework provided",
        difficulty:
          typeof item.difficulty === "number" ? item.difficulty : undefined,
      };
    });
  } catch (error) {
    console.error("Failed to parse questions:", error);
    // Fallback parsing logic if needed
    const questions: RawQuestion[] = [];
    const lines = responseText.split("\n");
    let currentQuestion: Partial<RawQuestion> = {};

    for (const line of lines) {
      if (line.match(/^Question \d+:/)) {
        if (currentQuestion.question) {
          questions.push({
            question: currentQuestion.question || "Missing question",
            explanation: currentQuestion.explanation || "Missing explanation",
            answerFramework:
              currentQuestion.answerFramework || "Missing answer framework",
          });
          currentQuestion = {};
        }
        currentQuestion.question = line.replace(/^Question \d+:/, "").trim();
      } else if (line.match(/^Explanation:/)) {
        currentQuestion.explanation = line.replace(/^Explanation:/, "").trim();
      } else if (line.match(/^Answer Framework:/)) {
        currentQuestion.answerFramework = line
          .replace(/^Answer Framework:/, "")
          .trim();
      }
    }

    if (currentQuestion.question) {
      questions.push({
        question: currentQuestion.question || "Missing question",
        explanation: currentQuestion.explanation || "Missing explanation",
        answerFramework:
          currentQuestion.answerFramework || "Missing answer framework",
      });
    }

    // If we still have no questions, provide a fallback
    if (questions.length === 0) {
      questions.push({
        question: "Fallback question due to parsing error",
        explanation: "The AI response could not be parsed correctly",
        answerFramework: "Please try again with a different prompt",
      });
    }

    return questions;
  }
}

function distributeQuestions(
  totalCount: number,
  types: QuestionType[]
): Record<QuestionType, number> {
  const result: Record<QuestionType, number> = {
    technical: 0,
    behavioral: 0,
    situational: 0,
    role_specific: 0,
    company_specific: 0,
  };

  // If no types selected or total count is 0, return empty distribution
  if (types.length === 0 || totalCount === 0) {
    return result;
  }

  // Basic distribution - equal numbers across selected types
  const basePerType = Math.floor(totalCount / types.length);
  let remaining = totalCount - basePerType * types.length;

  // Assign base count to each selected type
  for (const type of types) {
    result[type] = basePerType;
  }

  // Distribute any remaining questions (add one to each type until no more remain)
  for (let i = 0; i < types.length && remaining > 0; i++) {
    result[types[i]]++;
    remaining--;
  }

  // Sanity check - ensure total count matches requested count
  let totalAssigned = 0;
  for (const type of Object.keys(result) as QuestionType[]) {
    totalAssigned += result[type];
  }

  // If we've somehow assigned too many, adjust down
  if (totalAssigned > totalCount) {
    // Remove extras from types with the most questions
    const sortedTypes = types.sort((a, b) => result[b] - result[a]);
    for (let i = 0; totalAssigned > totalCount; i++) {
      if (result[sortedTypes[i % sortedTypes.length]] > 0) {
        result[sortedTypes[i % sortedTypes.length]]--;
        totalAssigned--;
      }
    }
  }

  return result;
}

function calculateDifficulty(question: RawQuestion): number {
  // Simple algorithm to estimate difficulty (1-5 scale)
  // This could be enhanced with more sophisticated logic
  const questionText =
    typeof question.question === "string"
      ? question.question.toLowerCase()
      : "";

  const answerText =
    typeof question.answerFramework === "string"
      ? question.answerFramework.toLowerCase()
      : "";

  let difficulty = 3; // Default medium difficulty

  // Higher difficulty for questions with certain keywords
  const complexityTerms = [
    "complex",
    "challenging",
    "difficult",
    "advanced",
    "expert",
    "senior",
    "architect",
    "lead",
    "design",
  ];

  for (const term of complexityTerms) {
    if (questionText.includes(term) || answerText.includes(term)) {
      difficulty += 1;
      break;
    }
  }

  // Lower difficulty for simpler questions
  const simplifiedTerms = ["basic", "simple", "entry", "junior", "fundamental"];

  for (const term of simplifiedTerms) {
    if (questionText.includes(term) || answerText.includes(term)) {
      difficulty -= 1;
      break;
    }
  }

  // Ensure difficulty is within range
  return Math.max(1, Math.min(5, difficulty));
}
