'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TransitionSoundType = 'focus' | 'warp' | 'inhale' | 'book'

interface SoundState {
  isEnabled: boolean
  transitionType: TransitionSoundType
  toggleSound: () => void
  setTransitionType: (type: TransitionSoundType) => void
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      isEnabled: true,
      transitionType: 'focus', // Default to the recommended one
      toggleSound: () => set((state) => ({ isEnabled: !state.isEnabled })),
      setTransitionType: (type) => set({ transitionType: type }),
    }),
    {
      name: 'sound-storage',
    }
  )
)
