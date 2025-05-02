import { db } from "@/db";
import { resumeEnhancerCredits, userQuestionCredits } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserCredits(userId: string) {
  const [questionCredits] = await db
    .select()
    .from(userQuestionCredits)
    .where(eq(userQuestionCredits.userId, userId))
    .limit(1);

  const [resumeCredits] = await db
    .select()
    .from(resumeEnhancerCredits)
    .where(eq(resumeEnhancerCredits.userId, userId))
    .limit(1);

  let finalQuestionCredits = questionCredits;
  let finalResumeCredits = resumeCredits;

  if (!finalQuestionCredits) {
    // Create initial credits if not exists
    const [newCredits] = await db
      .insert(userQuestionCredits)
      .values({
        userId,
        remainingQuestions: 3, // Start with 3 free questions
        totalQuestionsUsed: 0,
      })
      .returning();
    finalQuestionCredits = newCredits;
  }

  if (!finalResumeCredits) {
    // Create initial credits if not exists
    const [newCredits] = await db
      .insert(resumeEnhancerCredits)
      .values({
        userId,
        remainingCredits: 1, // Start with 1 free
        totalCreditsUsed: 0,
      })
      .returning();
    finalResumeCredits = newCredits;
  }

  // Return combined credits
  return {
    remainingQuestions: finalQuestionCredits.remainingQuestions,
    totalQuestionsUsed: finalQuestionCredits.totalQuestionsUsed,
    resumeCredits: finalResumeCredits.remainingCredits,
    totalResumeCreditsUsed: finalResumeCredits.totalCreditsUsed,
    lastQuestionCreditUpdate: finalQuestionCredits.lastCreditUpdate,
    lastResumeCreditUpdate: finalResumeCredits.lastCreditUpdate,
  };
}

export async function deductQuestionCredits(userId: string, count: number) {
  const credits = await getUserCredits(userId);

  if (credits.remainingQuestions < count) {
    throw new Error("Not enough question credits");
  }

  const [updatedCredits] = await db
    .update(userQuestionCredits)
    .set({
      remainingQuestions: credits.remainingQuestions - count,
      totalQuestionsUsed: credits.totalQuestionsUsed + count,
      lastCreditUpdate: new Date(),
    })
    .where(eq(userQuestionCredits.userId, userId))
    .returning();

  return updatedCredits;
}

export async function addQuestionCredits(userId: string, count: number) {
  const credits = await getUserCredits(userId);

  const [updatedCredits] = await db
    .update(userQuestionCredits)
    .set({
      remainingQuestions: credits.remainingQuestions + count,
      lastCreditUpdate: new Date(),
    })
    .where(eq(userQuestionCredits.userId, userId))
    .returning();

  return updatedCredits;
}

export async function deductResumeCredits(userId: string, count: number) {
  const credits = await getUserCredits(userId);

  if (credits.resumeCredits < count) {
    throw new Error("Not enough resume enhancer credits");
  }

  const [updatedCredits] = await db
    .update(resumeEnhancerCredits)
    .set({
      remainingCredits: credits.resumeCredits - count,
      totalCreditsUsed: credits.totalResumeCreditsUsed + count,
      lastCreditUpdate: new Date(),
    })
    .where(eq(resumeEnhancerCredits.userId, userId))
    .returning();

  return updatedCredits;
}

export async function addResumeCredits(userId: string, count: number) {
  const credits = await getUserCredits(userId);

  const [updatedCredits] = await db
    .update(resumeEnhancerCredits)
    .set({
      remainingCredits: credits.resumeCredits + count,
      lastCreditUpdate: new Date(),
    })
    .where(eq(resumeEnhancerCredits.userId, userId))
    .returning();

  return updatedCredits;
}
