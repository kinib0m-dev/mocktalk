import { InterviewPracticeLayout } from "@/components/app/interviews/practice/InterviewPracticeLayout";
import { HydrateClient } from "@/trpc/server";

export default async function InterviewPracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <HydrateClient>
      <InterviewPracticeLayout id={id} />
    </HydrateClient>
  );
}
