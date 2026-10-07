'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Lightning, Clock, MapPin } from '@phosphor-icons/react';
import { ease, fade } from '../motion';

type Row = { title: string; meta: string; tag: string };
type Feature = {
  title: [string, string];
  copy: string;
  href: string;
  art: string;
  img: string;
  panel: string;
  metas: string[];
  links: string[];
};

// Linear feature-section pattern: title left, copy right, one big product panel, then a "Features" link row.
const SECTIONS: Feature[] = [
  {
    title: ['Bike rides', 'through the jam'],
    copy: 'Dhaka traffic, solved on two wheels. The fastest pickup and the lowest fare in the city, with a helmet for every rider.',
    href: '/ride',
    art: '/icons/line_bike.png',
    img: '/icons/bike.webp',
    panel: 'Live in your area',
    metas: ['Helmet included', 'Fastest route', 'Parcel on board'],
    links: ['Helmet for every rider', 'Lowest city fare', 'Parcel by bike', 'Live trip sharing'],
  },
  {
    title: ['Electric rides', 'quiet and clean'],
    copy: 'Zero tailpipe, zero noise. Book an electric bike for short city hops and leave the smoke behind.',
    href: '/ride',
    art: '/icons/line_ev_bike.png',
    img: '/icons/ev_bike.webp',
    panel: 'Your EV trips',
    metas: ['Zero emissions', 'Silent ride', 'Battery full'],
    links: ['Zero emissions', 'Silent ride', 'Short city hops', 'Same upfront fares'],
  },
];

const TAG_ICON = { Matched: Lightning, 'On the way': Clock, Completed: MapPin } as const;

export const BikeSection = () => <FeatureSection s={SECTIONS[0]} />;
export const EvSection = () => <FeatureSection s={SECTIONS[1]} />;

// ponytail: fake "live" feed, shuffled on every page load from real Dhaka areas
const AREAS = ['Dhanmondi 27', 'Gulshan 1', 'Gulshan 2', 'Banani', 'Mirpur 10', 'Mirpur 1', 'Farmgate', 'Motijheel', 'Uttara Sector 7', 'Bashundhara', 'Badda', 'Mohakhali', 'Tejgaon', 'Shyamoli', 'Mohammadpur', 'Baridhara', 'Khilgaon', 'Rampura', 'Lalmatia', 'Panthapath', 'Old Dhaka', 'Hatirjheel', 'Airport'];
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
function randomTrips(metas: string[]): Row[] {
  return [0, 1, 2].map((i) => {
    const from = pick(AREAS);
    let to = pick(AREAS);
    while (to === from) to = pick(AREAS);
    const tag = (['Matched', 'On the way', 'Completed'] as const)[i];
    const mins = 1 + Math.floor(Math.random() * 6);
    const meta = tag === 'Completed' ? `Arrived, ${pick(metas).toLowerCase()}` : `Pickup in ${mins} min, ${pick(metas).toLowerCase()}`;
    return { title: `${from} to ${to}`, meta, tag };
  });
}

function FeatureSection({ s }: { s: Feature }) {
  // generated after mount so server and client HTML match
  const [rows, setRows] = useState<Row[] | null>(null);
  useEffect(() => setRows(randomTrips(s.metas)), [s.metas]);
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div
        {...fade()}
        className="grid gap-6 md:grid-cols-2"
      >
        <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          {s.title[0]}
          <br />
          {s.title[1]}
        </h2>
        <div className="md:pt-2">
          <p className="max-w-md text-[17px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{s.copy}</p>
          <Link href={s.href} className="group mt-5 inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
            Learn more <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>

      {/* product panel: line art that reveals the render on hover, beside a trip list styled like Linear's issue rows */}
      <motion.div
        {...fade(0.1)}
        className="group mt-14 grid overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent md:grid-cols-[1.1fr_1fr] dark:border-white/10 dark:from-white/[.03]"
      >
        <div className="relative flex h-[280px] items-center justify-center md:h-[400px]">
          <div
            aria-hidden
            className="h-[62%] w-[70%] bg-black/60 transition-opacity duration-500 group-hover:opacity-0 dark:bg-white/70"
            style={{ WebkitMask: `url(${s.art}) center / contain no-repeat`, mask: `url(${s.art}) center / contain no-repeat` }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.img} alt="" aria-hidden loading="lazy" className="absolute h-[62%] w-[70%] scale-95 object-contain opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
        </div>
        <div className="border-t border-black/10 p-6 md:border-l md:border-t-0 md:p-8 dark:border-white/10">
          <p className="text-[13px] font-medium text-black/50 dark:text-[#8A8F98]">{s.panel}</p>
          <ul className="mt-4 min-h-[180px] divide-y divide-black/[.06] dark:divide-white/[.06]">
            {(rows ?? []).map((r) => {
              const Icon = TAG_ICON[r.tag as keyof typeof TAG_ICON];
              return (
                <li key={r.title} className="flex items-center gap-3 py-3.5 text-[13px] animate-[fadein_.5s_ease]">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{r.title}</span>
                    <span className="block text-[12px] text-black/45 dark:text-[#8A8F98]">{r.meta}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 px-2 py-0.5 text-[11px] text-black/60 dark:border-white/10 dark:text-[#AFAFAF]">
                    <Icon size={11} weight="fill" className={r.tag === 'Completed' ? '' : 'text-brand-green'} />
                    {r.tag}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>

      <div className="mt-10 grid gap-4 border-t border-black/10 pt-6 md:grid-cols-[1fr_1fr] dark:border-white/10">
        <p className="text-[13px] text-black/40 dark:text-white/35">Features</p>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px] text-black/70 dark:text-[#D0D6E0]">
          {s.links.map((l) => (
            <li key={l} className="flex items-center gap-1">
              {l} <ArrowRight size={11} className="text-black/30 dark:text-white/30" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
