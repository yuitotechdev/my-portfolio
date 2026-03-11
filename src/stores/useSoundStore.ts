import { create } from 'zustand'

interface SoundState {
    isEnabled: boolean
    toggleSound: () => void
}

export const useSoundStore = create<SoundState>()((set) => ({
    isEnabled: true,
    toggleSound: () => set((state) => ({ isEnabled: !state.isEnabled })),
}))
