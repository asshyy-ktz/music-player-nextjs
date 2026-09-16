import { create } from 'zustand';

interface UIState {
  isNowPlayingOpen: boolean;
  isQueueOpen: boolean;
  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  toggleQueue: () => void;
  setQueueOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isNowPlayingOpen: false,
  isQueueOpen: false,
  openNowPlaying: () => set({ isNowPlayingOpen: true }),
  closeNowPlaying: () => set({ isNowPlayingOpen: false }),
  toggleQueue: () => set((s) => ({ isQueueOpen: !s.isQueueOpen })),
  setQueueOpen: (open) => set({ isQueueOpen: open }),
}));
