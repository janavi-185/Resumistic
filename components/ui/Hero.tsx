"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container relative z-10 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              AI-Powered Resume Analysis
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Unlock Your Career Potential with{" "}
            <span className="text-primary">Resumistic</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-sans">
            Analyze your resume with the power of advanced AI. Get expert
            feedback, track version updates, and stand out in the competitive
            job market.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="#features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg border border-border transition-all"
              >
                Learn More
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-center py-3 border-b border-border bg-muted/30">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                Dashboard Preview
              </span>
            </div>
            <div className="bg-background rounded-b-xl overflow-hidden aspect-video relative group">
              <Image
                src="/images/dashboard-preview.png"
                alt="Resumistic Dashboard Preview"
                fill
                className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30"
                >
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
