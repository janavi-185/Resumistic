'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

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
                    className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-primary/10 rounded-full blur-[150px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            <div className="container relative z-10 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">AI-Powered Resume Analysis</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                        Unlock Your Career Potential with <span className="text-primary">Resumistic</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed font-sans">
                        Analyze your resume with the power of advanced AI. Get expert feedback, track version updates, and stand out in the competitive job market.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/sign-up">
                            <button
                                className="px-8 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="#features">
                            <button
                                className="px-8 py-4 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-lg border border-border transition-all"
                            >
                                Learn More
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Dashboard Preview Placeholder */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-20 relative max-w-5xl mx-auto"
                >
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 shadow-2xl">
                        <div className="bg-background rounded-xl overflow-hidden aspect-video relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/image.png"
                                alt="Dashboard Preview"
                                className="object-cover w-full h-full transition-opacity"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default Hero
