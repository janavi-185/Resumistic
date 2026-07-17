'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <span className="text-2xl font-bold text-primary">R</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Resumistic
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* About Link */}
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>

            {/* Auth Section */}
            {status === 'loading' ? (
              <div className="h-9 w-32 animate-pulse bg-muted rounded-lg" />
            ) : session ? (
              // Logged In - Show Username Dropdown
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-accent"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Backdrop */}
                      {/* <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      /> */}
                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-xl z-20 overflow-hidden"
                      >
                        <div className="p-2">
                          <div className="px-3 py-2.5 text-xs text-muted-foreground border-b border-border/50 mb-1">
                            {session.user?.email}
                          </div>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent rounded-lg transition-all duration-200"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <span>Dashboard</span>
                          </Link>
                          <div className="my-1.5 h-px bg-border/50" />
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              signOut({ callbackUrl: '/' });
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 "
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Not Logged In - Show Sign In/Sign Up Buttons
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/80 rounded-lg transition-all duration-200 hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;