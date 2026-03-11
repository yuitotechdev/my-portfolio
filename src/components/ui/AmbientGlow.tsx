'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useMotion } from '@/components/providers/MotionProvider'

export function AmbientGlow() {
    const { preference } = useMotion()
    const [mounted, setMounted] = useState(false)

    const springConfig = { damping: 50, stiffness: 100, mass: 3 }
    const x = useSpring(0, springConfig)
    const y = useSpring(0, springConfig)

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true)
        // Center initial position
        x.set(window.innerWidth / 2)
        y.set(window.innerHeight / 2)
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

    if (preference === 'minimal') {
        return (
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden isolate">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] opacity-40 dark:opacity-5 mix-blend-soft-light blur-3xl" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(138,90,60,0.08)_0%,transparent_70%)] opacity-40 blur-3xl" />
                <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden isolate">
            {/* Interactive Glow */}
            <motion.div
                className="absolute w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.25)_0%,transparent_70%)] opacity-50 dark:opacity-10 mix-blend-soft-light transition-opacity duration-1000 blur-3xl"
                style={{
                    x,
                    y,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />

            {/* Accent Warmth (Static, Bottom Right) */}
            <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[radial-gradient(circle,rgba(138,90,60,0.08)_0%,transparent_70%)] opacity-40 blur-3xl" />

            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
    )
}
