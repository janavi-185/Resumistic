"use client";

import { motion } from "framer-motion";
import { LineChart, Layers, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Version Tracking",
    description:
      "Keep a history of your resumes and see how they improve over time.",
    icon: Layers,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "ATS Optimization",
    description:
      "Optimize your resume to pass through Applicant Tracking Systems effortlessly.",
    icon: ShieldCheck,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Growth Metrics",
    description:
      "Visualize your improvement with detailed scoring and constructive feedback.",
    icon: LineChart,
    color: "bg-pink-500/10 text-pink-500",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Features built for your{" "}
            <span className="text-primary">success</span>
          </motion.h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to transform your resume into a powerful
            career-building tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
