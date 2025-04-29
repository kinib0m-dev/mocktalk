import { InterviewDetailLayout } from "@/components/app/interviews/detail/InterviewDetailLayout";
import { HydrateClient } from "@/trpc/server";

export default async function InterviewIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <HydrateClient>
      <InterviewDetailLayout id={id} />
    </HydrateClient>
  );
}
