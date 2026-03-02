import type { Metadata } from 'next';
import Link from 'next/link';
import { client, POSTS_QUERY } from '@/lib/sanity';
import { BLOG_URL, SITE_URL } from '@/lib/seo';
import { CaretRight, Article } from '@phosphor-icons/react/ssr';

const BRAND_GREEN = '#016b42';

export const revalidate = 60; // Revalidate every 60 seconds to show new posts

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_URL),
  title: 'Blog | Ride Tips & Updates',
  description: 'Tips, updates, and stories about riding safer and smarter across Bangladesh. Arohon blog.',
  alternates: { canonical: '/' },
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default async function BlogPage() {
  const posts = await client.fetch<Array<{
    _id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: string | null;
    mainImage: string | null;
    readTime: number | null;
  }>>(POSTS_QUERY);

  return (
    <main className="min-h-screen">
      <div
        className="flex flex-col items-center px-4 py-16 sm:px-6 sm:py-20"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <div className="w-full max-w-6xl">
          {/* Header - matches homepage BlogSection exactly */}
          <div className="mx-auto mb-12 w-full max-w-[990px]">
            <h1
              className="font-semibold tracking-tight text-gray-900 text-3xl sm:text-4xl lg:text-[48px]"
              style={{ lineHeight: '100%', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            >
              From our <span style={{ color: BRAND_GREEN, fontWeight: 800, fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', letterSpacing: '1px' }}>blog</span>
            </h1>
            <p className="mt-1 max-w-[600px] text-base leading-relaxed text-gray-600">
              Tips, updates, and stories about riding safer and smarter across Bangladesh.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="mt-12 text-gray-500">No posts yet. Add posts in the Sanity Studio at /studio.</p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-lg"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${BRAND_GREEN}15` }}
                  >
                    <Article size={24} style={{ color: BRAND_GREEN }} weight="fill" />
                  </div>
                  <h2 className="font-semibold text-gray-900 transition-colors group-hover:text-[#016b42]" style={{ fontSize: '18px' }}>
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(post.publishedAt)}</span>
                    {post.readTime != null && <span>{post.readTime} min read</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12">
            <a
              href={SITE_URL}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
            >
              Back to home
              <CaretRight size={18} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
