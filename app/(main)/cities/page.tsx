import type { Metadata } from 'next';
import { CitiesPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Cities | Arohon across Bangladesh',
  description: 'Arohon drivers have joined from every division of Bangladesh, from Dhaka and Chattogram to Sylhet, Rangpur and Barishal. See where we are so far.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <CitiesPage />
    </main>
  );
}
