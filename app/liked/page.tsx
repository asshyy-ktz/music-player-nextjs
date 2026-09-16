'use client';

import { useMemo } from 'react';
import { Play, Heart } from 'lucide-react';
import { tracks } from '@/lib/mockData';
import { useLikedStore } from '@/store/likedStore';
import { usePlayerStore } from '@/store/playerStore';
import TrackList from '@/components/TrackList';

export default function LikedSongsPage() {
  const likedIds = useLikedStore((s) => s.likedIds);
  const setQueue = usePlayerStore((s) => s.setQueue);

  const likedTracks = useMemo(() => {
    const idSet = new Set(likedIds);
    return tracks.filter((t) => idSet.has(t.id));
  }, [likedIds]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
        <div className="w-40 h-40 md:w-56 md:h-56 rounded-lg bg-gradient-to-br from-accent2 to-accent flex items-center justify-center shrink-0 shadow-2xl">
          <Heart size={64} className="text-white" fill="white" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted">Playlist</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 mb-3">Liked Songs</h1>
          <p className="text-muted text-sm">{likedTracks.length} liked tracks</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setQueue(likedTracks, 0)}
        disabled={likedTracks.length === 0}
        className="flex items-center gap-2 rounded-full bg-accent text-black font-semibold px-6 py-2.5 w-fit hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
      >
        <Play size={18} className="fill-black" />
        Play All
      </button>

      {likedTracks.length === 0 ? (
        <p className="text-muted text-sm py-8">
          Tracks you like will appear here. Tap the heart icon on any track to add it.
        </p>
      ) : (
        <TrackList tracks={likedTracks} />
      )}
    </div>
  );
}
