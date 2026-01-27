'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, File, X, Sparkles, CheckCircle2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'

const ResumeUpload = () => {
    const [file, setFile] = useState<File | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)


    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0])
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

    const handleAnalyze = async () => {
        if (!file) return

        setIsAnalyzing(true)
        setError(null)
        setAnalysisResult(null)

        try {
            const formData = new FormData()
            formData.append("resume", file)

            const res = await fetch("/api/resume/analyze", {
            method: "POST",
            body: formData,
            })

            if (!res.ok) {
            throw new Error("Failed to analyze resume")
            }

            const data = await res.json()
            setAnalysisResult(data.analysis)
        } catch (err) {
            console.error(err)
            setError("Something went wrong while analyzing your resume.")
        } finally {
            setIsAnalyzing(false)
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
                    Boost your career with <span className="text-primary">AI Insights</span>
                </motion.h1>
                <p className="text-muted-foreground text-lg">
                    Upload your resume and get a professional analysis in seconds.
                </p>
            </div>

            {!file ? (
                <div
                    // initial={{ opacity: 0, scale: 0.95 }}
                    // animate={{ opacity: 1, scale: 1 }}
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
                            disabled={isAnalyzing}
                            onClick={() => setFile(null)}
                            className="w-full py-4 rounded-xl border border-border font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
                        >
                            Change File
                        </button>
                        <button
                            disabled={isAnalyzing}
                            onClick={handleAnalyze}
                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 overflow-hidden relative"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="absolute inset-0 bg-primary-foreground/10 animate-[shimmer_2s_infinite]" />
                                    <Sparkles className="w-5 h-5 animate-pulse" />
                                    Analyzing with AI...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Analyse Resume
                                </>
                            )}
                        </button>

                        {/* TEMP ANALYSIS RESULT  */}
                    {analysisResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 p-6 rounded-2xl border border-border bg-muted/40"
                        >
                            <h3 className="text-lg font-semibold mb-4">AI Resume Analysis</h3>
                            
                            {/* Rating */}
                            {analysisResult.rating && (
                                <div className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Overall Rating</p>
                                    <p className="text-2xl font-bold text-primary">{analysisResult.rating}/10</p>
                                </div>
                            )}

                            {/* Summary */}
                            {analysisResult.summary && (
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Summary</h4>
                                    <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                                </div>
                            )}

                            {/* Strengths */}
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

                            {/* Areas for Improvement */}
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

                            {/* Suggestions */}
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
                    {error && (
                        <p className="mt-4 text-sm text-destructive text-center">
                            {error}
                        </p>
                    )}
                    </div>
                </motion.div>
            )}

            {/* Quality Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">ATS Approved</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium">Industry Standard</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-sm font-medium">Privacy Guaranteed</span>
                </div>
            </div>
        </div>
    )
}

export default ResumeUpload
