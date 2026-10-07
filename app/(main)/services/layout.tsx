import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ride Services | Book Journey, Trip & Travel in Bangladesh',
  description: 'Every way to move in Bangladesh: bike, CNG, car, micro, Hiace, intercity, airport, pickup, parcel, ambulance and hourly rental, with upfront fares.',
  alternates: { canonical: '/services', languages: { en: '/services', bn: '/bn/services' } },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
