'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'framer-motion';
import { up } from './motion';

const muted = 'text-black/50 dark:text-[#8A8F98]';
// labels kept exactly as before the redesign; the first three sit under "Terms of Service"
const DOCS: { href: string; label: string; group?: boolean; svc?: boolean }[] = [
  { href: '/terms', label: 'Arohon Rides', group: true },
  { href: '/terms-customers', label: 'Customers', group: true },
  { href: '/terms-promo-code', label: 'Promo Code', group: true },
  { href: '/terms-parcel', label: 'Parcel Policy', svc: true },
  { href: '/terms-food', label: 'Food and Medicine Orders', svc: true },
  { href: '/terms-rental', label: 'Rental Policy', svc: true },
  { href: '/terms-rewards', label: 'Rewards and Missions', svc: true },
  { href: '/terms-merchants', label: 'Merchant Terms', svc: true },
  { href: '/community-guidelines', label: 'Community Guidelines' },
  { href: '/terms-return-refund', label: 'Return and Refund Policy' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/delete-account', label: 'Account Deletion' },
];
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** One document layout for every policy: policy list left, the document centre, an "On this page" list right that follows your reading. */
export function LegalPageLayout({ children, title, lastUpdated, heroTitle = 'Terms and Policies', heroSubtitle = 'Please read these terms carefully.' }: { children: React.ReactNode; title: string; lastUpdated?: string; heroTitle?: string; heroSubtitle?: string }) {
  const pathname = usePathname();
  const doc = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  // the policies are hand written JSX, so read their section headings from the page and give each an id
  useEffect(() => {
    const hs = Array.from(doc.current?.querySelectorAll('section > h2') ?? []) as HTMLElement[];
    const used = new Set<string>();
    const items = hs.map((h, i) => {
      let id = slug(h.textContent || '') || `section-${i + 1}`;
      while (used.has(id)) id += '-2';
      used.add(id);
      h.id = id;
      return { id, text: (h.textContent || '').trim() };
    });
    setToc(items);
    setActive(items[0]?.id ?? '');
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-15% 0px -75% 0px' });
    hs.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <motion.div aria-hidden style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[#079A70]" />

      <div className="mx-auto max-w-[1280px] px-6 pb-32 pt-28 sm:pt-36 md:px-16">
        <header className="max-w-3xl">
          <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{heroTitle}</motion.p>
          <motion.h1 {...up(0.1)} className="mt-4 text-[40px] font-medium leading-[1.05] tracking-[-0.025em] sm:text-[56px]">{title}</motion.h1>
          <motion.p {...up(0.2)} className={`mt-5 text-[16px] ${muted}`}>{heroSubtitle}</motion.p>
          {lastUpdated && <motion.p {...up(0.25)} className={`mt-2 text-[14px] ${muted}`}>Last updated: {lastUpdated}</motion.p>}
        </header>

        <div className="mt-14 border-t border-black/10 pt-12 lg:grid lg:grid-cols-[220px_1fr] lg:gap-14 xl:grid-cols-[220px_1fr_200px] dark:border-white/10">
          {/* policy list: chips on phones, a sticky list on desktop */}
          <nav aria-label="Policies" className="-mx-6 mb-10 flex gap-2 overflow-x-auto px-6 pb-1 lg:sticky lg:top-32 lg:mx-0 lg:mb-0 lg:block lg:space-y-1 lg:self-start lg:overflow-visible lg:px-0">
            <p className={`hidden text-[12px] lg:mb-3 lg:block ${muted}`}>Terms and Policies</p>
            {DOCS.map((d, i) => {
              const on = pathname === d.href;
              return (
                <div key={d.href} className="contents lg:block">
                  {i === 0 && <p className="hidden px-3 pb-1 pt-1 text-[13px] font-medium lg:block">Terms of Service</p>}
                  {d.svc && !DOCS[i - 1]?.svc && <p className="hidden px-3 pb-1 pt-4 text-[13px] font-medium lg:block">Service Policies</p>}
                <Link href={d.href} aria-current={on ? 'page' : undefined} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] transition-colors lg:block lg:whitespace-normal lg:rounded-lg lg:px-3 ${on ? 'bg-black text-white lg:bg-black/[.05] lg:font-medium lg:text-black dark:bg-white dark:text-black dark:lg:bg-white/[.08] dark:lg:text-white' : 'bg-black/[.05] text-black/60 hover:text-black lg:bg-transparent dark:bg-white/[.07] dark:text-white/55 dark:hover:text-white dark:lg:bg-transparent'}`}>
                  <span className="lg:hidden">{d.group ? `Terms of Service: ${d.label}` : d.label}</span>
                  <span className={`hidden lg:inline ${d.group || d.svc ? 'lg:pl-3' : ''}`}>{d.label}</span>
                </Link>
                </div>
              );
            })}
          </nav>

          <motion.article {...up(0.25)} ref={doc} className="legal min-w-0 max-w-[720px] space-y-12">
            {children}
          </motion.article>

          {toc.length > 1 && (
            <aside className="hidden xl:block">
              <nav aria-label="On this page" className="sticky top-32 space-y-2 text-[13px]">
                <p className={muted}>On this page</p>
                {toc.map((t) => (
                  <a key={t.id} href={`#${t.id}`} className={`block border-l-2 py-0.5 pl-3 leading-snug transition-colors ${active === t.id ? 'border-black text-black dark:border-white dark:text-white' : 'border-transparent text-black/45 hover:text-black dark:text-white/40 dark:hover:text-white'}`}>
                    {t.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
