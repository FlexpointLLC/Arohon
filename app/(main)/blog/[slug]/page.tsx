import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { toHTML } from '@portabletext/to-html';
import { client, POST_BY_SLUG_QUERY, POST_SLUGS_QUERY } from '@/lib/sanity';
import { BLOG_URL } from '@/lib/seo';
import { CaretRight } from '@phosphor-icons/react/ssr';

const BRAND_GREEN = '#016b42';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_BY_SLUG_QUERY, { slug });
  if (!post) notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-3 sm:mx-4 md:mx-6">
        <article
          className="mx-auto max-w-[736px] px-4 py-16 sm:px-6 sm:py-20"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <CaretRight size={18} weight="bold" className="rotate-180" />
          Back to blog
        </Link>

        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          {post.readTime != null && <span>{post.readTime} min read</span>}
        </div>

        {post.excerpt && (
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            {post.excerpt}
          </p>
        )}

        {post.body && post.body.length > 0 ? (
          <div
            className="prose prose-gray mt-10 max-w-none prose-p:leading-relaxed prose-headings:font-semibold"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: toHTML(post.body as import('@portabletext/types').TypedObject[]) }}
          />
        ) : null}
        </article>
      </div>
    </main>
  );
}
