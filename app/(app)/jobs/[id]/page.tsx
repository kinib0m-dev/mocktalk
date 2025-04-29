import { JobDetailLayout } from "@/components/app/jobs/detail/JobDetailLayout";
import { HydrateClient } from "@/trpc/server";

export default async function JobIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <HydrateClient>
      <JobDetailLayout id={id} />
    </HydrateClient>
  );
}
