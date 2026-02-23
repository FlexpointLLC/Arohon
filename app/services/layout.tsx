import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services - Arohon',
  description: 'Explore Arohon services: city rides, intercity, rentals, pickup, ambulance, and more.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
