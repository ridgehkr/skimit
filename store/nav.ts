import { create } from 'zustand'

interface NavState {
  // is the navigation menu currently open
  isOpen: boolean
}

interface NavActions {
  // switch the navigation menu between open and closed
  toggleNav: () => void

  // open the navigation menu
  openNav: () => void

  // close the navigation menu
  closeNav: () => void
}

type NavStore = NavState & NavActions

/**
 * Mannages the state of the mobile navigation menu which appears from side of the screen on hamburger button click
 */
export const useMobileNav = create<NavStore>((set) => ({
  isOpen: false,
  toggleNav: () => set((state) => ({ isOpen: !state.isOpen })),
  openNav: () => set({ isOpen: true }),
  closeNav: () => set({ isOpen: false }),
}))

/**
 * Mannages the state of the desktop navigation sidebar
 */
export const useDesktopNav = create<NavStore>((set) => ({
  isOpen: true,
  toggleNav: () => set((state) => ({ isOpen: !state.isOpen })),
  openNav: () => set({ isOpen: true }),
  closeNav: () => set({ isOpen: false }),
}))
