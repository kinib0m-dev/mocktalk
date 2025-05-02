import { BillingLayout } from "@/components/app/billing/BillingLayout";
import { HydrateClient } from "@/trpc/server";

export default function BillingPage() {
  return (
    <HydrateClient>
      <BillingLayout />
    </HydrateClient>
  );
}
