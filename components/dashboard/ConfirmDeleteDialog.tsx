'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Loader2, X } from 'lucide-react'
import { ConfirmDeleteDialogProps } from '@/types'

export const ConfirmDeleteDialog = ({
    isOpen,
    onClose,
    onConfirm,
    isDeleting
}: ConfirmDeleteDialogProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isDeleting ? onClose : undefined}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative"
                        >
                            {/* Close Button */}
                            {!isDeleting && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}

                            {/* Content */}
                            <div className="p-6 md:p-8 text-center flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                
                                <h2 className="text-2xl font-bold mb-2">Delete Chat?</h2>
                                <p className="text-muted-foreground mb-8">
                                    Are you sure you want to delete this analysis history? This action cannot be undone and the data will be permanently lost.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex w-full gap-3">
                                    <button
                                        onClick={onClose}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-3 rounded-xl border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-3 rounded-xl bg-destructive text-destructive-foreground font-medium hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, delete it"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
