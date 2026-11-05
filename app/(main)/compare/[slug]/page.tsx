import type { Metadata } from 'next';
import { CompareRoute } from '@/components/compare/routes';
import { COMPARES, findCompare } from '@/lib/compare';
import { SITE_URL } from '@/lib/seo';

export const dynamicParams = false;
export const generateStaticParams = () => COMPARES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = findCompare((await params).slug);
  if (!c) return {};
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDescription,
    alternates: { canonical: `/compare/${c.slug}`, languages: { 'x-default': `/compare/${c.slug}`, en: `/compare/${c.slug}`, bn: `/bn/compare/${c.slug}` } },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url: `${SITE_URL}/compare/${c.slug}`, images: ["/hero.png"] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CompareRoute slug={(await params).slug} />;
}
