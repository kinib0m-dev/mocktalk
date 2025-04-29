import { JobInterviewLayout } from "@/components/app/jobs/interview/JobInterviewLayout";
import { HydrateClient } from "@/trpc/server";

export default async function JobInterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <HydrateClient>
      <JobInterviewLayout id={id} />
    </HydrateClient>
  );
}
