'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, LinkedinLogo } from '@phosphor-icons/react';
import { RouteMarkers } from '../RouteMarkers';
import { ease, fade, up } from '../motion';
import { BDMap } from '../home/Sections';
import { StoreBadges } from '../StoreButtons';
import { useT } from '@/lib/i18n';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';

/* ── Letter: paragraphs rise in as you read, the signature writes itself at the end ── */
const LETTER_BN = [
  'বাংলাদেশে চলাফেরা মানেই এতদিন ছিল দরদাম। সিএনজি স্ট্যান্ডে, এয়ারপোর্টের গেটে, ঈদে বাড়ি ফেরার আগে বাস কাউন্টারে। ভাড়া কত হবে, ঠিক জানতেন না। কার সাথে যাচ্ছেন, সেটাও না।',
  'ড্রাইভারদের অবস্থাও সহজ ছিল না। বেশিরভাগ রাইড অ্যাপ প্রতি ভাড়া থেকে ১৫% থেকে ২৫% কেটে নেয়। ঢাকার জ্যামে বারো ঘণ্টা গাড়ি চালানো একজন ড্রাইভারের কাছে এটাই কিছু জমানো আর কিছুই না জমানোর পার্থক্য।',
  'আমরা আরোহন শুরু করেছি দুই দিকই একসাথে ঠিক করতে। রাইডার বুক করার আগেই ভাড়া দেখেন, কে আসছেন তাও জানেন। ড্রাইভার রাখেন প্রায় প্রতিটি টাকা, মাত্র ২% ফ্ল্যাট কমিশন, লুকানো কিছু নেই।',
  'এরপর মানুষ আরও চাইলেন। শহরের ওপারে একটা পার্সেল। মাঝরাতে ওষুধ। পরিবার নিয়ে কক্সবাজার যাওয়ার জন্য একটা মাইক্রো। কেউ অসুস্থ হলে অ্যাম্বুলেন্স। তাই আমরা সবই বানিয়েছি, একই অ্যাপে, একই কথা দিয়ে: ন্যায্য ভাড়া, যাচাই করা ড্রাইভার, কোনো চমক নেই।',
  'আমরা বাংলাদেশি কোম্পানি, বাংলাদেশের জন্যই বানাচ্ছি। প্রতিটি বিভাগ থেকে ড্রাইভাররা আমাদের সাথে যুক্ত হয়েছেন, আর সংখ্যাটা বাড়ছেই। আমাদের সাথে চড়ার জন্য, চালানোর জন্য, আর এরপর কী বানাব তা জানানোর জন্য ধন্যবাদ।',
];
const LETTER = [
  'Getting around Bangladesh has always meant bargaining. At the CNG stand, at the airport gate, at the bus counter before a trip home for Eid. You never quite knew the price, and you never quite knew who you were riding with.',
  'Drivers had it no easier. Most ride apps take 15% to 25% of every fare. For a driver working twelve hours in Dhaka traffic, that is the difference between saving something and saving nothing.',
  'We started Arohon to fix both sides at once. Riders see the fare before they book and know exactly who is coming. Drivers keep almost every taka, with a flat 2% commission and nothing hidden.',
  'From there, people asked for more. A parcel across town. Medicine at midnight. A micro for the family trip to Cox’s Bazar. An ambulance when someone is sick. So we built them, in the same app, with the same promise: a fair price, a checked driver, no surprises.',
  'We are a Bangladeshi company, building for Bangladesh. Drivers have joined us from every division, and we are still counting. Thank you for riding with us, driving with us, and telling us what to build next.',
];
/* ── P.S.: the founder's LinkedIn as a ride request. The match plays once in view, the button is a real link ── */
const LINKEDIN = 'https://www.linkedin.com/in/ashikprottoydesign';
function FounderRide() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: '-60px' });
  const [step, setStep] = useState(0); // 0 searching, 1 accepted, 2 arriving
  useEffect(() => {
    if (!on) return;
    const a = setTimeout(() => setStep(1), 1800);
    const b = setTimeout(() => setStep(2), 3200);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [on]);
  const { t, n } = useT();
  const status = t(['Finding your founder…', 'Ashik accepted your ride', 'Arriving in 1 tap'], ['আপনার ফাউন্ডারকে খোঁজা হচ্ছে…', 'আশিক আপনার রাইড নিয়েছেন', `${n(1)} ট্যাপেই পৌঁছে যাবেন`])[step];
  return (
    <div ref={ref} className="mt-14">
      <p className="font-[family-name:var(--font-sign)] text-[34px] leading-none text-black/80 dark:text-white/80">P.S.</p>
      <p className="mt-3 text-[18px] leading-[1.7] text-black/80 dark:text-white/80">{t('I answer every message myself. Want to talk about Arohon, design or Bangladesh? The ride is on me.', 'প্রতিটি মেসেজের উত্তর আমি নিজেই দিই। আরোহন, ডিজাইন বা বাংলাদেশ নিয়ে কথা বলতে চান? রাইডটা আমার পক্ষ থেকে।')}</p>
      <div className="group mt-6 rounded-[24px] bg-white p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:ring-white/10">
        <div className="flex items-center gap-2 text-[13px]">
          <span className={`h-2 w-2 rounded-full ${step === 0 ? 'bg-black/40 dark:bg-white/40' : 'bg-[#079A70]'}`} />
          <span className="relative h-5 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease }} className="absolute inset-0 font-medium">{status}</motion.span>
            </AnimatePresence>
          </span>
        </div>
        <div className="mt-5 flex gap-3">
          <RouteMarkers pad="py-[3px]" />
          <div className="flex-1 space-y-3 text-[15px]">
            <p className="leading-[22px]">{t('You, right here', 'আপনি, এখানেই')}</p>
            <p className="leading-[22px] font-medium">{t('Ashik Prottoy, on LinkedIn', 'আশিক প্রত্যয়, লিংকডইনে')}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-4 border-t border-black/[.07] pt-5 dark:border-white/[.07]">
          <span className="relative h-11 w-16 shrink-0">
            <img src="/icons/line_cng.png" alt="" className="absolute inset-0 h-full w-full object-contain opacity-60 transition-opacity duration-500 group-hover:opacity-0 dark:invert" />
            <img src="/icons/cng.webp" alt="" className="absolute inset-0 h-full w-full -translate-x-2 object-contain opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold">{t('CNG, his usual', 'সিএনজি, তার রোজকার')}</span>
            <span className={`text-[12px] ${muted}`}>{t('Co-founder and CEO', 'কো-ফাউন্ডার ও সিইও')}</span>
          </span>
          <span className="text-right">
            <span className="block text-[12px] text-black/40 line-through dark:text-white/40">৳{n(180)}</span>
            <span className="text-[17px] font-semibold tabular-nums">৳{n(0)}</span>
          </span>
        </div>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black/[.05] py-3.5 text-[15px] font-semibold transition-colors duration-300 group-hover:bg-black group-hover:text-white dark:bg-white/[.08] dark:group-hover:bg-white dark:group-hover:text-black">
          <LinkedinLogo size={18} weight="fill" /> {t('Connect on LinkedIn', 'লিংকডইনে যুক্ত হোন')} <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

function Letter() {
  const end = useRef<HTMLDivElement>(null);
  const signed = useInView(end, { once: true, margin: '-80px' });
  const { t } = useT();
  return (
    <article className="mx-auto max-w-[640px]">
      <motion.p {...fade()} className={`text-[13px] ${muted}`}>{t('A letter from our co-founder', 'আমাদের কো-ফাউন্ডারের চিঠি')}</motion.p>
      <motion.h2 {...fade(0.05)} className={`mt-3 ${h2}`}>
        {t('Why we built', 'কেন আমরা বানালাম')}
        <br />
        <span className={muted}>{t('Arohon.', 'আরোহন।')}</span>
      </motion.h2>
      <div className="mt-12 space-y-6 text-[18px] leading-[1.7] text-black/80 dark:text-white/80">
        <motion.p {...fade()}>{t('Dear rider, dear driver,', 'প্রিয় রাইডার, প্রিয় ড্রাইভার,')}</motion.p>
        {t(LETTER, LETTER_BN).map((p) => (
          <motion.p key={p.slice(0, 20)} {...fade()}>{p}</motion.p>
        ))}
      </div>
      <div ref={end} className="mt-12 border-t border-black/10 pt-8 dark:border-white/10">
        <div className="min-w-0">
          {/* the signature "writes" left to right; padding + negative inset so swashes are never clipped */}
          <motion.p
            className="-my-3 -ml-2 inline-block py-3 pl-2 pr-6 font-[family-name:var(--font-sign)] text-[48px] leading-[1.2] text-black dark:text-white"
            initial={{ clipPath: 'inset(-20% 100% -20% -10%)' }}
            animate={signed ? { clipPath: 'inset(-20% -10% -20% -10%)' } : undefined}
            transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.2 }}
          >
            Ashik Prottoy
          </motion.p>
          <p className="mt-1 text-[15px] font-medium">{t('Ashik Prottoy', 'আশিক প্রত্যয়')}</p>
          <p className={`text-[14px] ${muted}`}>{t('Co-founder and CEO, Arohon', 'কো-ফাউন্ডার ও সিইও, আরোহন')}</p>
        </div>
      </div>
      <FounderRide />
    </article>
  );
}

