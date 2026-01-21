'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div className="h-10 w-20 animate-pulse bg-muted rounded-lg" />
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {session.user?.email}
        </span>
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          variant="outline"
          size="sm"
        >
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => router.push('/sign-in')}
        variant="ghost"
        size="sm"
      >
        Sign In
      </Button>
      <Button
        onClick={() => router.push('/sign-up')}
        size="sm"
      >
        Sign Up
      </Button>
    </div>
  )
}
