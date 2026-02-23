import dynamic from 'next/dynamic';
import { HeroSection } from '@/components/HeroSection';
import { TrustedBy } from '@/components/TrustedBy';
import { ServicesSection } from '@/components/ServicesSection';
import { SeoContentSection } from '@/components/SeoContentSection';

const ServicesTabsSection = dynamic(() => import('@/components/ServicesTabsSection').then((m) => m.ServicesTabsSection), {
  ssr: true,
});
const AppDownloadCTA = dynamic(() => import('@/components/AppDownloadCTA').then((m) => m.AppDownloadCTA), {
  ssr: true,
});
const BlogSection = dynamic(() => import('@/components/BlogSection').then((m) => m.BlogSection), {
  ssr: true,
});

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