/* ── Fair by design: the commission comparison draws itself ── */
function CommissionBars() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: '-80px' });
  const { t, n } = useT();
  const rows = [
    { k: t('Most ride apps', 'বেশিরভাগ রাইড অ্যাপ'), v: t('15% to 25%', `${n(15)}% থেকে ${n(25)}%`), w: 25, me: false },
    { k: t('Arohon', 'আরোহন'), v: `${n(2)}%`, w: 2, me: true },
  ];
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{t('Commission on every fare', 'প্রতি ভাড়ায় কমিশন')}</p>
      <div className="mt-6 space-y-6">
        {rows.map((r, i) => (
          <div key={r.k}>
            <div className="flex items-baseline justify-between text-[15px]">
              <span className={r.me ? 'font-semibold' : ''}>{r.k}</span>
              <span className={`tabular-nums ${r.me ? 'font-semibold text-[#079A70] dark:text-[#0ABF8B]' : muted}`}>{r.v}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-black/[.05] dark:bg-white/[.07]">
              <motion.div
                className={`h-full rounded-full ${r.me ? 'bg-[#079A70]' : 'bg-black/30 dark:bg-white/30'}`}
                initial={{ width: 0 }}
                animate={on ? { width: `${(r.w / 25) * 100}%` } : undefined}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.25, ease }}
                style={{ minWidth: on ? 8 : 0 }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className={`mt-6 border-t border-black/10 pt-5 text-[14px] dark:border-white/10 ${muted}`}>{t('Plus a ৳3 safety charge and a small booking fee. On a ৳100 trip, the driver keeps ৳90.', `সাথে ৳${n(3)} সেফটি চার্জ আর ছোট্ট একটা বুকিং ফি। ৳${n(100)} এর ট্রিপে ড্রাইভার রাখেন ৳${n(90)}।`)}</p>
    </div>
  );
}

