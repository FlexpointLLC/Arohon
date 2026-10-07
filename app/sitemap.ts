import { MetadataRoute } from 'next';

const BASE_URL = 'https://arohon.co';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/contact',
    '/drive',
    '/ride',
    '/safety',
    '/cities',
    '/terms-parcel',
    '/terms-food',
    '/terms-rental',
    '/terms-rewards',
    '/terms-merchants',
    '/community-guidelines',
    '/join-our-team',
    '/partners',
    '/privacy',
    '/terms',
    '/terms-customers',
    '/terms-promo-code',
    '/terms-return-refund',
    '/services',
    '/services/ambulance',
    '/services/airport',
    '/services/payment',
    '/whats-new',
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route || '/'}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
