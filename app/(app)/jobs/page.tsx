import { JobLayout } from "@/components/app/jobs/JobLayout";
import { HydrateClient, trpc } from "@/trpc/server";

export default function JobsPage() {
  void trpc.jobs.getAll.prefetch();

  return (
    <HydrateClient>
      <JobLayout />
    </HydrateClient>
  );
}
