"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Award,
  Headphones,
  BarChart,
  Zap,
  MessageSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";

export function FinalCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50 },
    },
  };

  // Highlight features
  const highlights = [
    {
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      title: "Practice With AI",
      description:
        "Experience realistic voice-based interview simulations tailored to your job applications.",
    },
    {
      icon: <Award className="h-5 w-5 text-amber-500" />,
      title: "Personalized Feedback",
      description:
        "Receive detailed insights on your strengths and areas for improvement after each session.",
    },
    {
      icon: <BarChart className="h-5 w-5 text-green-500" />,
      title: "Track Progress",
      description:
        "Monitor your improvement over time with detailed analytics and performance metrics.",
    },
    {
      icon: <Zap className="h-5 w-5 text-purple-500" />,
      title: "No Commitments",
      description:
        "Start free and only pay for what you need with our flexible credit-based system.",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/30" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[40%] -right-[10%] w-[80%] h-[80%] rounded-full opacity-10 bg-primary blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[10%] w-[80%] h-[80%] rounded-full opacity-10 bg-primary blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Main heading */}
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
            variants={itemVariants}
          >
            Prepare to Impress in Your Next{" "}
            <span className="text-primary">Interview</span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Don&apos;t leave your dream job to chance. Join thousands of
            successful job seekers who&apos;ve used MockTalk to prepare
            effectively and interview confidently.
          </motion.p>

          {/* Highlight features grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-border/40"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                    {highlight.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{highlight.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Testimonial quote */}
          <motion.div
            className="relative mb-12 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            <div className="absolute -top-4 -left-4 text-6xl text-primary/20 font-serif">
              &quot;
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-border/40 italic text-muted-foreground">
              MockTalk helped me prepare for my senior developer interview at a
              top tech company. The AI interviewer asked thoughtful technical
              questions, and the feedback on my communication style was
              game-changing. I&apos;m now working at my dream job!
              <div className="mt-4 text-right text-sm font-medium text-foreground">
                — Michael R., Senior Software Engineer
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 text-6xl text-primary/20 font-serif">
              &quot;
            </div>
          </motion.div>

          {/* Final CTA buttons */}
          <motion.div
            className="flex flex-col items-center"
            variants={itemVariants}
          >
            {isAuthenticated ? (
              <Button size="lg" className="px-8 text-lg h-14" asChild>
                <Link href="/dashboard">
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <div className="space-y-4">
                <Button size="lg" className="px-8 text-lg h-14" asChild>
                  <Link href="/register">
                    Start Practicing Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  No credit card required. Get 3 free interview questions today.
                </p>
              </div>
            )}

            {/* Contact option */}
            <motion.div
              className="mt-8 flex items-center gap-2"
              variants={itemVariants}
            >
              <Headphones className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Questions? Contact our support team at{" "}
                <Link
                  href="mailto:info@mocktalk.com"
                  className="text-primary hover:underline"
                >
                  info@mocktalk.com
                </Link>
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
