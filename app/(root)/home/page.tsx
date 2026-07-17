'use client'

import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import HowItWorks from '@/components/home/HowItWorks'
import CTA from '@/components/home/CTA'
import Navbar from '@/components/shared/navbar'
import TrialResumeUpload from '@/components/home/TrialResumeUpload'

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