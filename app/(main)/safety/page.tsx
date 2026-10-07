import type { Metadata } from 'next';
import { SafetyPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Safety | Safe from pickup to drop off',
  description: 'Checked drivers, trips your family can follow, one tap SOS and ratings on every ride. How Arohon keeps riders and drivers safe.',
  alternates: { canonical: '/safety', languages: { en: '/safety', bn: '/bn/safety' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <SafetyPage />
    </main>
  );
}
