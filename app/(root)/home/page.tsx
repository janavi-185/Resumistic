'use client'

import Hero from '@/components/ui/Hero'
import Features from '@/components/ui/Features'
import HowItWorks from '@/components/ui/HowItWorks'
import CTA from '@/components/ui/CTA'
import Navbar from '@/components/shared/navbar'
import TrialResumeUpload from '@/components/ui/TrialResumeUpload'

const Home = () => {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <div id="trial-section" className="bg-muted/30">
                <TrialResumeUpload />
            </div>
            <Features />
            <HowItWorks />
            <CTA />
        </main>
    )
}

export default Home