import type { Metadata } from 'next';
import { FoodPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Food delivery | Food and medicine to your door',
  description: 'Order from restaurants and pharmacies near you in the Arohon app and follow it to your door.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <FoodPage />
    </main>
  );
}
