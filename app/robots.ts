import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host') ?? '';
  const blog = host.includes('blogs.');
  return {
    rules: { userAgent: '*', allow: '/', disallow: blog ? [] : ['/track/', '/studio', '/api/'] },
    sitemap: blog ? 'https://blogs.arohon.co/sitemap.xml' : 'https://arohon.co/sitemap.xml',
    host: blog ? 'https://blogs.arohon.co' : 'https://arohon.co',
  };
}