const TEAM = [
  { n: 'Ashik Prottoy', nBn: 'আশিক প্রত্যয়', r: 'Co-founder and CEO', rBn: 'কো-ফাউন্ডার ও সিইও', v: 'cng', ride: 'CNG', rideBn: 'সিএনজি' },
  { n: 'Momen Sarkar', nBn: 'মোমেন সরকার', r: 'Co-founder and Business Analyst', rBn: 'কো-ফাউন্ডার ও বিজনেস অ্যানালিস্ট', v: 'micro', ride: 'Micro', rideBn: 'মাইক্রো' },
  { n: 'Sabbir Hossain', nBn: 'সাব্বির হোসেন', r: 'Co-founder and Head of Engineering', rBn: 'কো-ফাউন্ডার ও হেড অব ইঞ্জিনিয়ারিং', v: 'bike', ride: 'Bike', rideBn: 'বাইক' },
  { n: 'Ashiquzzaman', nBn: 'আশিকুজ্জামান', r: 'Head of Operations', rBn: 'হেড অব অপারেশনস', v: 'car_plus', ride: 'Car Plus', rideBn: 'কার প্লাস' },
  { n: 'Md Nazim', nBn: 'মোঃ নাজিম', r: 'Head of Driver Experience', rBn: 'হেড অব ড্রাইভার এক্সপেরিয়েন্স', v: 'pickup', ride: 'Pickup, full of T-shirts', rideBn: 'পিকআপ, টি-শার্টে ঠাসা' },
  { n: 'Symoon Haque Siam', nBn: 'সাইমুন হক সিয়াম', r: 'Marketing Lead', rBn: 'মার্কেটিং লিড', v: 'ev_bike', ride: 'EV bike', rideBn: 'ইভি বাইক' },
];
/** Hover (or tap) a person and their usual ride drives into the tile. */
function Team() {
  const { t, bn } = useT();
  return (
    <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
      {TEAM.map((p, i) => (
        <motion.div key={p.n} {...fade(i * 0.06)} tabIndex={0} className="group outline-none">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/[.03] dark:bg-white/[.05]">
            {/* line drawing by default, the real vehicle on hover or tap */}
            <img src={`/icons/line_${p.v}.png`} alt="" className="absolute inset-0 m-auto h-[56%] w-[80%] object-contain opacity-60 transition-all duration-500 group-hover:scale-95 group-hover:opacity-0 group-focus:scale-95 group-focus:opacity-0 dark:invert" />
            <img src={`/icons/${p.v}.webp`} alt="" className="absolute inset-0 m-auto h-[56%] w-[80%] scale-90 object-contain opacity-0 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-100 group-hover:opacity-100 group-focus:-translate-y-2 group-focus:scale-100 group-focus:opacity-100" />
            <p className={`absolute inset-x-0 bottom-3 text-center text-[12px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus:opacity-100 ${muted}`}>
              {bn ? <>সাধারণত চড়েন <span className="font-medium text-black dark:text-white">{p.rideBn}</span></> : <>Usually rides <span className="font-medium text-black dark:text-white">{p.ride}</span></>}
            </p>
          </div>
          <p className="mt-4 text-[15px] font-medium">{t(p.n, p.nBn)}</p>
          <p className={`mt-0.5 text-[13px] leading-snug ${muted}`}>{t(p.r, p.rBn)}</p>
        </motion.div>
      ))}
    </div>
  );
}

