# Wavelength — Music Player (Next.js 14)

A fully client-side, mock-data music player built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. There is no real audio and no backend — playback, waveforms, and lyric sync are all simulated, but the UI, state management, and interaction patterns are production-shaped.

## Architecture

- **App Router pages** (`app/`)
  - `layout.tsx` — root layout: desktop sidebar, main content area, persistent bottom mini-player, mobile now-playing sheet, queue panel, and the `PlayerController` (Media Session wiring), all mounted once.
  - `page.tsx` — library browser (Albums / Artists / Playlists / Tracks tabs + search).
  - `playlists/[id]/page.tsx` — playlist detail: drag-to-reorder tracks, remove tracks, add tracks from an inline picker, "Play All".
  - `now-playing/page.tsx` — full desktop now-playing experience: large art, canvas waveform, synced lyrics, up-next queue.
  - `liked/page.tsx` — liked songs, sourced from the persisted `likedStore`.
- **components/** — presentational + interactive UI: `Sidebar`, `MiniPlayer`, `TrackList`/`TrackRow`, `LibraryTabs`, `SearchBar`, `AlbumGrid`/`ArtistGrid`/`PlaylistGrid`, `WaveformVisualizer` (canvas), `LyricsPanel`, `QueuePanel`, `VolumeSlider`, `SeekBar`, `NowPlayingSheet` (mobile sheet), `Providers` (TanStack Query).
- **store/** — Zustand stores:
  - `playerStore.ts` — queue, current index, playback position, volume, shuffle/repeat, and all transport actions, plus the mock playback timer (see below).
  - `likedStore.ts` — liked track ids, persisted to `localStorage` via `zustand/middleware persist`.
  - `uiStore.ts` — UI-only state (mobile now-playing sheet open/closed, queue panel open/closed).
- **lib/** — `types.ts` (domain types), `mockData.ts` (~40 tracks across 8 albums/artists, 5 playlists, synced lyrics on a few tracks), `waveform.ts` (synthetic waveform generation).
- **hooks/useMediaSession.ts** — wires `navigator.mediaSession` metadata + action handlers to the player store, guarded for SSR/unsupported browsers.

## Mock playback timer

There's no `<audio>` element. Instead, `playerStore` runs a `setInterval` (250ms tick) while `isPlaying` is true, advancing `position` by the elapsed time each tick. When `position` reaches the current track's `duration`, the store automatically calls its own `next()` logic (respecting shuffle/repeat) — this is how "auto-advance" works. `WaveformVisualizer` separately runs a `requestAnimationFrame` loop to redraw the canvas every frame, reading the latest `position` straight from the Zustand store (`usePlayerStore.getState()`) so the animation stays smooth independent of the coarser playback tick.

## Synthetic waveform generation

`lib/waveform.ts` hashes a track's id into a numeric seed, then feeds that seed into a small deterministic PRNG (mulberry32) to pick a few sine-wave frequencies/phases. Each bar's amplitude is a blend of three sine harmonics plus light jitter, tapered at the start/end so the waveform "breathes in" and "breathes out" like a real envelope. Because it's seeded from the track id, the same track always renders the same waveform shape — no audio file is ever read or decoded. `getActiveBarCount()` turns the current playback ratio into how many bars should render as "played" (colored) vs "unplayed".

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. No environment variables or backend services are required — everything runs against in-memory mock data (with liked songs persisted to `localStorage`).

## Features

- Library browser with Albums / Artists / Playlists / Tracks tabs and live search filtering per tab.
- Playlist detail page with HTML5 drag-and-drop reordering, per-row remove, an inline "add tracks" picker, and a "Play All" button that loads the playlist into the queue.
- Persistent bottom mini-player: play/pause, skip, draggable/clickable seek bar, volume, and a link/tap-through to the full now-playing view.
- Full-screen Now Playing view with a canvas waveform visualizer driven by `requestAnimationFrame`, synced lyrics highlighting based on position, and an "Up Next" queue list.
- Queue management: up-next list with drag-to-reorder and per-item remove, shuffle and repeat (off/all/one) toggles.
- Liked songs: heart toggle on every track row everywhere in the app, persisted across reloads, with a dedicated `/liked` page.
- Media Session API integration (lock screen / hardware media key support where the browser supports it).
- Responsive layout: mobile shows a bottom mini-player that opens a full-screen sheet; desktop (`md:` and up) shows a persistent left sidebar plus a full-width bottom player bar.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand (with `persist` middleware) · TanStack Query (provider is wired up for future data-fetching; mock data is currently synchronous) · lucide-react icons · native HTML5 drag-and-drop (no external DnD library required at runtime).
