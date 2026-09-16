'use client';

import clsx from 'clsx';

export type LibraryTab = 'albums' | 'artists' | 'playlists' | 'tracks';

const tabs: { id: LibraryTab; label: string }[] = [
  { id: 'albums', label: 'Albums' },
  { id: 'artists', label: 'Artists' },
  { id: 'playlists', label: 'Playlists' },
  { id: 'tracks', label: 'Tracks' },
];

interface LibraryTabsProps {
  active: LibraryTab;
  onChange: (tab: LibraryTab) => void;
}

export default function LibraryTabs({ active, onChange }: LibraryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            active === tab.id ? 'bg-white text-black' : 'bg-surface2 text-muted hover:text-white'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
