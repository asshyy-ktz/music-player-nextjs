import type { Album, Artist, Playlist, Track } from './types';

export const artists: Artist[] = [
  { id: 'art-1', name: 'Neon Horizon', image: 'https://picsum.photos/seed/art-1/400/400', genre: 'Synthwave' },
  { id: 'art-2', name: 'Velvet Static', image: 'https://picsum.photos/seed/art-2/400/400', genre: 'Indie Rock' },
  { id: 'art-3', name: 'Glass Mirage', image: 'https://picsum.photos/seed/art-3/400/400', genre: 'Ambient' },
  { id: 'art-4', name: 'Crimson Tide Collective', image: 'https://picsum.photos/seed/art-4/400/400', genre: 'Hip Hop' },
  { id: 'art-5', name: 'Paper Moons', image: 'https://picsum.photos/seed/art-5/400/400', genre: 'Folk' },
  { id: 'art-6', name: 'Echo Chamber', image: 'https://picsum.photos/seed/art-6/400/400', genre: 'Electronic' },
  { id: 'art-7', name: 'Midnight Atlas', image: 'https://picsum.photos/seed/art-7/400/400', genre: 'Jazz Fusion' },
  { id: 'art-8', name: 'Solar Drift', image: 'https://picsum.photos/seed/art-8/400/400', genre: 'Pop' },
];

export const albums: Album[] = [
  { id: 'alb-1', title: 'Afterglow', artistId: 'art-1', artistName: 'Neon Horizon', cover: 'https://picsum.photos/seed/alb-1/500/500', year: 2021 },
  { id: 'alb-2', title: 'Static Bloom', artistId: 'art-2', artistName: 'Velvet Static', cover: 'https://picsum.photos/seed/alb-2/500/500', year: 2019 },
  { id: 'alb-3', title: 'Vaporline', artistId: 'art-3', artistName: 'Glass Mirage', cover: 'https://picsum.photos/seed/alb-3/500/500', year: 2022 },
  { id: 'alb-4', title: 'Concrete Choir', artistId: 'art-4', artistName: 'Crimson Tide Collective', cover: 'https://picsum.photos/seed/alb-4/500/500', year: 2020 },
  { id: 'alb-5', title: 'Wildwood Letters', artistId: 'art-5', artistName: 'Paper Moons', cover: 'https://picsum.photos/seed/alb-5/500/500', year: 2018 },
  { id: 'alb-6', title: 'Pulse Archive', artistId: 'art-6', artistName: 'Echo Chamber', cover: 'https://picsum.photos/seed/alb-6/500/500', year: 2023 },
  { id: 'alb-7', title: 'Night Ledger', artistId: 'art-7', artistName: 'Midnight Atlas', cover: 'https://picsum.photos/seed/alb-7/500/500', year: 2017 },
  { id: 'alb-8', title: 'Halo Season', artistId: 'art-8', artistName: 'Solar Drift', cover: 'https://picsum.photos/seed/alb-8/500/500', year: 2024 },
];

const trackTitlesByAlbum: Record<string, string[]> = {
  'alb-1': ['Afterglow', 'Neon Rain', 'Drive Slow', 'Halflight', 'Skyline Static'],
  'alb-2': ['Static Bloom', 'Paper Skin', 'Radio Silence', 'Velvet Hour', 'Bruised Light'],
  'alb-3': ['Vaporline', 'Glass City', 'Soft Focus', 'Mirage Coast', 'Low Tide'],
  'alb-4': ['Concrete Choir', 'Corner Store', 'Uptown Echo', 'Brick and Gold', 'Fire Escape'],
  'alb-5': ['Wildwood Letters', 'Copper Fields', 'Harvest Moon', 'Quiet Roads', 'Autumn Ink'],
  'alb-6': ['Pulse Archive', 'Circuit Heart', 'Analog Ghost', 'Voltage Dream', 'Reboot'],
  'alb-7': ['Night Ledger', 'Blue Room', 'Smoke Signal', 'Last Call', 'Brass and Rain'],
  'alb-8': ['Halo Season', 'Golden Hour', 'Satellite', 'Orbit', 'Falling Slow'],
};

const durationsByIndex = [187, 214, 199, 231, 176];

