'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { ease, fade } from '../motion';
import { useT } from '@/lib/i18n';

const ITEMS = [
  { title: 'Intercity', bn: 'আউটস্টেশন ভ্রমণ', titleBn: 'আন্তঃজেলা', copy: 'Door to door between any two of 64 districts. Car, micro or Hiace, with round-trip discounts.', copyBn: '৬৪ জেলার যেকোনো দুই জায়গায় দরজা থেকে দরজায়। কার, মাইক্রো বা হায়েস, রাউন্ড ট্রিপে বাড়তি ছাড়।', img: '/img/intercity.webp', href: '/ride' },
  { title: 'Family trips', bn: 'সবাই মিলে, একসাথে', titleBn: 'পারিবারিক ভ্রমণ', copy: "Cox's Bazar with everyone in. Spacious micros and Hiaces with room for grandparents, kids and every suitcase.", copyBn: 'সবাইকে নিয়ে কক্সবাজার। দাদা দাদি, বাচ্চা আর সব স্যুটকেসের জায়গা হবে বড় মাইক্রো আর হায়েসে।', img: '/img/family.webp', href: '/ride' },
  { title: 'Parcel', bn: 'পার্সেল পাঠান', titleBn: 'পার্সেল', copy: 'Send it across town today. Same-day bike delivery, tracked from pickup to doorstep.', copyBn: 'আজই পাঠান শহরের যেকোনো প্রান্তে। একই দিনে বাইক ডেলিভারি, পিকআপ থেকে দরজা পর্যন্ত ট্র্যাকিং।', img: '/img/parcel.webp', href: '/services/parcel' },
];
const DUR = 6000;

// Linear-style feature switcher: tabs on the left auto-advance with a progress line, photo crossfades on the right.
export function Journeys() {
  const { t, href } = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setI((i + 1) % ITEMS.length), DUR);
    return () => clearTimeout(id);
  }, [i]);

  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div
        {...fade()}
        className="grid gap-6 md:grid-cols-2"
      >
        <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          {t('Beyond the city.', 'শহর ছাড়িয়ে।')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('Beyond rides.', 'রাইড ছাড়িয়ে।')}</span>
        </h2>
        <p className="max-w-md text-[17px] leading-relaxed text-black/50 md:justify-self-end md:pt-2 dark:text-[#8A8F98]">
          {t('The same app that gets you across Dhaka takes the whole family to the sea and gets your parcel there by tonight.', 'যে অ্যাপে ঢাকা ঘোরেন, সেটাতেই পুরো পরিবার যাবে সমুদ্রে, আর পার্সেল পৌঁছাবে আজ রাতেই।')}
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
                  {t(it.title, it.titleBn)}
                </span>
                <AnimatePresence initial={false}>
                  {k === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                      <p className="pt-3 text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{t(it.copy, it.copyBn)}</p>
                      <Link href={href(it.href)} className="group mt-4 inline-flex items-center gap-1 text-sm font-medium">
                        {t('Learn more', 'আরও জানুন')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
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
              alt={t(ITEMS[i].title, ITEMS[i].titleBn)}
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
