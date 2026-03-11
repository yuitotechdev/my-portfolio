'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface RevealProps {
    children: ReactNode
    width?: "fit-content" | "100%"
}

export const Reveal = ({ children, width = "fit-content" }: RevealProps) => {
    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25, ease: [0.33, 1, 0.68, 1] }}
            >
                {children}
            </motion.div>
            <motion.div
                variants={{
                    hidden: { left: 0 },
                    visible: { left: "100%" },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeIn" }}
                style={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    left: 0,
                    right: 0,
                    background: "var(--foreground)",
                    zIndex: 20,
                    opacity: 0.8
                }}
            />
        </div>
    )
}
