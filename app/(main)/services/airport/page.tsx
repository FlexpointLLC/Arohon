import type { Metadata } from 'next';
import { AirportPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Airport rides | Book ahead for 8 airports',
  description: "Book your airport ride ahead for Dhaka, Chattogram, Sylhet, Cox's Bazar and four more airports. Drivers send offers, you choose.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <AirportPage />
    </main>
  );
}
