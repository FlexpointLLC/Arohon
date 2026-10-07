import type { Metadata } from 'next';
import { AmbulancePage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Ambulance | Book an ambulance any hour',
  description: "Book an ambulance from the Arohon app any hour. Pick the hospital, add stretcher or oxygen, and nearby ambulances send you offers.",
  alternates: { canonical: '/services/ambulance', languages: { en: '/services/ambulance', bn: '/bn/services/ambulance' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <AmbulancePage />
    </main>
  );
}
