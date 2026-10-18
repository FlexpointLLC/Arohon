import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toHTML, uriLooksSafe } from '@portabletext/to-html';
import { client, POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, POSTS_QUERY } from '@/lib/sanity';
import { BLOG_URL, SITE_URL } from '@/lib/seo';
import { PostView } from '@/components/blog/PostView';
import type { BlogPost } from '@/components/BlogSection';

const portableTextComponents = {
  marks: {
    link: ({ value, children }: { value?: { href?: string }; children?: string }) => {
      const href = value?.href ?? '#';
      const safe = typeof href === 'string' && uriLooksSafe(href);
      const external = safe && (href.startsWith('http://') || href.startsWith('https://'));
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return safe ? `<a href="${href}" class="font-medium"${attrs}>${children ?? ''}</a>` : (children ?? '');
    },
  },
};

export const revalidate = 60; // Revalidate every 60 seconds to show new posts

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  _updatedAt?: string;
  publishedAt: string | null;
  body: object[] | null;
  mainImage: string | null;
  readTime: number | null;
};

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(POST_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });
  if (!post) return { title: 'Post not found' };
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  const url = `${BLOG_URL}/${slug}`;
  const images = [{ url: post.mainImage || `${SITE_URL}/hero.png`, width: 1200, height: 630, alt: post.title }];
  return {
    metadataBase: new URL(BLOG_URL),
    title: { absolute: `${title} | Arohon Blog` },
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, siteName: 'Arohon Blog', title, description, images, publishedTime: post.publishedAt ?? undefined, modifiedTime: post._updatedAt, authors: ['Arohon'] },
    twitter: { card: 'summary_large_image', site: '@Arohonride', title, description, images: images.map((i) => i.url) },
  };
}

type Block = { _type: string; style?: string; children?: { text: string }[] };
const text = (b: Block) => (b.children ?? []).map((c) => c.text).join('').trim();

// FAQ section (h2 "FAQ" or "Frequently asked questions") as question and answer pairs, for FAQPage data
function faqs(body: Block[]) {
  const out: { q: string; a: string }[] = [];
  let on = false;
  for (const b of body) {
    if (b._type !== 'block') continue;
    if (b.style === 'h2') { on = /faq|frequently asked/i.test(text(b)); continue; }
    if (!on) continue;
    const t = text(b);
    if (b.style === 'h3' || t.endsWith('?')) out.push({ q: t, a: '' });
    else if (/^\S.*\?\n/.test(t)) { const i = t.indexOf('?\n'); out.push({ q: t.slice(0, i + 1), a: t.slice(i + 2).trim() }); }
    else if (out.length) out[out.length - 1].a = `${out[out.length - 1].a} ${t}`.trim();
  }
  return out.filter((f) => f.q && f.a);
}

const slugify = (t: string) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug }), client.fetch<BlogPost[]>(POSTS_QUERY)]);
  if (!post) notFound();

  // give every h2 an id so the contents list can link to it
  const toc: { id: string; text: string }[] = [];
  const raw = post.body?.length ? toHTML(post.body as import('@portabletext/types').TypedObject[], { components: portableTextComponents }) : '';
  const html = raw.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const id = slugify(inner) || `section-${toc.length + 1}`;
    toc.push({ id, text: inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"') });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  const hrefBase = process.env.NODE_ENV === 'development' ? '/blog' : '';

  const url = `${BLOG_URL}/${post.slug}`;
  const qa = faqs((post.body ?? []) as Block[]);
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription || post.excerpt,
      image: post.mainImage || `${SITE_URL}/hero.png`,
      datePublished: post.publishedAt,
      dateModified: post._updatedAt || post.publishedAt,
      mainEntityOfPage: url,
      inLanguage: 'en',
      author: { '@type': 'Organization', name: 'Arohon', url: SITE_URL },
      publisher: { '@type': 'Organization', name: 'Arohon', logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` } },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Arohon', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BLOG_URL}/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    ...(qa.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qa.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : []),
  ];

  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
      <PostView post={post} html={html} toc={toc} url={`${BLOG_URL}/${post.slug}`} more={all.filter((p) => p.slug !== post.slug).slice(0, 3)} hrefBase={hrefBase} />
    </main>
  );
}
