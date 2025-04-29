import { ResourcesLayout } from "@/components/app/resources/ResourcesLayout";
import { HydrateClient } from "@/trpc/server";

export default function ResourcesPage() {
  return (
    <HydrateClient>
      <ResourcesLayout />
    </HydrateClient>
  );
}
