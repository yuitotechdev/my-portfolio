'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SoundState {
  isEnabled: boolean
  toggleSound: () => void
}

export const useSoundStore = create<SoundState>()(
  persist(
    (set) => ({
      isEnabled: true,
      toggleSound: () => set((state) => ({ isEnabled: !state.isEnabled })),
    }),
    {
      name: 'sound-storage',
    }
  )
)
