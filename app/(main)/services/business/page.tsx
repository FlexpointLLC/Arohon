import type { Metadata } from 'next';
import { BusinessPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: { absolute: 'Arohon for Business | E-commerce Delivery and Logistics' },
  description: 'Delivery fleet for online stores, supershops, pharmacies and electronics brands, plus staff transport for offices and airport pickups for hotels in Bangladesh.',
  alternates: { canonical: '/services/business', languages: { 'x-default': '/services/business', en: '/services/business', bn: '/bn/services/business' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <BusinessPage />
    </main>
  );
}
