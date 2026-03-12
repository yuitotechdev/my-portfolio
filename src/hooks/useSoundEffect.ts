'use client'

import useSound from 'use-sound'
import { useSoundStore } from '@/stores/useSoundStore'

// Standard UI sound effects (Public domain / royalty free placeholders)
const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle "click/pop"
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Solid click
  transition: 'https://assets.mixkit.co/active_storage/sfx/2592/2592-preview.mp3', // Whoosh
  tick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Use same as hover but modified
}

export function useSoundEffect() {
  const { isEnabled } = useSoundStore()
  
  const [playHover] = useSound(SOUNDS.hover, { volume: 0.15, soundEnabled: isEnabled })
  const [playClick] = useSound(SOUNDS.click, { volume: 0.3, soundEnabled: isEnabled })
  const [playTransition] = useSound(SOUNDS.transition, { volume: 0.2, soundEnabled: isEnabled })
  const [playTick] = useSound(SOUNDS.tick, { 
    volume: 0.008, // Extra quiet - felt more than heard
    soundEnabled: isEnabled, 
    playbackRate: 0.6 // Much deeper, mechanical feel
  }) 

  return {
    playHover: () => isEnabled && playHover(),
    playClick: () => isEnabled && playClick(),
    playTransition: () => isEnabled && playTransition(),
    playTick: () => isEnabled && playTick(),
  }
}
