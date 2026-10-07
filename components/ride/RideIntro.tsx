'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MapPin, User } from '@phosphor-icons/react';
import { USER_APP_URL } from '@/lib/app-links';
import { DhakaMap } from './DhakaMap';
import { ease, up } from '../motion';
import { RouteMarkers } from '../RouteMarkers';
import { useT } from '@/lib/i18n';

// Arohon's own take: a trip composer floating on our isometric city; your choices drive the map
const PRODUCTS = [
  { v: 'bike', label: 'Bike', bn: 'বাইক', seats: 1, base: 3 },
  { v: 'cng', label: 'CNG', bn: 'সিএনজি', seats: 3, base: 4 },
  { v: 'car', label: 'Car', bn: 'কার', seats: 4, base: 5 },
  { v: 'car_plus', label: 'Car Plus', bn: 'কার প্লাস', seats: 4, base: 6 },
  { v: 'micro', label: 'Micro', bn: 'মাইক্রো', seats: 7, base: 8 },
];
const PLACES = [
  { name: 'Hazrat Shahjalal International Airport', thana: 'Biman Bandar', area: 'Kurmitola', bnName: 'হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর', bnArea: 'কুর্মিটোলা' },
  { name: 'Gulshan 2 Circle', thana: 'Gulshan', area: 'Gulshan', bnName: 'গুলশান ২ সার্কেল', bnArea: 'গুলশান' },
  { name: 'Dhanmondi 27', thana: 'Dhanmondi', area: 'Dhanmondi', bnName: 'ধানমন্ডি ২৭', bnArea: 'ধানমন্ডি' },
  { name: 'Bashundhara City', thana: 'Kalabagan', area: 'Panthapath', bnName: 'বসুন্ধরা সিটি', bnArea: 'পান্থপথ' },
  { name: 'Kamalapur Railway Station', thana: 'Motijheel', area: 'Motijheel', bnName: 'কমলাপুর রেলস্টেশন', bnArea: 'মতিঝিল' },
];


