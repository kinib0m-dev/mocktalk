import { db } from "@/db";
import { userQuestionCredits } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserCredits(userId: string) {
  const [credits] = await db
    .select()
    .from(userQuestionCredits)
    .where(eq(userQuestionCredits.userId, userId))
    .limit(1);

  if (!credits) {
    // Create initial credits if not exists
    const [newCredits] = await db
      .insert(userQuestionCredits)
      .values({
        userId,
        remainingQuestions: 3, // Start with 3 free questions
        totalQuestionsUsed: 0,
      })
      .returning();
    return newCredits;
  }

  return credits;
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
