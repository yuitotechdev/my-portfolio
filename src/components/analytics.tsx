'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function Analytics() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Here you would trigger pageview events for your analytics provider.
        // Example: window.plausible('pageview') or similar.
        // For Cloudflare Web Analytics (auto-injected if enabled in dashboard), this might not be needed manually
        // but good for custom events.

        console.log(`[Analytics] Pageview: ${pathname}`)
    }, [pathname, searchParams])

    return null
}
