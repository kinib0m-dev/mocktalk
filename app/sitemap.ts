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

  // Static routes
  const publicRoutes = ["/", "/new-verification", "/too-fast", "/blog"];

  const authRoutes = [
    "/login",
    "/register",
    "/error",
    "/reset",
    "/new-password",
  ];

  const privateRoutes = ["/analytics", "/dashboard", "/profile", "/settings"];

  // Dynamic routes
  const dynamicInterviewRoutes = interviewIds.map((id) => `/interviews/${id}`);
  const dynamicJobRoutes = jobIds.map((id) => `/jobs/${id}`);
  const dynamicResourceRoutes = resourceSlugs.map(
    (slug) => `/resources/${slug}`
  );

  // Combine all URLs
  const allUrls = [
    ...publicRoutes,
    ...authRoutes,
    ...privateRoutes,
    ...dynamicInterviewRoutes,
    ...dynamicJobRoutes,
    ...dynamicResourceRoutes,
  ];

  // Return sitemap with dynamic values and metadata for SEO
  return allUrls.map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changefreq: ["/", "/blog"].includes(url) ? "daily" : "weekly", // Change frequency (high for homepage/blog)
    priority: ["/", "/blog"].includes(url) ? 1.0 : 0.8, // Priority (higher for important pages)
  }));
}
