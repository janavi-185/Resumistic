'use client'

import { motion } from 'framer-motion'

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-grotesk">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute border border-primary -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-primary/50 to-primary/30 rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tr from-primary/30 to-primary/30 rounded-full blur-[120px]"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [90, 0, 90],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                {/* <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" /> */}
            </div>

            {/* Main content container */}
            <div className="relative z-10 w-full max-w-md">
                {children}
            </div>
        </div>
    )
}