'use client'

import useSound from 'use-sound'
import { useSoundStore } from '@/stores/useSoundStore'

// Standard UI sound effects (Public domain / royalty free placeholders)
const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle "click/pop"
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Solid click
  transition: 'https://assets.mixkit.co/active_storage/sfx/2592/2592-preview.mp3', // Whoosh
  // Metallic haptic - sounds like a fidget spinner or metal gears
  tick: 'https://assets.mixkit.co/active_storage/sfx/2581/2581-preview.mp3', 
}

export function useSoundEffect() {
  const { isEnabled } = useSoundStore()
  
  const [playHover] = useSound(SOUNDS.hover, { volume: 0.2, soundEnabled: isEnabled })
  const [playClick] = useSound(SOUNDS.click, { volume: 0.35, soundEnabled: isEnabled })
  const [playTransition] = useSound(SOUNDS.transition, { volume: 0.25, soundEnabled: isEnabled })
  const [playTick] = useSound(SOUNDS.tick, { 
    volume: 0.1, // Stronger presence
    soundEnabled: isEnabled, 
    playbackRate: 1.1, // Natural pitch for metallic "clink"
    interrupt: true 
  }) 

  return {
    playHover: () => isEnabled && playHover(),
    playClick: () => isEnabled && playClick(),
    playTransition: () => isEnabled && playTransition(),
    playTick: () => isEnabled && playTick(),
  }
}
