'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTransitionStore } from '@/stores/useTransitionStore'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ProjectWiper() {
    const { projectTitle, setProjectTitle } = useTransitionStore()
    const pathname = usePathname()

    // パスが変更されたら（遷移が完了したら）少し待ってからワイプを閉じる
    useEffect(() => {
        if (projectTitle) {
            const timer = setTimeout(() => {
                setProjectTitle(null)
            }, 800) // 遷移後の待機時間
            return () => clearTimeout(timer)
        }
    }, [pathname, projectTitle, setProjectTitle])

    return (
        <AnimatePresence>
            {projectTitle && (
                <>
                    {/* Secondary background layer for depth */}
                    <motion.div
                        className="fixed inset-0 z-[99998] bg-indigo-600"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
                    />
                    
                    <motion.div
                        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden pointer-events-none"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    >
                        {/* Progress Bar in Transition */}
                        <motion.div 
                            className="absolute bottom-0 left-0 h-1 bg-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                        />

                        <div className="overflow-hidden py-4">
                            <motion.h2 
                                className="text-4xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase"
                                initial={{ y: "100%", rotate: 5 }}
                                animate={{ y: "0%", rotate: 0 }}
                                exit={{ y: "-100%", rotate: -5 }}
                                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                            >
                                {projectTitle}
                            </motion.h2>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ delay: 0.4 }}
                            className="text-[10px] font-bold tracking-[1em] uppercase mt-8"
                        >
                            Loading Experience
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
