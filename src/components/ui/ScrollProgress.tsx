'use client'

import { useScroll, useSpring, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function ScrollProgress() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    const [percentage, setPercentage] = useState(0)

    useEffect(() => {
        return scrollYProgress.on("change", (latest) => {
            setPercentage(Math.round(latest * 100))
        })
    }, [scrollYProgress])

    return (
        <>
            {/* 案5: 画面端のプログレスバー (Top) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* 案5: 画面右下の進行状況 (Vertical Text) */}
            <div className="fixed bottom-24 right-6 z-40 hidden md:flex flex-col items-center gap-4 group">
                <div className="h-20 w-[1px] bg-border relative overflow-hidden">
                    <motion.div 
                        className="absolute top-0 left-0 w-full bg-indigo-600"
                        style={{ height: `${percentage}%` }}
                    />
                </div>
                <div className="rotate-90 origin-center text-[10px] font-black tracking-widest text-muted-foreground whitespace-nowrap -translate-y-4">
                    SCROLL — {percentage.toString().padStart(3, '0')}%
                </div>
            </div>
        </>
    )
}
