import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mocktalk.dev";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/new-verification", "/too-fast", "/blog"], // Allow essential pages
        disallow: [
          "/login", // Login should not be indexed
          "/register", // Registration page should not be indexed
          "/error", // Error page should not be indexed
          "/reset", // Password reset page should not be indexed
          "/new-password", // New password page should not be indexed
          "/api/", // Block API routes from being indexed
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
