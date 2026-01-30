'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

// MOTION.md 1.1 Duration & 1.2 Easing
const transition = {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number], // easeOut-like
}

// MOTION.md 2.4 Scroll reveal
const variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
}

// Stagger for lists
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

interface RevealProps extends HTMLMotionProps<"div"> {
    children: ReactNode
    delay?: number
}

export function Reveal({ children, delay = 0, className, ...props }: RevealProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            transition={{ ...transition, delay }}
            variants={variants}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

export function StaggerList({ children, className, ...props }: RevealProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={staggerContainer}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    )
}

// MOTION.md 2.1 Buttons
export function MotionButton({ children, className, onClick, ...props }: HTMLMotionProps<"button">) {
    return (
        <motion.button
            whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
            className={className}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    )
}
