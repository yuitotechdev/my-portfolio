'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type MotionPreference = 'high' | 'safe' | 'minimal'

interface MotionContextType {
    preference: MotionPreference
    setPreference: (pref: MotionPreference) => void
}

const MotionContext = createContext<MotionContextType | undefined>(undefined)

export function MotionProvider({ children }: { children: ReactNode }) {
    const [preference, setPreference] = useState<MotionPreference>('high')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Load from localStorage or check media query
        const saved = localStorage.getItem('motion-preference') as MotionPreference | null
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (saved) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setPreference(saved)
        } else if (prefersReduced) {
            setPreference('minimal')
        }

        setMounted(true)
    }, [])

    const updatePreference = (pref: MotionPreference) => {
        setPreference(pref)
        localStorage.setItem('motion-preference', pref)
    }

    // Prepare context value
    const value = {
        preference,
        setPreference: updatePreference
    }

    return (
        <MotionContext.Provider value={value}>
            {/* Prevent hydration mismatch or flash by hiding until mounted */}
            <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
                {children}
            </div>
            {/* Class hook for CSS-based motion control if needed */}
            <div id="motion-mode" data-mode={preference} className="hidden" />
        </MotionContext.Provider>
    )
}

export function useMotion() {
    const context = useContext(MotionContext)
    if (context === undefined) {
        throw new Error('useMotion must be used within a MotionProvider')
    }
    return context
}
