import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in") || 
                     req.nextUrl.pathname.startsWith("/sign-up")
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard")

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect non-logged-in users from protected routes
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
