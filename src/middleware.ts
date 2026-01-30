import { auth } from "@/auth"
import { NextResponse } from "next/server"

const ADMIN_PUBLIC_ROUTES = ["/admin/login"]

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    const isAdminRoute = pathname.startsWith("/admin")
    const isPublicAdminRoute = ADMIN_PUBLIC_ROUTES.includes(pathname)

    if (isAdminRoute && !isPublicAdminRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", req.nextUrl))
    }

    return NextResponse.next()
})

export const config = { matcher: ["/admin/:path*"] }
