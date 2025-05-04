import {
  getAllInterviewIds,
  getAllJobIds,
  getAllResourceSlugs,
} from "@/lib/auth/helpers/ids";

export default async function sitemap() {
  const baseUrl = "https://mocktalk.dev";

  // Fetch dynamic pages
  const interviewIds = await getAllInterviewIds();
  const jobIds = await getAllJobIds();
  const resourceSlugs = await getAllResourceSlugs();

  // Static routes with proper categorization and priority
  const routes = [
    // Public pages - highest priority
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },

    // Auth pages - excluded from sitemap
    // "/login", "/register", "/reset", etc.

    // App sections - medium priority
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/interviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/billing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/settings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic routes - lower priority
  const dynamicRoutes = [
    // Interview detail pages
    ...interviewIds.map((id) => ({
      url: `${baseUrl}/interviews/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),

    // Job detail pages
    ...jobIds.map((id) => ({
      url: `${baseUrl}/jobs/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    })),

    // Resource detail pages
    ...resourceSlugs.map((slug) => ({
      url: `${baseUrl}/resources/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];

  return [...routes, ...dynamicRoutes];
}
