import { notFound } from 'next/navigation';
import { ComparePage, CompareHub } from './ComparePage';
import { COMPARES, HUB_FAQS, findCompare } from '@/lib/compare';
import { COMPARES_BN, HUB_FAQS_BN } from '@/lib/compareBn';
import { SITE_URL } from '@/lib/seo';

const ldFor = (bn?: boolean) => [
  { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Ride sharing apps compared with Arohon', itemListElement: COMPARES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, url: `${SITE_URL}/compare/${c.slug}` })) },
  { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: bn ? 'bn' : 'en', mainEntity: (bn ? HUB_FAQS_BN : HUB_FAQS).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Arohon', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}/compare` }] },
];

export function CompareRoute({ slug, bn }: { slug: string; bn?: boolean }) {
  const c = findCompare(slug);
  if (!c) notFound();
  const faqs = bn ? COMPARES_BN[slug]?.faqs ?? c.faqs : c.faqs;
  const base = bn ? `${SITE_URL}/bn` : SITE_URL;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: bn ? 'bn' : 'en', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Arohon', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Compare', item: `${base}/compare` },
        { '@type': 'ListItem', position: 3, name: c.label, item: `${base}/compare/${c.slug}` },
      ],
    },
  ];
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <ComparePage c={c} />
    </main>
  );
}

export function CompareHubRoute({ bn }: { bn?: boolean }) {
  const ld = ldFor(bn);
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <CompareHub />
    </main>
  );
}