const BELIEFS = [
  { t: 'Fair to drivers', tBn: 'ড্রাইভারের প্রতি ন্যায্য', c: 'A flat 2% commission. Drivers are the product, and they should keep what they earn.', cBn: 'মাত্র ২% ফ্ল্যাট কমিশন। ড্রাইভাররাই আমাদের আসল শক্তি, আয়ের পুরোটা প্রায় তাদেরই প্রাপ্য।' },
  { t: 'Clear to riders', tBn: 'রাইডারের কাছে স্বচ্ছ', c: 'The fare is set before you book. No bargaining at the door, no surprise at the end.', cBn: 'বুক করার আগেই ভাড়া ঠিক। দরজায় দরদাম নেই, শেষে কোনো চমকও নেই।' },
  { t: 'Safe by default', tBn: 'শুরু থেকেই নিরাপদ', c: 'Every driver’s ID, licence and papers are checked by our team before their first trip.', cBn: 'প্রথম ট্রিপের আগেই প্রত্যেক ড্রাইভারের আইডি, লাইসেন্স আর কাগজপত্র আমাদের টিম যাচাই করে।' },
  { t: 'Built here', tBn: 'এখানেই তৈরি', c: 'Designed in Dhaka for Bangladeshi roads, Bangladeshi prices and Bangladeshi families.', cBn: 'ঢাকায় বানানো, বাংলাদেশের রাস্তা, বাংলাদেশের দাম আর বাংলাদেশি পরিবারের কথা ভেবে।' },
];

const SERVICES = [
  { k: 'Rides', kBn: 'রাইড', c: 'Bike, CNG, car, micro and Hiace', cBn: 'বাইক, সিএনজি, কার, মাইক্রো আর হায়েস', v: 'car', href: '/ride' },
  { k: 'Parcel', kBn: 'পার্সেল', c: 'Across Dhaka or to any district', cBn: 'ঢাকার ভেতরে বা যেকোনো জেলায়', v: 'bike', href: '/services/parcel' },
  { k: 'Rental', kBn: 'রেন্টাল', c: 'A car and driver by the hour or month', cBn: 'ঘণ্টা বা মাস ধরে গাড়ি আর ড্রাইভার', v: 'car_plus', href: '/services/rental' },
  { k: 'Business', kBn: 'বিজনেস', c: 'Office rides and deliveries', cBn: 'অফিসের রাইড আর ডেলিভারি', v: 'hiace', href: '/services/business' },
  { k: 'Airport rides', kBn: 'এয়ারপোর্ট রাইড', c: 'Eight airports, booked ahead', cBn: 'আটটি এয়ারপোর্ট, আগে থেকেই বুক করুন', v: 'micro', href: '/services/airport' },
  { k: 'Ambulance', kBn: 'অ্যাম্বুলেন্স', c: 'Any hour, from the same app', cBn: 'যেকোনো সময়, একই অ্যাপ থেকে', v: 'ambulance', href: '/services/ambulance' },
];

