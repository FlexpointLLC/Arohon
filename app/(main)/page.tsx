import { AppDownloadCTA } from '@/components/AppDownloadCTA';
import { BlogSection } from '@/components/BlogSection';
import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ServicesTabsSection } from '@/components/ServicesTabsSection';
import { TrustedBy } from '@/components/TrustedBy';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrustedBy />
      <ServicesSection />
      <ServicesTabsSection />
      <AppDownloadCTA />
      <BlogSection />
    </main>
  );
}
