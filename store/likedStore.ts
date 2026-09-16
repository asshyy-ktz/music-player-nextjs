import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LikedState {
  likedIds: string[];
  toggleLike: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
}

export const useLikedStore = create<LikedState>()(
  persist(
    (set, get) => ({
      likedIds: [],
      toggleLike: (trackId) => {
        set((s) => ({
          likedIds: s.likedIds.includes(trackId)
            ? s.likedIds.filter((id) => id !== trackId)
            : [...s.likedIds, trackId],
        }));
      },
      isLiked: (trackId) => get().likedIds.includes(trackId),
    }),
    {
      name: 'music-player-liked-songs',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
