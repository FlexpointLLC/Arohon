import type { Metadata } from 'next';
import { findCompare } from '@/lib/compare';
import { COMPARES_BN } from '@/lib/compareBn';
import { CompareRoute } from '@/components/compare/routes';
import { COMPARES } from '@/lib/compare';

export const dynamicParams = false;
export const generateStaticParams = () => COMPARES.map((c) => ({ slug: c.slug }));

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CompareRoute slug={(await params).slug} bn />;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = findCompare(slug);
  const b = COMPARES_BN[slug];
  if (!c || !b) return {};
  return {
    title: { absolute: b.metaTitle },
    description: b.metaDescription,
    alternates: { canonical: `/bn/compare/${slug}`, languages: { 'x-default': `/compare/${slug}`, en: `/compare/${slug}`, bn: `/bn/compare/${slug}` } },
    openGraph: { title: b.metaTitle, description: b.metaDescription, url: `https://arohon.co/bn/compare/${slug}`, images: ['/hero.png'], locale: 'bn_BD' },
  };
}
