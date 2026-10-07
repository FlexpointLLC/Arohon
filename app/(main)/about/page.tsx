import type { Metadata } from 'next';
import { AboutPage } from '@/components/about/AboutPage';

export const metadata: Metadata = {
  title: 'About Arohon | Moving Bangladesh, fairly',
  description: 'Arohon is a Bangladeshi ride and delivery app with a flat 2% driver commission, upfront fares and checked drivers. Read a letter from our founder, Ashik Prottoy.',
  alternates: { canonical: '/about', languages: { en: '/about', bn: '/bn/about' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <AboutPage />
    </main>
  );
}
