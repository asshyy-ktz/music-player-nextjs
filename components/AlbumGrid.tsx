'use client';

import { Play } from 'lucide-react';
import type { Album } from '@/lib/types';
import { getTracksForAlbum } from '@/lib/mockData';
import { usePlayerStore } from '@/store/playerStore';

export default function AlbumGrid({ albums }: { albums: Album[] }) {
  const setQueue = usePlayerStore((s) => s.setQueue);

  if (albums.length === 0) {
    return <p className="text-muted text-sm py-8">No albums found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {albums.map((album) => (
        <div
          key={album.id}
          className="group relative rounded-lg bg-surface2/40 p-3 hover:bg-surface2 transition-colors cursor-pointer"
          onClick={() => setQueue(getTracksForAlbum(album.id), 0)}
        >
          <div className="relative">
            <img src={album.cover} alt={album.title} className="w-full aspect-square rounded-md object-cover" />
            <button
              type="button"
              className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-black opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-lg"
              aria-label={`Play ${album.title}`}
            >
              <Play size={18} className="ml-0.5" />
            </button>
          </div>
          <p className="mt-3 truncate text-sm font-medium text-white">{album.title}</p>
          <p className="truncate text-xs text-muted">
            {album.artistName} &middot; {album.year}
          </p>
        </div>
      ))}
    </div>
  );
}
