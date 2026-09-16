'use client';

import { useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import { Play, Plus, X } from 'lucide-react';
import { getPlaylistById, getTracksForPlaylist, tracks as allTracks } from '@/lib/mockData';
import type { Track } from '@/lib/types';
import TrackList from '@/components/TrackList';
import SearchBar from '@/components/SearchBar';
import { usePlayerStore } from '@/store/playerStore';

export default function PlaylistDetailPage({ params }: { params: { id: string } }) {
  const playlist = getPlaylistById(params.id);
  if (!playlist) {
    notFound();
  }

  const setQueue = usePlayerStore((s) => s.setQueue);

  const [playlistTracks, setPlaylistTracks] = useState<Track[]>(() => getTracksForPlaylist(playlist!));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');

  const totalDuration = useMemo(() => playlistTracks.reduce((sum, t) => sum + t.duration, 0), [playlistTracks]);

  const availableToAdd = useMemo(() => {
    const inPlaylist = new Set(playlistTracks.map((t) => t.id));
    const q = pickerQuery.trim().toLowerCase();
    return allTracks.filter((t) => {
      if (inPlaylist.has(t.id)) return false;
      if (!q) return true;
      return t.title.toLowerCase().includes(q) || t.artistName.toLowerCase().includes(q);
    });
  }, [playlistTracks, pickerQuery]);

  function handleReorder(fromIndex: number, toIndex: number) {
    setPlaylistTracks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }

  function handleRemove(index: number) {
    setPlaylistTracks((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddTrack(track: Track) {
    setPlaylistTracks((prev) => [...prev, track]);
  }

  function handlePlayAll() {
    setQueue(playlistTracks, 0);
  }

  const totalMinutes = Math.round(totalDuration / 60);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
        <img src={playlist!.cover} alt={playlist!.name} className="w-40 h-40 md:w-56 md:h-56 rounded-lg object-cover shadow-2xl shrink-0" />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted">Playlist</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 mb-3 truncate">{playlist!.name}</h1>
          <p className="text-muted text-sm">{playlist!.description}</p>
          <p className="text-muted text-xs mt-2">
            {playlistTracks.length} tracks &middot; about {totalMinutes} min
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePlayAll}
          disabled={playlistTracks.length === 0}
          className="flex items-center gap-2 rounded-full bg-accent text-black font-semibold px-6 py-2.5 hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
        >
          <Play size={18} className="fill-black" />
          Play All
        </button>
        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-surface2 transition-colors"
        >
          <Plus size={16} />
          Add Tracks
        </button>
      </div>

      {pickerOpen && (
        <div className="rounded-lg border border-white/10 bg-surface2/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white text-sm">Add from your library</h3>
            <button type="button" onClick={() => setPickerOpen(false)} className="text-muted hover:text-white" aria-label="Close picker">
              <X size={16} />
            </button>
          </div>
          <SearchBar value={pickerQuery} onChange={setPickerQuery} placeholder="Search tracks to add..." />
          <div className="mt-3 max-h-64 overflow-y-auto flex flex-col gap-1">
            {availableToAdd.length === 0 && <p className="text-xs text-muted py-3">No matching tracks.</p>}
            {availableToAdd.slice(0, 25).map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => handleAddTrack(track)}
                className="flex items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-surface2 transition-colors"
              >
                <img src={track.cover} alt="" className="h-9 w-9 rounded object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{track.title}</p>
                  <p className="truncate text-xs text-muted">{track.artistName}</p>
                </div>
                <Plus size={16} className="text-accent shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      <TrackList tracks={playlistTracks} draggable onReorder={handleReorder} onRemove={handleRemove} />
    </div>
  );
}
