'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { LyricLine } from '@/lib/types';

interface LyricsPanelProps {
  lyrics: LyricLine[] | undefined;
  position: number;
  className?: string;
}

function getActiveIndex(lyrics: LyricLine[], position: number): number {
  let active = 0;
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].time <= position) active = i;
    else break;
  }
  return active;
}

export default function LyricsPanel({ lyrics, position, className }: LyricsPanelProps) {
  const activeRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeIndex = lyrics ? getActiveIndex(lyrics, position) : -1;

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className={clsx('flex items-center justify-center text-muted text-sm', className)}>
        Lyrics unavailable for this track.
      </div>
    );
  }

  return (
    <div ref={containerRef} className={clsx('overflow-y-auto space-y-4 py-8 text-center', className)}>
      {lyrics.map((line, i) => (
        <p
          key={`${line.time}-${i}`}
          ref={i === activeIndex ? activeRef : undefined}
          className={clsx(
            'text-lg md:text-xl font-semibold transition-all duration-300',
            i === activeIndex ? 'text-white scale-105' : 'text-muted/60'
          )}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}
