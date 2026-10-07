import type { Metadata } from 'next';
import { RentalPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Rental | Car and driver by the hour, week or month',
  description: 'Rent a car, micro, Hiace or bus with a driver by the hour, week or month. Post your request and drivers bid.',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <RentalPage />
    </main>
  );
}
