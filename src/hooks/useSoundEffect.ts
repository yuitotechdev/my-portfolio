'use client'

import useSound from 'use-sound'
import { useSoundStore, TransitionSoundType } from '@/stores/useSoundStore'

// Sound catalog for testing
const SOUNDS = {
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  tick: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  // Different Transition Presets
  focus: 'https://assets.mixkit.co/active_storage/sfx/2556/2556-preview.mp3',   // Case 1: Optical Breath (Bassy Air)
  warp: 'https://assets.mixkit.co/active_storage/sfx/2592/2592-preview.mp3',    // Case 2: Spatial Warp (Whoosh-like)
  inhale: 'https://assets.mixkit.co/active_storage/sfx/614/614-preview.mp3',    // Case 3: Inhalation (Reverse-like)
  book: 'https://assets.mixkit.co/active_storage/sfx/1103/1103-preview.mp3',   // Previous: Book
}

export function useSoundEffect() {
  const { isEnabled, transitionType } = useSoundStore()
  
  const [playHover] = useSound(SOUNDS.hover, { volume: 0.15, soundEnabled: isEnabled })
  const [playClick] = useSound(SOUNDS.click, { volume: 0.3, soundEnabled: isEnabled })
  
  // Transition Sounds
  const [playFocus] = useSound(SOUNDS.focus, { volume: 0.4, playbackRate: 0.7, soundEnabled: isEnabled })
  const [playWarp] = useSound(SOUNDS.warp, { volume: 0.3, playbackRate: 1.0, soundEnabled: isEnabled })
  const [playInhale] = useSound(SOUNDS.inhale, { volume: 0.2, playbackRate: 1.5, soundEnabled: isEnabled })
  const [playBook] = useSound(SOUNDS.book, { volume: 0.4, playbackRate: 1.2, soundEnabled: isEnabled })

  // Tick for scroller
  const [playTick] = useSound(SOUNDS.tick, { volume: 0.1, soundEnabled: isEnabled, interrupt: true }) 

  const playTransitionMap: Record<TransitionSoundType, () => void> = {
    focus: playFocus,
    warp: playWarp,
    inhale: playInhale,
    book: playBook
  }

  return {
    playHover: () => isEnabled && playHover(),
    playClick: () => isEnabled && playClick(),
    playTransition: () => isEnabled && playTransitionMap[transitionType](),
    playTick: (options?: { playbackRate?: number }) => isEnabled && playTick(options),
  }
}
