import { FileSearch, PlusCircle } from 'lucide-react'

export const navItems = [
        { name: 'Analyze Resume', icon: FileSearch, href: '/dashboard' },
        { name: 'Create Resume', icon: PlusCircle, href: '/dashboard?view=create' },
    ]

export const historyItems = [
        { id: '1', title: 'Senior Dev Resume', date: '2 hours ago' },
        { id: '2', title: 'Product Manager App', date: 'Yesterday' },
        { id: '3', title: 'Marketing Specialist', date: '3 days ago' },
    ]
