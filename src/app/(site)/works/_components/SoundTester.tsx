'use client'

import { useSoundStore, TransitionSoundType } from '@/stores/useSoundStore'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function SoundTester() {
  const { transitionType, setTransitionType } = useSoundStore()

  const types: { id: TransitionSoundType; label: string }[] = [
    { id: 'focus', label: '1. Focus (Air)' },
    { id: 'warp', label: '2. Warp (Space)' },
    { id: 'inhale', label: '3. Inhale (Suck)' },
    { id: 'book', label: '4. Book (Prev)' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-24 right-6 z-[100] bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-border p-4 rounded-2xl shadow-2xl flex flex-col gap-2 max-w-[200px]"
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
        Transition Tester
      </span>
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => setTransitionType(type.id)}
          className={cn(
            "text-left px-3 py-2 rounded-lg text-xs font-medium transition-all",
            transitionType === type.id 
              ? "bg-foreground text-background" 
              : "hover:bg-muted text-foreground/60"
          )}
        >
          {type.label}
        </button>
      ))}
      <p className="text-[9px] text-muted-foreground mt-2 leading-tight">
        Click a work to test current preset.
      </p>
    </motion.div>
  )
}
