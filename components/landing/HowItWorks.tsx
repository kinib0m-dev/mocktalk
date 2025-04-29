"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FileText, BarChart, Briefcase, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
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
      image: "/images/step-1.png",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Generate Your Interview",
      description:
        "MockTalk analyzes the job requirements and creates a personalized interview with relevant questions for your target role.",
      color:
        "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      image: "/images/step-2.png",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Practice with AI Interviewer",
      description:
        "Engage in realistic voice interviews with our AI interviewer that adapts to your responses and asks follow-up questions.",
      color:
        "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
      image: "/images/step-3.png",
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Get Detailed Feedback",
      description:
        "Receive comprehensive feedback on your performance, including strengths, areas for improvement, and specific suggestions.",
      color:
        "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      image: "/images/step-4.png",
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
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/5"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

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
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/50 to-primary/20 hidden md:block"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-24 md:space-y-32 relative z-10"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`md:grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:rtl" : ""}`}
              >
                {/* Text Content */}
                <div
                  className={`${index % 2 === 1 ? "md:text-right" : ""} md:ltr space-y-4`}
                >
                  <div className="flex items-center mb-6 md:justify-start">
                    <div
                      className={`p-4 rounded-full ${step.color} mr-4 flex items-center justify-center shadow-sm`}
                    >
                      {step.icon}
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground text-lg">
                    {step.description}
                  </p>
                </div>

                {/* Image/Visual */}
                <motion.div
                  className="mt-8 md:mt-0 relative"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="aspect-video bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-border/50 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent z-0" />
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={600}
                      height={350}
                      className="w-full h-full object-cover z-10 relative"
                    />
                  </div>

                  {/* Animation dots at corners */}
                  <motion.div
                    className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                  <motion.div
                    className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5 + 1.5,
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="mt-20 text-center"
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
