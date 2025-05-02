"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail } from "lucide-react";
import Link from "next/link";

export function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  // FAQ Categories with questions and answers
  const faqCategories = [
    {
      title: "Getting Started",
      items: [
        {
          question: "How do I start my first interview practice?",
          answer:
            "After signing up, go to your dashboard and click on 'Add Job Description'. Paste a job description you're interested in, and MockTalk will analyze it to create relevant interview questions. Then click 'Generate Interview' to start practicing with our AI interviewer.",
        },
        {
          question: "Is MockTalk completely free to use?",
          answer:
            "MockTalk offers a free plan that includes 3 interview questions and 1 resume enhancement to help you get started. For more extensive practice, we offer affordable question packs that you can purchase as needed, with no subscription required.",
        },
        {
          question: "Do I need any special equipment to use MockTalk?",
          answer:
            "Just a computer or mobile device with a microphone and an internet connection. For the best experience, we recommend using headphones and finding a quiet environment for your practice sessions.",
        },
      ],
    },
    {
      title: "Credits & Pricing",
      items: [
        {
          question: "How does the credits system work?",
          answer:
            "Credits are used to generate interview questions. Each question costs 1 credit. Free accounts start with 3 credits. You can purchase additional question packs when you need more practice, with bonus credits included in larger packs.",
        },
        {
          question: "Do credits expire?",
          answer:
            "No, your purchased credits never expire. You can use them whenever you need to practice for upcoming interviews, whether that's right away or months later.",
        },
        {
          question: "Can I try MockTalk before committing?",
          answer:
            "Absolutely. Our free plan lets you try 3 AI-generated interview questions and 1 resume enhancement so you can experience how MockTalk works before buying additional credits.",
        },
      ],
    },
    {
      title: "Interview Process",
      items: [
        {
          question: "What types of interview questions can I practice?",
          answer:
            "MockTalk supports five types of interview questions: technical, behavioral, situational, role-specific, and company-specific. You can select which types to include in your practice sessions based on what you want to focus on.",
        },
        {
          question: "How realistic is the AI interviewer?",
          answer:
            "Our AI interviewer simulates a real interview setting. It not only asks relevant questions but also follows up based on your answers, creating a dynamic and lifelike interview experience.",
        },
        {
          question: "How long is each interview session?",
          answer:
            "Interview durations depend on the number of questions selected. Here's a general estimate:\n\n- 3 questions → ~6 minutes\n- 4 questions → ~7 minutes\n- 5 questions → ~9 minutes\n- 6 questions → ~10 minutes\n- 7 questions → ~12 minutes\n\n",
        },
      ],
    },
    {
      title: "Feedback & Analytics",
      items: [
        {
          question: "How is my interview performance evaluated?",
          answer:
            "After completing your interview, our AI analyzes your responses across multiple dimensions, including communication skills, technical knowledge, problem-solving ability, cultural fit, and confidence/clarity. You'll receive scores and detailed feedback on each area.",
        },
        {
          question: "Can I review my past interview sessions?",
          answer:
            "Yes, all your completed interviews are saved in your account. You can review full transcripts, feedback, and performance metrics at any time from your dashboard.",
        },
        {
          question: "How can I track my improvement over time?",
          answer:
            "The Analytics section of your dashboard shows your performance trends across different metrics and question types. Use this to identify areas where you've improved and where you might still need to focus.",
        },
      ],
    },
    {
      title: "Account & Privacy",
      items: [
        {
          question: "Is my interview data kept private?",
          answer:
            "Yes, your data is kept private and secure. Your interview recordings, transcripts, and feedback are only accessible to you and are not shared with any third parties. We use industry-standard encryption to protect your information.",
        },
        {
          question: "Can I delete my account and data?",
          answer:
            "Absolutely. You can request account deletion at any time from your account settings. When you delete your account, all your data, including interview recordings and transcripts, will be permanently removed from our systems.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "We use industry-standard payment processors (Stripe) and never store your full credit card information on our servers. All payment transactions are encrypted and secure.",
        },
      ],
    },
  ];

  // Animation variants
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
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.span
            className="inline-block text-primary font-medium mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            FAQ
          </motion.span>
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Find answers to common questions about MockTalk and how it can help
            you ace your interviews.
          </motion.p>
        </div>

        {/* FAQ accordion groups */}
        <motion.div
          ref={ref}
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={itemVariants}
              className="mb-8"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                {category.title}
              </h3>

              <Accordion
                type="single"
                collapsible
                className="bg-white dark:bg-slate-900 rounded-lg border border-border shadow-sm"
              >
                {category.items.map((item, itemIndex) => (
                  <AccordionItem
                    key={itemIndex}
                    value={`${categoryIndex}-${itemIndex}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </motion.div>

        {/* Support callout */}
        <motion.div
          className="mt-12 p-8 bg-primary/5 border border-primary/20 rounded-xl text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            We&apos;re here to help! Reach out to our support team for
            assistance with any questions not covered in our FAQ.
          </p>
          <Button asChild>
            <Link href="mailto:info@mocktalk.com">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
