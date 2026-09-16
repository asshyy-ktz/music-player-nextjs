'use client';

import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { usePlayerStore } from '@/store/playerStore';

export default function VolumeSlider({ className }: { className?: string }) {
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  const Icon = volume === 0 ? VolumeX : volume < 0.33 ? Volume : volume < 0.66 ? Volume1 : Volume2;

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setVolume(volume === 0 ? 0.75 : 0)}
        className="text-muted hover:text-white transition-colors"
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
      >
        <Icon size={18} />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 accent-accent h-1 cursor-pointer"
        aria-label="Volume"
      />
    </div>
  );
}
