'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Upload, Cpu, FileCheck } from 'lucide-react'

const steps = [
    {
        title: "Upload Your Resume",
        description: "Upload your current resume in PDF or Word format to our secure platform.",
        icon: Upload,
    },
    {
        title: "AI Processing",
        description: "Our AI system analyzes your content, comparing it against industry standards.",
        icon: Cpu,
    },
    {
        title: "Get Results",
        description: "Receive a detailed report with a score and actionable improvement tips.",
        icon: FileCheck,
    }
]

const HowItWorks = () => {
    return (
        <section className="py-24 px-4">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        How <span className="text-primary">Resumistic</span> works
                    </motion.h2>
                    <p className="text-muted-foreground text-lg">
                        Three simple steps to significantly boost your interview chances.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                <div className="w-20 h-20 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center mb-6 group-hover:border-primary transition-colors shadow-xl">
                                    <step.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                <p className="text-muted-foreground text-lg px-4 leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
