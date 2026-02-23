import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ride Services | Book Journey, Trip & Travel in Bangladesh',
  description: 'Book a ride for your journey or trip. City ride, intercity travel, hourly rental, ambulance, pickup. Plan your travel across Bangladesh with Arohon.',
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
