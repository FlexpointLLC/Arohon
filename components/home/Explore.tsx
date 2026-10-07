'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { ease, fade } from '../motion';

// v = vehicle key; line art at /icons/line_<v>.png, render at /icons/<v>.webp
const NAME: Record<string, string> = { cng: 'CNG', car: 'Car', micro: 'Micro', car_plus: 'Car Plus', hiace: 'Hiace', pickup: 'Pickup', ambulance: 'Ambulance' };
type Item = { title: string; copy: string; v: string; href: string; step?: string; tint?: string };


/** Line art that swaps to the real render when its `group` ancestor is hovered. */
function Art({ v, className = 'h-[150px] w-[78%]' }: { v: string; className?: string }) {
  const mask = `url(/icons/line_${v}.png) center / contain no-repeat`;
  return (
    <div className="relative flex w-full items-center justify-center">
      <div aria-hidden className={`${className} bg-black/60 transition-opacity duration-500 group-hover:opacity-0 dark:bg-white/70`} style={{ WebkitMask: mask, mask }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/icons/${v}.webp`} alt="" aria-hidden loading="lazy" className={`${className} absolute scale-95 object-contain opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100`} />
    </div>
  );
}

const Statement = ({ lead, rest }: { lead: string; rest: string }) => (
  <motion.h2 {...fade()} className="max-w-[1100px] text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
    {lead} <span className="text-black/45 dark:text-[#8A8F98]">{rest}</span>
  </motion.h2>
);

const wrap = 'mx-auto max-w-[1280px] px-6 py-24 sm:py-32 md:px-16';
const rule = 'border-t border-black/10 dark:border-white/10';

/* Layout A, Linear "new species": statement + three divided columns */
const PAINS: Item[] = [
  { title: 'No more haggling', copy: 'Every CNG, bike and car fare is set before you ride. What you see is what you pay.', v: 'cng', href: '/ride' },
  { title: 'Know who is coming', copy: 'Verified drivers, live tracking and one-tap SOS, shared with family in a tap.', v: 'car', href: '/#safety' },
  { title: 'Beyond Dhaka', copy: 'Door to door rides between any of 64 districts, booked like a city trip.', v: 'micro', href: '/ride' },
];

export function Explore() {
  return (
    <section className={wrap}>
      <Statement lead="Getting around, without the hassle." rest="Built for how Bangladesh actually moves, Arohon takes the bargaining, the guessing and the long road home out of every ride." />
      <div className="mt-20 grid md:grid-cols-3">
        {PAINS.map((p, i) => (
          <motion.div key={p.title} {...fade(i * 0.12)} className={`group py-8 md:px-8 md:py-0 ${i ? `${rule} md:border-l md:border-t-0` : 'md:pl-0'}`}>
            <Link href={p.href} className="block">
              <p className="font-mono text-[11px] uppercase tracking-wider text-black/35 dark:text-white/30">{NAME[p.v]}</p>
              <div className="flex h-[240px] items-center justify-center">
                <Art v={p.v} />
              </div>
              <h3 className="mt-6 text-[15px] font-medium">{p.title}</h3>
              <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{p.copy}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* Layout C, Linear "Changelog": big title, a rail with dots, entries hanging off it */
const TRAVEL: Item[] = [
  { step: 'Before you fly', title: 'Visiting from abroad', copy: 'Book your Bangladesh rides before you pack. Your driver is confirmed before the flight.', v: 'car', href: '/services/airport' },
  { step: 'At arrivals', title: 'Airport, safely', copy: 'No bargaining with strangers at the gate. A verified car waits for you, to the airport or back home, any hour.', v: 'car_plus', href: '/services/airport' },
  { step: 'The weekend away', title: 'Share the trip, split the cost', copy: "Planning Sylhet or Cox's Bazar on a budget? Post your trip, travellers join and everyone pays less.", v: 'micro', href: '/ride' },
];

export function Travel() {
  return (
    <section className={`${wrap} ${rule}`}>
      <motion.div {...fade()} className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">Travel, sorted</h2>
        <p className="max-w-sm text-[15px] text-black/50 dark:text-[#8A8F98]">From the booking to the runway to the road trip, every leg is covered.</p>
      </motion.div>
      <div className="relative mt-16">
        <div aria-hidden className="absolute inset-x-0 top-[5px] hidden h-px bg-black/10 md:block dark:bg-white/10" />
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {TRAVEL.map((t, i) => (
            <motion.div key={t.title} {...fade(i * 0.15)} className="group">
              <Link href={t.href} className="block">
                <span aria-hidden className="relative block h-[11px] w-[11px] rounded-full border-2 border-brand-green bg-[#FDFDFD] dark:bg-black" />
                <p className="mt-6 text-[13px] text-black/40 dark:text-white/35">{t.step}</p>
                <h3 className="mt-1 text-[17px] font-medium">{t.title}</h3>
                <p className="mt-2 max-w-[320px] text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{t.copy}</p>
                <div className="mt-8 flex h-[150px] items-center justify-start">
                  <Art v={t.v} className="h-[120px] w-[220px]" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Layout D, Linear testimonial cards as a photo bento: one tall hero moment, two stacked */
const MOMENTS = [
  { title: 'Wedding cars', copy: 'Decorated cars and a convoy for the whole family, booked for the day with drivers who arrive on time.', img: '/img/wedding.webp', tag: 'Book for the day', href: '/services/rental' },
  { title: 'Moving home', copy: 'A pickup and a trusted driver. Boxes, sofa and the fridge, moved without the worry.', img: '/img/moving.webp', tag: 'Pickup with driver', href: '/services/rental' },
  { title: 'When someone is sick', copy: 'An ambulance from the same app, any hour, tracked all the way to the hospital.', img: '/img/amb_night.webp', tag: '24/7', href: '/services/ambulance' },
];

export function LifeMoments() {
  return (
    <section className={`${wrap} ${rule}`}>
      <Statement lead="Life's big days, covered." rest="The moments that matter most need a ride you can trust." />
      <div className="mt-16 grid gap-3 md:h-[680px] md:grid-cols-[1.15fr_1fr] md:grid-rows-2">
        {MOMENTS.map((m, i) => (
          <motion.div key={m.title} {...fade(i * 0.1)} className={i === 0 ? 'md:row-span-2' : ''}>
            <Link href={m.href} className={`group relative flex h-full overflow-hidden rounded-2xl ${i === 0 ? 'min-h-[400px] md:min-h-[520px]' : 'min-h-[260px] md:min-h-[320px]'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt={m.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-black/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">{m.tag}</span>
              <div className="relative mt-auto flex w-full items-end justify-between gap-6 p-7 text-white">
                <div>
                  <h3 className={`font-medium tracking-tight ${i === 0 ? 'text-[32px]' : 'text-[22px]'}`}>{m.title}</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/75">{m.copy}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-colors group-hover:bg-white group-hover:text-black">
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* Layout E, Linear "Features" rows: sticky title left, divided rows right */
const WORK: Item[] = [
  { title: 'Same rider, every day', copy: 'Book your office commute by the month. The same trusted driver picks you up every morning.', v: 'car', href: '/services/business' },
  { title: 'Arohon for business', copy: 'Staff transport, deliveries and every movement in between, managed in one B2B account.', v: 'hiace', href: '/services/business' },
  { title: 'Hire a driver', copy: 'Have a car but no driver? Post a job on Arohon, drivers apply and you hire the one you like.', v: 'car_plus', href: '/drive' },
];

export function Work() {
  return (
    <section className={`${wrap} ${rule} grid gap-12 md:grid-cols-[1fr_1.4fr]`}>
      <motion.div {...fade()} className="md:sticky md:top-32 md:self-start">
        <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          Work,
          <br />
          handled
        </h2>
        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">Daily commutes, company logistics and a driver for your own car. Arohon runs the movement so you run the business.</p>
      </motion.div>
      <ul className="border-t border-black/10 dark:border-white/10">
        {WORK.map((w, i) => (
          <motion.li key={w.title} {...fade(i * 0.1)} className="group border-b border-black/10 dark:border-white/10">
            <Link href={w.href} className="flex items-center gap-4 py-6 sm:gap-6 sm:py-8">
              <div className="w-[80px] shrink-0 sm:w-[140px]">
                <Art v={w.v} className="h-[48px] w-[80px] sm:h-[80px] sm:w-[140px]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-medium">{w.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{w.copy}</p>
              </div>
              <ArrowRight size={16} className="shrink-0 text-black/30 transition-transform group-hover:translate-x-1 dark:text-white/30" />
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
