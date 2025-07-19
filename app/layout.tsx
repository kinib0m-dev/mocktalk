import type { Metadata, Viewport } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import AuthProvider from "@/components/auth/AuthProvider";
import { TRPCProvider } from "@/trpc/client";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-source-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0090ff",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mocktalk.dev"),
  title: {
    default: "MockTalk - AI-Powered Interview Practice Platform",
    template: `%s | MockTalk`,
  },
  description:
    "MockTalk is an AI-powered interview simulation platform designed for students and recent graduates to practice for job interviews, receive personalized feedback, and enhance their interview performance with detailed insights.",
  keywords: [
    "AI job interview simulator",
    "mock interview",
    "interview practice",
    "job interview preparation",
    "AI feedback",
    "career coaching",
    "resume enhancement",
    "job interview questions",
    "interview skills",
    "student career tools",
  ],
  authors: [{ name: "MockTalk Team" }],
  creator: "MockTalk",
  publisher: "MockTalk",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  category: "career",
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES", "fr_FR"],
    title: "MockTalk - AI-Powered Interview Practice Platform",
    description:
      "Practice for your next job interview with our AI-powered platform. Get personalized feedback and improve your interview skills.",
    url: "https://mocktalk.dev",
    siteName: "MockTalk",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MockTalk - AI-Powered Interview Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MockTalk - AI-Powered Interview Practice Platform",
    description:
      "Practice for your next job interview with our AI-powered platform. Get personalized feedback and improve your interview skills.",
    images: ["/icons/logo-full.svg"],
    creator: "@mocktalk",
    site: "@mocktalk",
  },
  verification: {
    google: "google-site-verification-code", // Replace with your verification code
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <AuthProvider session={session}>
      <html lang="en" dir="ltr">
        <head>
          <link rel="canonical" href="https://mocktalk.dev" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Add schema.org structured data for Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "MockTalk",
                url: "https://mocktalk.dev",
                logo: "https://mocktalk.dev/icons/logo-full.svg",
                description:
                  "AI-powered interview simulation platform for students and recent graduates",
                sameAs: [
                  "https://twitter.com/mocktalk",
                  "https://linkedin.com/company/mocktalk",
                ],
                foundingDate: "2024",
                founders: [
                  {
                    "@type": "Person",
                    name: "MockTalk Team",
                  },
                ],
              }),
            }}
          />
        </head>
        <body
          className={`${sora.variable} ${sourceSans3.variable} antialiased min-h-screen flex flex-col`}
        >
          <TRPCProvider>
            <main>{children}</main>
            <Toaster richColors closeButton />
          </TRPCProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
