'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Heart, ListMusic, Disc3 } from 'lucide-react';
import clsx from 'clsx';
import { playlists } from '@/lib/mockData';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/liked', label: 'Liked Songs', icon: Heart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col shrink-0 border-r border-white/5 bg-surface h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <Disc3 className="text-accent" size={28} />
        <span className="text-lg font-bold tracking-tight text-white">Wavelength</span>
      </div>

      <nav className="px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-surface2 text-white' : 'text-muted hover:text-white hover:bg-surface2/60'
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 px-6 flex items-center gap-2 text-muted uppercase text-xs font-semibold tracking-wider">
        <ListMusic size={16} />
        Your Playlists
      </div>

      <div className="mt-2 flex-1 overflow-y-auto px-3 pb-6">
        {playlists.map((pl) => {
          const active = pathname === `/playlists/${pl.id}`;
          return (
            <Link
              key={pl.id}
              href={`/playlists/${pl.id}`}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active ? 'bg-surface2 text-white' : 'text-muted hover:text-white hover:bg-surface2/60'
              )}
            >
              <img src={pl.cover} alt="" className="h-9 w-9 rounded object-cover shrink-0" />
              <span className="truncate">{pl.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-6 py-2 pb-4">
        <Library size={16} className="text-muted" />
        <span className="text-xs text-muted">{playlists.length} playlists</span>
      </div>
    </aside>
  );
}
