import { create } from 'zustand';
import type { RepeatMode, Track } from '@/lib/types';

interface PlayerState {
  queue: Track[];
  currentIndex: number;
  isPlaying: boolean;
  position: number; // seconds
  volume: number; // 0..1
  shuffle: boolean;
  repeatMode: RepeatMode;
  _timerId: ReturnType<typeof setInterval> | null;

  currentTrack: () => Track | null;
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playTrackFromList: (tracks: Track[], trackId: string) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (position: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  removeFromQueue: (index: number) => void;
  addToQueue: (track: Track) => void;
  _tick: () => void;
  _startTimer: () => void;
  _stopTimer: () => void;
}

const TICK_MS = 250;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  volume: 0.75,
  shuffle: false,
  repeatMode: 'off',
  _timerId: null,

  currentTrack: () => {
    const { queue, currentIndex } = get();
    return currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;
  },

  setQueue: (tracks, startIndex = 0) => {
    set({ queue: tracks, currentIndex: tracks.length ? startIndex : -1, position: 0, isPlaying: tracks.length > 0 });
    if (tracks.length > 0) get()._startTimer();
  },

  playTrackFromList: (tracks, trackId) => {
    const idx = tracks.findIndex((t) => t.id === trackId);
    if (idx === -1) return;
    set({ queue: tracks, currentIndex: idx, position: 0, isPlaying: true });
    get()._startTimer();
  },

  play: () => {
    const { queue, currentIndex } = get();
    if (currentIndex === -1 && queue.length > 0) {
      set({ currentIndex: 0 });
    }
    if (get().queue.length === 0) return;
    set({ isPlaying: true });
    get()._startTimer();
  },

  pause: () => {
    set({ isPlaying: false });
    get()._stopTimer();
  },

  togglePlay: () => {
    get().isPlaying ? get().pause() : get().play();
  },

  seek: (position) => {
    const track = get().currentTrack();
    const duration = track?.duration ?? 0;
    set({ position: Math.min(Math.max(position, 0), duration) });
  },

  next: () => {
    const { queue, currentIndex, shuffle, repeatMode } = get();
    if (queue.length === 0) return;

    if (repeatMode === 'one') {
      set({ position: 0, isPlaying: true });
      return;
    }

    let nextIndex: number;
    if (shuffle) {
      if (queue.length === 1) {
        nextIndex = 0;
      } else {
        do {
          nextIndex = Math.floor(Math.random() * queue.length);
        } while (nextIndex === currentIndex);
      }
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        set({ isPlaying: false, position: 0 });
        get()._stopTimer();
        return;
      }
    }

    set({ currentIndex: nextIndex, position: 0, isPlaying: true });
  },

  prev: () => {
    const { queue, currentIndex, position } = get();
    if (queue.length === 0) return;
    // If we're more than 3s into the track, restart it instead of going back
    if (position > 3) {
      set({ position: 0 });
      return;
    }
    const prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      set({ position: 0 });
      return;
    }
    set({ currentIndex: prevIndex, position: 0, isPlaying: true });
  },

  setVolume: (volume) => set({ volume: Math.min(Math.max(volume, 0), 1) }),

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  cycleRepeat: () =>
    set((s) => {
      const order: RepeatMode[] = ['off', 'all', 'one'];
      const idx = order.indexOf(s.repeatMode);
      return { repeatMode: order[(idx + 1) % order.length] };
    }),

  reorderQueue: (fromIndex, toIndex) => {
    set((s) => {
      const newQueue = [...s.queue];
      const [moved] = newQueue.splice(fromIndex, 1);
      newQueue.splice(toIndex, 0, moved);

      let newCurrentIndex = s.currentIndex;
      if (s.currentIndex === fromIndex) {
        newCurrentIndex = toIndex;
      } else if (fromIndex < s.currentIndex && toIndex >= s.currentIndex) {
        newCurrentIndex -= 1;
      } else if (fromIndex > s.currentIndex && toIndex <= s.currentIndex) {
        newCurrentIndex += 1;
      }

      return { queue: newQueue, currentIndex: newCurrentIndex };
    });
  },

  removeFromQueue: (index) => {
    set((s) => {
      const newQueue = s.queue.filter((_, i) => i !== index);
      let newCurrentIndex = s.currentIndex;
      if (index < s.currentIndex) newCurrentIndex -= 1;
      else if (index === s.currentIndex) newCurrentIndex = Math.min(newCurrentIndex, newQueue.length - 1);
      return { queue: newQueue, currentIndex: newQueue.length ? newCurrentIndex : -1 };
    });
  },

  addToQueue: (track) => {
    set((s) => ({ queue: [...s.queue, track], currentIndex: s.currentIndex === -1 ? 0 : s.currentIndex }));
  },

  _tick: () => {
    const { isPlaying, position } = get();
    const track = get().currentTrack();
    if (!isPlaying || !track) return;
    const nextPos = position + TICK_MS / 1000;
    if (nextPos >= track.duration) {
      get().next();
    } else {
      set({ position: nextPos });
    }
  },

  _startTimer: () => {
    const existing = get()._timerId;
    if (existing) clearInterval(existing);
    const id = setInterval(() => get()._tick(), TICK_MS);
    set({ _timerId: id });
  },

  _stopTimer: () => {
    const existing = get()._timerId;
    if (existing) clearInterval(existing);
    set({ _timerId: null });
  },
}));
