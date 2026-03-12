'use client'

import { useMotion } from "@/components/providers/MotionProvider"
import { useSoundStore } from '@/stores/useSoundStore'
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Shield, Battery, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function ExperienceControls() {
    const { preference, setPreference, theme } = useMotion()
    const { isEnabled: soundEnabled, toggleSound } = useSoundStore()
    const [isHovered, setIsHovered] = useState(false)

    const cyclePreference = () => {
        if (preference === 'high') setPreference('safe')
        else if (preference === 'safe') setPreference('minimal')
        else setPreference('high')
    }

    const motionOptions = [
        { value: 'high', label: 'High', icon: Zap },
        { value: 'safe', label: 'Safe', icon: Shield },
        { value: 'minimal', label: 'Min', icon: Battery },
    ]

    const currentMotion = motionOptions.find(o => o.value === preference) || motionOptions[0]
    const MotionIcon = currentMotion.icon

    return (
        <div 
            className="fixed bottom-6 left-6 z-[100] flex items-center gap-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center bg-background/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-border rounded-full p-1 shadow-2xl overflow-hidden">
                {/* Motion Control */}
                <motion.button
                    onClick={cyclePreference}
                    whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap",
                        preference === 'high' ? "text-indigo-500 font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                >
                    <MotionIcon size={16} />
                    <AnimatePresence mode="wait">
                        {isHovered && (
                            <motion.span 
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="text-[10px] font-bold uppercase tracking-widest overflow-hidden"
                            >
                                Motion: {currentMotion.label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                {/* Sound Control */}
                <motion.button
                    onClick={toggleSound}
                    whileHover={{ backgroundColor: soundEnabled ? 'rgba(99, 102, 241, 0.1)' : 'rgba(239, 68, 68, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-full transition-all whitespace-nowrap",
                        soundEnabled ? "text-indigo-500 font-bold" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                >
                    <div className="relative">
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        {soundEnabled && isHovered && (
                            <div className="absolute -top-1 -right-1 flex gap-0.5">
                                <motion.div animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity }} className="w-0.5 bg-indigo-500 rounded-full" />
                                <motion.div animate={{ height: [4, 2, 4] }} transition={{ repeat: Infinity }} className="w-0.5 bg-indigo-500 rounded-full" />
                            </div>
                        )}
                    </div>
                    <AnimatePresence mode="wait">
                        {isHovered && (
                            <motion.span 
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 'auto', opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="text-[10px] font-bold uppercase tracking-widest overflow-hidden"
                            >
                                Sound: {soundEnabled ? 'ON' : 'OFF'}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    )
}
