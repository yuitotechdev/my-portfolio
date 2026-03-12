'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { preference } = useMotion()
  
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
