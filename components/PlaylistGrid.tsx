'use client';

import Link from 'next/link';
import { Play } from 'lucide-react';
import type { Playlist } from '@/lib/types';
import { getTracksForPlaylist } from '@/lib/mockData';
import { usePlayerStore } from '@/store/playerStore';

export default function PlaylistGrid({ playlists }: { playlists: Playlist[] }) {
  const setQueue = usePlayerStore((s) => s.setQueue);

  if (playlists.length === 0) {
    return <p className="text-muted text-sm py-8">No playlists found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {playlists.map((pl) => (
        <Link
          key={pl.id}
          href={`/playlists/${pl.id}`}
          className="group relative rounded-lg bg-surface2/40 p-3 hover:bg-surface2 transition-colors block"
        >
          <div className="relative">
            <img src={pl.cover} alt={pl.name} className="w-full aspect-square rounded-md object-cover" />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setQueue(getTracksForPlaylist(pl), 0);
              }}
              className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg"
              aria-label={`Play ${pl.name}`}
            >
              <Play size={18} className="ml-0.5" />
            </button>
          </div>
          <p className="mt-3 truncate text-sm font-medium text-white">{pl.name}</p>
          <p className="truncate text-xs text-muted">{pl.description}</p>
        </Link>
      ))}
    </div>
  );
}
