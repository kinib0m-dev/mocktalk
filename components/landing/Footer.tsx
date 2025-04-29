"use client";

import Link from "next/link";
import Image from "next/image";
import { cloneElement, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronRight, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const navigation = {
    product: [
      { name: "Features", href: "/#features" },
      { name: "How It Works", href: "/#how-it-works" },
      { name: "Pricing", href: "/#pricing" },
      { name: "FAQ", href: "/#faq" },
    ],
    resources: [
      { name: "Interview Guides", href: "/resources/guides" },
      { name: "Question Library", href: "/resources/questions" },
      { name: "Blog", href: "/blog" },
      { name: "Career Tips", href: "/blog/category/career-tips" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Accessibility", href: "/accessibility" },
    ],
  };

  const socialLinks = [
    { name: "LinkedIn", icon: <Linkedin />, href: "https://linkedin.com" },
    { name: "Instagram", icon: <Instagram />, href: "https://instagram.com" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
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
    <footer
      ref={ref}
      className="bg-slate-50 dark:bg-slate-900/50 border-t border-border/40 pt-16 pb-8"
    >
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-16">
          <motion.div className="lg:col-span-3" variants={itemVariants}>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/icons/logo-full.svg"
                alt="MockTalk"
                width={180}
                height={60}
                className="mb-6"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Helping job seekers prepare for interviews with AI-powered
              practice and personalized feedback.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    {cloneElement(item.icon, { size: 16 })}
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-8"
            variants={itemVariants}
          >
            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                Product
              </h3>
              <ul className="space-y-3">
                {navigation.product.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                Resources
              </h3>
              <ul className="space-y-3">
                {navigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4 text-foreground">
                Legal
              </h3>
              <ul className="space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center"
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} MockTalk. All rights reserved.
        </div>
      </motion.div>
    </footer>
  );
}