function Composer({ vehicle, setVehicle, to, setTo }: { vehicle: string; setVehicle: (v: string) => void; to: number | null; setTo: (i: number) => void }) {
  const { t, n } = useT();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  // options "load" briefly after each choice, then their ETAs keep drifting like live data
  useEffect(() => {
    if (to === null) return;
    setLoading(true);
    const id = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(id);
  }, [to]);
  useEffect(() => {
    const id = setInterval(() => setTick((s) => s + 1), 4000);
    return () => clearInterval(id);
  }, []);
  const etas = useMemo(() => PRODUCTS.map((p) => Math.max(2, p.base + ((tick * 5 + p.base) % 3) - 1)), [tick]);

  return (
    <div className="w-full overflow-hidden rounded-[24px] bg-white text-black shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:text-white dark:ring-white/10">
      {/* where from / where to */}
      <div className="p-4">
        {/* markers match the customer app: pickup black square, destination red circle, joined by a centred line */}
        <div className="flex gap-3">
          <RouteMarkers />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex h-10 items-center rounded-xl px-3 text-[14px] text-black/55 dark:text-white/55">{t('Current location', 'বর্তমান লোকেশন')}</div>
            <button type="button" onClick={() => setOpen((o) => !o)} className="flex h-10 w-full items-center rounded-xl bg-black/[.04] px-3 text-left transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/10">
              <span className={`min-w-0 flex-1 truncate text-[14px] ${to === null ? 'text-black/45 dark:text-white/40' : 'font-medium'}`}>{to === null ? t('Where to?', 'কোথায় যাবেন?') : t(PLACES[to].name, PLACES[to].bnName)}</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease }} className="overflow-hidden">
              {PLACES.map((p, i) => (
                <li key={p.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setTo(i);
                      setOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.05]"
                  >
                    <MapPin size={16} weight="fill" className="shrink-0 text-black/40 dark:text-white/40" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium">{t(p.name, p.bnName)}</span>
                      <span className="block text-[11px] text-black/45 dark:text-white/45">{t(`${p.area}, Dhaka`, `${p.bnArea}, ঢাকা`)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* vehicle tiles in a row; the selected one shows how far away it is */}
      <div className="border-t border-black/[.07] p-3 dark:border-white/[.07]">
        <div className="grid grid-cols-5 gap-1.5">
          {PRODUCTS.map((p) => (
            <button
              key={p.v}
              type="button"
              onClick={() => setVehicle(p.v)}
              aria-pressed={vehicle === p.v}
              className={`flex flex-col items-center rounded-xl px-1 pb-2 pt-1.5 transition-all ${vehicle === p.v ? 'bg-black/[.06] ring-2 ring-black dark:bg-white/[.08] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.06] dark:bg-white/[.04] dark:hover:bg-white/[.07]'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/icons/${p.v}.webp`} alt="" className="h-8 w-11 object-contain" />
              <span className={`mt-0.5 text-[11px] ${vehicle === p.v ? 'font-semibold' : 'text-black/55 dark:text-white/55'}`}>{t(p.label, p.bn)}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex h-5 items-center justify-between px-1 text-[13px]">
          {(() => {
            const i = PRODUCTS.findIndex((p) => p.v === vehicle);
            const p = PRODUCTS[i];
            return (
              <>
                <span className="flex items-center gap-1.5 font-medium">
                  {t(p.label, p.bn)}
                  <span className="flex items-center gap-0.5 text-[11px] font-normal text-black/45 dark:text-white/45"><User size={10} weight="fill" />{n(p.seats)}</span>
                </span>
                {loading ? (
                  <span className="h-2.5 w-20 animate-pulse rounded bg-black/10 dark:bg-white/10" />
                ) : (
                  <motion.span key={vehicle + etas[i]} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-black/60 dark:text-white/60">
                    {t(`${etas[i]} min away`, `${n(etas[i])} মিনিট দূরে`)}
                  </motion.span>
                )}
              </>
            );
          })()}
        </div>
      </div>

      <div className="p-3 pt-1">
        <a href={USER_APP_URL} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black">
          {(() => { const p = PRODUCTS.find((x) => x.v === vehicle); return t(`Book ${p?.label} in the app`, `অ্যাপে ${p?.bn} বুক করুন`); })()} <ArrowRight size={14} />
        </a>
        <p className="mt-2 text-center text-[11px] text-black/40 dark:text-white/35">{t('Your exact fare is shown in the app before you confirm.', 'কনফার্ম করার আগেই অ্যাপে দেখবেন আপনার ঠিক ভাড়া।')}</p>
      </div>
    </div>
  );
}

export function RideIntro() {
  const { t } = useT();
  const [vehicle, setVehicle] = useState('car');
  const [to, setTo] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden bg-[#FDFDFD] pb-24 pt-28 dark:bg-black sm:pt-32">
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-6 md:px-16 lg:grid-cols-[400px_1fr] lg:gap-16">
        <div>
          <motion.p {...up(0.1)} className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Ride with Arohon', 'আরোহনে চলুন')}</motion.p>
          <motion.h1 {...up(0.2)} className="mt-4 u-h1 text-black dark:text-white">
            {t('Where to?', 'কোথায় যাবেন?')}
          </motion.h1>
          <motion.p {...up(0.3)} className="mt-5 text-base leading-relaxed text-black/55 dark:text-[#AFAFAF]">
            {t('Pick a place and a ride, and watch your trip across Dhaka.', 'জায়গা আর রাইড বেছে নিন, ঢাকার বুকে দেখুন আপনার যাত্রা।')}
          </motion.p>
          <motion.div {...up(0.4)} className="mt-8">
            <Composer vehicle={vehicle} setVehicle={setVehicle} to={to} setTo={setTo} />
          </motion.div>
        </div>

        {/* our own visual: dotted Dhaka by thana, your vehicle drives the route */}
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.3, ease }} className="lg:sticky lg:top-28">
          <DhakaMap to={to === null ? null : PLACES[to].thana} vehicle={vehicle} />
        </motion.div>
      </div>
    </section>
  );
}
