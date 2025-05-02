"use client";

import { motion } from "framer-motion";
import { CalendarDays, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-20 min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Icon */}
          <motion.div
            className="mb-8 inline-flex items-center justify-center p-4 bg-primary/10 rounded-full"
            variants={fadeIn}
          >
            <BookOpen className="h-8 w-8 text-primary" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
            variants={fadeIn}
          >
            Our Blog is Coming Soon
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8"
            variants={fadeIn}
          >
            We&apos;re working on creating valuable content for you. Our blog
            will be up and running in the next few days.
          </motion.p>

          {/* Status card */}
          <motion.div
            className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-10 flex flex-col md:flex-row items-center justify-center gap-6"
            variants={fadeIn}
          >
            <div className="flex items-center gap-3 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Currently under construction</span>
            </div>

            <div className="h-10 w-px bg-border hidden md:block"></div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span>Launch date: Coming in the next few days</span>
            </div>
          </motion.div>

          {/* Topics preview */}
          <motion.div className="mb-10" variants={fadeIn}>
            <h3 className="text-lg font-medium mb-4">
              Topics we&apos;ll cover:
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Interview Tips",
                "Career Advice",
                "Resume Building",
                "Tech Trends",
                "Success Stories",
              ].map((topic, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={fadeIn}
          >
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
