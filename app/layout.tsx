import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Sidebar from '@/components/Sidebar';
import MiniPlayer from '@/components/MiniPlayer';
import QueuePanel from '@/components/QueuePanel';
import NowPlayingSheet from '@/components/NowPlayingSheet';
import PlayerController from '@/components/PlayerController';

export const metadata: Metadata = {
  title: 'Wavelength — Music Player',
  description: 'A synthetic music player built with Next.js, TypeScript, and Tailwind CSS.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white antialiased">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 min-w-0 flex flex-col">
              <main className="flex-1 pb-40 md:pb-28 px-4 md:px-8 pt-6 max-w-[1600px] w-full mx-auto">{children}</main>
            </div>
          </div>
          <MiniPlayer />
          <QueuePanel />
          <NowPlayingSheet />
          <PlayerController />
        </Providers>
      </body>
    </html>
  );
}
