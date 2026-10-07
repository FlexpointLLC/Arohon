import type { Metadata } from 'next';
import { RideIntro } from '@/components/ride/RideIntro';
import { Reserve } from '@/components/ride/Reserve';
import { Referral, FareBreakdown, AirportBoard, TourShare, PayYourWay } from '@/components/ride/RideSections';
import { FleetScroll } from '@/components/home/FleetScroll';
import { Coverage, SafetyStory, Faq, FinalCTA } from '@/components/home/Sections';

export const metadata: Metadata = {
  title: 'Book a Ride | City, Intercity & Airport Rides in Bangladesh',
  description: 'Book a bike, CNG, car, micro or Hiace in Bangladesh. Upfront fares, verified drivers and live tracking across all 64 districts.',
};

export default function RidePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <RideIntro />
      <FareBreakdown />
      <Referral />
      <Reserve />
      <FleetScroll />
      <AirportBoard />
      <TourShare />
      <PayYourWay />
      <Coverage />
      <SafetyStory />
      <Faq />
      <FinalCTA />
    </main>
  );
}
