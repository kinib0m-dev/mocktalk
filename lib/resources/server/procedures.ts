// lib/resources/server/procedures.ts
import { z } from "zod";
import { db } from "@/db";
import { resources, resourceTags, userBookmarkedResources } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const resourcesRouter = createTRPCRouter({
  // Get all resources - no filtering, just return everything
  getAllResources: protectedProcedure.query(async () => {
    try {
      // Simple query to get all resources
      const resourcesList = await db
        .select()
        .from(resources)
        .orderBy(desc(resources.createdAt));

      return resourcesList;
    } catch (error) {
      console.error("Failed to get resources:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve resources",
      });
    }
  }),

  // Get featured resources
  getFeaturedResources: protectedProcedure.query(async () => {
    try {
      // Get resources marked as featured
      const featuredResourcesList = await db
        .select()
        .from(resources)
        .where(eq(resources.isFeatured, true))
        .orderBy(desc(resources.createdAt));

      return featuredResourcesList;
    } catch (error) {
      console.error("Failed to get featured resources:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve featured resources",
      });
    }
  }),

  // Get a single resource by ID
  getResourceById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // Get the resource
        const [resource] = await db
          .select()
          .from(resources)
          .where(eq(resources.id, input.id))
          .limit(1);

        if (!resource) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resource not found",
          });
        }

        // Get the tags for this resource
        const tagResults = await db
          .select({ tag: resourceTags.tag })
          .from(resourceTags)
          .where(eq(resourceTags.resourceId, input.id));

        const tags = tagResults.map((t) => t.tag);

        // Get related resources based on category (simple approach)
        const relatedResources = await db
          .select()
          .from(resources)
          .where(eq(resources.category, resource.category))
          .limit(4);

        // Remove the current resource from related resources
        const filteredRelatedResources = relatedResources
          .filter((r) => r.id !== input.id)
          .slice(0, 3);

        return {
          resource,
          tags,
          relatedResources: filteredRelatedResources,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("Failed to get resource details:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve resource details",
        });
      }
    }),

  // Add resource to user bookmarks
  bookmarkResource: protectedProcedure
    .input(z.object({ resourceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      try {
        // Check if resource exists
        const [resource] = await db
          .select()
          .from(resources)
          .where(eq(resources.id, input.resourceId))
          .limit(1);

        if (!resource) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resource not found",
          });
        }

        // Add to bookmarks
        await db.insert(userBookmarkedResources).values({
          userId: user.id,
          resourceId: input.resourceId,
        });

        return { success: true };
      } catch (error) {
        console.error("Failed to bookmark resource:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to bookmark resource",
        });
      }
    }),

  // Remove resource from user bookmarks
  removeBookmark: protectedProcedure
    .input(z.object({ resourceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;

      try {
        await db
          .delete(userBookmarkedResources)
          .where(
            and(
              eq(userBookmarkedResources.userId, user.id),
              eq(userBookmarkedResources.resourceId, input.resourceId)
            )
          );

        return { success: true };
      } catch (error) {
        console.error("Failed to remove bookmark:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove bookmark",
        });
      }
    }),

  // Get user bookmarked resources
  getUserBookmarks: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    try {
      const bookmarks = await db
        .select({
          resource: resources,
        })
        .from(userBookmarkedResources)
        .innerJoin(
          resources,
          eq(userBookmarkedResources.resourceId, resources.id)
        )
        .where(eq(userBookmarkedResources.userId, user.id))
        .orderBy(desc(userBookmarkedResources.createdAt));

      return bookmarks.map((item) => item.resource);
    } catch (error) {
      console.error("Failed to get user bookmarks:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to retrieve bookmarked resources",
      });
    }
  }),
});
