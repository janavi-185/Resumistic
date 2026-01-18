import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const CTA = () => {
    return (
        <section className="py-24 px-4 overflow-hidden">
            <div className="container mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-primary px-8 py-16 md:px-16 md:py-20 text-center text-primary-foreground shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                            Ready to transform your resume?
                        </h2>
                        <p className="text-primary-foreground/80 text-lg md:text-xl mb-12 font-sans leading-relaxed">
                            Join thousands of job seekers already using Resumistic to get analyzed by AI and secure more interviews.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/sign-up">
                                <button className="px-8 py-4 rounded-xl bg-white text-primary font-bold text-lg shadow-xl flex items-center gap-2 group transition-all hover:scale-105 active:scale-95">
                                    Start Analyzing Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/about">
                                <button className="px-8 py-4 rounded-xl bg-primary-foreground/10 text-primary-foreground font-semibold text-lg border border-primary-foreground/20 transition-all backdrop-blur-sm hover:scale-105 active:scale-95">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA
