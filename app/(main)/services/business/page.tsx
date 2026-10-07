import type { Metadata } from 'next';
import { BusinessPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Arohon for Business | Office commute, team transport and deliveries',
  description: 'Monthly office rides with the same driver, team transport by micro, Hiace or bus, and same-day deliveries for your shop.',
  alternates: { canonical: '/services/business', languages: { en: '/services/business', bn: '/bn/services/business' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <BusinessPage />
    </main>
  );
}
