"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  BarChart,
  Briefcase,
  MessageSquare,
  CheckCircle,
  Target,
  PenTool,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  const steps = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Upload Your Job Description",
      description:
        "Start by pasting a job description to tailor your practice interview to the specific role you're applying for.",
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      benefits: [
        "Custom questions based on job requirements",
        "Industry-specific focus",
        "Targeted skill assessment",
      ],
      accent: "border-blue-400 dark:border-blue-600",
      iconBg: "bg-blue-500 dark:bg-blue-700",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Generate Your Interview",
      description:
        "MockTalk analyzes the job requirements and creates a personalized interview with relevant questions for your target role.",
      color:
        "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      benefits: [
        "AI-powered question generation",
        "Role-appropriate difficulty level",
        "Covers key skills from the job post",
      ],
      accent: "border-purple-400 dark:border-purple-600",
      iconBg: "bg-purple-500 dark:bg-purple-700",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Practice with AI Interviewer",
      description:
        "Engage in realistic voice interviews with our AI interviewer that adapts to your responses and asks follow-up questions.",
      color:
        "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      benefits: [
        "Real-time conversation flow",
        "Voice recognition technology",
        "Natural follow-up questions",
      ],
      accent: "border-amber-400 dark:border-amber-600",
      iconBg: "bg-amber-500 dark:bg-amber-700",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Get Detailed Feedback",
      description:
        "Receive comprehensive feedback on your performance, including strengths, areas for improvement, and specific suggestions.",
      color:
        "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      benefits: [
        "Personalized improvement suggestions",
        "Performance analytics dashboard",
        "Compare progress over time",
      ],
      accent: "border-green-400 dark:border-green-600",
      iconBg: "bg-green-500 dark:bg-green-700",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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

  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/30 dark:to-slate-900/10 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span
            className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Simple Process
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            How MockTalk <span className="text-primary">Works</span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A simple four-step process to prepare you for interviews and improve
            your chances of landing your dream job.
          </motion.p>
        </div>

        {/* Process steps */}
        <div ref={ref} className="relative">
          {/* Steps connector line */}
          <div className="absolute left-[28px] sm:left-1/2 sm:-translate-x-1/2 top-8 bottom-8 w-1 sm:w-px bg-gradient-to-b from-primary/30 via-primary/50 to-primary/20"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-16 sm:space-y-24 relative z-10"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start gap-8"
              >
                {/* Step Number with Icon */}
                <div className="flex-shrink-0 relative z-10">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${step.iconBg}`}
                  >
                    {step.icon}
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white dark:bg-slate-800 -z-10 opacity-20 blur-[10px]"></div>
                </div>

                {/* Step Content Card */}
                <div
                  className={`flex-1 bg-white dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border-l-4 ${step.accent}`}
                >
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-5">
                    {step.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-lg p-4">
                    <h4 className="font-semibold text-sm uppercase text-slate-500 dark:text-slate-400 mb-3">
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {step.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step Number Indicator */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">{index + 1}</span>
                  </div>

                  {/* Visual Decorator Element */}
                  <div
                    className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full ${step.color} opacity-20 blur-xl`}
                  ></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Results Section */}
        <motion.div
          className="mt-20 bg-primary/5 border border-primary/20 rounded-xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-4">
            The Results You&apos;ll Achieve
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800/60 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-3">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="font-bold mb-1">Confidence Boost</h4>
              <p className="text-sm text-muted-foreground">
                Enter interviews with proven preparation and performance
                insights
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800/60 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 mb-3">
                <PenTool className="h-6 w-6" />
              </div>
              <h4 className="font-bold mb-1">Communication Skills</h4>
              <p className="text-sm text-muted-foreground">
                Develop clear, concise answers that highlight your strengths
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800/60 p-5 rounded-lg shadow-sm flex flex-col items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h4 className="font-bold mb-1">Job Offer Success</h4>
              <p className="text-sm text-muted-foreground">
                Dramatically increase your chances of landing your dream job
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {isAuthenticated ? (
            <Button size="lg" className="px-8 h-12 text-base" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button size="lg" className="px-8 h-12 text-base" asChild>
              <Link href="/register">Start Your First Interview</Link>
            </Button>
          )}
          <p className="text-muted-foreground mt-4">
            No credit card required to start. Get 3 free interview questions
            today.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
