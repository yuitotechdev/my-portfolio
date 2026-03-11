'use client'

import { useSoundStore } from '@/stores/useSoundStore'
import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

export function SoundToggle() {
    const { isEnabled, toggleSound } = useSoundStore()

    return (
        <motion.button
            onClick={toggleSound}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-background/50 border border-border backdrop-blur-md shadow-lg text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
            title={isEnabled ? "Mute" : "Unmute"}
        >
            <div className="relative">
                {isEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                {isEnabled && (
                    <div className="absolute -top-1 -right-1 flex gap-0.5">
                        <motion.div 
                            animate={{ height: [2, 8, 4, 10, 2] }} 
                            transition={{ repeat: Infinity, duration: 0.8 }} 
                            className="w-0.5 bg-indigo-500 rounded-full" 
                        />
                        <motion.div 
                            animate={{ height: [4, 2, 10, 6, 4] }} 
                            transition={{ repeat: Infinity, duration: 1.2 }} 
                            className="w-0.5 bg-indigo-500 rounded-full" 
                        />
                    </div>
                )}
            </div>
        </motion.button>
    )
}
