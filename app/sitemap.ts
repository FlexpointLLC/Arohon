import { MetadataRoute } from 'next';
import { BN_PATHS } from '@/lib/langPaths';
import { CAMPAIGNS } from '@/lib/campaigns';

const BASE_URL = 'https://arohon.co';
const LEGAL = ['/privacy', '/terms', '/terms-customers', '/terms-promo-code', '/terms-return-refund', '/terms-parcel', '/terms-food', '/terms-rental', '/terms-rewards', '/terms-merchants', '/community-guidelines'];

const url = (p: string) => BASE_URL + (p === '/' ? '' : p);

export default function sitemap(): MetadataRoute.Sitemap {
  const paired = [...BN_PATHS, ...CAMPAIGNS.map((c) => `/promotion/${c.slug}`)];
  const withBn = paired.flatMap((p) => {
    const languages = { en: url(p), bn: url(p === '/' ? '/bn' : `/bn${p}`), 'x-default': url(p) };
    const priority = p === '/' ? 1 : p.split('/').length > 2 ? 0.8 : 0.9;
    return [
      { url: languages.en, changeFrequency: 'weekly' as const, priority, alternates: { languages } },
      { url: languages.bn, changeFrequency: 'weekly' as const, priority, alternates: { languages } },
    ];
  });
  return [...withBn, ...LEGAL.map((p) => ({ url: url(p), changeFrequency: 'yearly' as const, priority: 0.3 }))];
}
