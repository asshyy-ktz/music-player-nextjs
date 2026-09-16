'use client';

import Link from 'next/link';
import { Heart, ListMusic, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import clsx from 'clsx';
import { usePlayerStore } from '@/store/playerStore';
import { useLikedStore } from '@/store/likedStore';
import { useUIStore } from '@/store/uiStore';
import SeekBar from './SeekBar';
import VolumeSlider from './VolumeSlider';

export default function MiniPlayer() {
  const track = usePlayerStore((s) => s.currentTrack());
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const position = usePlayerStore((s) => s.position);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const seek = usePlayerStore((s) => s.seek);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const toggleQueue = useUIStore((s) => s.toggleQueue);
  const openNowPlaying = useUIStore((s) => s.openNowPlaying);

  const isLiked = useLikedStore((s) => (track ? s.isLiked(track.id) : false));
  const toggleLike = useLikedStore((s) => s.toggleLike);

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-white/5 bg-surface flex items-center justify-center text-muted text-sm z-40">
        Select a track to start listening
      </div>
    );
  }

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-surface z-40">
      <div className="px-2">
        <SeekBar position={position} duration={track.duration} onSeek={seek} showTime={false} className="md:hidden" />
      </div>
      <div className="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3">
        <button
          type="button"
          onClick={openNowPlaying}
          className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:w-64 text-left"
        >
          <img src={track.cover} alt="" className="h-12 w-12 rounded object-cover shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{track.title}</p>
            <p className="truncate text-xs text-muted">{track.artistName}</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => toggleLike(track.id)}
          className={clsx('hidden sm:block transition-colors', isLiked ? 'text-accent' : 'text-muted hover:text-white')}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        <div className="flex-1 hidden md:flex flex-col items-center gap-1 max-w-xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleShuffle}
              className={clsx('transition-colors', shuffle ? 'text-accent' : 'text-muted hover:text-white')}
              aria-label="Toggle shuffle"
            >
              <Shuffle size={16} />
            </button>
            <button type="button" onClick={prev} className="text-muted hover:text-white transition-colors" aria-label="Previous">
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button type="button" onClick={next} className="text-muted hover:text-white transition-colors" aria-label="Next">
              <SkipForward size={18} />
            </button>
            <button
              type="button"
              onClick={cycleRepeat}
              className={clsx('transition-colors', repeatMode !== 'off' ? 'text-accent' : 'text-muted hover:text-white')}
              aria-label="Toggle repeat"
            >
              <RepeatIcon size={16} />
            </button>
          </div>
          <SeekBar position={position} duration={track.duration} onSeek={seek} className="w-full" />
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button type="button" onClick={togglePlay} className="text-white" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button type="button" onClick={next} className="text-white" aria-label="Next">
            <SkipForward size={22} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 w-64 justify-end">
          <button type="button" onClick={toggleQueue} className="text-muted hover:text-white transition-colors" aria-label="Queue">
            <ListMusic size={18} />
          </button>
          <VolumeSlider />
          <Link href="/now-playing" className="text-xs text-muted hover:text-white transition-colors">
            Full screen
          </Link>
        </div>
      </div>
    </div>
  );
}
