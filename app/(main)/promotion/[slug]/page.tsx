import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CAMPAIGNS, campaignBySlug } from '@/lib/campaigns';
import { PromotionDetail } from '@/components/promotion/Promotion';

export function generateStaticParams() {
  return CAMPAIGNS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = campaignBySlug((await params).slug);
  if (!c) return {};
  return {
    title: `${c.name[0]} | Arohon promotion`,
    description: c.sub[0],
    alternates: { canonical: `/promotion/${c.slug}`, languages: { en: `/promotion/${c.slug}`, bn: `/bn/promotion/${c.slug}` } },
    openGraph: { images: [c.img] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!campaignBySlug(slug)) notFound();
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <PromotionDetail slug={slug} />
    </main>
  );
}
