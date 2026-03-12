'use client'

import { ReactLenis, useLenis } from 'lenis/react'
import { ReactNode, useRef } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useSoundEffect } from '@/hooks/useSoundEffect'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { preference } = useMotion()
  const { playTick } = useSoundEffect()
  const lastScrollPos = useRef(0)
  const tickThreshold = 100 // Play tick every 100px (More responsive feedback)

  useLenis(({ scroll }) => {
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
