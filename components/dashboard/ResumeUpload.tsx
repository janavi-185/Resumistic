'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, File, X, Sparkles, CheckCircle2, FileText, BarChart, Flame, ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { useSearchParams, useRouter } from 'next/navigation'

import { AnalysisResult } from '@/types'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'
import { AnalysisResults } from './AnalysisResults'

const ResumeUpload = () => {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [jdText, setJdText] = useState('')
    const [analysisMode, setAnalysisMode] = useState<'ats' | 'detailed'>('detailed')
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
    const [resultType, setResultType] = useState<'ats' | 'full' | 'roast' | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const searchParams = useSearchParams()
    const router = useRouter()
    const chatId = searchParams.get('chatId')

    // Check theme initially and on change
    useEffect(() => {
        const checkTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'))
        }
        checkTheme()
        window.addEventListener('theme-changed', checkTheme)
        return () => window.removeEventListener('theme-changed', checkTheme)
    }, [])

    useEffect(() => {
        if (chatId) {
            const fetchChat = async () => {
                setIsLoadingHistory(true)
                setError(null)
                try {
                    const res = await fetch(`/api/resume/history/${chatId}`)
                    if (res.ok) {
                        const data = await res.json()
                        if (data.success && data.analysis) {
                            setAnalysisResult(data.analysis.result)
                            setResultType(data.analysis.analysis_type)
                            setFile(null) // clear any active upload
                        } else {
                            setError("Failed to load historical chat.")
                        }
                    } else {
                        setError("Failed to load historical chat.")
                    }
                } catch {
                    setError("Error loading chat.")
                } finally {
                    setIsLoadingHistory(false)
                }
            }
            fetchChat()
        } else {
            // Only clear results if we don't have a file uploaded currently
            if (!file) {
                setAnalysisResult(null)
                setResultType(null)
                setError(null)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]) // deliberately ignoring file dependency

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setPreviewUrl(null)
        }
    }, [file])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            if (chatId) {
                router.push('/dashboard') // clear chatid from url
            }
            setFile(acceptedFiles[0])
            setAnalysisResult(null)
            setError(null)
        }
    }, [chatId, router])

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
            // Only send JD if we are not in ATS mode
            if (analysisMode !== 'ats') {
                formData.append("jdText", jdText)
            }
            
            let currentMode = 'full'
            if (analysisMode === 'ats') {
                currentMode = 'ats'
            } else if (analysisMode === 'detailed' && isDarkMode) {
                currentMode = 'roast'
            }
            
            formData.append("mode", currentMode)
            setResultType(currentMode as 'ats' | 'full' | 'roast')

            const res = await fetch("/api/resume/analyze", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                throw new Error("Failed to analyze resume")
            }

            const data = await res.json()
            setAnalysisResult(data.analysis)
            // notify sidebar to refresh history
            window.dispatchEvent(new Event('history-updated'))
        } catch (err) {
            console.error(err)
            setError("Something went wrong while analyzing your resume.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleDeleteChat = async () => {
        if (!chatId) return

        setIsDeleting(true)
        try {
            const res = await fetch(`/api/resume/history/${chatId}`, {
                method: "DELETE"
            })
            if (res.ok) {
                window.dispatchEvent(new Event('history-updated'))
                router.push('/dashboard')
            } else {
                setError("Failed to delete history.")
            }
        } catch (err) {
            console.error(err)
            setError("Something went wrong while deleting.")
        } finally {
            setIsDeleting(false)
            setIsDeleteDialogOpen(false)
        }
    }

    return (
        <div className={cn("mx-auto py-12", (file || chatId) ? "max-w-360 px-8 lg:px-16" : "max-w-4xl px-4")}>
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

            {isLoadingHistory && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Sparkles className="w-10 h-10 animate-pulse text-primary mb-4" />
                    <p>Loading historical analysis...</p>
                </div>
            )}

            {!file && !chatId && !isLoadingHistory && (
                <div
                    {...getRootProps()}
                    className={cn(
                        "group relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300",
                        isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <div className={cn(
                            "w-20 h-20 rounded-xl flex items-center justify-center mb-6 transition-colors",
                            isDragActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
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
                            <span className="px-3 py-1 rounded-md border border-border">PDF</span>
                            <span className="px-3 py-1 rounded-md border border-border">DOCX</span>
                            <span className="px-3 py-1 rounded-md border border-border">UP TO 10MB</span>
                        </div>
                    </div>
                </div>
            )}

            {(file || (chatId && analysisResult)) && !isLoadingHistory && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("grid gap-8", file ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1")}
                >
                    {/* Left Column: Resume Preview (Only for new uploads) */}
                    {file && (
                        <div className="hidden lg:flex lg:col-span-2 flex-col h-125 sticky top-8 border border-border rounded-xl overflow-hidden">
                            <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center shrink-0">
                                <span className="font-semibold flex items-center gap-2 text-sm">
                                    <File className="w-4 h-4 text-primary"/> Preview
                                </span>
                                <span className="text-xs text-muted-foreground truncate max-w-37.5" title={file.name}>
                                    {file.name}
                                </span>
                            </div>
                            <div className="flex-1 bg-muted/10 relative overflow-hidden">
                                {file.type === 'application/pdf' ? (
                                    <iframe src={previewUrl ? `${previewUrl}#toolbar=0&navpanes=0&scrollbar=0` : ''} className="w-full h-full border-none" title="Resume Preview" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        <FileText className="w-12 h-12 mb-4 opacity-50" />
                                        <p className="text-sm">Preview not available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Right Column: Controls and Results */}
                    <div className={cn("flex flex-col gap-8", file ? "lg:col-span-3" : "w-full max-w-4xl mx-auto")}>
                        
                        {/* History Navigation Back Button */}
                        {chatId && (
                            <div className="flex items-center justify-between mb-2">
                                <button 
                                    onClick={() => router.push('/dashboard')}
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Upload
                                </button>
                                <button
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    disabled={isDeleting}
                                    className="text-sm font-medium text-destructive hover:text-destructive/80 flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Delete Chat
                                </button>
                            </div>
                        )}

                        {/* Analysis Settings (Only show if we have a file uploaded, hidden in history mode) */}
                        {file && (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold">Analysis Settings</h2>
                                    <button 
                                        onClick={() => setFile(null)}
                                        className="text-sm text-destructive hover:underline flex items-center gap-1 transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Remove File
                                    </button>
                                </div>
                                
                                {/* Mobile file info (since preview is hidden on mobile) */}
                                <div className="lg:hidden flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border mb-6">
                                    <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                                        <File className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-3">Analysis Mode</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setAnalysisMode('detailed')}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                                                analysisMode === 'detailed' 
                                                    ? "border-primary bg-primary/5 text-primary" 
                                                    : "border-border hover:border-primary/50 text-muted-foreground"
                                            )}
                                        >
                                            {isDarkMode ? <Flame className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                            <span className="font-medium text-sm text-center">{isDarkMode ? 'Roast Mode' : 'Detailed Analysis'}</span>
                                        </button>
                                        <button
                                            onClick={() => setAnalysisMode('ats')}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                                                analysisMode === 'ats' 
                                                    ? "border-primary bg-primary/5 text-primary" 
                                                    : "border-border hover:border-primary/50 text-muted-foreground"
                                            )}
                                        >
                                            <BarChart className="w-6 h-6" />
                                            <span className="font-medium text-sm text-center">ATS Score Only</span>
                                        </button>
                                    </div>
                                </div>

                                {/* JD Input - Only show if detailed analysis */}
                                {analysisMode === 'detailed' && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }} 
                                        animate={{ opacity: 1, height: 'auto' }} 
                                        transition={{ duration: 0.3 }}
                                        className="mb-6 overflow-hidden"
                                    >
                                        <label className="block text-sm font-medium mb-2">Job Description (Optional)</label>
                                        <textarea
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value)}
                                            placeholder="Paste the job description here to get tailored feedback..."
                                            className="w-full h-32 p-4 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all custom-scrollbar text-sm"
                                        />
                                    </motion.div>
                                )}

                                <button
                                    disabled={isAnalyzing}
                                    onClick={handleAnalyze}
                                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 overflow-hidden relative"
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
                                {error && !chatId && (
                                    <p className="mt-4 text-sm font-medium text-destructive text-center p-3 rounded-lg bg-destructive/10">
                                        {error}
                                    </p>
                                )}
                            </div>
                        )}

                        {error && chatId && (
                            <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* ANALYSIS RESULT */}
                        <AnalysisResults 
                            analysisResult={analysisResult} 
                            resultType={resultType} 
                            chatId={chatId} 
                            file={file} 
                        />
                    </div>
                </motion.div>
            )}

            {/* Quality Badges - only show when no file is uploaded and no history is viewed for cleaner layout */}
            {!file && !chatId && !isLoadingHistory && (
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
            )}

            <ConfirmDeleteDialog 
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteChat}
                isDeleting={isDeleting}
            />
        </div>
    )
}

export default ResumeUpload
