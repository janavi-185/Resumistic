'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
// import SocialAuth from '@/components/auth/social-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

const SignUpPage = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Create user account
            const signupResponse = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    username: formData.username,
                }),
            })

            const signupData = await signupResponse.json()

            if (!signupResponse.ok) {
                setError(signupData.error || 'Failed to create account')
                return
            }

            // Automatically sign in after successful signup
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError('Account created but sign in failed. Please try signing in.')
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Sign up failed')
        } finally {
            setLoading(false)
        }
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        
            <Card className="backdrop-blur-xl bg-card/50 border-white rounded-3xl shadow-xl overflow-hidden py-4">
                <CardHeader className="text-center p-2">
                    <CardTitle className="text-3xl font-bold text-foreground">Create Account</CardTitle>
                    <CardDescription className="text-muted-foreground text-base mt-1">
                        Join us and start your journey
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-foreground/80 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="h-10 bg-white/5 border-white/20 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </motion.div>
                        <motion.div className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        >
                            <label className="block text-sm text-foreground/80 ml-1">
                                Username
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="h-10 bg-white/5 border-white/20 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:border-primary/50"
                                    placeholder="johndoe"
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        >
                            <label className="block text-sm text-foreground/80 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="h-10 bg-white/5 border-white/20 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/30 focus-visible:border-primary/50"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors duration-200 z-10"
                                >
                                </button>
                            </div>
                        </motion.div>

                        {error && (
                            <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="default"
                            className="w-full h-10 rounded-xl shadow-lg transition-all duration-200 group mt-2"
                            disabled={loading}
                            asChild
                        >
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </motion.button>
                        </Button>
                    </form>

                    <motion.div className="mt-4 text-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    >
                        <p className="text-muted-foreground">
                            Already have an account?{' '}
                            <Link
                                href="/sign-in"
                                className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>

                    {/* <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-black/30 to-transparent" />
                        <span className="text-muted-foreground/40 text-sm font-medium">or continue with</span>
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-black/30 to-transparent" />
                    </div>
                    <SocialAuth /> */}
                </CardContent>
            </Card>
    )
}

export default SignUpPage