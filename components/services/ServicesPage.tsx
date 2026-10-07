'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowRight, User } from '@phosphor-icons/react';
import { ease, fade } from '../motion';
import { INTERCITY, quoteIntercity, type IntercityV } from '@/lib/fares';
import { useT } from '@/lib/i18n';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';

/* ── Hero: a big vehicle cross-fades through the everyday needs we cover ── */
const NEEDS = [
  { need: 'Get around the city', v: 'bike', name: 'Bike, CNG and car', needBn: 'শহরে চলাফেরা', nameBn: 'বাইক, সিএনজি আর কার' },
  { need: 'Go to another city', v: 'micro', name: 'Car, micro and Hiace', needBn: 'অন্য শহরে যাওয়া', nameBn: 'কার, মাইক্রো আর হায়েস' },
  { need: 'Move your things', v: 'pickup', name: 'Pickup and trucks', needBn: 'মালপত্র সরানো', nameBn: 'পিকআপ আর ট্রাক' },
  { need: 'Reach a hospital', v: 'ambulance', name: 'Ambulance, any hour', needBn: 'হাসপাতালে পৌঁছানো', nameBn: 'অ্যাম্বুলেন্স, যেকোনো সময়' },
  { need: 'Travel with the family', v: 'hiace', name: 'Hiace, up to 12 seats', needBn: 'পরিবার নিয়ে ঘোরা', nameBn: 'হায়েস, ১২ সিট পর্যন্ত' },
];
export function ServicesHero() {
  const { t: tr } = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setI((x) => (x + 1) % NEEDS.length), 2600);
    return () => clearTimeout(t);
  }, [i]);
  const n = NEEDS[i];
  return (
    <section className="relative overflow-hidden bg-[#FDFDFD] pb-20 pt-28 dark:bg-black sm:pt-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1fr_1fr]">
        <div>
          <motion.p {...fade(0.05)} className={`text-[13px] ${muted}`}>{tr('Services', 'সার্ভিস')}</motion.p>
          <motion.h1 {...fade(0.1)} className="mt-4 u-h1">
            {tr('Every way to move', 'বাংলাদেশে চলার')}
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">{tr('in Bangladesh.', 'সব উপায়, এক অ্যাপে।')}</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            {tr('City rides, trips between any of 64 districts, goods, ambulances and cars by the hour. One app, one account, upfront fares.', 'শহরের রাইড, ৬৪ জেলার যেকোনোটিতে যাতায়াত, মালামাল, অ্যাম্বুলেন্স আর ঘণ্টা হিসেবে গাড়ি। এক অ্যাপ, এক অ্যাকাউন্ট, ভাড়া আগেই জানা।')}
          </motion.p>
          <motion.ul {...fade(0.3)} className="mt-8 space-y-1">
            {NEEDS.map((x, k) => (
              <li key={x.need}>
                <button type="button" onClick={() => setI(k)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors ${k === i ? 'bg-black/[.05] font-medium dark:bg-white/[.07]' : `${muted} hover:text-black dark:hover:text-white`}`}>
                  {tr(x.need, x.needBn)}
                  {k === i && <span className="text-[13px] font-normal text-black/50 dark:text-white/50">{tr(x.name, x.nameBn)}</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        </div>
        <div className="relative flex aspect-[4/3] items-center justify-center">
          <motion.div aria-hidden className="absolute bottom-[14%] h-[10%] w-[60%] rounded-[50%] bg-black/15 blur-2xl dark:bg-white/10" />
          <AnimatePresence mode="wait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={n.v}
              src={`/icons/${n.v}.webp`}
              alt={tr(n.name, n.nameBn)}
              initial={{ opacity: 0, x: 60, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.94 }}
              transition={{ duration: 0.55, ease }}
              className="relative w-[78%] object-contain"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ── Catalogue: tabbed, line art that turns into the render on hover ── */
type Svc = { name: string; v: string; copy: string; meta: string; href: string; tags: string[]; bn: { name: string; copy: string; meta: string } };
const SERVICES: Svc[] = [
  { name: 'Bike', v: 'bike', copy: 'The fastest way through Dhaka traffic, with a helmet for you.', meta: '1 seat', href: '/ride', tags: ['City'], bn: { name: 'বাইক', copy: 'ঢাকার জ্যাম পেরোনোর সবচেয়ে দ্রুত উপায়, আপনার জন্য হেলমেটসহ।', meta: '১ সিট' } },
  { name: 'EV bike', v: 'ev_bike', copy: 'Quiet, zero-emission rides for short city hops.', meta: '1 seat', href: '/ride', tags: ['City'], bn: { name: 'ইভি বাইক', copy: 'শহরের ছোট দূরত্বে নিঃশব্দ, দূষণমুক্ত রাইড।', meta: '১ সিট' } },
  { name: 'CNG', v: 'cng', copy: 'The everyday three-wheeler, with the fare set before you ride.', meta: '3 seats', href: '/ride', tags: ['City'], bn: { name: 'সিএনজি', copy: 'রোজকার তিন চাকার বাহন, ওঠার আগেই ভাড়া ঠিক।', meta: '৩ সিট' } },
  { name: 'Car', v: 'car', copy: 'AC sedans for the daily run and trips out of town.', meta: '4 seats', href: '/ride', tags: ['City', 'Travel'], bn: { name: 'কার', copy: 'রোজকার যাতায়াত আর শহরের বাইরে যাওয়ার জন্য এসি সেডান।', meta: '৪ সিট' } },
  { name: 'Car Plus', v: 'car_plus', copy: 'Roomier cars and top-rated drivers for meetings and long trips.', meta: '4 seats', href: '/ride', tags: ['City', 'Travel'], bn: { name: 'কার প্লাস', copy: 'মিটিং আর লম্বা ট্রিপের জন্য আরও বড় গাড়ি, সেরা রেটিংয়ের ড্রাইভার।', meta: '৪ সিট' } },
  { name: 'Micro', v: 'micro', copy: 'Room for the whole family and the luggage, city or intercity.', meta: '7 seats', href: '/ride', tags: ['Travel'], bn: { name: 'মাইক্রো', copy: 'পুরো পরিবার আর লাগেজের জায়গা, শহরে বা শহরের বাইরে।', meta: '৭ সিট' } },
  { name: 'Hiace', v: 'hiace', copy: 'Office trips, weddings and tours, one booking for the group.', meta: '12 seats', href: '/ride', tags: ['Travel'], bn: { name: 'হায়েস', copy: 'অফিস ট্রিপ, বিয়ে আর ট্যুর, পুরো দলের জন্য এক বুকিং।', meta: '১২ সিট' } },
  { name: 'Airport', v: 'car_plus', copy: 'Book your pickup from Shahjalal ahead, your driver is confirmed before you land.', meta: 'Scheduled', href: '/services/airport', tags: ['Travel'], bn: { name: 'এয়ারপোর্ট', copy: 'শাহজালাল থেকে পিকআপ আগেই বুক করুন, নামার আগেই ড্রাইভার নিশ্চিত।', meta: 'শিডিউলড' } },
  { name: 'Share a trip', v: 'micro', copy: 'Post a trip to Sylhet or Cox’s Bazar and split the cost with travellers.', meta: 'Cost sharing', href: '/ride', tags: ['Travel'], bn: { name: 'ট্রিপ শেয়ার', copy: 'সিলেট বা কক্সবাজারের ট্রিপ পোস্ট করুন, সহযাত্রীদের সাথে খরচ ভাগ করুন।', meta: 'খরচ ভাগাভাগি' } },
  { name: 'Pickup and trucks', v: 'pickup', copy: 'Move house or shop stock. You and the driver agree the price first.', meta: 'Goods', href: '/services/rental', tags: ['Goods'], bn: { name: 'পিকআপ আর ট্রাক', copy: 'বাসা বদল বা দোকানের মাল। আগে ড্রাইভারের সাথে দাম ঠিক করুন।', meta: 'মালামাল' } },
  { name: 'Parcel', v: 'bike', copy: 'Across Dhaka within an hour, or to any district in 1 to 3 days.', meta: 'Up to 8 kg', href: '/services/parcel', tags: ['Goods'], bn: { name: 'পার্সেল', copy: 'ঢাকার ভেতরে এক ঘণ্টায়, যেকোনো জেলায় ১ থেকে ৩ দিনে।', meta: '৮ কেজি পর্যন্ত' } },
  { name: 'Food delivery', v: 'ev_bike', copy: 'Food and medicine from restaurants and pharmacies near you.', meta: 'Daily needs', href: '/services/food', tags: ['Goods'], bn: { name: 'ফুড ডেলিভারি', copy: 'কাছের রেস্টুরেন্ট আর ফার্মেসি থেকে খাবার ও ওষুধ।', meta: 'রোজকার দরকার' } },
  { name: 'Ambulance', v: 'ambulance', copy: 'Emergency transport any hour, booked from the same app.', meta: '24/7', href: '/services/ambulance', tags: ['Medical'], bn: { name: 'অ্যাম্বুলেন্স', copy: 'যেকোনো সময় জরুরি পরিবহন, একই অ্যাপ থেকে বুক করুন।', meta: '২৪/৭' } },
  { name: 'Rental', v: 'car', copy: 'A car and driver by the hour, week or month. Drivers bid, you choose.', meta: 'With driver', href: '/services/rental', tags: ['By the hour'], bn: { name: 'রেন্টাল', copy: 'ঘণ্টা, সপ্তাহ বা মাস হিসেবে ড্রাইভারসহ গাড়ি। ড্রাইভাররা দর দেন, আপনি বেছে নেন।', meta: 'ড্রাইভারসহ' } },
  { name: 'Business', v: 'hiace', copy: 'Monthly office rides with the same driver and transport for the team.', meta: 'For teams', href: '/services/business', tags: ['By the hour', 'Travel'], bn: { name: 'বিজনেস', copy: 'একই ড্রাইভারের সাথে মাসিক অফিস রাইড, পুরো টিমের যাতায়াত।', meta: 'টিমের জন্য' } },
  { name: 'Hire a driver', v: 'car_plus', copy: 'Own a car? Post a job and hire a driver by the hour, week or month.', meta: 'Job posts', href: '/driver', tags: ['By the hour'], bn: { name: 'ড্রাইভার নিয়োগ', copy: 'নিজের গাড়ি আছে? জব পোস্ট করুন, ঘণ্টা, সপ্তাহ বা মাস হিসেবে ড্রাইভার নিন।', meta: 'জব পোস্ট' } },
];
const TABS = ['All', 'City', 'Travel', 'Goods', 'Medical', 'By the hour'];
const TABS_BN = ['সব', 'শহর', 'ভ্রমণ', 'মালামাল', 'চিকিৎসা', 'ঘণ্টা হিসেবে'];

function Art({ v }: { v: string }) {
  const mask = `url(/icons/line_${v}.png) center / contain no-repeat`;
  return (
    <div className="relative flex h-[120px] items-center justify-center">
      <div aria-hidden className="h-[96px] w-[70%] bg-black/55 transition-opacity duration-500 group-hover:opacity-0 dark:bg-white/65" style={{ WebkitMask: mask, mask }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/icons/${v}.webp`} alt="" aria-hidden loading="lazy" className="absolute h-[96px] w-[70%] scale-95 object-contain opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
    </div>
  );
}

export function Catalogue() {
  const { t: tr, href } = useT();
  const [tab, setTab] = useState('All');
  const list = SERVICES.filter((s) => tab === 'All' || s.tags.includes(tab));
  return (
    <section className={wrap}>
      <motion.div {...fade()} className="flex flex-wrap items-end justify-between gap-6">
        <h2 className={h2}>
          {tr('Pick a ride', 'যে কারণেই হোক,')}
          <br />
          <span className={muted}>{tr('for every reason.', 'রাইড বেছে নিন।')}</span>
        </h2>
        <LayoutGroup>
          <div className="flex flex-wrap gap-1 rounded-full bg-black/[.04] p-1 dark:bg-white/[.06]">
            {TABS.map((t, k) => (
              <button key={t} type="button" onClick={() => setTab(t)} className="relative rounded-full px-3.5 py-1.5 text-[13px]">
                {tab === t && <motion.span layoutId="svc-tab" className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-white/15" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className={`relative ${tab === t ? 'font-medium' : muted}`}>{tr(t, TABS_BN[k])}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </motion.div>

      <motion.div layout className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((s) => (
            <motion.div key={s.name} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease }}>
              <Link href={href(s.href)} className={`group flex h-full flex-col p-5 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.03] ${panel}`}>
                <Art v={s.v} />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[16px] font-medium">{tr(s.name, s.bn.name)}</p>
                  <span className={`flex items-center gap-1 text-[11px] ${muted}`}>{s.meta.includes('seat') && <User size={10} weight="fill" />}{tr(s.meta, s.bn.meta)}</span>
                </div>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${muted}`}>{tr(s.copy, s.bn.copy)}</p>
                <span className="mt-auto flex items-center gap-1 pt-4 text-[13px] font-medium">
                  {tr('Details', 'বিস্তারিত')} <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* ── Intercity fare explorer: real fare_config rates, approximate road distance and time ── */
const CITIES = [
  { name: 'Chattogram', km: 250, min: 360, bn: 'চট্টগ্রাম' },
  { name: 'Sylhet', km: 240, min: 360, bn: 'সিলেট' },
  { name: "Cox's Bazar", km: 400, min: 600, bn: 'কক্সবাজার' },
  { name: 'Rajshahi', km: 255, min: 390, bn: 'রাজশাহী' },
  { name: 'Khulna', km: 220, min: 330, bn: 'খুলনা' },
];
const VEH: IntercityV[] = ['car', 'car_plus', 'micro', 'hiace'];
const VEH_BN: Record<IntercityV, string> = { bike: 'বাইক', cng: 'সিএনজি', car: 'কার', car_plus: 'কার প্লাস', micro: 'মাইক্রো', hiace: 'হায়েস' };
type FareProps = { label?: string; title?: string; rest?: string; copy?: string; vehicles?: IntercityV[]; seats?: Partial<Record<IntercityV, number>> };
/** shared by /services (all vehicles) and /services/business (groups, with the price per person) */
export function FareExplorer({
  label,
  title,
  rest,
  copy,
  vehicles = VEH,
  seats,
}: FareProps = {}) {
  const { t, n, bn } = useT();
  label ??= t('Intercity', 'আন্তঃজেলা');
  title ??= t('Out of Dhaka?', 'ঢাকার বাইরে যাবেন?');
  rest ??= t('See the fare first.', 'আগেই ভাড়া দেখে নিন।');
  copy ??= t('Pick a city and compare every vehicle, worked out with our current intercity rates. Split it with your group and it gets even lighter.', 'শহর বেছে নিন আর সব গাড়ির ভাড়া মিলিয়ে দেখুন, আমাদের বর্তমান আন্তঃজেলা রেটে হিসাব করা। দলের সাথে ভাগ করলে খরচ আরও হালকা।');
  const money = (x: number) => n(x.toLocaleString('en-US'));
  const [c, setC] = useState(0);
  const city = CITIES[c];
  const quotes = vehicles.map((v) => ({ v, ...quoteIntercity(v, city.km, city.min) }));
  const max = Math.max(...quotes.map((q) => q.total));
  return (
    <section className={wrap}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{label}</p>
          <h2 className={`mt-3 ${h2}`}>
            {title}
            <br />
            <span className={muted}>{rest}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>{copy}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CITIES.map((x, k) => (
              <button key={x.name} type="button" onClick={() => setC(k)} className={`rounded-full px-4 py-2 text-[14px] transition-colors ${k === c ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07] dark:hover:bg-white/10'}`}>
                {t(x.name, x.bn)}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade(0.1)} className={`${panel} p-6 sm:p-8`}>
          <div className="flex items-baseline justify-between">
            <p className="text-[15px] font-medium">{bn ? `ঢাকা থেকে ${city.bn}` : `Dhaka to ${city.name}`}</p>
            <p className={`text-[12px] ${muted}`}>{bn ? `প্রায় ${n(city.km)} কিমি, ${n(Math.round(city.min / 60))} ঘণ্টা` : `About ${city.km} km, ${Math.round(city.min / 60)} hours`}</p>
          </div>
          <ul className="mt-6 space-y-5">
            {quotes.map((q) => (
              <li key={q.v} className="grid grid-cols-[64px_1fr] items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/${q.v}.webp`} alt="" className="h-10 w-16 object-contain" />
                <div>
                  <div className="flex items-baseline justify-between text-[14px]">
                    <span className="font-medium">{t(INTERCITY[q.v].label, VEH_BN[q.v])}{seats?.[q.v] && <span className={`ml-2 text-[12px] font-normal ${muted}`}>{t(`${seats[q.v]} seats`, `${n(seats[q.v]!)} সিট`)}</span>}</span>
                    <motion.span key={city.name + q.v} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="tabular-nums">
                      ৳{money(q.total)}
                      {seats?.[q.v] && <span className={`ml-2 text-[12px] ${muted}`}>{t(`৳${Math.ceil(q.total / seats[q.v]!).toLocaleString('en-US')} each`, `জনপ্রতি ৳${money(Math.ceil(q.total / seats[q.v]!))}`)}</span>}
                    </motion.span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/[.06] dark:bg-white/[.08]">
                    <motion.div className="h-full rounded-full bg-black dark:bg-white" animate={{ width: `${(q.total / max) * 100}%` }} transition={{ type: 'spring', stiffness: 110, damping: 20 }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className={`mt-6 border-t border-black/10 pt-4 text-[12px] dark:border-white/10 ${muted}`}>
            {t('Totals include the ৳3 safety charge and ৳100 booking fee. Distances and times are approximate; your exact fare is confirmed in the app before you book.', `মোট ভাড়ায় ৳${n(3)} সেফটি চার্জ আর ৳${n(100)} বুকিং ফি ধরা আছে। দূরত্ব আর সময় আনুমানিক, বুক করার আগে অ্যাপে আপনার সঠিক ভাড়া নিশ্চিত হবে।`)}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
