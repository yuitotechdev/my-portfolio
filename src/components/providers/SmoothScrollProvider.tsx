'use client'

import { ReactLenis } from 'lenis/react'
import { ReactNode, useRef, useEffect } from 'react'
import { useMotion } from '@/components/providers/MotionProvider'
import { useSoundEffect } from '@/hooks/useSoundEffect'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { preference } = useMotion()
  const { playTick } = useSoundEffect()
  const accumulatedDelta = useRef(0)
  const TICK_THRESHOLD = 80 // Distance in pixels
  
  // Fidget Scroll Logic: Direct input hook (bypasses inertia)
  useEffect(() => {
    const handleInput = (delta: number) => {
      const absDelta = Math.abs(delta)
      accumulatedDelta.current += absDelta
      
      if (accumulatedDelta.current >= TICK_THRESHOLD) {
        // Calculate pitch based on speed (higher delta = higher pitch)
        // Range: 1.5 (slow) to 3.0 (fast)
        const pitch = Math.min(Math.max(absDelta / 20, 1.5), 3.0)
        
        playTick({ playbackRate: pitch })
        accumulatedDelta.current = 0
      }
    }

    const onWheel = (e: WheelEvent) => handleInput(e.deltaY)
    
    let lastTouchY = 0
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      handleInput(lastTouchY - touchY)
      lastTouchY = touchY
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [playTick])

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
