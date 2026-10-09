'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, MapPin } from '@phosphor-icons/react';
import { USER_APP_URL } from '@/lib/app-links';
import { StoreBadges } from '../StoreButtons';
import { ease, up } from '../motion';
import { CityMap, useTripProgress } from './CityMap';
import { RIDES, RideStack } from './RideStack';
import { CometBorder } from './CometBorder';
import { useT } from '@/lib/i18n';
import { CAMPAIGNS, isLive } from '@/lib/campaigns';
import Link from 'next/link';


export function Hero() {
  const { t, href } = useT();
  const { progress, restart } = useTripProgress(16);
  const [active, setActive] = useState(0);
  const last = useRef(0);
  // when a trip finishes (progress wraps back to 0), the next ride in the stack takes over
  useMotionValueEvent(progress, 'change', (v) => {
    if (v < 0.05 && last.current > 0.95) setActive((a) => (a + 1) % RIDES.length);
    last.current = v;
  });
  const select = (i: number) => {
    setActive(i);
    last.current = 0;
    restart();
  };
  const ride = RIDES[active];
  const promo = CAMPAIGNS.find((c) => isLive(c));

  return (
    <section className="relative overflow-hidden bg-[#FDFDFD] pt-28 dark:bg-black sm:pt-32">
      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-16">
        <motion.p {...up(0.1)} className="flex items-center gap-2 text-base font-medium text-black dark:text-white">
          <MapPin size={18} weight="fill" />
          {t('Dhaka, BD', 'ঢাকা, বাংলাদেশ')}
        </motion.p>
        {/* the announcement pill belongs to the headline, so it sits right on top of it */}
        {/* Linear-style announcement pill for the live campaign, gone when nothing is running */}
        {promo && (
          <motion.div {...up(0.15)} className="mt-6">
            <Link href={href(`/promotion/${promo.slug}`)} className="group relative inline-flex rounded-full">
              <CometBorder />
              <span className="inline-flex items-center gap-2 rounded-full py-[5px] pl-[5px] pr-[13px] text-[13px] text-black/70 transition-colors group-hover:text-black dark:text-[#D0D6E0] dark:group-hover:text-white">
                <span className="rounded-full bg-black px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-white dark:text-black">{t('New', 'নতুন')}</span>
                {t(promo.name[0], promo.name[1])}
                <ArrowRight size={12} className="text-black/40 transition-transform group-hover:translate-x-0.5 dark:text-white/40" />
              </span>
            </Link>
          </motion.div>
        )}
        <motion.h1 {...up(0.2)} className={`${promo ? 'mt-3' : 'mt-6'} u-h1 text-black dark:text-white`}>
          {t('Go anywhere,', 'যেখানে খুশি যান,')}
          <br />
          {t('ride the way you want', 'যেভাবে খুশি চলুন')}
        </motion.h1>
        <motion.p {...up(0.35)} className="mt-6 max-w-xl text-base leading-relaxed text-black/55 dark:text-[#AFAFAF]">
          {t('Book a bike, CNG, car or micro in minutes and get there safely and affordably, across Dhaka and all of Bangladesh.', 'মিনিটেই বুক করুন বাইক, সিএনজি, কার বা মাইক্রো। ঢাকাসহ সারা বাংলাদেশে পৌঁছে যান নিরাপদে, সাশ্রয়ে।')}
        </motion.p>
        <motion.div {...up(0.5)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={USER_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-7 py-4 sm:w-auto text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,.6)] dark:bg-white dark:text-black"
          >
            {t('Request a ride', 'রাইড নিন')}
            <ArrowRight weight="bold" className="transition-transform group-hover:translate-x-1" />
          </a>
          <a href={href('/driver')} className="w-full rounded-full bg-black/[.05] px-6 py-4 text-center sm:w-auto dark:bg-white/10 text-[15px] font-semibold text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:hover:bg-white/10 dark:text-[#AFAFAF] dark:hover:text-white">
            {t('Become a driver', 'ড্রাইভার হোন')}
          </a>
        </motion.div>
        <motion.div {...up(0.6)}>
          <StoreBadges className="mt-6" />
        </motion.div>

        {/* Stack of active rides; the front card's vehicle and destination drive the map */}
        {/* stretches to the hero copy: card top = location line, card bottom = buttons */}
        <div className="absolute inset-y-0 right-6 hidden md:right-16 lg:block">
          <motion.div className="h-full" {...up(1.2)}>
            <RideStack active={active} progress={progress} onSelect={select} />
          </motion.div>
        </div>
      </div>

      <motion.div {...up(0.4)} className="relative -mt-6 sm:-mt-10">
        <CityMap progress={progress} riderV={ride.v} dest={t(ride.dest, ride.destBn)} />

      </motion.div>
    </section>
  );
}
