'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrambleText } from '@/components/ui/ScrambleText'

export function Preloader() {
    const [progress, setProgress] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setTimeout(() => setIsComplete(true), 500)
                    return 100
                }
                // Random jumps for "natural" loading feel
                const jump = Math.floor(Math.random() * 15) + 5
                return Math.min(prev + jump, 100)
            })
        }, 150)
        return () => clearInterval(interval)
    }, [])

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ 
                        y: '-100%',
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    <div className="relative flex flex-col items-center">
                        {/* Status Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-bold tracking-[0.5em] text-muted-foreground uppercase mb-4"
                        >
                            Initializing Experience
                        </motion.div>

                        {/* Large Progress Number */}
                        <div className="text-8xl md:text-9xl font-black tracking-tighter tabular-nums flex items-baseline">
                            <span className="text-foreground">{progress.toString().padStart(3, '0')}</span>
                            <span className="text-indigo-600 text-4xl mb-4 ml-2">%</span>
                        </div>

                        {/* Scrambled Tagline */}
                        <div className="mt-8 overflow-hidden h-6">
                           <ScrambleText text="Curating digital excellence." />
                        </div>
                    </div>

                    {/* Bottom Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
                        <motion.div 
                            className="h-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
