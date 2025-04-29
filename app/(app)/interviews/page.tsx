import { InterviewLayout } from "@/components/app/interviews/InterviewLayout";
import { HydrateClient, trpc } from "@/trpc/server";

export default function JobsPage() {
  void trpc.interviews.getAll.prefetch();

  return (
    <HydrateClient>
      <InterviewLayout />
    </HydrateClient>
  );
}
