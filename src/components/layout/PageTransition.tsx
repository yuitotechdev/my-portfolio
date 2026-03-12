'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useMotion } from '@/components/providers/MotionProvider'
import { MOTION } from '@/config/motion'
import { cn } from '@/lib/utils'

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { preference } = useMotion()

    // Pure path-based detection for detail pages
    const isWorkDetail = pathname?.startsWith('/works/') && pathname !== '/works'

    // Admin routes are always Safe (Minimal transition)
    const isAdmin = pathname?.startsWith('/admin')
    const isHigh = preference === 'high' && !isAdmin

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                key={pathname}
                className="w-full min-h-screen relative"
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* 
                  Frosted Hydraulic Layers 
                  Skip these if we are doing a Shared Element Transition (Work Deep Dive)
                  to prevent flickering and overlapping with the expanding image.
                */}
                {!isAdmin && preference !== 'minimal' && !isWorkDetail && (
                    <>
                        {/* Layer 2: Secondary Damping (Slightly darker/blue tint) */}
                        <motion.div
                            className={cn(
                                "fixed inset-0 z-[60] pointer-events-none bg-muted/30", 
                                isHigh && "backdrop-blur-[2px]"
                            )}
                            variants={MOTION.frosted.secondary}
                            style={{ originX: 0 }}
                        />

                        {/* Layer 1: Primary Water Surface (White/Frosted) */}
                        <motion.div
                            className={cn(
                                "fixed inset-0 z-[61] pointer-events-none bg-background/90", 
                                isHigh && "backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl"
                            )}
                            variants={MOTION.frosted.primary}
                            style={{ originX: 0 }}
                        />
                    </>
                )}

                {/* Page Content */}
                <motion.div
                    variants={{
                        ...MOTION.page,
                        // If deep diving, we don't want the page to blur/scale out
                        // We want it to stay steady while the image expands
                        exit: isWorkDetail 
                            ? { opacity: 0, transition: { duration: 0.3 } } 
                            : MOTION.page.exit
                    }}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
