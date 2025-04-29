"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";

interface NavItem {
  name: string;
  href: string;
  children?: {
    name: string;
    href: string;
    description?: string;
  }[];
}

const navigation: NavItem[] = [
  { name: "Features", href: "/#features" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Pricing", href: "/#pricing" },
  {
    name: "Resources",
    href: "#",
    children: [
      {
        name: "Interview Guides",
        href: "/resources/guides",
        description: "Learn interviewing techniques and strategies",
      },
      {
        name: "Question Library",
        href: "/resources/questions",
        description: "Browse common interview questions by category",
      },
      {
        name: "Blog",
        href: "/blog",
        description: "Tips and advice from hiring experts",
      },
    ],
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src="/icons/logo-full.svg"
                alt="MockTalk"
                width={200}
                height={70}
                className=""
                priority
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.children ? (
                  <div>
                    <button
                      className="group text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary flex items-center gap-1"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.name ? null : item.name
                        )
                      }
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          className="absolute left-0 z-10 mt-2 w-80 origin-top-left rounded-md bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          onMouseEnter={() => setActiveDropdown(item.name)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="py-1 px-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="block px-4 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800"
                              >
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {child.name}
                                </p>
                                {child.description && (
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {child.description}
                                  </p>
                                )}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons - FIXED */}
          <div className="hidden md:flex md:items-center space-x-3">
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <motion.button
              type="button"
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </nav>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto px-4 py-2 space-y-1 bg-white dark:bg-slate-900 shadow-lg">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="py-2">
                      <button
                        className="w-full flex items-center justify-between px-3 py-2 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-primary/10"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.name ? null : item.name
                          )
                        }
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 pl-4 border-l-2 border-primary/30 ml-3"
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                href={child.href}
                                className="block py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-primary/10"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile buttons - FIXED */}
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center gap-3 mt-2">
                  {isAuthenticated ? (
                    <Button asChild className="w-full">
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
