'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, User } from '@phosphor-icons/react';
import { FLEET } from '@/lib/fleet';
import { ease, fade } from '../motion';
import { useT } from '@/lib/i18n';

const FLEET_BN: Record<string, { name: string; copy: string; best: string }> = {
  bike: { name: 'বাইক', copy: 'নিরাপদ, দ্রুত, সাশ্রয়ী। শহরের সবচেয়ে কম ভাড়ায় পেরিয়ে যান রাশ আওয়ার।', best: 'একা যাতায়াতে' },
  cng: { name: 'সিএনজি', copy: 'রোজকার তিন চাকা, আগাম ভাড়া, লাইভ ট্র্যাকিং, কোনো দরদাম নেই।', best: 'কাছের দূরত্বে' },
  car: { name: 'কার', copy: 'প্রতিটি রাইড নিরাপদ আর প্রিমিয়াম। রোজকার চলাচলে এসি সেডান।', best: 'রোজকার আরামে' },
  carplus: { name: 'কার প্লাস', copy: 'মিটিং আর এয়ারপোর্টের জন্য এক্সিকিউটিভ সেডান আর টপ রেটেড ড্রাইভার।', best: 'বিজনেস ও এয়ারপোর্ট' },
  micro: { name: 'মাইক্রো', copy: 'লাগেজের জায়গাসহ আরামের গ্রুপ রাইড। আন্তঃজেলা ভ্রমণের জন্য তৈরি।', best: 'পরিবার ও আন্তঃজেলা' },
  hiace: { name: 'হায়েস', copy: 'অফিস ট্রিপ, বিয়ে আর ট্যুর, এক বুকিংয়ে ১২ জন পর্যন্ত।', best: 'ট্যুর ও অনুষ্ঠান' },
  ambulance: { name: 'অ্যাম্বুলেন্স', copy: 'জরুরি চিকিৎসা পরিবহন, যেকোনো সময়, একই অ্যাপ থেকে।', best: 'জরুরি প্রয়োজনে' },
  pickup: { name: 'পিকআপ', copy: 'বাসা বদল, দোকানের মাল, আসবাব। সাইজ বাছুন, ট্রাক নিয়ে আসছি আমরা।', best: 'মালামাল ও শিফটিং' },
};

// Uber-style "ways to ride" carousel: native scroll-snap, arrows just nudge the scroller.
export function FleetScroll() {
  const { t, n, href } = useT();
  const track = useRef<HTMLDivElement>(null);
  const nudge = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section id="fleet" className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6 px-6 md:px-16">
        <div>
          <h2 className="u-h2">{t('Eight ways to move', 'চলার আট উপায়')}</h2>
          <p className="mt-3 max-w-md text-black/60 dark:text-[#AFAFAF]">{t('From a quick bike hop to a 12 seat Hiace, pick the ride that fits. Every fare is upfront.', 'ছোট্ট বাইক রাইড থেকে ১২ সিটের হায়েস, বেছে নিন যেটা মানানসই। সব ভাড়া আগেই জানা।')}</p>
        </div>
        <div className="flex gap-2">
          {[[-1, ArrowLeft, t('Previous', 'আগের')], [1, ArrowRight, t('Next', 'পরের')]].map(([d, Icon, label]) => {
            const I = Icon as typeof ArrowLeft;
            return (
              <button key={label as string} type="button" aria-label={label as string} onClick={() => nudge(d as number)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[.06] text-black transition-colors hover:bg-black/[.12] dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                <I size={18} weight="bold" />
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={track}
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] md:px-16 xl:px-[calc((100vw_-_1280px)/2_+_64px)] xl:scroll-px-[calc((100vw_-_1280px)/2_+_64px)] scroll-px-6 md:scroll-px-16 [&::-webkit-scrollbar]:hidden"
      >
        {FLEET.map((v, i) => (
          <motion.div
            key={v.id}
            {...fade(Math.min(i, 4) * 0.06)}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((min(100vw,1280px)_-_128px_-_48px)/4)]"
          >
            <Link href={href('/ride')} className="group flex h-full flex-col rounded-3xl bg-[#F3F3F1] p-6 transition-colors hover:bg-[#EAEAE7] dark:bg-[#141414] dark:hover:bg-[#1E1E1E]">
              <div className="flex aspect-[4/3] items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt={t(`Arohon ${v.name}`, `আরোহন ${FLEET_BN[v.id]?.name ?? v.bn}`)} loading="lazy" className="max-h-[78%] w-[78%] object-contain transition-transform duration-500 ease-out group-hover:-translate-x-2" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xl font-bold tracking-tight">{t(v.name, FLEET_BN[v.id]?.name ?? v.bn)}</p>
                {v.seats !== 'N/A' && (
                  <span className="flex items-center gap-1 rounded-full bg-black/[.06] px-2.5 py-1 text-[12px] font-semibold dark:bg-white/10">
                    <User size={12} weight="fill" />
                    {n(v.seats)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-black/60 dark:text-[#AFAFAF]">{t(v.copy, FLEET_BN[v.id]?.copy ?? v.copy)}</p>
              <p className="mt-auto flex items-center gap-1 pt-5 text-sm font-semibold">
                {t(v.best, FLEET_BN[v.id]?.best ?? v.best)}
                <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
