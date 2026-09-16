'use client';

import type { Artist } from '@/lib/types';
import { getTracksForArtist } from '@/lib/mockData';
import { usePlayerStore } from '@/store/playerStore';

export default function ArtistGrid({ artists }: { artists: Artist[] }) {
  const setQueue = usePlayerStore((s) => s.setQueue);

  if (artists.length === 0) {
    return <p className="text-muted text-sm py-8">No artists found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="group flex flex-col items-center text-center rounded-lg p-3 hover:bg-surface2 transition-colors cursor-pointer"
          onClick={() => setQueue(getTracksForArtist(artist.id), 0)}
        >
          <img src={artist.image} alt={artist.name} className="w-full aspect-square rounded-full object-cover" />
          <p className="mt-3 truncate text-sm font-medium text-white w-full">{artist.name}</p>
          <p className="truncate text-xs text-muted w-full">{artist.genre}</p>
        </div>
      ))}
    </div>
  );
}
