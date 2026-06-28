"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowLeft,
  FileUp,
  FileText,
  X,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

const suggestedTemplates = [
  {
    title: "Software Engineer",
    description: "Focus on React, Node.js, and Cloud Infrastructure.",
    fullJD:
      "We are looking for a Software Engineer to develop, test, and maintain high-quality software applications. \n\nKey Responsibilities:\n- Collaborate with cross-functional teams to define and ship new features.\n- Write clean, maintainable, and efficient code.\n- Participate in code reviews and contribute to architectural decisions.\n\nRequirements:\n- Strong experience with React, TypeScript, and Node.js.\n- Familiarity with cloud infrastructure (AWS/Azure/GCP).\n- Excellent problem-solving skills.",
  },
  {
    title: "Product Designer",
    description: "Focus on UI/UX, Figma, and User Research.",
    fullJD:
      "We are seeking a Product Designer to create intuitive user experiences and beautiful visual designs. \n\nKey Responsibilities:\n- Design user flows, wireframes, and high-fidelity mockups.\n- Conduct user research and usability testing.\n- Work closely with engineering to ensure design fidelity.\n\nRequirements:\n- Proficiency in Figma and Adobe Creative Suite.\n- Strong portfolio demonstrating UI/UX best practices.\n- Experience with design systems.",
  },
  {
    title: "Data Analyst",
    description: "Focus on Python, SQL, and Statistical Modeling.",
    fullJD:
      "We are hiring a Data Analyst to interpret complex data sets and help drive business decisions. \n\nKey Responsibilities:\n- Extract and clean data from various sources (SQL, APIs).\n- Perform statistical analysis and create visualizations.\n- Present insights to stakeholders to guide strategy.\n\nRequirements:\n- Advanced SQL skills and proficiency in Python or R.\n- Experience with BI tools like Tableau or PowerBI.\n- Strong analytical and communication skills.",
  },
];

const ResumeCreator = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAttachments((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTemplateClick = (jd: string) => {
    setJobDescription(jd);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Create Your <span className="text-primary">Professional Resume</span>
        </motion.h1>
        <p className="text-muted-foreground text-lg">
          Use a template or paste your own job description to generate a
          tailored resume.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Templates */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Templates
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {suggestedTemplates.map((template) => (
              <motion.button
                key={template.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateClick(template.fullJD)}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/50 text-left transition-all group"
              >
                <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                  {template.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Side: Input Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Description Textarea */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 ml-1">
              <FileText className="w-4 h-4 text-primary" />
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-80 bg-muted/30 border border-border rounded-3xl p-6 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground/50"
              placeholder="Paste the job description here or click a template on the left to auto-fill..."
            />
          </div>

          {/* Extra Attachments */}
          <div className="space-y-3">
            <label className="text-sm font-bold flex items-center gap-2 ml-1">
              <FileUp className="w-4 h-4 text-primary" />
              Additional Context (Optional)
            </label>

            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30",
              )}
            >
              <input {...getInputProps()} />
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span className="text-sm">
                  Add extra attachments (PDF, DOCX, TXT)
                </span>
              </div>
            </div>

            {/* List of Attachments */}
            <AnimatePresence>
              {attachments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-3 mt-4"
                >
                  {attachments.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                    >
                      <span className="truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="hover:text-foreground"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={!jobDescription || isGenerating}
            className="w-full py-5 rounded-3xl bg-primary text-primary-foreground font-bold text-xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-6 h-6 animate-spin" />
                Generating Tailored Resume...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Generate Professional Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCreator;
