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
                <motion.div
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden pointer-events-none"
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    <motion.h2 
                        className="text-4xl md:text-7xl lg:text-9xl font-black tracking-tighter"
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, y: -50 }}
                        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                    >
                        {projectTitle}
                    </motion.h2>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
