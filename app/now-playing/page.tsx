'use client';

import Link from 'next/link';
import { ChevronDown, Heart, ListMusic, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import clsx from 'clsx';
import { usePlayerStore } from '@/store/playerStore';
import { useLikedStore } from '@/store/likedStore';
import { useUIStore } from '@/store/uiStore';
import SeekBar from '@/components/SeekBar';
import VolumeSlider from '@/components/VolumeSlider';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import LyricsPanel from '@/components/LyricsPanel';
import { formatDuration } from '@/lib/mockData';

export default function NowPlayingPage() {
  const track = usePlayerStore((s) => s.currentTrack());
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const position = usePlayerStore((s) => s.position);
  const shuffle = usePlayerStore((s) => s.shuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const seek = usePlayerStore((s) => s.seek);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = usePlayerStore((s) => s.cycleRepeat);
  const toggleQueue = useUIStore((s) => s.toggleQueue);

  const isLiked = useLikedStore((s) => (track ? s.isLiked(track.id) : false));
  const toggleLike = useLikedStore((s) => s.toggleLike);

  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted">Nothing is playing right now.</p>
        <Link href="/" className="mt-4 text-accent text-sm font-medium">
          Browse your library
        </Link>
      </div>
    );
  }

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;
  const upNext = queue.slice(currentIndex + 1);

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Link href="/" className="flex items-center gap-2 text-muted hover:text-white text-sm w-fit">
        <ChevronDown size={16} />
        Back to library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-10">
        <div className="flex flex-col items-center text-center">
          <img src={track.cover} alt="" className="w-full max-w-md aspect-square rounded-2xl object-cover shadow-2xl" />

          <div className="mt-8 w-full max-w-md flex items-center justify-between">
            <div className="min-w-0 text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white truncate">{track.title}</h1>
              <p className="text-muted truncate">
                {track.artistName} &middot; {track.albumTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleLike(track.id)}
              className={clsx('ml-4 shrink-0', isLiked ? 'text-accent' : 'text-muted hover:text-white')}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-6 w-full max-w-md">
            <SeekBar position={position} duration={track.duration} onSeek={seek} />
          </div>

          <div className="mt-6 flex items-center gap-6">
            <button type="button" onClick={toggleShuffle} className={shuffle ? 'text-accent' : 'text-muted hover:text-white'} aria-label="Shuffle">
              <Shuffle size={20} />
            </button>
            <button type="button" onClick={prev} className="text-white" aria-label="Previous">
              <SkipBack size={30} />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button type="button" onClick={next} className="text-white" aria-label="Next">
              <SkipForward size={30} />
            </button>
            <button type="button" onClick={cycleRepeat} className={repeatMode !== 'off' ? 'text-accent' : 'text-muted hover:text-white'} aria-label="Repeat">
              <RepeatIcon size={20} />
            </button>
          </div>

          <div className="mt-4">
            <VolumeSlider />
          </div>

          <div className="w-full max-w-2xl h-24 mt-10">
            <WaveformVisualizer trackId={track.id} duration={track.duration} />
          </div>

          <LyricsPanel lyrics={track.lyrics} position={position} className="max-h-72 w-full max-w-xl" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <ListMusic size={18} />
              Up Next
            </h2>
            <button type="button" onClick={toggleQueue} className="text-xs text-muted hover:text-white lg:hidden">
              Toggle
            </button>
          </div>
          <div className="flex flex-col gap-1 max-h-[32rem] overflow-y-auto">
            {upNext.length === 0 && <p className="text-sm text-muted">Queue is empty.</p>}
            {upNext.map((t, i) => (
              <div key={`${t.id}-${i}`} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-surface2/60 transition-colors">
                <img src={t.cover} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{t.title}</p>
                  <p className="truncate text-xs text-muted">{t.artistName}</p>
                </div>
                <span className="text-xs text-muted tabular-nums">{formatDuration(t.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
