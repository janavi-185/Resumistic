import React from 'react'

export interface HistoryItem {
    id: string;
    title: string;
    analysis_type: string;
    created_at: string;
}

export interface AnalysisResult {
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    suggestions?: string[];
    rating?: number;
    atsScore?: number;
    feedback?: string;
    roast?: string;
    redFlags?: string[];
    harshTruth?: string;
    score?: number;
}

export interface RoastResult {
    roast?: string;
    redFlags?: string[];
    harshTruth?: string;
    score?: number;
}

export interface ProtectedRouteProps {
    children: React.ReactNode;
}

export interface AnalysisResultsProps {
    analysisResult: AnalysisResult | null;
    resultType: 'ats' | 'full' | 'roast' | null;
    chatId?: string | null;
    file?: File | null;
}

export interface ConfirmDeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}
