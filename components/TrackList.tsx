'use client';

import { useState } from 'react';
import type { Track } from '@/lib/types';
import TrackRow from './TrackRow';

interface TrackListProps {
  tracks: Track[];
  showAlbum?: boolean;
  draggable?: boolean;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onRemove?: (index: number) => void;
}

export default function TrackList({ tracks, showAlbum = true, draggable = false, onReorder, onRemove }: TrackListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function handleDrop(toIndex: number) {
    if (dragIndex !== null && dragIndex !== toIndex) {
      onReorder?.(dragIndex, toIndex);
    }
    setDragIndex(null);
    setOverIndex(null);
  }

  if (tracks.length === 0) {
    return <p className="text-sm text-muted px-3 py-6">No tracks here yet.</p>;
  }

  return (
    <div className="flex flex-col">
      <div className="hidden md:grid grid-cols-[2rem_1fr_minmax(0,1fr)_5rem_auto] gap-3 px-3 pb-2 text-xs uppercase tracking-wider text-muted border-b border-white/5 mb-1">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="text-right">Like</span>
        <span className="text-right">Time</span>
      </div>
      {tracks.map((track, index) => (
        <TrackRow
          key={`${track.id}-${index}`}
          track={track}
          index={index}
          tracksInContext={tracks}
          showAlbum={showAlbum}
          draggable={draggable}
          isDragTarget={overIndex === index && dragIndex !== index}
          onDragStart={setDragIndex}
          onDragOver={setOverIndex}
          onDrop={handleDrop}
          onRemove={onRemove ? () => onRemove(index) : undefined}
        />
      ))}
    </div>
  );
}
