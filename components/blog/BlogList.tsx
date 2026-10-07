'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react';
import type { BlogPost } from '../BlogSection';
import { fade, up } from '../motion';

const muted = 'text-black/50 dark:text-[#8A8F98]';
const ART = ['car', 'cng', 'micro', 'bike', 'hiace'];
const date = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');
const meta = (p: BlogPost) => [date(p.publishedAt), p.readTime != null && `${p.readTime} min read`].filter(Boolean).join(', ');

/** Cover image, or a vehicle line drawing that fills in on hover when a post has none. */
function Cover({ p, i, big }: { p: BlogPost; i: number; big?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-black/10 bg-black/[.03] dark:border-white/10 dark:bg-white/[.03] ${big ? 'aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[360px]' : 'aspect-[16/10]'}`}>
      {p.mainImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${p.mainImage}?w=${big ? 1400 : 900}&auto=format`} alt="" loading={big ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="relative h-[45%] w-[55%]">
            <span aria-hidden className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:opacity-0 dark:bg-white/30" style={{ WebkitMask: `url(/icons/line_${ART[i % ART.length]}.png) center / contain no-repeat`, mask: `url(/icons/line_${ART[i % ART.length]}.png) center / contain no-repeat` }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/icons/${ART[i % ART.length]}.webp`} alt="" className="absolute inset-0 h-full w-full scale-95 object-contain opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
          </span>
        </div>
      )}
    </div>
  );
}

export function BlogList({ posts, hrefBase }: { posts: BlogPost[]; hrefBase: string }) {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? posts.filter((p) => `${p.title} ${p.excerpt ?? ''}`.toLowerCase().includes(s)) : posts;
  }, [q, posts]);
  const [top, ...rest] = list;
  const href = (p: BlogPost) => `${hrefBase}/${p.slug}`;

  return (
    <div className="mx-auto max-w-[1280px] px-6 pb-32 md:px-16">
      <section className="flex flex-wrap items-end justify-between gap-8 pb-14 pt-28 sm:pt-36">
        <div>
          <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>Journal</motion.p>
          <motion.h1 {...up(0.1)} className="mt-4 u-h1">
            Stories
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">from the road.</span>
          </motion.h1>
          <motion.p {...up(0.2)} className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>Ride tips, product news and the people behind Arohon, from Dhaka to every district.</motion.p>
        </div>
        <motion.label {...up(0.3)} className="flex w-full items-center gap-2 rounded-full bg-black/[.05] px-4 py-3 text-[14px] sm:w-72 dark:bg-white/[.07]">
          <MagnifyingGlass size={16} className="shrink-0 text-black/40 dark:text-white/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories" aria-label="Search stories" className="w-full bg-transparent outline-none placeholder:text-black/40 dark:placeholder:text-white/35" />
        </motion.label>
      </section>

      <AnimatePresence mode="wait">
        {!top ? (
          <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`border-t border-black/10 py-20 text-[15px] dark:border-white/10 ${muted}`}>
            {posts.length ? `No stories match “${q}”.` : 'New stories are on the way.'}
          </motion.p>
        ) : (
          <motion.div key={q ? 'search' : 'all'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* featured: the newest story, Linear "Now" lead layout */}
            <motion.a {...fade()} href={href(top)} className="group grid gap-8 border-t border-black/10 pt-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14 dark:border-white/10">
              <Cover p={top} i={0} big />
              <div className="flex flex-col justify-center">
                <p className={`text-[13px] ${muted}`}>{q ? 'Top result' : 'Latest'}</p>
                <h2 className="mt-3 text-[28px] font-medium leading-[1.1] tracking-[-0.02em] transition-colors group-hover:text-black/70 sm:text-[36px] dark:group-hover:text-white/80">{top.title}</h2>
                {top.excerpt && <p className={`mt-4 line-clamp-4 text-[16px] leading-relaxed ${muted}`}>{top.excerpt}</p>}
                <p className="mt-6 text-[13px] text-black/40 dark:text-white/35">{meta(top)}</p>
                <span className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">
                  Read story <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.a>

            {rest.length > 0 && (
              <div className="mt-20 grid gap-x-8 gap-y-14 border-t border-black/10 pt-12 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/10">
                {rest.map((p, i) => (
                  <motion.a key={p._id} {...fade((i % 3) * 0.06)} href={href(p)} className="group block">
                    <Cover p={p} i={i + 1} />
                    <h3 className="mt-5 text-[18px] font-medium leading-snug transition-colors group-hover:text-black/70 dark:group-hover:text-white/80">{p.title}</h3>
                    {p.excerpt && <p className={`mt-2 line-clamp-2 text-[14px] leading-relaxed ${muted}`}>{p.excerpt}</p>}
                    <p className="mt-4 text-[12px] text-black/40 dark:text-white/35">{meta(p)}</p>
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
