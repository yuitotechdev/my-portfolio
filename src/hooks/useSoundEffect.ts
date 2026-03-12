'use client'

import useSound from 'use-sound'
import { useSoundStore } from '@/stores/useSoundStore'

// Standard UI sound effects (Public domain / royalty free placeholders)
const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle "click/pop"
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Solid click
  // "The Deep Bloom" - Ambient bassy transition with a touch of magic
  transition: 'https://assets.mixkit.co/active_storage/sfx/2556/2556-preview.mp3', // Deep, spacious digital bloom
  // Metallic mechanical tick for fidget effect
  tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', 
}

export function useSoundEffect() {
  const { isEnabled } = useSoundStore()
  
  const [playHover] = useSound(SOUNDS.hover, { volume: 0.15, soundEnabled: isEnabled })
  const [playClick] = useSound(SOUNDS.click, { volume: 0.3, soundEnabled: isEnabled })
  const [playTransition] = useSound(SOUNDS.transition, { 
    volume: 0.4, 
    soundEnabled: isEnabled,
    playbackRate: 0.8 // Lower pitch for deeper, heavier bass feel
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
