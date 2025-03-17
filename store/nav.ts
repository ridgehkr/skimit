import { create } from 'zustand'

interface NavState {
  isOpen: boolean
  isTransitioning: boolean
}

interface NavActions {
  toggleNav: () => void
  openNav: () => void
  closeNav: () => void
}

type NavStore = NavState & NavActions

/**
 * Mannages the state of the mobile navigation menu which appears from side of the screen on hamburger button click
 */
export const useMobileNav = create<NavStore>((set) => ({
  isOpen: false,
  isTransitioning: false,
  toggleNav: () => set((state) => ({ isOpen: !state.isOpen })),
  openNav: () => set({ isOpen: true }),
  closeNav: () => set({ isOpen: false }),
}))

/**
 * Mannages the state of the desktop navigation sidebar
 */
export const useDesktopNav = create<NavStore>((set) => ({
  isOpen: true,
  isTransitioning: false,
  toggleNav: () => set((state) => ({ isOpen: !state.isOpen })),
  openNav: () => set({ isOpen: true }),
  closeNav: () => set({ isOpen: false }),
}))
