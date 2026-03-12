'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTransitionStore } from '@/stores/useTransitionStore'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ProjectWiper() {
    const { projectTitle, setProjectTitle } = useTransitionStore()
    const pathname = usePathname()

    // Keep wiper visible until the detail page is fully rendered underneath
    // Then dissolve to reveal it
    useEffect(() => {
        if (projectTitle) {
            const timer = setTimeout(() => {
                setProjectTitle(null)
            }, 1400) // Longer hold: detail page loads underneath during this time
            return () => clearTimeout(timer)
        }
    }, [pathname, projectTitle, setProjectTitle])

    return (
        <AnimatePresence>
            {projectTitle && (
                <motion.div
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden pointer-events-none"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    {/* Dissolving Title: scales down and fades as it "settles" into the page */}
                    <motion.h2
                        className="text-4xl md:text-7xl lg:text-9xl font-black tracking-tighter"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ 
                            opacity: 0, 
                            scale: 0.85, 
                            y: -30,
                            filter: 'blur(12px)',
                        }}
                        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                    >
                        {projectTitle}
                    </motion.h2>

                    {/* Subtle particle-like dissolve dots */}
                    <motion.div 
                        className="absolute inset-0 pointer-events-none"
                        exit={{ 
                            background: 'radial-gradient(circle at 50% 50%, transparent 0%, transparent 100%)',
                            opacity: 0 
                        }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
