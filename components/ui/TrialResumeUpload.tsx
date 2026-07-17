'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, File, X, Sparkles, CheckCircle2, Flame } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { AnalysisResult, RoastResult } from '@/types'

const TrialResumeUpload = () => {
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const [roastResult, setRoastResult] = useState<RoastResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    
    // Trial limits
    const MAX_ANALYZE_ATTEMPTS = 2
    const MAX_ROAST_ATTEMPTS = 1
    
    const [analyzeAttempts, setAnalyzeAttempts] = useState(0)
    const [roastAttempts, setRoastAttempts] = useState(0)

    useEffect(() => {
        // Load attempts from local storage on mount
        const storedAnalyze = localStorage.getItem('trial_analyze_attempts')
        const storedRoast = localStorage.getItem('trial_roast_attempts')
        
        if (storedAnalyze) setAnalyzeAttempts(parseInt(storedAnalyze, 10))
        if (storedRoast) setRoastAttempts(parseInt(storedRoast, 10))
    }, [])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
            setAnalysisResult(null)
            setRoastResult(null)
            setError(null)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc']
        },
        multiple: false
    })

    const handleAction = async (action: 'analyze' | 'roast') => {
        if (!file) return

        if (action === 'analyze' && analyzeAttempts >= MAX_ANALYZE_ATTEMPTS) {
            setError("You've used all your trial analysis attempts. Please sign up for unlimited access.")
            return
        }

        if (action === 'roast' && roastAttempts >= MAX_ROAST_ATTEMPTS) {
            setError("You've used your only trial roast attempt. Please sign up for more.")
            return
        }

        setIsProcessing(true)
        setError(null)
        
        if (action === 'analyze') setAnalysisResult(null)
        if (action === 'roast') setRoastResult(null)

        try {
            const formData = new FormData()
            formData.append("resume", file)

            const endpoint = action === 'analyze' ? "/api/resume/trial/analyze" : "/api/resume/trial/roast"
            const res = await fetch(endpoint, {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                throw new Error(`Failed to ${action} resume`)
            }

            const data = await res.json()
            
            if (action === 'analyze') {
                setAnalysisResult(data.analysis)
                const newCount = analyzeAttempts + 1
                setAnalyzeAttempts(newCount)
                localStorage.setItem('trial_analyze_attempts', newCount.toString())
            } else {
                setRoastResult(data.roast)
                const newCount = roastAttempts + 1
                setRoastAttempts(newCount)
                localStorage.setItem('trial_roast_attempts', newCount.toString())
            }
        } catch (err) {
            console.error(err)
            setError(`Something went wrong while trying to ${action} your resume.`)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="text-center mb-12">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold mb-4"
                >
                    Try it out for <span className="text-primary">Free</span>
                </motion.h1>
                <p className="text-muted-foreground text-lg">
                    Upload your resume to see our AI in action before signing up.
                </p>
                <div className="flex gap-4 justify-center mt-4 text-sm font-medium">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {MAX_ANALYZE_ATTEMPTS - analyzeAttempts} Analysis attempts left
                    </span>
                    <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full">
                        {MAX_ROAST_ATTEMPTS - roastAttempts} Roast attempt left
                    </span>
                </div>
            </div>

            {!file ? (
                <div
                    {...getRootProps()}
                    className={cn(
                        "group relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300",
                        isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-primary/2"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                            isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            <Upload className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                            {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            or click to browse from your computer
                        </p>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            <span className="px-3 py-1 rounded-full border border-border">PDF</span>
                            <span className="px-3 py-1 rounded-full border border-border">DOCX</span>
                            <span className="px-3 py-1 rounded-full border border-border">UP TO 10MB</span>
                        </div>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border border-border bg-card rounded-3xl p-8 shadow-xl"
                >
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/50 border border-border mb-8">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <File className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setFile(null)}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            disabled={isProcessing || analyzeAttempts >= MAX_ANALYZE_ATTEMPTS}
                            onClick={() => handleAction('analyze')}
                            className={cn("w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden relative",
                                analyzeAttempts >= MAX_ANALYZE_ATTEMPTS 
                                    ? "bg-muted text-muted-foreground cursor-not-allowed" 
                                    : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90"
                            )}
                        >
                            {isProcessing && !roastResult && !analysisResult ? (
                                <>
                                    <div className="absolute inset-0 bg-primary-foreground/10 animate-[shimmer_2s_infinite]" />
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Analyse Resume
                                </>
                            )}
                        </button>
                        
                        <button
                            disabled={isProcessing || roastAttempts >= MAX_ROAST_ATTEMPTS}
                            onClick={() => handleAction('roast')}
                            className={cn("w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden relative",
                                roastAttempts >= MAX_ROAST_ATTEMPTS 
                                    ? "bg-muted text-muted-foreground cursor-not-allowed" 
                                    : "bg-destructive text-destructive-foreground shadow-destructive/20 hover:bg-destructive/90"
                            )}
                        >
                            {isProcessing && !analysisResult && !roastResult ? (
                                <>
                                    <div className="absolute inset-0 bg-primary-foreground/10 animate-[shimmer_2s_infinite]" />
                                    <Flame className="w-5 h-5 animate-pulse" />
                                    Roasting...
                                </>
                            ) : (
                                <>
                                    <Flame className="w-5 h-5" />
                                    Roast Resume
                                </>
                            )}
                        </button>

                        {/* ANALYSIS RESULT  */}
                        {analysisResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 col-span-1 md:col-span-2 p-6 rounded-2xl border border-border bg-muted/40"
                            >
                                <h3 className="text-lg font-semibold mb-4 text-primary">AI Resume Analysis</h3>
                                
                                {analysisResult.rating && (
                                    <div className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                        <p className="text-sm font-medium text-muted-foreground mb-1">Overall Rating</p>
                                        <p className="text-2xl font-bold text-primary">{analysisResult.rating}/10</p>
                                    </div>
                                )}

                                {analysisResult.summary && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Summary</h4>
                                        <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                                    </div>
                                )}

                                {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Key Strengths</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {analysisResult.strengths.map((strength: string, idx: number) => (
                                                <li key={idx} className="text-sm text-muted-foreground">{strength}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {analysisResult.improvements.map((improvement: string, idx: number) => (
                                                <li key={idx} className="text-sm text-muted-foreground">{improvement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Suggestions</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {analysisResult.suggestions.map((suggestion: string, idx: number) => (
                                                <li key={idx} className="text-sm text-muted-foreground">{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* ROAST RESULT */}
                        {roastResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 col-span-1 md:col-span-2 p-6 rounded-2xl border border-destructive/20 bg-destructive/5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Flame className="w-6 h-6 text-destructive" />
                                    <h3 className="text-xl font-bold text-destructive">Brutal Roast</h3>
                                </div>
                                
                                {roastResult.score !== undefined && (
                                    <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                                        <p className="text-sm font-medium text-destructive/80 mb-1">Survival Score</p>
                                        <p className="text-3xl font-black text-destructive">{roastResult.score}/10</p>
                                    </div>
                                )}

                                {roastResult.harshTruth && (
                                    <div className="mb-6 p-4 border-l-4 border-destructive bg-destructive/10">
                                        <p className="font-bold text-destructive italic">&quot;{roastResult.harshTruth}&quot;</p>
                                    </div>
                                )}

                                {roastResult.roast && (
                                    <div className="mb-6">
                                        <p className="text-foreground font-medium leading-relaxed">{roastResult.roast}</p>
                                    </div>
                                )}

                                {roastResult.redFlags && roastResult.redFlags.length > 0 && (
                                    <div className="mb-4">
                                        <h4 className="font-bold text-destructive mb-3">Red Flags Detected 🚩</h4>
                                        <ul className="space-y-2">
                                            {roastResult.redFlags.map((flag: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <span className="text-destructive mt-1">•</span>
                                                    <span>{flag}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                    
                    {error && (
                        <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
                            <p className="text-sm font-medium text-destructive mb-2">{error}</p>
                            <Link href="/sign-up" className="inline-block mt-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                Sign Up for Unlimited Access
                            </Link>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    )
}

export default TrialResumeUpload
