'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { fade, up } from '../motion';
import { useT } from '@/lib/i18n';

const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';

/** step counter that only runs while the demo is on screen */
function useTick(ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { margin: '-40px' });
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setT((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [on, ms]);
  return { ref, t };
}

/* ── small live demos, one per headline release ── */
function DarkModeDemo() {
  const { t: tr } = useT();
  const { ref, t } = useTick(1800);
  const dark = t % 2 === 1;
  return (
    <div ref={ref} className={`${panel} flex items-center justify-center p-8`}>
      <div className={`w-[220px] rounded-[28px] p-4 shadow-xl ring-1 transition-colors duration-700 ${dark ? 'bg-[#111] text-white ring-white/10' : 'bg-white text-black ring-black/10'}`}>
        <div className={`h-24 rounded-2xl transition-colors duration-700 ${dark ? 'bg-[#1E1E1E]' : 'bg-[#EEF1F0]'}`} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] font-semibold">{tr('You’re online', 'আপনি অনলাইনে')}</span>
          <span className="h-2 w-2 rounded-full bg-[#079A70]" />
        </div>
        <div className={`mt-3 rounded-full py-2 text-center text-[12px] font-semibold transition-colors duration-700 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>{tr('Accept', 'গ্রহণ করুন')}</div>
        <p className={`mt-3 text-center text-[11px] transition-colors duration-700 ${dark ? 'text-white/50' : 'text-black/45'}`}>{dark ? tr('Dark', 'ডার্ক') : tr('Light', 'লাইট')}{tr(', follows your phone', ', ফোনের সেটিং মেনে')}</p>
      </div>
    </div>
  );
}

function MarkerDemo() {
  const { t, n } = useT();
  // a vehicle glides along a road while its heading turns, the way the new 3D markers move
  return (
    <div className={`${panel} relative h-[240px] overflow-hidden`}>
      <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" aria-hidden>
        <path id="wn-road" d="M-20 190 C 90 190, 120 60, 220 80 S 360 170, 430 60" fill="none" className="stroke-black/10 dark:stroke-white/10" strokeWidth="18" strokeLinecap="round" />
        <path d="M-20 190 C 90 190, 120 60, 220 80 S 360 170, 430 60" fill="none" className="stroke-black/25 dark:stroke-white/25" strokeWidth="1.5" strokeDasharray="6 8" />
        <g>
          <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
            <mpath href="#wn-road" />
          </animateMotion>
          <circle r="20" className="fill-[#079A70]/15" />
          <image href="/icons/car.webp" x="-26" y="-16" width="52" height="32" />
        </g>
      </svg>
      <p className={`absolute bottom-4 left-5 text-[12px] ${muted}`}>{t('12 vehicles, smooth glide, no jumps', `${n(12)}টি গাড়ি, মসৃণ চলা, কোনো লাফ নেই`)}</p>
    </div>
  );
}

function EvDemo() {
  const { t: tr, n } = useT();
  const { ref, t } = useTick(2600);
  const on = t > 0;
  const rows = [
    { k: 'Bike', kBn: 'বাইক', v: 120, me: false },
    { k: 'EV bike', kBn: 'ইভি বাইক', v: 93, me: true },
  ];
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{tr('Same 6 km trip, sample fare', `একই ${n(6)} কিমি ট্রিপ, নমুনা ভাড়া`)}</p>
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <div key={r.k}>
            <div className="flex justify-between text-[15px]">
              <span className={r.me ? 'font-semibold' : ''}>{tr(r.k, r.kBn)}</span>
              <span className={`tabular-nums ${r.me ? 'font-semibold text-[#079A70] dark:text-[#0ABF8B]' : muted}`}>৳{n(r.v)}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-black/[.05] dark:bg-white/[.07]">
              <div className={`h-full rounded-full transition-[width] duration-1000 ease-out ${r.me ? 'bg-[#079A70]' : 'bg-black/30 dark:bg-white/30'}`} style={{ width: on ? `${(r.v / 120) * 100}%` : '0%' }} />
            </div>
          </div>
        ))}
      </div>
      <p className={`mt-6 text-[13px] ${muted}`}>{tr('EV rides are 21% to 24% cheaper than a bike.', `ইভি রাইড বাইকের চেয়ে ${n(21)}% থেকে ${n(24)}% সস্তা।`)}</p>
    </div>
  );
}

function IslandDemo() {
  const { t: tr } = useT();
  const { ref, t } = useTick(700);
  const p = (t % 16) / 15;
  const label = p < 0.15 ? tr('Finding your driver', 'ড্রাইভার খোঁজা হচ্ছে') : p < 0.5 ? tr('Karim is 3 min away', 'করিম ৩ মিনিট দূরে') : p < 0.95 ? tr('On the way to Banani', 'বনানীর পথে') : tr('You’ve arrived', 'পৌঁছে গেছেন');
  return (
    <div ref={ref} className={`${panel} flex h-[240px] items-center justify-center`}>
      <div className="w-[280px] rounded-[26px] bg-black px-5 py-4 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <img src="/icons/car.webp" alt="" className="h-7 w-11 object-contain" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="text-[13px] font-semibold">{label}</motion.span>
          </AnimatePresence>
        </div>
        <div className="mt-3 h-1 rounded-full bg-white/15">
          <div className="h-full rounded-full bg-[#0ABF8B] transition-[width] duration-700 ease-linear" style={{ width: `${p * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

const WAVE = ['#079A70', '#FF9500', '#FF2D55'];
function MissionsDemo() {
  const { t: tr, n } = useT();
  const { ref, t } = useTick(140);
  const cols = 14;
  const head = t % (cols + 8);
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium">{tr('Daily missions', 'ডেইলি মিশন')}</p>
        <span className="rounded-full bg-[#FF9500]/10 px-2.5 py-1 text-[12px] font-semibold text-[#C77700] dark:text-[#FF9F0A]">{tr('7 day streak', `${n(7)} দিনের স্ট্রিক`)}</span>
      </div>
      <div className="mt-6 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
        {Array.from({ length: cols * 4 }, (_, i) => {
          const c = i % cols;
          const lit = c <= head && c > head - 6;
          return <span key={i} className="aspect-square rounded-[4px] bg-black/[.06] transition-colors duration-300 dark:bg-white/[.08]" style={lit ? { background: WAVE[Math.floor(i / cols) % 3] } : undefined} />;
        })}
      </div>
      <p className={`mt-6 text-[13px] ${muted}`}>{tr('Daily quests, a streak, a chest and weekly rewards.', 'রোজকার কোয়েস্ট, স্ট্রিক, চেস্ট আর সাপ্তাহিক রিওয়ার্ড।')}</p>
    </div>
  );
}

function BoostDemo() {
  const { t: tr, n } = useT();
  const { ref, t } = useTick(1100);
  const step = t % 6;
  const fare = 180 + Math.min(step, 3) * 20;
  const found = step >= 4;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{found ? tr('Driver found', 'ড্রাইভার পাওয়া গেছে') : tr('Searching nearby drivers…', 'কাছের ড্রাইভার খোঁজা হচ্ছে…')}</p>
      <div className="mt-4 flex items-end justify-between">
        <motion.span key={fare} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[34px] font-semibold tabular-nums tracking-tight">৳{n(fare)}</motion.span>
        <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${found ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black text-white dark:bg-white dark:text-black'}`}>{found ? tr('Karim accepted', 'করিম গ্রহণ করেছেন') : tr('+৳20 boost', `+৳${n(20)} বুস্ট`)}</span>
      </div>
      <p className={`mt-4 text-[13px] ${muted}`}>{tr('Raise your fare while searching and nearby drivers see it at once.', 'খোঁজার সময়ই ভাড়া বাড়ান, কাছের ড্রাইভাররা সাথে সাথে দেখবেন।')}</p>
    </div>
  );
}

/* ── the log ── */
type App = 'Rider app' | 'Driver app' | 'Shops';
type Entry = { date: string; dateBn: string; app: App; title: string; titleBn: string; copy: string; copyBn: string; demo?: React.ReactNode; also?: string[]; alsoBn?: string[] };
const APP_BN: Record<'All' | App, string> = { All: 'সব', 'Rider app': 'রাইডার অ্যাপ', 'Driver app': 'ড্রাইভার অ্যাপ', Shops: 'শপ' };
const LOG: { month: string; monthBn: string; entries: Entry[] }[] = [
  {
    month: 'October 2026',
    monthBn: 'অক্টোবর ২০২৬',
    entries: [
      { date: 'Oct 7', app: 'Driver app', title: 'Dark mode and a calmer ride flow', copy: 'The driver app now follows your phone’s light or dark setting. Ride requests, the trip screen and receipts were rebuilt to be clearer at a glance, day or night.', demo: <DarkModeDemo />, also: ['bKash number and referral reward now come from the server', 'Rental off days and driving experience on job posts'], dateBn: '৭ অক্টোবর', titleBn: 'ডার্ক মোড আর আরও শান্ত রাইড ফ্লো', copyBn: 'ড্রাইভার অ্যাপ এখন আপনার ফোনের লাইট বা ডার্ক সেটিং মেনে চলে। রাইড রিকোয়েস্ট, ট্রিপ স্ক্রিন আর রসিদ নতুন করে বানানো, দিনে হোক বা রাতে, এক নজরেই সব পরিষ্কার।', alsoBn: ['বিকাশ নম্বর আর রেফারেল রিওয়ার্ড এখন সার্ভার থেকে আসে', 'জব পোস্টে রেন্টালের ছুটির দিন আর ড্রাইভিং অভিজ্ঞতা'] },
      { date: 'Oct 6', app: 'Rider app', title: 'Live 3D vehicles on the map', copy: 'All 12 vehicle types now appear as 3D models that turn with the road and glide smoothly between updates, instead of jumping from point to point.', demo: <MarkerDemo />, also: ['In-app updates on Android, update card on iOS', 'Smoother switching between vehicle types'], dateBn: '৬ অক্টোবর', titleBn: 'ম্যাপে লাইভ 3D গাড়ি', copyBn: '১২ ধরনের গাড়িই এখন 3D মডেলে দেখা যায়, রাস্তার সাথে ঘোরে আর আপডেটের মাঝে মসৃণভাবে চলে, এক জায়গা থেকে আরেক জায়গায় লাফ দেয় না।', alsoBn: ['অ্যান্ড্রয়েডে অ্যাপের ভেতরেই আপডেট, iOS এ আপডেট কার্ড', 'গাড়ির ধরন বদলানো এখন আরও মসৃণ'] },
      { date: 'Oct 6', app: 'Driver app', title: 'Sign up in fewer steps', copy: 'A new checklist walks drivers through every document, with help on each step and a “why we ask for this” note. Photos are compressed before upload, and EV bikes can now register.', also: ['Floating request bubble with a draining Accept timer', 'Switch between English and Bangla without restarting'], dateBn: '৬ অক্টোবর', titleBn: 'কম ধাপে সাইনআপ', copyBn: 'নতুন চেকলিস্ট ড্রাইভারদের প্রতিটা ডকুমেন্টে হাত ধরে নিয়ে যায়, প্রতিটা ধাপে সাহায্য আর “কেন এটা চাই” নোটসহ। আপলোডের আগে ছবি ছোট করা হয়, আর এখন ইভি বাইকও রেজিস্টার করা যায়।', alsoBn: ['ভাসমান রিকোয়েস্ট বাবল, সাথে কমতে থাকা Accept টাইমার', 'রিস্টার্ট ছাড়াই ইংরেজি আর বাংলায় বদল'] },
      { date: 'Oct 5', app: 'Rider app', title: 'EV bike is here', copy: 'EV bikes are now a real ride type with their own drivers, arrival times and fares, 21% to 24% cheaper than a regular bike.', demo: <EvDemo />, dateBn: '৫ অক্টোবর', titleBn: 'ইভি বাইক চলে এসেছে', copyBn: 'ইভি বাইক এখন পুরোদস্তুর রাইড টাইপ, নিজস্ব ড্রাইভার, পৌঁছানোর সময় আর ভাড়াসহ, সাধারণ বাইকের চেয়ে ২১% থেকে ২৪% সস্তা।' },
      { date: 'Oct 5', app: 'Rider app', title: 'Your ride on the lock screen', copy: 'On iPhone, your trip now lives in the Dynamic Island and on the lock screen, from finding a driver to arriving.', demo: <IslandDemo />, also: ['Airports and Hospitals tabs in Where to', 'New weather card with rain watch', 'Redesigned ambulance booking'], dateBn: '৫ অক্টোবর', titleBn: 'লক স্ক্রিনে আপনার রাইড', copyBn: 'আইফোনে আপনার ট্রিপ এখন Dynamic Island আর লক স্ক্রিনে থাকে, ড্রাইভার খোঁজা থেকে পৌঁছানো পর্যন্ত।', alsoBn: ['কোথায় যাবেন অংশে এয়ারপোর্ট আর হাসপাতাল ট্যাব', 'বৃষ্টির খবরসহ নতুন আবহাওয়া কার্ড', 'নতুন ডিজাইনে অ্যাম্বুলেন্স বুকিং'] },
      { date: 'Oct 4', app: 'Rider app', title: 'More than one ride at a time', copy: 'Book a second ride while the first is still going, with an in-trip safety check and fares priced on our servers for everyone.', dateBn: '৪ অক্টোবর', titleBn: 'একসাথে একাধিক রাইড', copyBn: 'প্রথম রাইড চলতে চলতেই দ্বিতীয়টা বুক করুন, ট্রিপের মাঝে সেফটি চেক আর সবার জন্য আমাদের সার্ভারে হিসাব করা ভাড়াসহ।' },
      { date: 'Oct 3', app: 'Rider app', title: 'Daily missions', copy: 'Complete small daily quests, keep your streak alive and open a chest for extra points. Weekly and streak rewards stack on top of your tier.', demo: <MissionsDemo />, dateBn: '৩ অক্টোবর', titleBn: 'ডেইলি মিশন', copyBn: 'রোজ ছোট ছোট কোয়েস্ট শেষ করুন, স্ট্রিক ধরে রাখুন আর বাড়তি পয়েন্টের চেস্ট খুলুন। সাপ্তাহিক আর স্ট্রিক রিওয়ার্ড আপনার টিয়ারের ওপর যোগ হয়।' },
    ],
  },
  {
    month: 'September 2026',
    monthBn: 'সেপ্টেম্বর ২০২৬',
    entries: [
      { date: 'Sep 22', app: 'Rider app', title: 'Rentals, end to end', copy: 'Post a rental, get bids from drivers, approve the one you like and track weekly attendance for monthly hires. Status changes now arrive as notifications.', dateBn: '২২ সেপ্টেম্বর', titleBn: 'রেন্টাল, শুরু থেকে শেষ', copyBn: 'রেন্টাল পোস্ট করুন, ড্রাইভারদের বিড পান, পছন্দেরটা অনুমোদন দিন, আর মাসিক ভাড়ায় সাপ্তাহিক হাজিরা ট্র্যাক করুন। স্ট্যাটাস বদলালে এখন নোটিফিকেশন আসে।' },
      { date: 'Sep 13', app: 'Driver app', title: 'Fewer missed requests', copy: 'Drivers whose app was closed are now woken up quietly so they stay online, and the map no longer flickers on a weak connection.', dateBn: '১৩ সেপ্টেম্বর', titleBn: 'কম রিকোয়েস্ট মিস', copyBn: 'অ্যাপ বন্ধ থাকলেও ড্রাইভারদের চুপচাপ জাগিয়ে রাখা হয় যেন তাঁরা অনলাইনে থাকেন, আর দুর্বল নেটে ম্যাপ আর ঝিলমিল করে না।' },
    ],
  },
  {
    month: 'July 2026',
    monthBn: 'জুলাই ২০২৬',
    entries: [
      { date: 'Jul 22', app: 'Shops', title: 'Arohon Shop for restaurants and pharmacies', copy: 'A new order board for shops: new orders appear in real time, accept starts preparing, and an Arohon rider picks up when it’s ready.', also: ['Food and medicine orders dispatched to the nearest rider', 'Multi branch shops supported'], dateBn: '২২ জুলাই', titleBn: 'রেস্টুরেন্ট আর ফার্মেসির জন্য Arohon Shop', copyBn: 'শপের জন্য নতুন অর্ডার বোর্ড: নতুন অর্ডার সাথে সাথে চলে আসে, গ্রহণ করলেই প্রস্তুতি শুরু, আর রেডি হলে আরোহনের রাইডার এসে নিয়ে যায়।', alsoBn: ['খাবার আর ওষুধের অর্ডার যায় সবচেয়ে কাছের রাইডারের কাছে', 'একাধিক ব্রাঞ্চের শপও চলবে'] },
      { date: 'Jul 6', app: 'Rider app', title: 'Ambulance and pickup through bidding', copy: 'Ambulance and pickup requests now reach nearby drivers through the same fast dispatch as rides, and drivers send their offers.', dateBn: '৬ জুলাই', titleBn: 'বিডিংয়ে অ্যাম্বুলেন্স আর পিকআপ', copyBn: 'অ্যাম্বুলেন্স আর পিকআপ রিকোয়েস্ট এখন রাইডের মতোই দ্রুত কাছের ড্রাইভারদের কাছে পৌঁছায়, আর ড্রাইভাররা তাঁদের অফার পাঠান।' },
      { date: 'Jul 4', app: 'Rider app', title: 'Fare boost while searching', copy: 'If no one has accepted yet, raise your fare from the search screen. It goes out as a fresh request to every nearby driver.', demo: <BoostDemo />, dateBn: '৪ জুলাই', titleBn: 'খোঁজার সময় ভাড়া বুস্ট', copyBn: 'কেউ এখনো গ্রহণ না করলে সার্চ স্ক্রিন থেকেই ভাড়া বাড়ান। এটা কাছের সব ড্রাইভারের কাছে নতুন রিকোয়েস্ট হয়ে যায়।' },
    ],
  },
];
const FILTERS: ('All' | App)[] = ['All', 'Rider app', 'Driver app', 'Shops'];

export function WhatsNewPage() {
  const { t } = useT();
  const [f, setF] = useState<(typeof FILTERS)[number]>('All');
  return (
    <>
      <section className="mx-auto max-w-[1080px] px-6 pb-12 pt-28 sm:pt-36 md:px-16">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{t('Changelog', 'চেঞ্জলগ')}</motion.p>
        <motion.h1 {...up(0.1)} className="mt-4 u-h1">
          {t('What’s new', 'আরোহনে')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('in Arohon.', 'নতুন কী এলো।')}</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>{t('New features and improvements across the rider app, the driver app and Arohon Shop. We ship every week.', 'রাইডার অ্যাপ, ড্রাইভার অ্যাপ আর Arohon Shop জুড়ে নতুন ফিচার আর উন্নতি। আমরা প্রতি সপ্তাহে নতুন কিছু আনি।')}</motion.p>
        <motion.div {...up(0.3)} className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((x) => (
            <button key={x} type="button" onClick={() => setF(x)} className={`rounded-full px-4 py-2 text-[13px] transition-colors ${f === x ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07] dark:hover:bg-white/[.1]'}`}>
              {t(x, APP_BN[x])}
            </button>
          ))}
        </motion.div>
      </section>

      <div className="mx-auto max-w-[1080px] px-6 pb-32 md:px-16">
        {LOG.map((m) => {
          const list = m.entries.filter((e) => f === 'All' || e.app === f);
          if (!list.length) return null;
          return (
            <section key={m.month} className="border-t border-black/10 pt-10 dark:border-white/10">
              <p className="text-[13px] font-medium">{t(m.month, m.monthBn)}</p>
              <div className="mt-6">
                {list.map((e) => (
                  <motion.article key={e.date + e.title} {...fade()} className="grid gap-6 pb-20 md:grid-cols-[180px_1fr] md:gap-10">
                    <div className="md:sticky md:top-28 md:self-start">
                      <p className={`text-[14px] ${muted}`}>{t(e.date, e.dateBn)}</p>
                      <span className="mt-2 inline-block rounded-full bg-black/[.05] px-2.5 py-1 text-[11px] font-medium dark:bg-white/[.08]">{t(e.app, APP_BN[e.app])}</span>
                    </div>
                    <div>
                      <h2 className="text-[24px] font-medium leading-tight tracking-[-0.015em] sm:text-[28px]">{t(e.title, e.titleBn)}</h2>
                      <p className={`mt-3 max-w-2xl text-[16px] leading-relaxed ${muted}`}>{t(e.copy, e.copyBn)}</p>
                      {e.demo && <div className="mt-8 max-w-2xl">{e.demo}</div>}
                      {e.also && (
                        <ul className="mt-6 max-w-2xl space-y-1.5 border-l border-black/10 pl-4 text-[14px] dark:border-white/10">
                          {e.also.map((a, i) => (
                            <li key={a} className={muted}>{t(a, e.alsoBn?.[i] ?? a)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
