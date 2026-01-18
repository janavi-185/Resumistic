import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-1/4 right-1/4 w-125 h-125 bg-primary/10 rounded-full blur-[150px] opacity-20" />
            </div>

            <div className="container relative z-10 mx-auto text-center">
                <div>
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
                            <button className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 flex items-center gap-2 group transition-all hover:scale-105 active:scale-95">
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link href="#features">
                            <button className="px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg border border-border transition-all hover:scale-105 active:scale-95">
                                Learn More
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="mt-20 relative max-w-5xl mx-auto">
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 shadow-2xl">
                        <div className="bg-background rounded-xl overflow-hidden aspect-video relative group">
                            {/* <img
                                src="https://images.unsplash.com/photo-1517245385169-d39139a4603c?auto=format&fit=crop&q=80&w=2070"
                                alt="Dashboard Preview"
                                className="object-cover w-full h-full opacity-60 group-hover:opacity-80 transition-opacity"
                            /> */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-4 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
