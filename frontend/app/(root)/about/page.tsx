'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ShieldCheck, Zap, Heart } from 'lucide-react'
import Navbar from '@/components/shared/navbar'

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            
            <div className="max-w-4xl mx-auto py-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        About <span className="text-primary">Resumistic</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        We believe that everyone deserves a professional resume that reflects their true potential. Resumistic uses advanced AI to make resume building simple, fast, and effective.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {[
                        {
                            title: "AI Powered",
                            description: "Leverage cutting-edge AI to generate tailored content and analyze your resume for improvements.",
                            icon: Zap,
                            color: "text-yellow-500"
                        },
                        {
                            title: "Privacy First",
                            description: "Your data is yours. We ensure your personal information is protected and never shared.",
                            icon: ShieldCheck,
                            color: "text-green-500"
                        },
                        {
                            title: "Professional",
                            description: "Built with industry standards in mind to help you stand out to recruiters and ATS systems.",
                            icon: Sparkles,
                            color: "text-primary"
                        },
                        {
                            title: "User Centric",
                            description: "Designed for ease of use, so you can focus on your career while we handle the formatting.",
                            icon: Heart,
                            color: "text-red-500"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl border border-border bg-card hover:border-primary/30 transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center p-12 rounded-[2.5rem] bg-primary/5 border border-primary/10"
                >
                    <h2 className="text-2xl font-bold mb-4">Ready to start?</h2>
                    <p className="text-muted-foreground mb-8">
                        Join thousands of professionals already using Resumistic.
                    </p>
                    <a href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
                        Get Started for Free
                    </a>
                </motion.div>
            </div>
        </main>
    )
}

export default AboutPage
