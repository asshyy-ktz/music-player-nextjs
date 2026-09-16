export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  cover: string;
  year: number;
}

export interface LyricLine {
  time: number; // seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  cover: string;
  duration: number; // seconds
  trackNumber: number;
  lyrics?: LyricLine[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  trackIds: string[];
}

export type RepeatMode = 'off' | 'all' | 'one';
