import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Leaderboard } from '@/components/challenges/Leaderboard';
import { CHALLENGES, challengeBySlug } from '@/lib/challenges';
import { dbReady, listEntries, votedBy, type PublicEntry } from '@/lib/challengeDb';
import { DEMO_ENTRIES } from '@/lib/challengeDemo';

export const dynamic = 'force-dynamic';
export const generateStaticParams = () => CHALLENGES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = challengeBySlug((await params).slug);
  if (!c) return {};
  const title = `${c.name}: Vote and Win GTA 6 | Arohon Challenge`;
  return {
    title: { absolute: title },
    description: `See every project submitted to ${c.name} and vote for the ones you would use. Top two win GTA 6.`,
    alternates: { canonical: `/challenges/${c.slug}` },
    openGraph: { title, url: `/challenges/${c.slug}`, images: ['/hero.png'] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = challengeBySlug(slug);
  if (!c) notFound();
  const voter = (await cookies()).get('ch_voter')?.value;
  let entries: PublicEntry[] = [];
  let mine: string[] = [];
  const demo = !dbReady && process.env.NODE_ENV !== 'production';
  if (demo) entries = DEMO_ENTRIES;
  if (dbReady) {
    try {
      [entries, mine] = await Promise.all([listEntries(slug), voter ? votedBy(voter) : Promise.resolve([])]);
    } catch (e) {
      console.error('leaderboard load failed', e);
    }
  }
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <Leaderboard slug={slug} entries={entries} voted={mine} demo={demo} />
    </main>
  );
}
