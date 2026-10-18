import type { Metadata } from 'next';
import { CareersPage } from '@/components/careers/CareersPage';

export const metadata: Metadata = {
  title: { absolute: 'Careers at Arohon | Build how Bangladesh moves' },
  description: 'Join the Arohon team in Dhaka. Engineering, design, operations, marketing and field roles through open applications at career@arohon.co.',
  alternates: { canonical: '/join-our-team', languages: { 'x-default': '/join-our-team', en: '/join-our-team', bn: '/bn/join-our-team' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <CareersPage />
    </main>
  );
}
