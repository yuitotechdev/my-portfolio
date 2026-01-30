'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useMotion } from '@/components/providers/MotionProvider'
import { MOTION } from '@/config/motion'
import { cn } from '@/lib/utils'

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { preference } = useMotion()

    // Admin routes are always Safe (Minimal transition)
    const isAdmin = pathname?.startsWith('/admin')
    const isHigh = preference === 'high' && !isAdmin
    const isSafe = (preference === 'safe' || isAdmin) && preference !== 'minimal'

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                className="w-full min-h-screen relative"
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* 
                  Frosted Hydraulic Layers 
                  Only render in High/Safe modes (Minimal gets no curtain)
                  Safe mode: No Blur, just Opacity/Color
                */}
                {!isAdmin && preference !== 'minimal' && (
                    <>
                        {/* Layer 2: Secondary Damping (Slightly darker/blue tint) */}
                        <motion.div
                            className={cn(
                                "fixed inset-0 z-[60] pointer-events-none bg-blue-50/50", // More opaque, lighter blue
                                isHigh && "backdrop-blur-[2px]" // Minimal blur on secondary
                            )}
                            variants={MOTION.frosted.secondary}
                            style={{ originX: 0 }} // Starts from left
                        />

                        {/* Layer 1: Primary Water Surface (White/Frosted) */}
                        <motion.div
                            className={cn(
                                "fixed inset-0 z-[61] pointer-events-none bg-white/90", // Much more opaque (was 60)
                                isHigh && "backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl" // Heavy frost
                            )}
                            variants={MOTION.frosted.primary}
                            style={{ originX: 0 }}
                        />
                    </>
                )}

                {/* Page Content */}
                <motion.div
                    variants={MOTION.page}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
