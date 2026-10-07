import type { Metadata } from 'next';
import { DriveHero, Commission, WhyDrive, Requirements, DriverJobs, DriverSafety, DriverFaq, DriveCTA } from '@/components/drive/DrivePage';

export const metadata: Metadata = {
  title: 'Drive with Arohon | Just 2% commission',
  description: 'Drive with Arohon for just 2% commission. Go online when you want, keep your cash fares, cash out to bKash and find driver jobs from car owners.',
};

export default function DrivePage() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <DriveHero />
      <Commission />
      <WhyDrive />
      <Requirements />
      <DriverJobs />
      <DriverSafety />
      <DriverFaq />
      <DriveCTA />
    </main>
  );
}
