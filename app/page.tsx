import { Metadata } from "next";
import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";

export const metadata: Metadata = {
  title: "MockTalk - AI-Powered Interview Practice Platform",
  description:
    "Prepare for your next job interview with our AI-powered platform. Practice with realistic interview simulations, receive personalized feedback, and track your progress.",
  alternates: {
    canonical: "https://mocktalk.dev",
    languages: {
      "en-US": "https://mocktalk.dev",
      "es-ES": "https://mocktalk.dev/es",
      "fr-FR": "https://mocktalk.dev/fr",
    },
  },
  openGraph: {
    title: "MockTalk - Prepare for Your Next Job Interview with AI",
    description:
      "Our AI-powered platform provides realistic interview practice, personalized feedback, and detailed analytics to help you land your dream job.",
    url: "https://mocktalk.dev",
    images: [
      {
        url: "/images/interview-dashboard.png",
        width: 1200,
        height: 630,
        alt: "MockTalk Platform Preview",
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="flex flex-col">
        <section id="hero">
          <Hero />
        </section>
        <section id="how-it-works" aria-labelledby="how-it-works-heading">
          <HowItWorks />
        </section>
        <section id="features" aria-labelledby="features-heading">
          <Features />
        </section>
        <section id="pricing" aria-labelledby="pricing-heading">
          <Pricing />
        </section>
        <section id="faq" aria-labelledby="faq-heading">
          <FAQ />
        </section>
        <section id="cta">
          <FinalCTA />
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
