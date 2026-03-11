'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react'

export type MotionPreference = 'high' | 'safe' | 'minimal'

interface MotionContextType {
    preference: MotionPreference
    setPreference: (pref: MotionPreference) => void
    theme: 'light' | 'dark'
    toggleTheme: () => void
}

const MotionContext = createContext<MotionContextType | undefined>(undefined)

export function MotionProvider({ children }: { children: ReactNode }) {
    const [preference, setPreference] = useState<MotionPreference>('high')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Load from localStorage or check media query
        const savedPref = localStorage.getItem('motion-preference') as MotionPreference | null
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
        const initialPref = savedPref || (prefersReduced ? 'minimal' : 'high')

        // Asynchronous update to avoid "cascading renders" error during build
        setTimeout(() => {
            setPreference(initialPref)
            setTheme(initialTheme)
            if (initialTheme === 'dark') {
                document.documentElement.classList.add('dark')
            }
            setMounted(true)
        }, 0)
    }, [])

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem('theme', newTheme)
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            return newTheme
        })
    }, [])

    const updatePreference = useCallback((pref: MotionPreference) => {
        setPreference(pref)
        localStorage.setItem('motion-preference', pref)
    }, [])

    // Prepare context value
    const value = useMemo(() => ({
        preference,
        setPreference: updatePreference,
        theme,
        toggleTheme
    }), [preference, theme, updatePreference, toggleTheme])

    return (
        <MotionContext.Provider value={value}>
            {/* Prevent hydration mismatch or flash by hiding until mounted */}
            {mounted ? (
                <div>
                    {children}
                </div>
            ) : (
                <div style={{ visibility: 'hidden' }}>
                    {children}
                </div>
            )}
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
