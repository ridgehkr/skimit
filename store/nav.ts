import { create } from 'zustand'

interface NavState {
  isOpen: boolean
  toggleNav: () => void
  openNav: () => void
  closeNav: () => void
}

export const useNavStore = create<NavState>((set) => ({
  isOpen: false,
  toggleNav: () => set((state) => ({ isOpen: !state.isOpen })),
  openNav: () => set({ isOpen: true }),
  closeNav: () => set({ isOpen: false }),
}))
