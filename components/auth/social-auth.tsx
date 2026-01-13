'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

const SocialAuth = () => {
    return (
        <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl h-11"
                asChild
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FaGoogle className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                    Google
                </motion.button>
            </Button>
            <Button
                variant="outline"
                className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl h-11"
                asChild
            >
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Github className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                    GitHub
                </motion.button>
            </Button>
        </div>
    )
}

export default SocialAuth
