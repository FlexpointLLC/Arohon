import { ServicesHero, Catalogue, FareExplorer } from '@/components/services/ServicesPage';
import { PayYourWay } from '@/components/ride/RideSections';
import { FinalCTA } from '@/components/home/Sections';

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
