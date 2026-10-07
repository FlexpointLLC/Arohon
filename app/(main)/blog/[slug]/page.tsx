import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { toHTML, uriLooksSafe } from '@portabletext/to-html';
import { client, POST_BY_SLUG_QUERY, POST_SLUGS_QUERY, POSTS_QUERY } from '@/lib/sanity';
import { BLOG_URL } from '@/lib/seo';
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
  return {
    metadataBase: new URL(BLOG_URL),
    title: `${post.title} | Blog`,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/${slug}` },
  };
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

  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <PostView post={post} html={html} toc={toc} url={`${BLOG_URL}/${post.slug}`} more={all.filter((p) => p.slug !== post.slug).slice(0, 3)} hrefBase={hrefBase} />
    </main>
  );
}
