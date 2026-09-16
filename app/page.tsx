'use client';

import { useMemo, useState } from 'react';
import LibraryTabs, { type LibraryTab } from '@/components/LibraryTabs';
import SearchBar from '@/components/SearchBar';
import AlbumGrid from '@/components/AlbumGrid';
import ArtistGrid from '@/components/ArtistGrid';
import PlaylistGrid from '@/components/PlaylistGrid';
import TrackList from '@/components/TrackList';
import { albums, artists, playlists, tracks } from '@/lib/mockData';

export default function HomePage() {
  const [tab, setTab] = useState<LibraryTab>('albums');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { albums, artists, playlists, tracks };
    return {
      albums: albums.filter((a) => a.title.toLowerCase().includes(q) || a.artistName.toLowerCase().includes(q)),
      artists: artists.filter((a) => a.name.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q)),
      playlists: playlists.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
      tracks: tracks.filter((t) => t.title.toLowerCase().includes(q) || t.artistName.toLowerCase().includes(q)),
    };
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Your Library</h1>
          <p className="text-muted text-sm mt-1">Browse albums, artists, playlists, and tracks.</p>
        </div>
        <SearchBar value={query} onChange={setQuery} placeholder={`Search ${tab}...`} />
      </div>

      <LibraryTabs active={tab} onChange={setTab} />

      <div className="pb-4">
        {tab === 'albums' && <AlbumGrid albums={filtered.albums} />}
        {tab === 'artists' && <ArtistGrid artists={filtered.artists} />}
        {tab === 'playlists' && <PlaylistGrid playlists={filtered.playlists} />}
        {tab === 'tracks' && <TrackList tracks={filtered.tracks} />}
      </div>
    </div>
  );
}
