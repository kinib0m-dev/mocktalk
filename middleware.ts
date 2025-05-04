import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "@/lib/auth/routes/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  // Add check for tRPC routes to be bypassed from authentication
  const isTrpcRoute = nextUrl.pathname.startsWith("/api/trpc");

  if (req.nextUrl.pathname.includes("/api/webhooks/stripe")) {
    return NextResponse.next();
  }

  if (
    isApiAuthRoute ||
    isTrpcRoute ||
    nextUrl.pathname === "/api/parse-offer"
  ) {
    return applySecurityHeaders();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return applySecurityHeaders();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return applySecurityHeaders();
});

// Function to apply security headers to all responses
function applySecurityHeaders() {
  const response = NextResponse.next();
  const headers = response.headers;

  // Prevent clickjacking
  headers.set("X-Frame-Options", "DENY");

  // Help prevent XSS attacks
  headers.set("X-Content-Type-Options", "nosniff");

  // Strict Transport Security
  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Content Security Policy - Updated to allow all needed services including unsafe-eval
  headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://c.daily.co https://*.daily.co; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https://*.daily.co; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.vapi.ai https://*.vapi.ai https://c.daily.co https://*.daily.co " +
      "https://*.sentry.io https://o77906.ingest.sentry.io wss://*.daily.co; " +
      "media-src 'self' blob:; " +
      "worker-src 'self' blob:;"
  );

  // Referrer Policy
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy - Updated to allow microphone for voice interviews
  headers.set(
    "Permissions-Policy",
    "camera=self, microphone=self, geolocation=(), interest-cohort=()"
  );

  return response;
}

// Optionally, don't invoke Middleware on some paths
// In middleware.ts
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api(?!/webhooks/stripe)|trpc)(.*)",
  ],
};
