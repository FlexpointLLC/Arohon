import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChallengeDetail } from '@/components/challenges/Challenges';
import { CHALLENGES, challengeBySlug } from '@/lib/challenges';

export const dynamicParams = false;
export const generateStaticParams = () => CHALLENGES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = challengeBySlug((await params).slug);
  if (!c) return {};
  const title = `Submit to ${c.name}: Win GTA 6 | Arohon`;
  return {
    title: { absolute: title },
    description: c.brief.slice(0, 155),
    alternates: { canonical: `/challenges/${c.slug}/submit` },
    openGraph: { title, description: c.tagline, url: `/challenges/${c.slug}/submit`, images: ['/hero.png'] },
    twitter: { card: 'summary_large_image', title, description: c.tagline },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!challengeBySlug(slug)) notFound();
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <ChallengeDetail slug={slug} />
    </main>
  );
}
