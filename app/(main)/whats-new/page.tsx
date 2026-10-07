import type { Metadata } from 'next';
import { WhatsNewPage } from '@/components/whatsnew/WhatsNewPage';

export const metadata: Metadata = {
  title: "What's new in Arohon | Changelog",
  description: 'New features and improvements across the Arohon rider app, driver app and Arohon Shop: EV bikes, 3D vehicles, daily missions, dark mode and more.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <WhatsNewPage />
    </main>
  );
}