export function AboutPage() {
  const { t, n, href } = useT();
  return (
    <>
      <section className="bg-[#FDFDFD] px-6 pb-20 pt-28 text-center dark:bg-black sm:pt-36">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{t('About Arohon', 'আরোহন সম্পর্কে')}</motion.p>
        <motion.h1 {...up(0.1)} className="mx-auto mt-4 max-w-4xl u-h1">
          {t('Moving Bangladesh,', 'বাংলাদেশকে এগিয়ে নিচ্ছি,')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('fairly.', 'ন্যায্যভাবে।')}</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mx-auto mt-6 max-w-xl text-[17px] leading-relaxed ${muted}`}>{t('Arohon is a Bangladeshi ride and delivery app. One app for getting around, sending things and getting help, built to be fair to the people who ride and the people who drive.', 'আরোহন একটি বাংলাদেশি রাইড ও ডেলিভারি অ্যাপ। চলাফেরা, জিনিস পাঠানো আর বিপদে সাহায্য, সব এক অ্যাপে। যারা চড়েন আর যারা চালান, দুই পক্ষের প্রতিই ন্যায্য।')}</motion.p>
      </section>

      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <motion.div {...fade()}>
            <p className={`text-[13px] ${muted}`}>{t('Who we are', 'আমরা কারা')}</p>
            <h2 className={`mt-3 ${h2}`}>
              {t('A ride app', 'একটি রাইড অ্যাপ')}
              <br />
              <span className={muted}>{t('that starts with the driver.', 'যার শুরু ড্রাইভারকে দিয়ে।')}</span>
            </h2>
            <div className={`mt-8 max-w-lg space-y-5 text-[16px] leading-relaxed ${muted}`}>
              <p>{t('When drivers keep what they earn, they stay, they care, and riders get better trips. That idea shapes everything we build, from the 2% commission to how we check every driver before their first ride.', 'ড্রাইভার যখন নিজের আয় নিজে রাখেন, তিনি থেকে যান, যত্ন নেন, আর রাইডার পান আরও ভালো ট্রিপ। এই ভাবনাই আমাদের সবকিছুর ভিত্তি, ২% কমিশন থেকে শুরু করে প্রথম রাইডের আগে প্রত্যেক ড্রাইভারকে যাচাই করা পর্যন্ত।')}</p>
              <p>{t('Today Arohon covers city rides, intercity trips, parcels, rentals, business transport, airport rides and ambulances, with drivers joining from every division of the country.', 'আজ আরোহনে আছে শহরের রাইড, আন্তঃজেলা ট্রিপ, পার্সেল, রেন্টাল, বিজনেস ট্রান্সপোর্ট, এয়ারপোর্ট রাইড আর অ্যাম্বুলেন্স। দেশের প্রতিটি বিভাগ থেকে ড্রাইভাররা যুক্ত হচ্ছেন।')}</p>
            </div>
          </motion.div>
          <motion.div {...fade(0.1)} className="mx-auto w-full max-w-[440px]">
            <BDMap label={t('Arohon trips across Bangladesh', 'সারা বাংলাদেশে আরোহনের ট্রিপ')} />
          </motion.div>
        </div>
      </section>

      <section className={wrap}>
        <Letter />
      </section>

      <section className={wrap}>
        <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
          <div>
            <p className={`text-[13px] ${muted}`}>{t('Team', 'টিম')}</p>
            <h2 className={`mt-3 ${h2}`}>
              {t('The people', 'আরোহনের পেছনের')}
              <br />
              <span className={muted}>{t('behind Arohon.', 'মানুষগুলো।')}</span>
            </h2>
          </div>
          <p className={`self-end text-[16px] leading-relaxed ${muted}`}>{t('A small team in Dhaka building the ride app we always wanted to use. Hover over anyone to see how they get to work.', 'ঢাকার ছোট্ট একটা টিম, বানাচ্ছি সেই রাইড অ্যাপ যেটা আমরা সবসময় চেয়েছি। কারও ওপর হোভার করুন, দেখুন তিনি কীসে চড়ে অফিসে আসেন।')}</p>
        </motion.div>
        <Team />
      </section>

      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <motion.div {...fade()}>
            <p className={`text-[13px] ${muted}`}>{t('What we believe', 'আমরা যা বিশ্বাস করি')}</p>
            <h2 className={`mt-3 ${h2}`}>
              {t('Fair is a feature.', 'ন্যায্যতা আমাদের ফিচার।')}
              <br />
              <span className={muted}>{t('Not a promotion.', 'অফার নয়।')}</span>
            </h2>
          </motion.div>
          <CommissionBars />
        </div>
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
          {BELIEFS.map((b, i) => (
            <motion.div key={b.t} {...fade(i * 0.06)} className="bg-[#FDFDFD] p-7 dark:bg-black">
              <p className={`font-mono text-[11px] ${muted}`}>{n(`0${i + 1}`)}</p>
              <p className="mt-6 text-[18px] font-medium tracking-tight">{t(b.t, b.tBn)}</p>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{t(b.c, b.cBn)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={wrap}>
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('One app', 'এক অ্যাপ')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Everything that moves,', 'চলাচলের সবকিছু,')}
            <br />
            <span className={muted}>{t('in one place.', 'এক জায়গায়।')}</span>
          </h2>
        </motion.div>
        <ul className="mt-14 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
          {SERVICES.map((s, i) => (
            <motion.li key={s.k} {...fade(i * 0.04)}>
              <Link href={href(s.href)} className="group flex items-center gap-5 py-4 sm:gap-8">
                <span className="relative h-12 w-20 shrink-0">
                  <img src={`/icons/line_${s.v}.png`} alt="" className="absolute inset-0 h-full w-full object-contain opacity-60 transition-opacity duration-300 group-hover:opacity-0 dark:invert" />
                  <img src={`/icons/${s.v}.webp`} alt="" className="absolute inset-0 h-full w-full scale-90 object-contain opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                </span>
                <span className="flex-1 sm:flex sm:items-baseline sm:gap-6">
                  <span className="block text-[18px] font-medium tracking-tight sm:w-48">{t(s.k, s.kBn)}</span>
                  <span className={`text-[14px] ${muted}`}>{t(s.c, s.cBn)}</span>
                </span>
                <ArrowRight size={16} className="shrink-0 text-black/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-black dark:text-white/30 dark:group-hover:text-white" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>

      <section className={wrap}>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 md:grid-cols-3 dark:border-white/10 dark:bg-white/10">
          {[
            { k: t('Company', 'কোম্পানি'), v: t('Arohon Limited', 'আরোহন লিমিটেড'), c: t('Navana HR Tower 1, Gulshan Link Road, Dhaka', 'নাভানা এইচআর টাওয়ার ১, গুলশান লিংক রোড, ঢাকা'), href: '/contact', cta: t('Contact us', 'যোগাযোগ করুন') },
            { k: t('Careers', 'ক্যারিয়ার'), v: t('Build it with us', 'আমাদের সাথে গড়ুন'), c: t('Engineers, designers and operators who care about Bangladesh.', 'ইঞ্জিনিয়ার, ডিজাইনার আর অপারেটর, যারা বাংলাদেশকে নিয়ে ভাবেন।'), href: '/join-our-team', cta: t('Open roles', 'খালি পদ') },
            { k: t('Drivers', 'ড্রাইভার'), v: t('Just 2% commission', 'মাত্র ২% কমিশন'), c: t('Bring your bike, CNG, car or micro and drive on your hours.', 'আপনার বাইক, সিএনজি, কার বা মাইক্রো নিয়ে আসুন, চালান নিজের সময়ে।'), href: '/driver', cta: t('Drive with Arohon', 'আরোহনে গাড়ি চালান') },
          ].map((x, i) => (
            <motion.div key={x.k} {...fade(i * 0.06)} className="flex flex-col bg-[#FDFDFD] p-7 dark:bg-black">
              <p className={`text-[13px] ${muted}`}>{x.k}</p>
              <p className="mt-6 text-[20px] font-medium tracking-tight">{x.v}</p>
              <p className={`mt-2 flex-1 text-[14px] leading-relaxed ${muted}`}>{x.c}</p>
              <Link href={href(x.href)} className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium">{x.cta} <ArrowRight size={13} /></Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
        <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
          {t('Come along', 'চলুন,')}
          <br />
          <span className={muted}>{t('for the ride.', 'একসাথে এগোই।')}</span>
        </motion.h2>
        <motion.div {...fade(0.15)} className="mt-10 flex justify-center"><StoreBadges className="justify-center" /></motion.div>
      </section>
    </>
  );
}
