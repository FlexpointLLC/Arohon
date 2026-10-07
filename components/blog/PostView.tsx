'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, FacebookLogo, LinkSimple, LinkedinLogo, WhatsappLogo } from '@phosphor-icons/react';
import type { BlogPost } from '../BlogSection';
import { StoreBadges } from '../StoreButtons';
import { fade, up } from '../motion';

const muted = 'text-black/50 dark:text-[#8A8F98]';
const date = (d: string | null) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');

function Share({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const btn = 'flex h-9 w-9 items-center justify-center rounded-full bg-black/[.05] text-black/60 transition-colors hover:bg-black/[.1] hover:text-black dark:bg-white/[.07] dark:text-white/60 dark:hover:bg-white/[.12] dark:hover:text-white';
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="Copy link" className={btn} onClick={() => { navigator.clipboard?.writeText(url).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
        {copied ? <Check size={15} weight="bold" className="text-[#079A70]" /> : <LinkSimple size={15} />}
      </button>
      <a aria-label="Share on WhatsApp" className={btn} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}><WhatsappLogo size={15} /></a>
      <a aria-label="Share on Facebook" className={btn} target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}><FacebookLogo size={15} /></a>
      <a aria-label="Share on LinkedIn" className={btn} target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}><LinkedinLogo size={15} /></a>
    </div>
  );
}

/** Contents list that follows the heading you are reading. */
function Contents({ toc }: { toc: { id: string; text: string }[] }) {
  const [active, setActive] = useState(toc[0]?.id);
  useEffect(() => {
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-20% 0px -70% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);
  return (
    <nav aria-label="Contents" className="space-y-2.5 text-[13px]">
      <p className={muted}>On this page</p>
      {toc.map((t) => (
        <a key={t.id} href={`#${t.id}`} className={`block border-l-2 py-0.5 pl-3 leading-snug transition-colors ${active === t.id ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-black/45 hover:text-black dark:text-white/40 dark:hover:text-white'}`}>
          {t.text}
        </a>
      ))}
    </nav>
  );
}

export function PostView({ post, html, toc, url, more, hrefBase }: { post: BlogPost; html: string; toc: { id: string; text: string }[]; url: string; more: BlogPost[]; hrefBase: string }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <>
      {/* reading progress, under the nav bar */}
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[#079A70]" />

      <div className="mx-auto max-w-[1180px] px-6 pb-24 pt-28 sm:pt-32 md:px-16">
        <motion.a {...up(0)} href={hrefBase || '/'} className={`group inline-flex items-center gap-1.5 text-[14px] ${muted} hover:text-black dark:hover:text-white`}>
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" /> Journal
        </motion.a>

        <header className="mx-auto mt-10 max-w-[720px]">
          <motion.p {...up(0.05)} className={`text-[14px] ${muted}`}>
            {[date(post.publishedAt), post.readTime != null && `${post.readTime} min read`].filter(Boolean).join(', ')}
          </motion.p>
          <motion.h1 {...up(0.1)} className="mt-4 text-[36px] font-medium leading-[1.08] tracking-[-0.025em] sm:text-[52px]">{post.title}</motion.h1>
          {post.excerpt && <motion.p {...up(0.2)} className={`mt-6 text-[19px] leading-relaxed ${muted}`}>{post.excerpt}</motion.p>}
          <motion.div {...up(0.3)} className="mt-8 flex items-center justify-between gap-4 border-y border-black/10 py-4 dark:border-white/10">
            <span className="text-[14px] font-medium">By the Arohon team</span>
            <Share url={url} title={post.title} />
          </motion.div>
        </header>

        {post.mainImage && (
          <motion.div {...up(0.35)} className="mx-auto mt-12 max-w-[960px] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${post.mainImage}?w=1920&auto=format`} alt="" className="w-full" />
          </motion.div>
        )}

        <div className="relative mt-14 xl:grid xl:grid-cols-[1fr_720px_1fr] xl:gap-12">
          <div />
          <motion.div {...fade()} className="blog-content mx-auto max-w-[720px]" dangerouslySetInnerHTML={{ __html: html }} />
          {toc.length > 1 && (
            <aside className="hidden xl:block">
              <div className="sticky top-32">
                <Contents toc={toc} />
              </div>
            </aside>
          )}
        </div>

        <div className="mx-auto mt-16 flex max-w-[720px] items-center justify-between gap-4 border-t border-black/10 pt-6 dark:border-white/10">
          <span className={`text-[14px] ${muted}`}>Share this story</span>
          <Share url={url} title={post.title} />
        </div>

        <motion.div {...fade()} className="mx-auto mt-16 flex max-w-[720px] flex-col items-start gap-6 rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent p-8 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:from-white/[.03]">
          <div>
            <p className="text-[20px] font-medium tracking-tight">Ride with Arohon</p>
            <p className={`mt-1 text-[14px] ${muted}`}>Fair fares, checked drivers, every district.</p>
          </div>
          <StoreBadges />
        </motion.div>
      </div>

      {more.length > 0 && (
        <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 md:px-16 dark:border-white/10">
          <motion.p {...fade()} className="text-[13px] font-medium">More stories</motion.p>
          <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p, i) => (
              <motion.a key={p._id} {...fade(i * 0.06)} href={`${hrefBase}/${p.slug}`} className="group block">
                <h3 className="text-[18px] font-medium leading-snug transition-colors group-hover:text-black/70 dark:group-hover:text-white/80">{p.title}</h3>
                {p.excerpt && <p className={`mt-2 line-clamp-2 text-[14px] leading-relaxed ${muted}`}>{p.excerpt}</p>}
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium">Read <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" /></span>
              </motion.a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
