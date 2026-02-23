import { MetadataRoute } from 'next';

const BASE_URL = 'https://arohon.co';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/contact',
    '/drive',
    '/ride',
    '/join-our-team',
    '/partners',
    '/privacy',
    '/terms',
    '/terms-customers',
    '/terms-promo-code',
    '/terms-return-refund',
    '/services',
    '/services/daily',
    '/services/go-anywhere',
    '/services/payment',
    '/services/ride-more',
    '/whats-new',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route || '/'}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
