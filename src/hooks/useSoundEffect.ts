'use client'

import useSound from 'use-sound'
import { useSoundStore } from '@/stores/useSoundStore'

// Optimized UI sound effects
const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle "click/pop"
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Solid click
  // "The Focus Air" - Bassy, smooth transition sound
  transition: 'https://assets.mixkit.co/active_storage/sfx/2556/2556-preview.mp3',
  // Metallic mechanical tick for fidget effect
  tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', 
}

export function useSoundEffect() {
  const { isEnabled } = useSoundStore()
  
  const [playHover] = useSound(SOUNDS.hover, { volume: 0.15, soundEnabled: isEnabled })
  const [playClick] = useSound(SOUNDS.click, { volume: 0.3, soundEnabled: isEnabled })
  
  // Transition Sound (Finalized: Focus Air)
  const [playTransition] = useSound(SOUNDS.transition, { 
    volume: 0.4, 
    playbackRate: 0.7, // Lower pitch for deeper, heavier bass feel
    soundEnabled: isEnabled 
  })
  
  // Scroller Tick: High precision mechanical sound
  const [playTick] = useSound(SOUNDS.tick, { 
    volume: 0.1, 
    soundEnabled: isEnabled, 
    interrupt: true 
  }) 

  return {
    playHover: () => isEnabled && playHover(),
    playClick: () => isEnabled && playClick(),
    playTransition: () => isEnabled && playTransition(),
    // Allow dynamic playbackRate for the "fidget" feel
    playTick: (options?: { playbackRate?: number }) => isEnabled && playTick(options),
  }
}
