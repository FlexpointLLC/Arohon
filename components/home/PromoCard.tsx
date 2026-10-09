'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { CAMPAIGNS, isLive } from '@/lib/campaigns';
import { useT } from '@/lib/i18n';
import { fade } from '../motion';

/** Linear-style feature row for the live campaign: image left, story right. Renders nothing when no campaign is live. */
export function PromoCard() {
  const { t, href } = useT();
  const c = CAMPAIGNS.find((x) => isLive(x));
  if (!c) return null;
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Promotion', 'প্রোমোশন')}</p>
          <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
            {t('Ride, share,', 'রাইড নিন, শেয়ার করুন,')}
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">{t('and earn it back.', 'আর আয় করুন।')}</span>
          </h2>
        </div>
        <Link href={href('/promotion')} className="group inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
          {t('All promotions', 'সব প্রোমোশন')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
      <motion.div {...fade(0.1)}>
        <Link href={href(`/promotion/${c.slug}`)} className="group mt-14 grid overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent transition-colors hover:border-black/20 md:grid-cols-[1.2fr_1fr] dark:border-white/10 dark:from-white/[.03] dark:hover:border-white/20">
          <div className="overflow-hidden bg-[#EDEDED]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <p className="text-[13px] text-black/50 dark:text-[#8A8F98]">{t('Live now', 'চলছে এখন')}</p>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
