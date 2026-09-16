'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { formatDuration } from '@/lib/mockData';

interface SeekBarProps {
  position: number;
  duration: number;
  onSeek: (value: number) => void;
  showTime?: boolean;
  className?: string;
}

export default function SeekBar({ position, duration, onSeek, showTime = true, className }: SeekBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const ratio = dragRatio ?? (duration > 0 ? Math.min(position / duration, 1) : 0);

  function ratioFromEvent(e: ReactPointerEvent<HTMLDivElement>): number {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const r = (e.clientX - rect.left) / rect.width;
    return Math.min(Math.max(r, 0), 1);
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const r = ratioFromEvent(e);
    setDragRatio(r);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragRatio === null) return;
    setDragRatio(ratioFromEvent(e));
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    if (dragRatio === null) return;
    const r = ratioFromEvent(e);
    onSeek(r * duration);
    setDragRatio(null);
  }

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="group relative h-3 w-full cursor-pointer flex items-center"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={position}
      >
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-white group-hover:bg-accent transition-colors" style={{ width: `${ratio * 100}%` }} />
        </div>
        <div
          className="absolute h-3 w-3 rounded-full bg-white opacity-0 group-hover:opacity-100 -translate-x-1/2 shadow"
          style={{ left: `${ratio * 100}%` }}
        />
      </div>
      {showTime && (
        <div className="flex justify-between text-[11px] text-muted mt-1 tabular-nums">
          <span>{formatDuration(ratio * duration)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      )}
    </div>
  );
}
