import { ResourceDetailLayout } from "@/components/app/resources/detail/ResourceDetailLayout";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function ResourceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { slug } = await params;
  const { id } = await searchParams;

  // If ID is not provided in search params, try to prefetch by slug
  if (id) {
    await trpc.resources.getResourceById.prefetch({ id });
  }

  return (
    <HydrateClient>
      <ResourceDetailLayout slug={slug} id={id} />
    </HydrateClient>
  );
}
