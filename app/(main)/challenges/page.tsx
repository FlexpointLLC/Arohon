import type { Metadata } from 'next';
import { ChallengeHub } from '@/components/challenges/Challenges';

export const metadata: Metadata = {
  title: 'Challenges: Build, Ship, Win',
  description: 'Open build challenges for developers and designers in Bangladesh. Ship an app, site or prototype, send the link and repo, and win prizes like GTA 6.',
  alternates: { canonical: '/challenges' },
  openGraph: { title: 'Arohon Challenges: Build, Ship, Win', url: '/challenges', images: ['/hero.png'] },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <ChallengeHub />
    </main>
  );
}
