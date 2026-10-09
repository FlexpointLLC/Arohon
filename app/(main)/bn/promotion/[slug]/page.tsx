import type { Metadata } from 'next';
import { campaignBySlug } from '@/lib/campaigns';
export { default, generateStaticParams } from '../../../promotion/[slug]/page';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = campaignBySlug((await params).slug);
  if (!c) return {};
  return {
    title: `${c.name[1]} | আরোহন প্রোমোশন`,
    description: c.sub[1],
    alternates: { canonical: `/bn/promotion/${c.slug}`, languages: { en: `/promotion/${c.slug}`, bn: `/bn/promotion/${c.slug}` } },
    openGraph: { images: [c.img] },
  };
}
