"use client";

import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import HowItWorks from "@/components/ui/HowItWorks";
import CTA from "@/components/ui/CTA";
import Navbar from "@/components/shared/navbar";

const Home = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  );
};

export default Home;
