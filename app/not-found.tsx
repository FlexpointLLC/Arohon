'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { up } from '@/components/motion';
import DHAKA from '@/lib/dhakaDots.json';
import { useT } from '@/lib/i18n';

const MAP = DHAKA as unknown as { w: number; h: number; thanas: Record<string, [number, number][]>; centers: Record<string, [number, number]> };
const DOTS = Object.fromEntries(Object.entries(MAP.thanas).map(([k, pts]) => [k, pts.map(([x, y]) => `M${x} ${y}h0`).join('')]));
const FROM = MAP.centers.Tejgaon;
const END: [number, number] = [MAP.w + 4, 120]; // off the edge of the city, where no page lives
const ROUTE = `M${FROM[0]} ${FROM[1]} C ${FROM[0] + 60} ${FROM[1] - 10}, 230 250, 290 230 S ${END[0] - 30} ${END[1] + 60}, ${END[0]} ${END[1]}`;

const muted = 'text-black/50 dark:text-[#8A8F98]';
const PLACES = [
  ['Home', 'হোম', '/'],
  ['Book a ride', 'রাইড বুক করুন', '/ride'],
  ['All services', 'সব সার্ভিস', '/services'],
  ['Drive with Arohon', 'আরোহনে গাড়ি চালান', '/driver'],
  ['Help and contact', 'সাহায্য ও যোগাযোগ', '/contact'],
];

/** 404: a route leaves Tejgaon and ends off the map, then "rerouting" offers real pages. */
export default function NotFound() {
  const path = usePathname();
  const { t, n, href } = useT();
  const [rerouted, setRerouted] = useState(false);
  useEffect(() => {
    // follow the visitor's light or dark setting, this page sits outside the themed layout
    try {
      const t = localStorage.getItem('theme');
      document.documentElement.classList.toggle('dark', t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {}
    const id = setTimeout(() => setRerouted(true), 2200);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#FDFDFD] px-6 py-10 text-black dark:bg-black dark:text-white">
      <Link href={href('/')} aria-label={t('Arohon home', 'আরোহন হোম')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt={t('Arohon', 'আরোহন')} className="h-7 w-auto dark:[filter:brightness(0)_invert(1)]" />
      </Link>

      <div className="grid w-full max-w-[1000px] flex-1 items-center gap-12 py-12 md:grid-cols-[1fr_1fr] md:gap-16">
        <div>
          <motion.p {...up(0.05)} className={`font-mono text-[13px] ${muted}`}>{n(404)}</motion.p>
          <motion.h1 {...up(0.1)} className="mt-3 text-[44px] font-medium leading-[1.03] tracking-[-0.025em] sm:text-[60px]">
            {t('Wrong turn.', 'ভুল মোড়।')}
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">{t('This road ends here.', 'এই রাস্তা এখানেই শেষ।')}</span>
          </motion.h1>
          <motion.p {...up(0.2)} className={`mt-6 max-w-sm text-[17px] leading-relaxed ${muted}`}>
            {t('We couldn’t find ', '')}<span className="break-all font-mono text-[14px] text-black/70 dark:text-white/70">{path}</span>{t('. The page may have moved, or the link may be old.', ' পেজটি খুঁজে পাইনি। হয়তো সরে গেছে, অথবা লিংকটা পুরনো।')}
          </motion.p>

          <motion.div {...up(0.3)} className="mt-10">
            <div className="flex items-center gap-2 text-[13px]">
              <span className={`h-2 w-2 rounded-full ${rerouted ? 'bg-[#079A70]' : 'animate-pulse bg-[#FF9500]'}`} />
              <span className="relative h-5 w-40 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(rerouted)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute inset-0 font-medium">
                    {rerouted ? t('New routes found', 'নতুন রুট পাওয়া গেছে') : t('Rerouting…', 'রুট বদলানো হচ্ছে…')}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
            <ul className="mt-4 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
              {PLACES.map(([label, labelBn, to], i) => (
                <motion.li key={to} initial={{ opacity: 0, x: -8 }} animate={rerouted ? { opacity: 1, x: 0 } : { opacity: 0.25, x: 0 }} transition={{ duration: 0.4, delay: rerouted ? i * 0.07 : 0 }}>
                  <Link href={href(to)} className="group flex items-center justify-between py-3.5 text-[15px]">
                    {t(label, labelBn)}
                    <ArrowRight size={14} className="text-black/30 transition-transform group-hover:translate-x-1 group-hover:text-black dark:text-white/30 dark:group-hover:text-white" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* dotted Dhaka, the same map language as the rest of the site: a route draws out of Tejgaon and ends nowhere */}
        <motion.div {...up(0.25)} className="mx-auto w-full max-w-[380px]">
          <svg viewBox={`-10 -10 ${MAP.w + 20} ${MAP.h + 20}`} className="w-full overflow-visible" aria-hidden>
            {Object.entries(DOTS).map(([k, d]) => (
              <path key={k} d={d} strokeWidth="5" strokeLinecap="round" className="stroke-black/15 dark:stroke-white/15" />
            ))}
            <path d={ROUTE} pathLength={1} fill="none" strokeWidth="3" strokeLinecap="round" className="nf-route stroke-black dark:stroke-white" />
            {/* start: the rider, square marker */}
            <g transform={`translate(${FROM[0]} ${FROM[1]})`}>
              <rect x="-9" y="-9" width="18" height="18" rx="4" className="fill-black dark:fill-white" />
              <rect x="-3" y="-3" width="6" height="6" rx="1" className="fill-white dark:fill-black" />
            </g>
            {/* end: a destination that doesn't exist */}
            <g transform={`translate(${END[0]} ${END[1]})`} className="nf-end">
              <circle r="10" className="nf-ping fill-none stroke-[#FF3B30]" strokeWidth="2" />
              <circle r="10" fill="#FF3B30" />
              <circle r="3.5" fill="#fff" />
              <text x="0" y="-22" textAnchor="middle" fontSize="14" fontWeight="600" className="fill-[#FF3B30] font-mono">{n(404)}</text>
            </g>
          </svg>
        </motion.div>
      </div>
    </main>
  );
}