function buildTracksForAlbum(album: Album): Track[] {
  const titles = trackTitlesByAlbum[album.id];
  return titles.map((title, idx) => ({
    id: `${album.id}-trk-${idx + 1}`,
    title,
    artistId: album.artistId,
    artistName: album.artistName,
    albumId: album.id,
    albumTitle: album.title,
    cover: album.cover,
    duration: durationsByIndex[idx],
    trackNumber: idx + 1,
  }));
}

export const tracks: Track[] = albums.flatMap(buildTracksForAlbum);

// Attach synced lyrics to a handful of tracks
const lyricsFor = (title: string): { time: number; text: string }[] => [
  { time: 0, text: `[Intro]` },
  { time: 4, text: `Every corner of this city hums your name` },
  { time: 10, text: `${title}, echoing through the frame` },
  { time: 17, text: `We were lightning, we were young` },
  { time: 24, text: `Words unfinished, songs unsung` },
  { time: 32, text: `[Chorus]` },
  { time: 36, text: `Hold on to the ${title.toLowerCase()} tonight` },
  { time: 43, text: `Turn the dark into the light` },
  { time: 51, text: `Nothing lasts but nothing's lost` },
  { time: 59, text: `We keep moving, count the cost` },
  { time: 68, text: `[Verse 2]` },
  { time: 72, text: `Streetlights flicker, tape decks spin` },
  { time: 80, text: `Let the old year in again` },
  { time: 90, text: `[Outro]` },
  { time: 96, text: `Fading slow, fading out...` },
];

const lyricTrackIds = new Set([
  'alb-1-trk-1',
  'alb-2-trk-1',
  'alb-3-trk-3',
  'alb-6-trk-2',
  'alb-8-trk-1',
]);

for (const t of tracks) {
  if (lyricTrackIds.has(t.id)) {
    t.lyrics = lyricsFor(t.title);
  }
}

export const playlists: Playlist[] = [
  {
    id: 'pl-1',
    name: 'Late Night Drive',
    description: 'Synth-soaked cruising through empty streets.',
    cover: 'https://picsum.photos/seed/pl-1/500/500',
    trackIds: ['alb-1-trk-1', 'alb-1-trk-3', 'alb-6-trk-2', 'alb-3-trk-1', 'alb-8-trk-3', 'alb-7-trk-2'],
  },
  {
    id: 'pl-2',
    name: 'Coffeehouse Mornings',
    description: 'Soft folk and jazz to start the day.',
    cover: 'https://picsum.photos/seed/pl-2/500/500',
    trackIds: ['alb-5-trk-1', 'alb-5-trk-3', 'alb-7-trk-1', 'alb-7-trk-4', 'alb-5-trk-5'],
  },
  {
    id: 'pl-3',
    name: 'Workout Surge',
    description: 'High-energy beats to push through.',
    cover: 'https://picsum.photos/seed/pl-3/500/500',
    trackIds: ['alb-4-trk-1', 'alb-4-trk-2', 'alb-4-trk-3', 'alb-6-trk-1', 'alb-6-trk-4', 'alb-8-trk-2'],
  },
  {
    id: 'pl-4',
    name: 'Rainy Day Static',
    description: 'Indie melancholy for grey afternoons.',
    cover: 'https://picsum.photos/seed/pl-4/500/500',
    trackIds: ['alb-2-trk-1', 'alb-2-trk-2', 'alb-2-trk-4', 'alb-3-trk-4', 'alb-3-trk-5'],
  },
  {
    id: 'pl-5',
    name: 'Golden Hour Pop',
    description: 'Bright, upbeat tracks for sunlit moments.',
    cover: 'https://picsum.photos/seed/pl-5/500/500',
    trackIds: ['alb-8-trk-1', 'alb-8-trk-4', 'alb-8-trk-5', 'alb-1-trk-2', 'alb-6-trk-3'],
  },
];

export function getTrackById(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getAlbumById(id: string): Album | undefined {
  return albums.find((a) => a.id === id);
}

export function getArtistById(id: string): Artist | undefined {
  return artists.find((a) => a.id === id);
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id);
}

export function getTracksForAlbum(albumId: string): Track[] {
  return tracks.filter((t) => t.albumId === albumId).sort((a, b) => a.trackNumber - b.trackNumber);
}

export function getTracksForArtist(artistId: string): Track[] {
  return tracks.filter((t) => t.artistId === artistId);
}

export function getTracksForPlaylist(playlist: Playlist): Track[] {
  return playlist.trackIds
    .map((id) => getTrackById(id))
    .filter((t): t is Track => Boolean(t));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
