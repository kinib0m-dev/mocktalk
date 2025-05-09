"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Check,
  HelpCircle,
  ShoppingCart,
  Sparkles,
  FileText,
  Package,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Pricing() {
  const freeRef = useRef(null);
  const paidRef = useRef(null);

  const isFreeInView = useInView(freeRef, { once: true, amount: 0.1 });
  const isPaidInView = useInView(paidRef, { once: true, amount: 0.2 });

  const freeTier = {
    name: "Launchpad",
    description: "Perfect for anyone to try the core experience.",
    features: [
      { text: "3 AI Interview Questions" },
      { text: "1 Resume Enhancement" },
      { text: "Full AI-Powered Interview Simulation" },
      { text: "Interactive Performance Report" },
      { text: "Access to Learning Resources" },
    ],
    note: "No credit card required.",
    cta: "Sign Up Free",
    ctaLink: "/register",
  };

  const packs = [
    {
      name: "KickStart",
      icon: "🚀",
      badge: "First Timer",
      description: "Ideal for first-timers and light users.",
      price: "$6",
      features: [
        { text: "5 Interview Questions" },
        {
          text: "1 Resume Enhancement",
          tooltip: "Included at a rate of 1 per 5 questions purchased",
        },
        { text: "Performance Reports & Learning Hub Access" },
      ],
      cta: "Get Pack",
      ctaLink: "/billing",
      highlight: false,
    },
    {
      name: "Momentum",
      icon: "💪",
      badge: "Most Popular",
      description: "Designed for moderate users with regular practice needs.",
      price: "$12",
      features: [
        { text: "10 Interview Questions" },
        { text: "2 Resume Enhancements" },
        { text: "Full Progress Tracking" },
        { text: "Performance Reports & Learning Hub Access" },
      ],
      cta: "Get Pack",
      ctaLink: "/billing",
      highlight: true,
    },
    {
      name: "Accelerator",
      icon: "⚡",
      badge: "Best Value",
      description: "Perfect for power users preparing deeply for interviews.",
      price: "$22",
      features: [
        { text: "20 Interview Questions" },
        { text: "4 Resume Enhancements" },
        { text: "Advanced Feedback Reports" },
        { text: "Priority Support" },
      ],
      cta: "Get Pack",
      ctaLink: "/billing",
      highlight: false,
    },
    {
      name: "Summit",
      icon: "🏔️",
      badge: "Most Complete",
      description: "For heavy users and those receiving career coaching.",
      price: "$40",
      features: [
        { text: "40 Interview Questions" },
        { text: "8 Resume Enhancements" },
        { text: "Advanced Feedback Reports" },
        { text: "Premium Priority Support" },
        { text: "Exclusive Content Access" },
      ],
      cta: "Get Pack",
      ctaLink: "/billing",
      highlight: false,
    },
  ];

  const resumeEnhancers = [
    {
      amount: 1,
      price: "$2",
    },
    {
      amount: 4,
      price: "$7",
    },
    {
      amount: 10,
      price: "$14",
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
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-primary font-medium mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isFreeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5 }}
          >
            Pricing
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isFreeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose the Plan That Works for You
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isFreeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start free and purchase question packs only when you need more
            practice. No subscriptions or recurring fees.
          </motion.p>
        </div>

        {/* Free tier */}
        <motion.div
          ref={freeRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isFreeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-border p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-5">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{freeTier.name}</h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {freeTier.description}
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-8">
              {freeTier.features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="text-sm text-muted-foreground italic mb-6">
              {freeTier.note}
            </div>

            <Button size="lg" className="px-8" asChild>
              <Link href={freeTier.ctaLink}>
                {freeTier.cta}
                <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Divider with text */}
        <div className="relative flex items-center justify-center my-12">
          <div className="border-t border-border w-full absolute"></div>
          <span className="relative bg-background px-4 text-muted-foreground">
            Buy question packs when you need more
          </span>
        </div>

        {/* Question Packs */}
        <motion.div
          ref={paidRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isPaidInView ? "visible" : "hidden"}
        >
          <TooltipProvider>
            {packs.map((pack, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative rounded-xl border ${
                  pack.highlight
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border"
                } bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300`}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {pack.badge && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg">
                      {pack.badge}
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
                      <span className="text-2xl">{pack.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{pack.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {pack.description}
                    </p>

                    <div className="text-3xl md:text-4xl font-bold">
                      {pack.price}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      One-time purchase
                    </p>
                  </div>

                  <div className="border-t border-border pt-6 mb-6">
                    <ul className="space-y-3">
                      {pack.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span>{feature.text}</span>
                          {feature.tooltip && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p>{feature.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full"
                    variant={pack.highlight ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link href={pack.ctaLink}>
                      {pack.cta}
                      <Package className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </TooltipProvider>
        </motion.div>

        {/* Resume Enhancer Add-on */}
        <motion.div
          className="mt-12 p-6 rounded-xl border border-primary/20 bg-primary/5"
          initial={{ opacity: 0, y: 20 }}
          animate={isPaidInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="md:w-3/4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold">
                  Additional Resume Enhancers
                </h3>
              </div>
              <p className="text-muted-foreground mb-3">
                Buy additional resume enhancers anytime. Choose from these
                bundles:
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                {resumeEnhancers.map((bundle, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-800 rounded-lg px-4 py-2 border border-border"
                  >
                    <span className="font-bold text-lg">{bundle.price}</span>
                    <span className="text-muted-foreground block text-sm">
                      {bundle.amount}{" "}
                      {bundle.amount === 1 ? "Enhancer" : "Enhancers"}
                    </span>
                  </div>
                ))}
              </div>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>AI-Optimized Resume</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Tailored to Each Job Offer</span>
                </li>
              </ul>
            </div>
            <Button size="lg" className="md:w-auto w-full" asChild>
              <Link href="/billing">
                Buy Resume Enhancers
                <ShoppingCart className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
