import { create } from 'zustand'

interface GlowState {
    color: string
    setColor: (color: string) => void
}

export const useGlowStore = create<GlowState>()((set) => ({
    // デフォルト（従来のインディゴ系）
    color: 'rgba(99, 102, 241, 0.15)',
    setColor: (color) => set({ color }),
}))
