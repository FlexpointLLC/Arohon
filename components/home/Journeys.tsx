'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { ease, fade } from '../motion';

const ITEMS = [
  { title: 'Intercity', bn: 'আউটস্টেশন ভ্রমণ', copy: 'Door to door between any two of 64 districts. Car, micro or Hiace, with round-trip discounts.', img: '/img/intercity.webp', href: '/ride' },
  { title: 'Family trips', bn: 'সবাই মিলে, একসাথে', copy: "Cox's Bazar with everyone in. Spacious micros and Hiaces with room for grandparents, kids and every suitcase.", img: '/img/family.webp', href: '/ride' },
  { title: 'Parcel', bn: 'পার্সেল পাঠান', copy: 'Send it across town today. Same-day bike delivery, tracked from pickup to doorstep.', img: '/img/parcel.webp', href: '/services/parcel' },
];
const DUR = 6000;

// Linear-style feature switcher: tabs on the left auto-advance with a progress line, photo crossfades on the right.
export function Journeys() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((i + 1) % ITEMS.length), DUR);
    return () => clearTimeout(t);
  }, [i]);

  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div
        {...fade()}
        className="grid gap-6 md:grid-cols-2"
      >
        <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          Beyond the city.
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">Beyond rides.</span>
        </h2>
        <p className="max-w-md text-[17px] leading-relaxed text-black/50 md:justify-self-end md:pt-2 dark:text-[#8A8F98]">
          The same app that gets you across Dhaka takes the whole family to the sea and gets your parcel there by tonight.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12">
        <ul className="flex flex-col">
          {ITEMS.map((it, k) => (
            <li key={it.title} className="border-t border-black/10 dark:border-white/10">
              <button type="button" onClick={() => setI(k)} className="relative w-full py-6 text-left">
                {/* progress line runs along the top border of the active tab */}
                {k === i && (
                  <motion.span key={i} aria-hidden className="absolute -top-px left-0 h-px bg-black dark:bg-white" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: DUR / 1000, ease: 'linear' }} />
                )}
                <span className={`flex items-baseline justify-between text-[20px] font-medium tracking-tight transition-colors ${k === i ? '' : 'text-black/35 dark:text-white/35'}`}>
                  {it.title}
                </span>
                <AnimatePresence initial={false}>
                  {k === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <p className="pt-3 text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{it.copy}</p>
                      <Link href={it.href} className="group mt-4 inline-flex items-center gap-1 text-sm font-medium">
                        Learn more <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </li>
          ))}
        </ul>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black/5 md:aspect-auto md:min-h-[520px] dark:bg-white/5">
          <AnimatePresence mode="sync">
            <motion.img
              key={ITEMS[i].img}
              src={ITEMS[i].img}
              alt={ITEMS[i].title}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
