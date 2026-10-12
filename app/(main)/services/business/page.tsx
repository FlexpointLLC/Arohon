import type { Metadata } from 'next';
import { BusinessPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Arohon for Business | E-commerce delivery fleet, logistics and staff transport',
  description: 'A managed delivery fleet for online stores, supershops, pharmacies and electronics brands, plus staff transport for offices and airport pickups for hotels, across Bangladesh.',
  alternates: { canonical: '/services/business', languages: { en: '/services/business', bn: '/bn/services/business' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <BusinessPage />
    </main>
  );
}
