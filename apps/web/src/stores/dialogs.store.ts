import { create } from 'zustand'

type DialogsStore = {
  isSignInDialogOpen: boolean
  setIsSignInOpen: (value: boolean) => void
}

export const useDialogsStore = create<DialogsStore>((set) => ({
  isSignInDialogOpen: false,
  setIsSignInOpen: (isSignInOpen) => {
    set({ isSignInDialogOpen: isSignInOpen })
  }
}))
