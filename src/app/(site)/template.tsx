'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
                duration: 0.5, 
                ease: [0.22, 1, 0.36, 1] // cubic-bezier for smooth reveal
            }}
        >
            {children}
        </motion.div>
    )
}
