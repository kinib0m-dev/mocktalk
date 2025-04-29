"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Sparkles,
  FileText,
  Zap,
  Mic,
  Presentation,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice-Based AI Interviewer",
      description:
        "Practice with our lifelike AI interviewer that responds to your voice and adapts questions based on your answers.",
      span: "col-span-2",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Role-Specific Questions",
      description:
        "Get interview questions tailored to your industry, role, and the specific job you're applying for.",
      span: "col-span-1",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Multiple Interview Types",
      description:
        "Practice technical, behavioral, situational, and role-specific interview questions to be fully prepared.",
      span: "col-span-1",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Detailed Feedback",
      description:
        "Receive comprehensive feedback on your responses to improve your communication and interview technique.",
      span: "col-span-1",
    },
    {
      icon: <Presentation className="h-6 w-6" />,
      title: "Performance Analytics",
      description:
        "Track your progress with detailed analytics on your interview performance, strengths, and areas for improvement.",
      span: "col-span-3",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Resume Enhancer",
      description:
        "Optimize your resume for each job application with AI-powered suggestions and improvements tailored to the role.",
      span: "col-span-2",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
    <section id="features" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_80%_20%,var(--primary)/8%,transparent)]" />
      <div className="absolute -left-20 top-1/4 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-primary font-medium mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything You Need to Ace Your Interview
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            MockTalk combines advanced AI with expert interview techniques to
            provide you with the most effective interview practice experience.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          ref={ref}
          className="grid grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-xl border border-border/40 bg-white dark:bg-slate-900/60 hover:shadow-md hover:border-primary/20 transition-all duration-300 ${feature.span}`}
              whileHover={{ y: -5 }}
            >
              <div className="p-3 rounded-lg bg-primary/10 text-primary inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-4">
            Ready to level up your interview game?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Get personalized AI coaching, improve your communication, and land
            the job you deserve.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
