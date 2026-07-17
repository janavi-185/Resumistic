import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Flame, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnalysisResultsProps } from '@/types'

export const AnalysisResults = ({ analysisResult, resultType, chatId, file }: AnalysisResultsProps) => {
    if (!analysisResult) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("pt-8", file ? "border-t border-border" : "")}
        >
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                {resultType === 'ats' ? <BarChart className="w-6 h-6 text-primary" /> : 
                 resultType === 'roast' ? <Flame className="w-6 h-6 text-destructive" /> : 
                 <FileText className="w-6 h-6 text-primary" />}
                {resultType === 'ats' ? 'ATS Evaluation' : resultType === 'roast' ? 'Resume Roast' : 'AI Analysis'}
                {chatId && <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded ml-2">Historical</span>}
            </h3>
            
            {resultType === 'ats' && (
                <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-primary/20 bg-primary/5">
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * (analysisResult.atsScore || 0)) / 100} className="text-primary transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary">{analysisResult.atsScore}</span>
                            </div>
                        </div>
                        <p className="mt-4 font-medium text-lg">ATS Compatibility Score</p>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-muted/20">
                        <h4 className="font-semibold mb-2">Feedback</h4>
                        <p className="text-muted-foreground">{analysisResult.feedback}</p>
                    </div>
                </div>
            )}

            {resultType === 'full' && (
                <div className="space-y-6">
                    {analysisResult.rating && (
                        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                            <p className="font-medium text-muted-foreground">Overall Rating</p>
                            <p className="text-3xl font-bold text-primary">{analysisResult.rating}/10</p>
                        </div>
                    )}

                    {analysisResult.summary && (
                        <div>
                            <h4 className="font-semibold mb-2 text-primary">Summary</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {analysisResult.strengths && analysisResult.strengths.length > 0 && (
                            <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                                <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">Key Strengths</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    {analysisResult.strengths.map((strength: string, idx: number) => (
                                        <li key={idx} className="text-sm text-muted-foreground">{strength}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {analysisResult.improvements && analysisResult.improvements.length > 0 && (
                            <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
                                <h4 className="font-semibold mb-3 text-orange-600 dark:text-orange-400">Areas for Improvement</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    {analysisResult.improvements.map((improvement: string, idx: number) => (
                                        <li key={idx} className="text-sm text-muted-foreground">{improvement}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                        <div className="p-4 rounded-xl border border-border bg-muted/20">
                            <h4 className="font-semibold mb-3 text-primary">Actionable Suggestions</h4>
                            <ul className="list-disc list-inside space-y-2">
                                {analysisResult.suggestions.map((suggestion: string, idx: number) => (
                                    <li key={idx} className="text-sm text-muted-foreground">{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {resultType === 'roast' && (
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/10 text-center">
                        <h4 className="text-xl font-bold text-destructive mb-2">Brutal Score</h4>
                        <p className="text-5xl font-black text-destructive mb-4">{analysisResult.score}/10</p>
                        <p className="font-bold text-foreground italic">&quot;{analysisResult.harshTruth}&quot;</p>
                    </div>
                    
                    <div className="p-4 rounded-xl border border-border bg-muted/20">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Flame className="w-5 h-5 text-destructive" /> The Roast</h4>
                        <p className="text-muted-foreground leading-relaxed">{analysisResult.roast}</p>
                    </div>

                    {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
                        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                            <h4 className="font-bold mb-3 text-red-600 dark:text-red-400">Major Red Flags 🚩</h4>
                            <ul className="space-y-3">
                                {analysisResult.redFlags.map((flag: string, idx: number) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="mt-0.5">💀</span>
                                        <span>{flag}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </motion.div>
    )
}
