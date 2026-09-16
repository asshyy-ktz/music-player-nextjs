'use client';

import { useMediaSession } from '@/hooks/useMediaSession';

/**
 * Invisible client component mounted once near the root that wires up
 * side-effect-only hooks like the Media Session API integration.
 */
export default function PlayerController() {
  useMediaSession();
  return null;
}
