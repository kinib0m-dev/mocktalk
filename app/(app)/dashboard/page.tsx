import { DashboardLayout } from "@/components/app/dashboard/DashboardLayout";
import { HydrateClient, trpc } from "@/trpc/server";

export default function DashboardPage() {
  // Prefetch data for dashboard components
  void trpc.jobs.getAll.prefetch();
  void trpc.interviews.getAll.prefetch();
  void trpc.credits.getUserCredits.prefetch();
  void trpc.dashboard.getRecentActivity.prefetch();
  void trpc.dashboard.getStats.prefetch();

  return (
    <HydrateClient>
      <DashboardLayout />
    </HydrateClient>
  );
}
