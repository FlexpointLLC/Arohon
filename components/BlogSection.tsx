'use client';

import { motion } from 'framer-motion';
import { CaretRight, Article } from '@phosphor-icons/react';
import { BLOG_URL } from '@/lib/seo';
import { appearTransition, appearViewport, fadeUpVariants } from './AnimateIn';

const BRAND_GREEN = '#016b42';

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  mainImage: string | null;
  readTime: number | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}


export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <motion.section
      className="relative flex flex-col items-center px-4 py-16 sm:px-6 sm:py-24 md:py-[100px] lg:py-[150px]"
      initial="initial"
      whileInView="animate"
      viewport={appearViewport}
      transition={appearTransition}
      variants={fadeUpVariants}
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-12 w-full max-w-[990px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
          <h2
            className="font-semibold tracking-tight text-gray-900 text-3xl sm:text-4xl lg:text-[48px]"
            style={{ lineHeight: '100%' }}
          >
            From our <span style={{ color: BRAND_GREEN, fontWeight: 800, fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', letterSpacing: '1px' }}>blog</span>
          </h2>
          <p className="mt-1 max-w-[600px] text-base leading-relaxed text-gray-600">
            Tips, updates, and stories about riding safer and smarter across Bangladesh.
          </p>
        </div>

        {/* Post cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No posts yet. Add posts in the Sanity Studio.</p>
          ) : (
            posts.map((post) => (
              <a
                key={post._id}
                href={`${BLOG_URL}/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-lg"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${BRAND_GREEN}15` }}
                >
                  <Article size={24} style={{ color: BRAND_GREEN }} weight="fill" />
                </div>
                <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-[#016b42]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '18px' }}>
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(post.publishedAt)}</span>
                  {post.readTime != null && <span>{post.readTime} min read</span>}
                </div>
              </a>
            ))
          )}
        </div>

        {/* View all link */}
        <div className="mt-12 flex justify-center">
          <a
            href={BLOG_URL}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 sm:w-auto"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            View all ride tips and updates
            <CaretRight size={18} weight="bold" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
