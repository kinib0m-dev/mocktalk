import { InterviewFeedbackLayout } from "@/components/app/interviews/feedback/InterviewFeedbackLayout";
import { HydrateClient } from "@/trpc/server";

export default async function InterviewFeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <HydrateClient>
      <InterviewFeedbackLayout id={id} />
    </HydrateClient>
  );
}
