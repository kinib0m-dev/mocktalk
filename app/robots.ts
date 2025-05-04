import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://mocktalk.dev";
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: ["/", "/blog", "/resources"],
        disallow: [
          "/api/",
          "/login",
          "/register",
          "/reset",
          "/new-password",
          "/error",
          "/new-verification",
          "/too-fast",
          "/*?id=*", // Block URLs with query parameters
        ],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/blog", "/resources"],
        disallow: [
          "/api/",
          "/login",
          "/register",
          "/reset",
          "/new-password",
          "/error",
          "/new-verification",
          "/too-fast",
          "/*?id=*", // Block URLs with query parameters
        ],
      },
      {
        userAgent: "*",
        allow: ["/", "/blog", "/resources", "/terms", "/privacy"],
        disallow: [
          "/api/",
          "/login",
          "/register",
          "/reset",
          "/new-password",
          "/error",
          "/new-verification",
          "/too-fast",
          "/dashboard",
          "/jobs",
          "/interviews",
          "/analytics",
          "/settings",
          "/profile",
          "/billing",
          "/*?id=*", // Block URLs with query parameters
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
