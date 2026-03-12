'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { ReactNode, useRef } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useSoundEffect } from '@/hooks/useSoundEffect'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { preference } = useMotion()
  const { playTick } = useSoundEffect()
  const lastScrollPos = useRef(0)
  const tickThreshold = 120 // Heavier metallic feel

  useLenis(({ scroll, velocity }) => {
    // Aggressive cut-off to prevent "pico-pico" during deceleration
    if (Math.abs(velocity) < 0.4) return;

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
