'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/shared/Sidebar'
import ResumeUpload from '@/components/ui/ResumeUpload'
import ResumeCreator from '@/components/ui/ResumeCreator'

const DashboardContent = () => {
    const searchParams = useSearchParams()
    const view = searchParams.get('view') || 'analyze'

    return (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
                    <div className="container mx-auto">
                        {view === 'create' ? <ResumeCreator /> : <ResumeUpload />}
                    </div>
                </div>
            </main>
        </div>
    )
}

const DashboardPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}

export default DashboardPage