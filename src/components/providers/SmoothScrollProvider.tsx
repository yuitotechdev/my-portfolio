'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { ReactNode, useRef } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useSoundEffect } from '@/hooks/useSoundEffect'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { preference } = useMotion()
  const { playTick } = useSoundEffect()
  const lastScrollPos = useRef(0)
  const tickThreshold = 110 // Precision balance

  useLenis(({ scroll, velocity }) => {
    // Only play if moving faster than a tiny creep (prevent ghost ticks)
    if (Math.abs(velocity) < 0.2) return;

    const distance = Math.abs(scroll - lastScrollPos.current)
    if (distance >= tickThreshold) {
      playTick()
      lastScrollPos.current = scroll
    }
  })
  
  // Disable smooth scroll if user prefers minimal motion
  const isDisabled = preference === 'minimal'

  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        smoothWheel: !isDisabled,
        syncTouch: true 
      }}
    >
      {children}
    </ReactLenis>
  )
}
