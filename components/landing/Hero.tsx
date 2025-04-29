"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Play, ArrowRight, MessageSquare, BarChart, Award } from "lucide-react";

export function Hero() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  // Animation variants
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
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const featureItemVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  // Features list with icons
  const features = [
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: "AI-powered interviews",
    },
    { icon: <BarChart className="h-4 w-4" />, text: "Performance analytics" },
    { icon: <Award className="h-4 w-4" />, text: "Personalized feedback" },
  ];

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-30">
      {/* Enhanced multi-color gradient background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,var(--primary)/15%_0%,transparent_70%)]" />
      <div className="absolute top-1/3 left-1/4 -z-9 w-full h-full bg-[radial-gradient(circle_at_center,#8b5cf6/8%_0%,transparent_50%)]" />
      <div className="absolute bottom-0 right-1/3 -z-9 w-full h-full bg-[radial-gradient(circle_at_center,#f59e0b/8%_0%,transparent_60%)]" />
      <div className="absolute top-0 right-1/4 -z-9 w-full h-full bg-[radial-gradient(circle_at_center,#0d9488/6%_0%,transparent_55%)]" />
      <div className="absolute inset-0 -z-5 opacity-7 bg-[url('/images/grid-pattern.png')] bg-repeat" />
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {/* Soft glowing orbs with better animation */}
        <motion.div
          className="absolute h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          style={{ top: "15%", right: "5%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          style={{ bottom: "10%", left: "5%" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        {/* Subtle geometric shapes for visual interest */}
        <svg
          className="absolute top-1/4 -right-24 w-96 h-96 text-primary/5"
          viewBox="0 0 200 200"
        >
          <motion.path
            fill="currentColor"
            d="M46.5,-67.2C59.5,-56.3,69,-41.5,74.8,-25.1C80.6,-8.7,82.8,9.2,77.9,25.3C73,41.3,61,55.3,46.2,65.3C31.4,75.3,13.8,81.2,-2.4,84.4C-18.7,87.6,-33.9,88,-48,80.8C-62.1,73.6,-75,58.7,-79.6,42.1C-84.2,25.5,-80.5,7.1,-73.6,-7.5C-66.8,-22.2,-56.8,-33.1,-45.6,-44.6C-34.4,-56.1,-22.1,-68.2,-6.2,-70.6C9.7,-73,22.7,-65.8,34.5,-60.7L38.3,-59.5"
            animate={{
              d: [
                "M46.5,-67.2C59.5,-56.3,69,-41.5,74.8,-25.1C80.6,-8.7,82.8,9.2,77.9,25.3C73,41.3,61,55.3,46.2,65.3C31.4,75.3,13.8,81.2,-2.4,84.4C-18.7,87.6,-33.9,88,-48,80.8C-62.1,73.6,-75,58.7,-79.6,42.1C-84.2,25.5,-80.5,7.1,-73.6,-7.5C-66.8,-22.2,-56.8,-33.1,-45.6,-44.6C-34.4,-56.1,-22.1,-68.2,-6.2,-70.6C9.7,-73,22.7,-65.8,34.5,-60.7L38.3,-59.5",
                "M49.4,-58.6C62.1,-49.7,69.1,-32.3,73.3,-14C77.5,4.3,78.8,23.7,70.5,37.8C62.3,51.9,44.5,60.9,26.4,67.8C8.3,74.7,-10,79.4,-26.4,74.5C-42.8,69.6,-57.2,55.1,-65.9,38.1C-74.6,21,-77.5,1.5,-73.4,-15.9C-69.3,-33.3,-58.2,-48.4,-44.2,-57.1C-30.2,-65.8,-13.2,-67.9,3,-71.4C19.1,-74.9,36.7,-67.5,49.4,-58.6Z",
                "M46.5,-67.2C59.5,-56.3,69,-41.5,74.8,-25.1C80.6,-8.7,82.8,9.2,77.9,25.3C73,41.3,61,55.3,46.2,65.3C31.4,75.3,13.8,81.2,-2.4,84.4C-18.7,87.6,-33.9,88,-48,80.8C-62.1,73.6,-75,58.7,-79.6,42.1C-84.2,25.5,-80.5,7.1,-73.6,-7.5C-66.8,-22.2,-56.8,-33.1,-45.6,-44.6C-34.4,-56.1,-22.1,-68.2,-6.2,-70.6C9.7,-73,22.7,-65.8,34.5,-60.7L38.3,-59.5",
              ],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "easeInOut",
            }}
          />
        </svg>

        <svg
          className="absolute bottom-1/3 -left-24 w-96 h-96 text-primary/5"
          viewBox="0 0 200 200"
        >
          <motion.path
            fill="currentColor"
            d="M37.9,-48.2C51.1,-40.6,65,-31.6,71.1,-18.5C77.2,-5.4,75.4,11.7,67.6,24.9C59.8,38.1,45.8,47.4,31.2,53.6C16.6,59.8,1.3,63,-15.6,63C-32.5,63,-51,59.9,-64.3,49.4C-77.6,38.9,-85.8,21,-85.1,3.5C-84.5,-14,-75,-28,-63.5,-39.4C-52,-50.8,-38.5,-59.4,-24.8,-66.5C-11.1,-73.7,2.8,-79.2,15,-75C27.1,-70.8,37.6,-55.8,37.9,-48.2Z"
            animate={{
              d: [
                "M37.9,-48.2C51.1,-40.6,65,-31.6,71.1,-18.5C77.2,-5.4,75.4,11.7,67.6,24.9C59.8,38.1,45.8,47.4,31.2,53.6C16.6,59.8,1.3,63,-15.6,63C-32.5,63,-51,59.9,-64.3,49.4C-77.6,38.9,-85.8,21,-85.1,3.5C-84.5,-14,-75,-28,-63.5,-39.4C-52,-50.8,-38.5,-59.4,-24.8,-66.5C-11.1,-73.7,2.8,-79.2,15,-75C27.1,-70.8,37.6,-55.8,37.9,-48.2Z",
                "M43.7,-58.4C55.8,-48.5,64.3,-33.9,67.4,-18.5C70.5,-3,68.3,13.4,60.7,26C53.1,38.5,40.1,47.3,25.9,54.4C11.8,61.5,-3.6,67,-18.1,65C-32.5,63,-46.1,53.6,-55.2,40.9C-64.3,28.3,-68.9,12.3,-68.7,-3.7C-68.5,-19.8,-63.4,-35.9,-52.9,-46.1C-42.3,-56.3,-26.2,-60.6,-10.4,-59.9C5.4,-59.3,17.1,-53.8,31.6,-68.3C31.7,-68.4,31.6,-68.3,31.6,-68.1C31.5,-67.8,37.6,-68.3,43.7,-58.4Z",
                "M37.9,-48.2C51.1,-40.6,65,-31.6,71.1,-18.5C77.2,-5.4,75.4,11.7,67.6,24.9C59.8,38.1,45.8,47.4,31.2,53.6C16.6,59.8,1.3,63,-15.6,63C-32.5,63,-51,59.9,-64.3,49.4C-77.6,38.9,-85.8,21,-85.1,3.5C-84.5,-14,-75,-28,-63.5,-39.4C-52,-50.8,-38.5,-59.4,-24.8,-66.5C-11.1,-73.7,2.8,-79.2,15,-75C27.1,-70.8,37.6,-55.8,37.9,-48.2Z",
              ],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Interview Practice
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
              variants={itemVariants}
            >
              Ace Your Next <span className="text-primary">Interview</span> With
              Confidence
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Practice with our AI interviewer, get personalized feedback, and
              track your progress to land your dream job.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              variants={itemVariants}
            >
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link href="/register">
                      Start Practicing Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#how-it-works">
                      <Play className="mr-2 h-5 w-5" />
                      See how it works
                    </a>
                  </Button>
                </>
              )}
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.8, staggerChildren: 0.1 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-sm"
                  variants={featureItemVariants}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Improved Image Display with Better Shadow and Effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 50,
            }}
            className="relative"
          >
            {/* Drop shadow behind image for depth */}
            <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl transform translate-y-4 scale-95 opacity-50" />

            {/* Glass card effect for the image container */}
            <motion.div
              className="relative z-10 rounded-xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              {/* Reflection overlay with subtle color accents to enhance image quality appearance */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-blue-500/5 to-transparent pointer-events-none z-10" />

              {/* High-quality dashboard image with quality prop set to high */}
              <Image
                src="/images/interview-dashboard.png"
                alt="MockTalk Interview Dashboard"
                width={800} // Increased from 600 for higher resolution
                height={533} // Maintained aspect ratio
                className="w-full h-auto"
                priority
                quality={100} // Maximum quality
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />

              {/* Subtle image frame accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary/80 to-primary/30" />
            </motion.div>

            {/* Decorative elements with color variations */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
            <div className="absolute bottom-1/4 right-1/3 w-16 h-16 bg-purple-500/10 rounded-full blur-xl" />
            <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl" />

            {/* Floating feature dots with varied colors */}
            <motion.div
              className="absolute -right-2 top-1/4 w-5 h-5 rounded-full bg-primary"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -left-2 bottom-1/3 w-3 h-3 rounded-full bg-purple-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            <motion.div
              className="absolute right-1/4 bottom-0 w-4 h-4 rounded-full bg-amber-500"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
            />
          </motion.div>
        </div>

        {/* Social proof */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Trusted by job seekers from leading companies
          </p>
          <div className="flex flex-wrap justify-center gap-8 grayscale opacity-70">
            {["Google", "Microsoft", "Amazon", "Meta", "Apple"].map(
              (company) => (
                <div key={company} className="h-6 flex items-center">
                  <span className="text-muted-foreground font-semibold">
                    {company}
                  </span>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
