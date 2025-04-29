"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

// Custom Quote icon that looks better for testimonials
const QuoteIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary/20"
  >
    <path
      d="M9.83333 18.5H4.5L9.83333 8.5H6.5L1.16667 18.5V26.5H9.83333V18.5ZM23.8333 18.5H18.5L23.8333 8.5H20.5L15.1667 18.5V26.5H23.8333V18.5Z"
      fill="currentColor"
    />
  </svg>
);

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const testimonials = [
    {
      quote:
        "I struggled with technical interviews for months. MockTalk helped me structure my answers better and gain confidence when discussing my coding experience. The feedback on my communication style was especially valuable.",
      name: "David K.",
      role: "Software Developer",
      location: "Atlanta, GA",
      stars: 5,
    },
    {
      quote:
        "The AI interviewer asked thoughtful follow-up questions that really made me think on my feet. After a few practice sessions, I noticed a huge improvement in how I articulated my past experiences during my actual interviews.",
      name: "Rebecca T.",
      role: "Marketing Specialist",
      location: "Boston, MA",
      stars: 4,
    },
    {
      quote:
        "As someone switching careers, I was nervous about interviewing for roles with limited experience. The practice interviews and specific feedback on how to better frame my transferable skills were incredibly helpful.",
      name: "James M.",
      role: "Career Changer",
      location: "Portland, OR",
      stars: 5,
    },
  ];

  const stats = [
    { value: "86%", label: "Report Improved Confidence" },
    { value: "15,000+", label: "Practice Sessions" },
    { value: "4.7/5", label: "User Satisfaction" },
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
    <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-primary font-medium mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            User Experiences
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What Our Users Are Saying
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real feedback from job seekers who improved their interview skills
            with MockTalk.
          </motion.p>
        </div>

        {/* Testimonial cards */}
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md relative flex flex-col h-full border border-border/40"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6">
                <QuoteIcon />
              </div>

              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.stars
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground mb-6 flex-grow">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* User */}
              <div className="mt-auto">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                      {testimonial.name.charAt(0)}
                    </div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                  </div>
                  <div className="mt-1 pl-10">
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <motion.div
                className="text-4xl md:text-5xl font-bold text-primary mb-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                  isInView
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.8, opacity: 0 }
                }
                transition={{
                  delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 50,
                }}
              >
                {stat.value}
              </motion.div>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
