import type { Metadata } from "next";
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
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mocktalk.dev"),
  title: {
    default: "MockTalk",
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
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "MockTalk",
    description:
      "MockTalk is an AI-powered interview simulation platform designed for students and recent graduates to practice for job interviews, receive personalized feedback, and enhance their interview performance with detailed insights.",
    images: [""],
    url: "https://mocktalk.dev",
    siteName: "MockTalk",
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
      <html lang="en">
        <body
          className={`${sora.variable} ${sourceSans3.variable} antialiased`}
        >
          <TRPCProvider>
            {children}
            <Toaster richColors closeButton />
          </TRPCProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
