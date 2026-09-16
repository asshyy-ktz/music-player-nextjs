/**
 * Synthetic waveform generation.
 *
 * We don't have real audio, so we deterministically synthesize an amplitude
 * array per track using a hash of the track id as a seed. The result is a
 * stable "fingerprint" waveform that looks organic (layered sine waves with
 * a touch of pseudo-random jitter) but is 100% reproducible for a given id.
 */

const BAR_COUNT = 96;

function hashSeed(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

// Simple deterministic pseudo-random generator (mulberry32)
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a deterministic array of normalized amplitudes (0..1) for a
 * given track id. Combines a few sine harmonics with light jitter so bars
 * vary smoothly like a real waveform envelope, plus tapered intro/outro.
 */
export function generateWaveform(trackId: string, barCount: number = BAR_COUNT): number[] {
  const seed = hashSeed(trackId);
  const rand = mulberry32(seed);
  const freqA = 0.08 + rand() * 0.05;
  const freqB = 0.19 + rand() * 0.07;
  const freqC = 0.31 + rand() * 0.11;
  const phase = rand() * Math.PI * 2;

  const bars: number[] = [];
  for (let i = 0; i < barCount; i++) {
    const a = Math.sin(i * freqA + phase);
    const b = Math.sin(i * freqB + phase * 1.5) * 0.6;
    const c = Math.sin(i * freqC + phase * 0.5) * 0.35;
    const jitter = (rand() - 0.5) * 0.25;
    let value = (a + b + c) / 1.95 + jitter;
    value = Math.abs(value);

    // Taper the very start and end so the waveform "breathes in/out"
    const taper = Math.min(i / 6, (barCount - i) / 6, 1);
    value *= Math.max(taper, 0.15);

    bars.push(Math.min(1, Math.max(0.04, value)));
  }
  return bars;
}

/**
 * Given a playback position/duration and a bar count, compute how many bars
 * should be rendered as "active" (already played) for the visualizer.
 */
export function getActiveBarCount(position: number, duration: number, barCount: number = BAR_COUNT): number {
  if (duration <= 0) return 0;
  const ratio = Math.min(Math.max(position / duration, 0), 1);
  return Math.round(ratio * barCount);
}
