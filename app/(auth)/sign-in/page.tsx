'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
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

const SignInPage = () => {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email: formData.emailOrUsername,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                setError('Invalid email or password')
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Sign in failed')
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

            <Card className="backdrop-blur-xl bg-card/50 border-white/10 rounded-3xl shadow-2xl overflow-hidden py-4">
                <CardHeader className="text-center p-2">
                    <CardTitle className="text-3xl font-bold text-foreground">Welcome Back</CardTitle>
                    <CardDescription className="text-muted-foreground text-base mt-1">
                        Sign in to continue your journey
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email/Username Input */}
                        <motion.div className="space-y-2"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        >
                            <label className="block text-sm font-medium text-foreground/80 ml-1">
                                Email or Username
                            </label>
                            <div className="relative">
                                <Input
                                    type="text"
                                    name="emailOrUsername"
                                    value={formData.emailOrUsername}
                                    onChange={handleChange}
                                    required
                                    className="h-10 bg-white/5 border-white/20 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/20 focus-visible:border-primary/20"
                                    placeholder="you@example.com or username"
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div className="space-y-2"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-between ml-1">
                                <label className="block text-sm font-medium text-foreground/80">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="h-10 bg-white/5 border-white/20 rounded-xl px-4 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/20 focus-visible:border-primary/20"
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

                        {/* Submit Button */}
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
                                {loading ? 'Signing In...' : 'Sign In'}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </motion.button>
                        </Button>
                    </form>

                    {/* Footer */}
                    <motion.div className="mt-8 text-center"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    >
                        <p className="text-muted-foreground">
                            Don't have an account?{' '}
                            <Link
                                href="/sign-up"
                                className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200"
                            >
                                Sign up
                            </Link>
                        </p>
                    </motion.div>

                    {/* <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-muted-foreground/40 text-sm font-medium">or continue with</span>
                        <div className="flex-1 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    <SocialAuth /> */}
                </CardContent>
            </Card>
    )
}

export default SignInPage