'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    PlusCircle, 
    FileSearch, 
    History, 
    Menu, 
    X, 
    MessageSquare,
    ChevronRight,
    LogOut
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems, historyItems } from '@/frontend/context/constants'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentView = searchParams.get('view') || 'analyze'

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop for Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Shell */}
            <aside className={cn(
                "fixed inset-y-0 left-0 bg-card border-r border-border z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:w-72",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                R
                            </div>
                            <span className="font-bold text-xl">Resumistic</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1 mb-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                    (item.href === '/dashboard' && pathname === '/dashboard' && currentView === 'analyze') ||
                                    (item.href === '/dashboard?view=create' && currentView === 'create')
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* History Section */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 px-4 mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            <History className="w-3 h-3" />
                            Previous Chats
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 px-1 custom-scrollbar">
                            {historyItems.map((chat) => (
                                <button
                                    key={chat.id}
                                    className="w-full flex items-center justify-between group px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all text-left"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <MessageSquare className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{chat.title}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Area Footer & Theme Toggle */}
                    <div className="mt-auto pt-6 border-t border-border space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold">
                                    JD
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">John Doe</p>
                                    <p className="text-xs text-muted-foreground truncate italic">Free Plan</p>
                                </div>
                            </div>
                            
                            {/* Theme & Logout Controls */}
                            <div className="flex items-center gap-2">
                                {/* Theme Toggle */}
                                <div className="relative group/toggle">
                                    <button
                                        onClick={() => {
                                            const isDark = document.documentElement.classList.toggle('dark');
                                            localStorage.setItem('theme', isDark ? 'dark' : 'light');
                                        }}
                                        className="px-2 py-1 rounded-xl bg-muted hover:bg-muted/80 transition-all text-xl"
                                        title="Toggle Theme"
                                    >
                                        <span className="dark:hidden">😊</span>
                                        <span className="hidden dark:inline">😈</span>
                                    </button>
                                    
                                    {/* Tooltip Card */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/toggle:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover/toggle:translate-y-0">
                                        <div className="bg-card border border-border px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                                <span className="dark:hidden">roast mode</span>
                                                <span className="hidden dark:inline">roast mode off</span>
                                            </p>
                                        </div>
                                        <div className="w-2 h-2 bg-card border-r border-b border-border rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <Link
                                    href="/"
                                    className="p-2 rounded-xl bg-muted hover:bg-destructive/10 hover:text-destructive transition-all flex items-center justify-center"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
