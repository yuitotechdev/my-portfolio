'use client'

import useSound from 'use-sound'
import { useSoundStore } from '@/stores/useSoundStore'

// Standard UI sound effects (Public domain / royalty free placeholders)
const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle "click/pop"
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Solid click
  transition: 'https://assets.mixkit.co/active_storage/sfx/2592/2592-preview.mp3', // Whoosh
  // "The Frosted Silk" - Short, textured friction sound
  tick: 'https://assets.mixkit.co/active_storage/sfx/2564/2564-preview.mp3', // Soft paper-like ruffle/click
}

export function useSoundEffect() {
  const { isEnabled } = useSoundStore()
  
  const [playHover] = useSound(SOUNDS.hover, { volume: 0.15, soundEnabled: isEnabled })
  const [playClick] = useSound(SOUNDS.click, { volume: 0.3, soundEnabled: isEnabled })
  const [playTransition] = useSound(SOUNDS.transition, { volume: 0.2, soundEnabled: isEnabled })
  const [playTick] = useSound(SOUNDS.tick, { 
    volume: 0.04, // Very subtle, integrated into background
    soundEnabled: isEnabled, 
    playbackRate: 3.5, // Sped up to create a very short "sh" or "tch" friction texture
  }) 

  return {
    playHover: () => isEnabled && playHover(),
    playClick: () => isEnabled && playClick(),
    playTransition: () => isEnabled && playTransition(),
    playTick: () => isEnabled && playTick(),
  }
}
