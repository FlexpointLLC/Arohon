import type { Metadata } from 'next';
import { ServicesHero, Catalogue, FareExplorer } from '@/components/services/ServicesPage';
import { PayYourWay } from '@/components/ride/RideSections';
import { FinalCTA } from '@/components/home/Sections';

export const metadata: Metadata = {
  title: 'All services | Rides, parcel, rental, food and more',
  description: 'Every Arohon service in one place: bike, CNG and car rides, parcel delivery in 1 hour, rental with driver, food and medicine delivery, ambulance and airport rides across Bangladesh.',
  alternates: { canonical: '/services', languages: { 'x-default': '/services', en: '/services', bn: '/bn/services' } },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <ServicesHero />
      <Catalogue />
      <FareExplorer />
      <PayYourWay />
      <FinalCTA />
    </main>
  );
}
