# Auth.js Setup Guide

## Prerequisites

Before you can use the authentication system, you need to:

### 1. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase/schema.sql` to create the users table

### 2. Configure Environment Variables

You need to add the following environment variables to your `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Auth.js Configuration
AUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

**To generate AUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 3. Find Your Supabase Credentials

1. Go to your Supabase project settings
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** (for `NEXT_PUBLIC_SUPABASE_URL`)
4. Copy the **anon/public** key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Usage

### Sign Up Flow

Users can create an account at `/sign-up`. After successful registration, they are automatically signed in and redirected to `/dashboard`.

### Sign In Flow

Users can sign in at `/sign-in` using their email and password.

### Protected Routes

Routes are protected using middleware. The `/dashboard` route requires authentication. Unauthenticated users are redirected to `/sign-in`.

### Using Auth Components

#### AuthButton Component

Add to your navbar to show sign in/sign up buttons or user info with sign out:

```tsx
import { AuthButton } from "@/components/auth/auth-button";

export default function Navbar() {
  return (
    <nav>
      {/* Your navbar content */}
      <AuthButton />
    </nav>
  );
}
```

#### ProtectedRoute Component

Wrap any page content that requires authentication:

```tsx
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function DashboardPage() {
  return <ProtectedRoute>{/* Your protected content */}</ProtectedRoute>;
}
```

#### Using Session Data

Access the current user session in any client component:

```tsx
"use client";

import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;

  return <div>Welcome, {session.user?.email}!</div>;
}
```

## Testing

1. Start your development server: `pnpm dev`
2. Navigate to `/sign-up` and create an account
3. You should be automatically signed in and redirected to `/dashboard`
4. Try signing out and signing back in at `/sign-in`
5. Try accessing `/dashboard` while signed out - you should be redirected to `/sign-in`
