'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { BLOG_URL } from '@/lib/seo';
import { ease, fade } from './motion';
import { useT, bnDigits } from '@/lib/i18n';

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  mainImage: string | null;
  readTime: number | null;
};

function formatDate(dateStr: string | null, bn = false) {
  if (!dateStr) return '';
  if (bn) return bnDigits(new Date(dateStr).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric', numberingSystem: 'latn' }));
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// posts without a cover get one of the vehicle line drawings instead of an empty box
const FALLBACK_ART = ['car', 'cng', 'micro'];

// Linear "Now" pattern: title left, small link right, three borderless posts with cover, title, excerpt, meta
export function BlogSection({ posts }: { posts: BlogPost[] }) {
  const { t, n, bn } = useT();
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div
        {...fade()}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Journal', 'জার্নাল')}</p>
          <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">{t('Stories from the road', 'পথের গল্প')}</h2>
        </div>
        <a href={BLOG_URL} className="group inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
          {t('View all', 'সব দেখুন')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </motion.div>

      {posts.length === 0 ? (
        <p className="mt-14 text-[15px] text-black/50 dark:text-[#8A8F98]">{t('New stories are on the way.', 'নতুন গল্প আসছে শিগগিরই।')}</p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const art = FALLBACK_ART[i % FALLBACK_ART.length];
            return (
              <motion.a
                key={post._id}
                href={`${BLOG_URL}/${post.slug}`}
                {...fade(i * 0.08)}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-black/10 bg-black/[.03] dark:border-white/10 dark:bg-white/[.03]">
                  {post.mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${post.mainImage}?w=900&auto=format`} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div
                        aria-hidden
                        className="h-[45%] w-[55%] bg-black/30 transition-colors duration-500 group-hover:bg-black/50 dark:bg-white/30 dark:group-hover:bg-white/50"
                        style={{ WebkitMask: `url(/icons/line_${art}.png) center / contain no-repeat`, mask: `url(/icons/line_${art}.png) center / contain no-repeat` }}
                      />
                    </div>
                  )}
                </div>
                <h3 className="mt-5 text-[17px] font-medium leading-snug transition-colors group-hover:text-black/70 dark:group-hover:text-white/80">{post.title}</h3>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{post.excerpt}</p>}
                <p className="mt-4 text-[12px] text-black/40 dark:text-white/35">
                  {[formatDate(post.publishedAt, bn), post.readTime != null && t(`${post.readTime} min read`, `${n(post.readTime)} মিনিটে পড়ুন`)].filter(Boolean).join(', ')}
                </p>
              </motion.a>
            );
          })}
        </div>
      )}
    </section>
  );
}
