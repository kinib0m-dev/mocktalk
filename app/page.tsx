import { FAQ } from "@/components/landing/FAQ";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
}
