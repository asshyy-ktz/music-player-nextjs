'use client';

import { Heart, Pause, Play, GripVertical, X } from 'lucide-react';
import clsx from 'clsx';
import type { Track } from '@/lib/types';
import { formatDuration } from '@/lib/mockData';
import { usePlayerStore } from '@/store/playerStore';
import { useLikedStore } from '@/store/likedStore';

interface TrackRowProps {
  track: Track;
  index: number;
  tracksInContext: Track[];
  showAlbum?: boolean;
  draggable?: boolean;
  onDragStart?: (index: number) => void;
  onDragOver?: (index: number) => void;
  onDrop?: (index: number) => void;
  onRemove?: () => void;
  isDragTarget?: boolean;
}

export default function TrackRow({
  track,
  index,
  tracksInContext,
  showAlbum = true,
  draggable = false,
  onDragStart,
  onDragOver,
  onDrop,
  onRemove,
  isDragTarget = false,
}: TrackRowProps) {
  const currentTrack = usePlayerStore((s) => s.currentTrack());
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const playTrackFromList = usePlayerStore((s) => s.playTrackFromList);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const isLiked = useLikedStore((s) => s.isLiked(track.id));
  const toggleLike = useLikedStore((s) => s.toggleLike);

  const isCurrent = currentTrack?.id === track.id;

  function handlePlayClick() {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrackFromList(tracksInContext, track.id);
    }
  }

  return (
    <div
      draggable={draggable}
      onDragStart={() => onDragStart?.(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(index);
      }}
      className={clsx(
        'group grid grid-cols-[2rem_1fr_auto_auto_auto] md:grid-cols-[2rem_1fr_minmax(0,1fr)_5rem_auto] items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
        isCurrent ? 'bg-surface2 text-accent' : 'text-white hover:bg-surface2/60',
        isDragTarget && 'ring-1 ring-accent/60'
      )}
    >
      <div className="flex items-center justify-center text-muted">
        {draggable && <GripVertical size={16} className="cursor-grab opacity-0 group-hover:opacity-100 mr-1" />}
        <button
          type="button"
          onClick={handlePlayClick}
          className="relative flex h-6 w-6 items-center justify-center"
          aria-label={isCurrent && isPlaying ? 'Pause' : 'Play'}
        >
          <span className={clsx('text-xs tabular-nums', 'group-hover:hidden', isCurrent ? 'hidden' : 'block')}>
            {index + 1}
          </span>
          <span className={clsx('hidden group-hover:flex', isCurrent && 'flex')}>
            {isCurrent && isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </span>
        </button>
      </div>

      <div className="min-w-0 flex items-center gap-3">
        <img src={track.cover} alt="" className="h-10 w-10 rounded object-cover hidden sm:block shrink-0" />
        <div className="min-w-0">
          <p className="truncate font-medium">{track.title}</p>
          <p className="truncate text-xs text-muted">{track.artistName}</p>
        </div>
      </div>

      {showAlbum ? (
        <p className="hidden md:block truncate text-xs text-muted">{track.albumTitle}</p>
      ) : (
        <div className="hidden md:block" />
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => toggleLike(track.id)}
          aria-label={isLiked ? 'Unlike' : 'Like'}
          className={clsx('transition-colors', isLiked ? 'text-accent' : 'text-muted hover:text-white')}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex items-center gap-3 justify-end text-xs text-muted tabular-nums">
        {formatDuration(track.duration)}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove from playlist"
            className="text-muted hover:text-red-400 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
