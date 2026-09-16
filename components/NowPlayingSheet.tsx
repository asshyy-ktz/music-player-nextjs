'use client';

import clsx from 'clsx';
import { ChevronDown, Heart, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';
import { useLikedStore } from '@/store/likedStore';
import { useUIStore } from '@/store/uiStore';
import SeekBar from './SeekBar';
import WaveformVisualizer from './WaveformVisualizer';
import LyricsPanel from './LyricsPanel';

/**
 * Mobile-only full-screen "now playing" sheet. Slides up from the bottom
 * using a CSS transform/transition controlled by uiStore.isNowPlayingOpen.
 * On desktop this is not used — /now-playing route is the full experience.
 */
export default function NowPlayingSheet() {
  const isOpen = useUIStore((s) => s.isNowPlayingOpen);
  const closeNowPlaying = useUIStore((s) => s.closeNowPlaying);

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

  const isLiked = useLikedStore((s) => (track ? s.isLiked(track.id) : false));
  const toggleLike = useLikedStore((s) => s.toggleLike);

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div
      className={clsx(
        'md:hidden fixed inset-0 z-50 bg-background flex flex-col transition-transform duration-300 ease-out',
        isOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      )}
    >
      {track && (
        <>
          <div className="flex items-center justify-between px-4 py-4">
            <button type="button" onClick={closeNowPlaying} aria-label="Close" className="text-white">
              <ChevronDown size={24} />
            </button>
            <p className="text-xs uppercase tracking-wider text-muted">{track.albumTitle}</p>
            <div className="w-6" />
          </div>

          <div className="flex-1 flex flex-col px-6 overflow-y-auto">
            <img src={track.cover} alt="" className="w-full max-w-xs mx-auto aspect-square rounded-xl object-cover shadow-2xl mt-4" />

            <div className="mt-8 flex items-center justify-between">
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-white truncate">{track.title}</h1>
                <p className="text-muted truncate">{track.artistName}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleLike(track.id)}
                className={clsx('ml-4 shrink-0', isLiked ? 'text-accent' : 'text-muted')}
                aria-label={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="mt-6">
              <SeekBar position={position} duration={track.duration} onSeek={seek} />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={toggleShuffle} className={shuffle ? 'text-accent' : 'text-muted'} aria-label="Shuffle">
                <Shuffle size={20} />
              </button>
              <button type="button" onClick={prev} className="text-white" aria-label="Previous">
                <SkipBack size={28} />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <button type="button" onClick={next} className="text-white" aria-label="Next">
                <SkipForward size={28} />
              </button>
              <button type="button" onClick={cycleRepeat} className={repeatMode !== 'off' ? 'text-accent' : 'text-muted'} aria-label="Repeat">
                <RepeatIcon size={20} />
              </button>
            </div>

            <div className="h-16 mt-8">
              <WaveformVisualizer trackId={track.id} duration={track.duration} />
            </div>

            <LyricsPanel lyrics={track.lyrics} position={position} className="max-h-48 mt-4" />
          </div>
        </>
      )}
    </div>
  );
}
