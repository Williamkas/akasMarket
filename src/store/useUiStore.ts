import { create } from 'zustand';

export type UiStore = {
  showLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  showLoginModal: false,
  openLoginModal: () => set({ showLoginModal: true }),
  closeLoginModal: () => set({ showLoginModal: false })
}));
