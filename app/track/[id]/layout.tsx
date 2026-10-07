import type { Metadata } from 'next';

// shared ride links are personal, keep them out of search results
export const metadata: Metadata = {
  title: 'Shared ride | Arohon',
  description: 'Someone shared their Arohon ride with you. Open it in the Arohon app to follow it live.',
  robots: { index: false, follow: false },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
