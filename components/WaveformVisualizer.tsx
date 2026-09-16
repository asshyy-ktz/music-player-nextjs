'use client';

import { useEffect, useRef } from 'react';
import { generateWaveform } from '@/lib/waveform';
import { usePlayerStore } from '@/store/playerStore';

interface WaveformVisualizerProps {
  trackId: string;
  duration: number;
  className?: string;
  barColorActive?: string;
  barColorInactive?: string;
}

export default function WaveformVisualizer({
  trackId,
  duration,
  className,
  barColorActive = '#1db954',
  barColorInactive = 'rgba(255,255,255,0.18)',
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveformRef = useRef<number[]>(generateWaveform(trackId));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    waveformRef.current = generateWaveform(trackId);
  }, [trackId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function draw() {
      const canvasEl = canvasRef.current;
      if (!canvasEl || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvasEl.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);

      if (canvasEl.width !== width * dpr || canvasEl.height !== height * dpr) {
        canvasEl.width = width * dpr;
        canvasEl.height = height * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const bars = waveformRef.current;
      const position = usePlayerStore.getState().position;
      const isCurrent = usePlayerStore.getState().currentTrack()?.id === trackId;
      const activeRatio = isCurrent && duration > 0 ? Math.min(position / duration, 1) : 0;
      const activeCount = Math.round(activeRatio * bars.length);

      const gap = 2;
      const barWidth = width / bars.length - gap;

      bars.forEach((amp, i) => {
        const barHeight = Math.max(amp * height, 2);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;
        ctx.fillStyle = i < activeCount ? barColorActive : barColorInactive;
        const radius = Math.min(2, barWidth / 2);
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x, y, Math.max(barWidth, 1), barHeight, radius);
        } else {
          ctx.rect(x, y, Math.max(barWidth, 1), barHeight);
        }
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [trackId, duration, barColorActive, barColorInactive]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
