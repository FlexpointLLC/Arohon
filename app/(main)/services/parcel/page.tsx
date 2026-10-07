import type { Metadata } from 'next';
import { ParcelPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Parcel delivery | Within 1 hour to nationwide',
  description: 'Send parcels across Dhaka within an hour or to any district in 1 to 3 days. Up to 8 kg, tracked to the door.',
  alternates: { canonical: '/services/parcel', languages: { en: '/services/parcel', bn: '/bn/services/parcel' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <ParcelPage />
    </main>
  );
}
