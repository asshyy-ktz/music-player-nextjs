'use client';

import { useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import clsx from 'clsx';
import { usePlayerStore } from '@/store/playerStore';
import { formatDuration } from '@/lib/mockData';
import { useUIStore } from '@/store/uiStore';

export default function QueuePanel({ className }: { className?: string }) {
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const reorderQueue = usePlayerStore((s) => s.reorderQueue);
  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);
  const isQueueOpen = useUIStore((s) => s.isQueueOpen);
  const setQueueOpen = useUIStore((s) => s.setQueueOpen);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  if (!isQueueOpen) return null;

  const upNext = queue.map((t, i) => ({ track: t, index: i })).filter(({ index }) => index > currentIndex);

  return (
    <div className={clsx('fixed right-0 top-0 bottom-20 w-full sm:w-80 bg-surface border-l border-white/5 z-30 flex flex-col', className)}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        <h2 className="font-semibold text-white">Up Next</h2>
        <button type="button" onClick={() => setQueueOpen(false)} className="text-muted hover:text-white" aria-label="Close queue">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {upNext.length === 0 && <p className="text-sm text-muted px-3 py-6">Nothing queued up next.</p>}
        {upNext.map(({ track, index }) => (
          <div
            key={`${track.id}-${index}`}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => {
              e.preventDefault();
              setOverIndex(index);
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragIndex !== null && dragIndex !== index) {
                reorderQueue(dragIndex, index);
              }
              setDragIndex(null);
              setOverIndex(null);
            }}
            className={clsx(
              'group flex items-center gap-2 rounded-md px-2 py-2 hover:bg-surface2/60 transition-colors',
              overIndex === index && dragIndex !== index && 'ring-1 ring-accent/60'
            )}
          >
            <GripVertical size={14} className="text-muted cursor-grab shrink-0" />
            <img src={track.cover} alt="" className="h-9 w-9 rounded object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">{track.title}</p>
              <p className="truncate text-xs text-muted">{track.artistName}</p>
            </div>
            <span className="text-xs text-muted tabular-nums">{formatDuration(track.duration)}</span>
            <button
              type="button"
              onClick={() => removeFromQueue(index)}
              className="text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove from queue"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
