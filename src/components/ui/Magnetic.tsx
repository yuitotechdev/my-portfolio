'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMotion } from '@/components/providers/MotionProvider'

export function Magnetic({ children, className, intensity = 0.5 }: { children: React.ReactNode, className?: string, intensity?: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const { preference } = useMotion()

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (preference === 'minimal') return

        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current!.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        setPosition({ x: middleX * intensity, y: middleY * intensity })
    }

    const reset = () => setPosition({ x: 0, y: 0 })

    const { x, y } = position

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
