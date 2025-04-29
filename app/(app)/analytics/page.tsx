import { AnalyticsLayout } from "@/components/app/analytics/AnalyticsLayout";
import { HydrateClient, trpc } from "@/trpc/server";

export default function AnalyticsPage() {
  void trpc.analytics.getOverviewStats.prefetch();
  void trpc.analytics.getMetricPerformance.prefetch();
  void trpc.analytics.getQuestionTypePerformance.prefetch();
  void trpc.analytics.getPerformanceTrend.prefetch();
  void trpc.analytics.getStrengthsAndImprovements.prefetch();

  return (
    <HydrateClient>
      <AnalyticsLayout />
    </HydrateClient>
  );
}
