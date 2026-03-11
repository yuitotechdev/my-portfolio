'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useMotion } from '@/components/providers/MotionProvider'
import { useGlowStore } from '@/stores/useGlowStore'

export function AmbientGlow() {
    const { preference } = useMotion()
    const { color } = useGlowStore()
    const [mounted, setMounted] = useState(false)

    const springConfig = { damping: 50, stiffness: 100, mass: 3 }
    const x = useSpring(0, springConfig)
    const y = useSpring(0, springConfig)

    useEffect(() => {
        // Asynchronous update to avoid "cascading renders" error during build
        const timer = setTimeout(() => {
            setMounted(true)
            // Center initial position
            x.set(window.innerWidth / 2)
            y.set(window.innerHeight / 2)
        }, 0)
        return () => clearTimeout(timer)
    }, [x, y])

    useEffect(() => {
        if (preference === 'minimal') return

        const updateMousePosition = (e: MouseEvent) => {
            x.set(e.clientX)
            y.set(e.clientY)
        }

        window.addEventListener('mousemove', updateMousePosition)
        return () => window.removeEventListener('mousemove', updateMousePosition)
    }, [x, y, preference])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden isolate">
            {/* Interactive Glow */}
            <motion.div
                className="absolute w-[80vw] h-[80vw] rounded-full mix-blend-soft-light transition-opacity duration-1000 blur-3xl opacity-50 dark:opacity-20"
                style={{
                    x: preference === 'minimal' ? '0%' : x,
                    y: preference === 'minimal' ? '0%' : y,
                    translateX: '-50%',
                    translateY: '-50%',
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
                }}
            />

            {/* Accent Warmth (Static, Bottom Right) - Reduced opacity for cleaner feel */}
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(138,90,60,0.05)_0%,transparent_70%)] opacity-30 blur-3xl" />
        </div>
    )
}
