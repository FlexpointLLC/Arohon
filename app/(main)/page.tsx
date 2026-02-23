import { AppDownloadCTA } from '@/components/AppDownloadCTA';
import { BlogSection } from '@/components/BlogSection';
import { HeroSection } from '@/components/HeroSection';
import { SeoContentSection } from '@/components/SeoContentSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ServicesTabsSection } from '@/components/ServicesTabsSection';
import { TrustedBy } from '@/components/TrustedBy';

export const metadata = {
  title: 'Arohon | Book a Ride in Bangladesh – Dhaka, Sylhet, 64 Districts',
  description:
    'Book a ride, plan your journey, or plan your trip in Bangladesh. Arohon ride sharing: Dhaka, Sylhet, 64 districts. Safe, affordable rides. One tap to ride.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrustedBy />
      <ServicesSection />
      <SeoContentSection />
      <ServicesTabsSection />
      <AppDownloadCTA />
      <BlogSection />
    </main>
  );
}
