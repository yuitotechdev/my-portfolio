import { create } from 'zustand'

interface TransitionState {
    projectTitle: string | null
    setProjectTitle: (title: string | null) => void
}

export const useTransitionStore = create<TransitionState>()((set) => ({
    projectTitle: null,
    setProjectTitle: (title) => set({ projectTitle: title }),
}))
