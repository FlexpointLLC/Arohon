import type { Metadata } from 'next';
import { PartnersPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Partners | Grow with Arohon',
  description: 'Sell food and medicine on Arohon, earn ৳60 for every driver you sign up as an Arohon Captain, or find a checked driver for your car.',
  alternates: { canonical: '/partners', languages: { en: '/partners', bn: '/bn/partners' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <PartnersPage />
    </main>
  );
}
