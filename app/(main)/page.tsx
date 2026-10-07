import { client, POSTS_QUERY } from '@/lib/sanity';
import { Hero } from '@/components/home/Hero';
import { Explore, Travel, LifeMoments, Work } from '@/components/home/Explore';
import { FleetScroll } from '@/components/home/FleetScroll';
import { BikeSection, EvSection } from '@/components/home/FeatureSections';
import { Journeys } from '@/components/home/Journeys';
import { Stats, SafetyStory, Coverage, Rewards, Drive, Faq, FinalCTA } from '@/components/home/Sections';
import { BlogSection } from '@/components/BlogSection';

export const revalidate = 60; // Revalidate so new blog posts appear on homepage

export const metadata = {
  title: 'Arohon | Book a Ride in Bangladesh, Dhaka, Sylhet, 64 Districts',
  description:
    'Book a ride, plan your journey, or plan your trip in Bangladesh. Arohon ride sharing: Dhaka, Sylhet, 64 districts. Safe, affordable rides. One tap to ride.',
};

export default async function Home() {
  const posts = await client.fetch<Array<{
    _id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: string | null;
    mainImage: string | null;
    readTime: number | null;
  }>>(POSTS_QUERY);
  const latestPosts = posts.slice(0, 3);

  return (
    <main className="min-h-screen">
      <Hero />
      <Explore />
      <BikeSection />
      <Travel />
      <EvSection />
      <LifeMoments />
      <Work />
      <FleetScroll />
      <Stats />
      <Journeys />
      <SafetyStory />
      <Coverage />
      <Rewards />
      <Drive />
      <BlogSection posts={latestPosts} />
      <Faq />
      <FinalCTA />
    </main>
  );
}
