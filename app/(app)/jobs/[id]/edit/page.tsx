import { JobEditLayout } from "@/components/app/jobs/edit/JobEditLayout";
import { HydrateClient } from "@/trpc/server";

export default async function JobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <HydrateClient>
      <JobEditLayout id={id} />
    </HydrateClient>
  );
}
