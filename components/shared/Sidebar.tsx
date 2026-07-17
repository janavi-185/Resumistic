'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    PlusCircle, 
    FileSearch, 
    History, 
    Menu, 
    X, 
    MessageSquare,
    ChevronRight,
    LogOut,
    GripVertical
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

import { HistoryItem } from '@/types'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
    const [loadingHistory, setLoadingHistory] = useState(true)
    
    // Resizable sidebar state
    const [sidebarWidth, setSidebarWidth] = useState(288) // 288px default (w-72)
    const [isResizing, setIsResizing] = useState(false)

    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentView = searchParams.get('view') || 'analyze'
    const currentChatId = searchParams.get('chatId')
    const { data: session } = useSession()

    // Handle resizing logic
    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        setIsResizing(true)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return
            // constrain width between 240px and 600px
            const newWidth = Math.max(240, Math.min(600, e.clientX))
            setSidebarWidth(newWidth)
        }
        const handleMouseUp = () => {
            setIsResizing(false)
        }

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizing])

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch('/api/resume/history')
                if (res.ok) {
                    const data = await res.json()
                    if (data.success) {
                        const sorted = [...data.analyses].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                        setHistoryItems(sorted)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch history:', error)
            } finally {
                setLoadingHistory(false)
            }
        }
        
        if (session?.user) {
            fetchHistory()
        }

        window.addEventListener('history-updated', fetchHistory)
        return () => window.removeEventListener('history-updated', fetchHistory)
    }, [session])

    const navItems = [
        { name: 'Analyze Resume', icon: FileSearch, href: '/dashboard' },
        { name: 'Create Resume', icon: PlusCircle, href: '/dashboard?view=create' },
    ]

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }

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
            <aside 
                className={cn(
                    "inset-y-0 left-0 bg-card border-r border-border z-50 transition-transform duration-300 lg:translate-x-0 lg:static shrink-0 relative",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    isResizing && "transition-none select-none"
                )}
                style={{ width: isOpen ? '100%' : undefined, maxWidth: '100vw', ...(typeof window !== 'undefined' && window.innerWidth >= 1024 ? { width: sidebarWidth } : {}) }}
            >
                <div className="flex flex-col h-full p-6 relative">
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
                                    (item.href === '/dashboard' && pathname === '/dashboard' && currentView === 'analyze' && !currentChatId) ||
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
                            {loadingHistory ? (
                                <div className="text-sm text-muted-foreground px-4 py-2">Loading...</div>
                            ) : historyItems.length === 0 ? (
                                <div className="text-sm text-muted-foreground px-4 py-2">No history found</div>
                            ) : (
                                historyItems.map((chat) => (
                                    <button
                                        key={chat.id}
                                        onClick={() => {
                                            router.push(`/dashboard?chatId=${chat.id}`)
                                            setIsOpen(false)
                                        }}
                                        className={cn(
                                            "w-full flex flex-col gap-1 group px-4 py-3 rounded-xl text-sm transition-all text-left relative",
                                            currentChatId === chat.id 
                                                ? "bg-muted text-foreground font-medium" 
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                                                <MessageSquare className={cn("w-4 h-4 shrink-0", currentChatId === chat.id ? "text-primary" : "")} />
                                                <span className="truncate">{chat.title}</span>
                                            </div>
                                            <ChevronRight className={cn("w-4 h-4 shrink-0 transition-opacity", currentChatId === chat.id ? "opacity-100" : "opacity-0 group-hover:opacity-100")} />
                                        </div>
                                        <div className="text-xs pl-7 flex justify-between opacity-70">
                                            <span>{chat.analysis_type === 'ats' ? 'ATS' : chat.analysis_type === 'roast' ? 'Roast' : 'Full'} Analysis</span>
                                            <span>{formatDate(chat.created_at)}</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* User Area Footer & Theme Toggle */}
                    <div className="mt-auto pt-6 border-t border-border space-y-4">
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex shrink-0 items-center justify-center text-primary font-bold uppercase">
                                    {session?.user?.name?.[0] || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{session?.user?.name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email || ''}</p>
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
                                            window.dispatchEvent(new Event('theme-changed'));
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
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="p-2 rounded-xl bg-muted hover:bg-destructive/10 hover:text-destructive transition-all flex items-center justify-center"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resize Handle */}
                <div 
                    className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/50 items-center justify-center z-50 group transition-colors hidden lg:flex"
                    onMouseDown={startResizing}
                >
                    <div className="absolute -right-2.5 w-6 h-full flex items-center justify-center">
                        <GripVertical className="w-4 h-4 text-border group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
