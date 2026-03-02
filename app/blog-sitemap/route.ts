import { client, POST_SLUGS_QUERY } from '@/lib/sanity';
import { BLOG_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const slugs = await client.fetch<Array<{ slug: string }>>(POST_SLUGS_QUERY);
  const urls = [
    { loc: `${BLOG_URL}/`, lastmod: new Date().toISOString().slice(0, 10), priority: '1.0', changefreq: 'weekly' as const },
    ...slugs.map(({ slug }) => ({
      loc: `${BLOG_URL}/${slug}`,
      lastmod: new Date().toISOString().slice(0, 10),
      priority: '0.8',
      changefreq: 'monthly' as const,
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
