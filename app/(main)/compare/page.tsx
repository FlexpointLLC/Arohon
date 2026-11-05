import type { Metadata } from 'next';
import { CompareHubRoute } from '@/components/compare/routes';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Best Ride Sharing Apps in Bangladesh Compared (2026)' },
  description: 'Arohon vs Uber, Pathao, inDrive, Obhai and Garibook: driver commission, upfront fares, bike, CNG, parcel and food. Find the cheapest ride app in Bangladesh.',
  alternates: { canonical: '/compare', languages: { 'x-default': '/compare', en: '/compare', bn: '/bn/compare' } },
  openGraph: { title: 'Best Ride Sharing Apps in Bangladesh Compared (2026)', description: 'Driver commission, fares and services of every ride app in Bangladesh, side by side.', url: `${SITE_URL}/compare`, images: ['/hero.png'] },
};

export default function Page() {
  return <CompareHubRoute />;
}
