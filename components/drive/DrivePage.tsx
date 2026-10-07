'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Clock, Phone, ShieldCheck, Star, Lifebuoy, Lock, Briefcase, MapPin, Wallet, Target, CalendarCheck } from '@phosphor-icons/react';
import { StoreButton } from '../StoreButtons';
import { ease, fade, up } from '../motion';
import { RouteMarkers } from '../RouteMarkers';
import { cityBooking, SAFETY_FEE } from '@/lib/fares';
import { useT } from '@/lib/i18n';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';
const rnd = (n: number) => Math.floor(Math.random() * n);
type Area = { en: string; bn: string };
const AREAS: Area[] = [
  { en: 'Gulshan 2', bn: 'গুলশান ২' },
  { en: 'Banani', bn: 'বনানী' },
  { en: 'Dhanmondi 27', bn: 'ধানমন্ডি ২৭' },
  { en: 'Mirpur 10', bn: 'মিরপুর ১০' },
  { en: 'Uttara', bn: 'উত্তরা' },
  { en: 'Farmgate', bn: 'ফার্মগেট' },
  { en: 'Motijheel', bn: 'মতিঝিল' },
  { en: 'Bashundhara', bn: 'বসুন্ধরা' },
  { en: 'Mohakhali', bn: 'মহাখালী' },
  { en: 'Badda', bn: 'বাড্ডা' },
];

function useLoop(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { margin: '-80px' });
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setI((x) => (x + 1) % steps), ms);
    return () => clearTimeout(t);
  }, [i, on, steps, ms]);
  return { ref, i };
}

/* ── Hero: flip "Go online" and sample requests arrive; accept to earn ── */
type Req = { id: number; from: Area; to: Area; fare: number; km: number };
function newReq(): Req {
  const from = AREAS[rnd(AREAS.length)];
  let to = AREAS[rnd(AREAS.length)];
  while (to === from) to = AREAS[rnd(AREAS.length)];
  return { id: Date.now(), from, to, fare: 90 + rnd(30) * 10, km: +(2 + Math.random() * 9).toFixed(1) };
}
const WINDOW = 8;

function DriverConsole() {
  const { t, n } = useT();
  const [online, setOnline] = useState(false);
  const [req, setReq] = useState<Req | null>(null);
  const [left, setLeft] = useState(WINDOW);
  const [earned, setEarned] = useState(0);
  const [trips, setTrips] = useState(0);

  // while online: a request arrives, its accept window counts down, then the next one comes
  useEffect(() => {
    if (!online) return setReq(null);
    if (!req) {
      const t = setTimeout(() => {
        setReq(newReq());
        setLeft(WINDOW);
      }, 1400);
      return () => clearTimeout(t);
    }
    if (left <= 0) return setReq(null);
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [online, req, left]);

  const accept = () => {
    if (!req) return;
    setEarned((e) => e + req.fare);
    setTrips((n) => n + 1);
    setReq(null);
  };

  return (
    <div className="w-full overflow-hidden rounded-[24px] bg-white text-black shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:text-white dark:ring-white/10">
      <div className="flex items-center justify-between border-b border-black/[.07] px-5 py-4 dark:border-white/[.07]">
        <div>
          <p className="text-[12px] text-black/45 dark:text-white/45">{t('Today, sample', 'আজ, নমুনা')}</p>
          <p className="text-[28px] font-semibold tabular-nums tracking-tight">
            <motion.span key={earned} initial={{ opacity: 0.3, y: -4 }} animate={{ opacity: 1, y: 0 }}>৳{n(earned.toLocaleString('en-US'))}</motion.span>
          </p>
          <p className="text-[12px] text-black/45 dark:text-white/45">{n(trips)} {t(trips === 1 ? 'trip' : 'trips', 'ট্রিপ')}</p>
        </div>
        <button
          type="button"
          onClick={() => setOnline((o) => !o)}
          aria-pressed={online}
          className={`relative flex h-11 w-[132px] items-center rounded-full px-1 text-[13px] font-semibold transition-colors duration-300 ${online ? 'bg-[#0ABF8B] text-black' : 'bg-black/[.07] text-black/60 dark:bg-white/10 dark:text-white/60'}`}
        >
          <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 35 }} className={`absolute h-9 w-9 rounded-full bg-white shadow ${online ? 'right-1' : 'left-1'}`} />
          <span className={`w-full text-center ${online ? 'pr-9' : 'pl-9'}`}>{online ? t('Online', 'অনলাইন') : t('Go online', 'অনলাইন হোন')}</span>
        </button>
      </div>

      {/* all states share one grid cell with an invisible request card, so the height never changes */}
      <div className="grid p-5">
        <div aria-hidden className="invisible flex flex-col [grid-area:1/1]">
          <RequestBody req={{ id: 0, from: AREAS[0], to: AREAS[7], fare: 160, km: 4.8 }} left={WINDOW} />
        </div>
        <div className="[grid-area:1/1]">
        <AnimatePresence mode="wait">
          {!online && (
            <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[15px] font-medium">{t('You\'re offline', 'আপনি অফলাইনে আছেন')}</p>
              <p className="mt-1 max-w-[220px] text-[13px] text-black/50 dark:text-white/50">{t('Flip the switch to see how trip requests reach you.', 'সুইচটা চাপুন, দেখুন ট্রিপের রিকোয়েস্ট কীভাবে আপনার কাছে আসে।')}</p>
            </motion.div>
          )}
          {online && !req && (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center">
              <span className="relative flex h-14 w-14 items-center justify-center">
                <span className="absolute h-full w-full animate-ping rounded-full bg-black/15 dark:bg-white/25" />
                <span className="h-4 w-4 rounded-full bg-black dark:bg-white" />
              </span>
              <p className="mt-4 text-[13px] text-black/50 dark:text-white/50">{t('Finding trips near you…', 'আশেপাশে ট্রিপ খোঁজা হচ্ছে…')}</p>
            </motion.div>
          )}
          {online && req && (
            <motion.div key={req.id} initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }} className="flex h-full flex-col">
              <RequestBody req={req} left={left} onAccept={accept} />
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/** request card body; also rendered invisibly as a size ghost so every state has the same height */
function RequestBody({ req, left, onAccept }: { req: Req; left: number; onAccept?: () => void }) {
  const accept = onAccept;
  const { t, n } = useT();
  return (
    <>
      <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-black/45 dark:text-white/45">{t('New trip request', 'নতুন ট্রিপ রিকোয়েস্ট')}</p>
                  <p className="mt-0.5 text-[26px] font-semibold tabular-nums tracking-tight">৳{n(req.fare)}</p>
                </div>
                {/* accept window ring */}
                <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" className="stroke-black/10 dark:stroke-white/10" />
                  <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" stroke="#0ABF8B" strokeLinecap="round" pathLength={1} strokeDasharray={`${left / WINDOW} 1`} style={{ transition: 'stroke-dasharray 1s linear' }} />
                  <text x="18" y="22" textAnchor="middle" fontSize="11" className="rotate-90 fill-current" style={{ transformOrigin: '18px 18px' }}>{n(left)}</text>
                </svg>
              </div>
              <div className="mt-3 text-[13px]">
                {/* pickup square and destination circle joined by a centred line, as in the app */}
                <div className="flex gap-2.5">
                  <RouteMarkers pad="py-[2px]" />
                  <div className="space-y-2.5">
                    <p className="leading-5">{t(req.from.en, req.from.bn)}</p>
                    <p className="leading-5">{t(req.to.en, req.to.bn)}</p>
                  </div>
                </div>
                <p className="my-3 text-black/45 dark:text-white/45">{t(`${req.km} km trip`, `${n(req.km)} কিমি ট্রিপ`)}</p>
              </div>
              <button type="button" onClick={accept} className="rounded-xl bg-black py-3 text-[14px] font-semibold text-white transition-transform active:scale-[.98] dark:bg-white dark:text-black">
                {t('Accept', 'গ্রহণ করুন')}
              </button>
    </>
  );
}

export function DriveHero() {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden bg-[#FDFDFD] pb-24 pt-28 dark:bg-black sm:pt-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1fr_380px] lg:gap-20">
        <div>
          <motion.p {...fade(0.05)} className={`text-[13px] ${muted}`}>{t('Drive with Arohon', 'আরোহনে গাড়ি চালান')}</motion.p>
          <motion.h1 {...fade(0.1)} className="mt-4 u-h1">
            {t('Just 2% commission.', 'মাত্র ২% কমিশন।')}
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">{t('Keep almost every taka.', 'আয়ের প্রায় পুরোটাই আপনার।')}</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>
            {t('Most ride apps take 15% to 25% of every fare. Arohon takes a flat 2%. Drive your bike, CNG, car or micro whenever you like and cash out to bKash.', 'বেশিরভাগ রাইড অ্যাপ প্রতি ভাড়া থেকে ১৫% থেকে ২৫% কেটে নেয়। আরোহন নেয় মাত্র ২%, ব্যস। বাইক, সিএনজি, কার বা মাইক্রো চালান যখন খুশি, টাকা তুলুন বিকাশে।')}
          </motion.p>
          <motion.div {...fade(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <StoreButton kind="driver" variant="dark" />
          </motion.div>
        </div>
        <motion.div {...up(0.4)}>
          <DriverConsole />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Commission: flat 2% + ৳3 safety charge + ৳5 to ৳20 booking fee, vs the 15% to 25% most apps take ── */
export function Commission() {
  const { t, n } = useT();
  const [fare, setFare] = useState(300);
  // exact cut from the live fare_config: 2% commission + ৳3 safety + city booking-fee tier
  const fee = cityBooking(fare);
  const ours = Math.round(fare * 0.02) + SAFETY_FEE + fee;
  const lo = Math.round(fare * 0.15);
  const hi = Math.round(fare * 0.25);
  const extra10 = Math.max(0, Math.round((fare * 0.2 - ours) * 10));
  const scale = (v: number) => `${Math.min(100, (v / (fare * 0.25)) * 100)}%`;
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Commission', 'কমিশন')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('See what you keep.', 'দেখুন আপনার হাতে কত থাকে।')}
            <br />
            <span className={muted}>{t('On every single trip.', 'প্রতিটা ট্রিপেই।')}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            {t('Most ride apps in Bangladesh take 15% to 25% of every fare. Arohon takes a flat 2%, plus a small safety charge and booking fee. Nothing hidden.', 'বাংলাদেশে বেশিরভাগ রাইড অ্যাপ প্রতি ভাড়া থেকে ১৫% থেকে ২৫% নেয়। আরোহন নেয় সোজা ২%, সাথে ছোট্ট একটা সেফটি চার্জ আর বুকিং ফি। কোনো লুকানো খরচ নেই।')}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[t('2% commission', '২% কমিশন'), t('৳3 safety charge', '৳৩ সেফটি চার্জ'), t('৳5 to ৳20 booking fee', '৳৫ থেকে ৳২০ বুকিং ফি')].map((c) => (
              <span key={c} className="rounded-full border border-black/10 px-3.5 py-1.5 text-[13px] dark:border-white/15">{c}</span>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade(0.1)} className={`${panel} p-6 sm:p-8`}>
          <div className="flex items-baseline justify-between">
            <p className={`text-[13px] ${muted}`}>{t('Trip fare', 'ট্রিপের ভাড়া')}</p>
            <p className="text-[22px] font-semibold tabular-nums">৳{n(fare.toLocaleString('en-US'))}</p>
          </div>
          <input
            type="range"
            min={100}
            max={1500}
            step={10}
            value={fare}
            onChange={(e) => setFare(+e.target.value)}
            aria-label={t('Trip fare', 'ট্রিপের ভাড়া')}
            className="mt-3 w-full accent-[#0ABF8B]"
          />

          <div className="mt-8 space-y-5">
            <div>
              <div className="flex justify-between text-[13px]">
                <span className="font-medium">{t('Arohon takes', 'আরোহন নেয়')}</span>
                <span className="tabular-nums">৳{n(ours)}</span>
              </div>
              <p className={`mt-1 text-[11px] tabular-nums ${muted}`}>{t(`৳${Math.round(fare * 0.02)} commission + ৳${SAFETY_FEE} safety + ৳${fee} booking`, `৳${n(Math.round(fare * 0.02))} কমিশন + ৳${n(SAFETY_FEE)} সেফটি + ৳${n(fee)} বুকিং`)}</p>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/[.06] dark:bg-white/[.08]">
                <motion.div className="h-full rounded-full bg-[#0ABF8B]" animate={{ width: scale(ours) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px]">
                <span className={muted}>{t('Most ride apps take', 'বেশিরভাগ রাইড অ্যাপ নেয়')}</span>
                <span className={`tabular-nums ${muted}`}>{t(`৳${lo} to ৳${hi}`, `৳${n(lo)} থেকে ৳${n(hi)}`)}</span>
              </div>
              <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-black/[.06] dark:bg-white/[.08]">
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-black/25 dark:bg-white/25" animate={{ width: scale(hi) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-black/45 dark:bg-white/45" animate={{ width: scale(lo) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/10 pt-6 dark:border-white/10">
            <div>
              <p className={`text-[12px] ${muted}`}>{t('You keep', 'আপনার থাকে')}</p>
              <motion.p key={fare - ours} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-[30px] font-semibold tabular-nums tracking-tight text-[#079A70] dark:text-[#0ABF8B]">
                ৳{n((fare - ours).toLocaleString('en-US'))}
              </motion.p>
            </div>
            <div className="text-right">
              <p className={`text-[12px] ${muted}`}>{t('Over 10 trips like this', 'এমন ১০টা ট্রিপে')}</p>
              <p className="text-[30px] font-semibold tabular-nums tracking-tight">+৳{n(extra10.toLocaleString('en-US'))}</p>
              <p className={`text-[11px] ${muted}`}>{t('more than an app taking 20%', '২০% কাটা অ্যাপের চেয়ে বেশি')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Why drive: three benefits, each with its own live visual ── */
const DAYS = [
  { en: 'Sat', bn: 'শনি' },
  { en: 'Sun', bn: 'রবি' },
  { en: 'Mon', bn: 'সোম' },
  { en: 'Tue', bn: 'মঙ্গল' },
  { en: 'Wed', bn: 'বুধ' },
  { en: 'Thu', bn: 'বৃহঃ' },
  { en: 'Fri', bn: 'শুক্র' },
];
function HoursViz() {
  const { ref, i } = useLoop(6, 1300);
  const { t } = useT();
  // a different pattern of online hours each beat: your week, your call
  const on = (d: number, h: number) => ((d * 3 + h * 5 + i * 7) % 11) < 4 + (i % 3);
  return (
    <div ref={ref} className="space-y-1">
      {DAYS.map((d, di) => (
        <div key={d.en} className="flex items-center gap-2">
          <span className={`w-7 text-[10px] ${muted}`}>{t(d.en, d.bn)}</span>
          <div className="grid flex-1 grid-cols-12 gap-[3px]">
            {Array.from({ length: 12 }, (_, h) => (
              <span key={h} className={`h-3 rounded-[2px] transition-colors duration-500 ${on(di, h) ? 'bg-[#0ABF8B]' : 'bg-black/[.06] dark:bg-white/[.07]'}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function CashoutViz() {
  const { ref, i } = useLoop(4, 1500);
  const { t, n } = useT();
  const bal = [1840, 1840, 0, 0][i];
  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-center justify-between rounded-xl bg-black/[.04] px-4 py-3 dark:bg-white/[.05]">
        <span className="flex items-center gap-2 text-[13px]"><Wallet size={16} /> {t('Wallet', 'ওয়ালেট')}</span>
        <motion.span key={bal} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="text-[15px] font-semibold tabular-nums">৳{n(bal.toLocaleString('en-US'))}</motion.span>
      </div>
      <div className="flex justify-center">
        <motion.span animate={{ y: i === 1 ? [0, 6, 0] : 0, opacity: i === 1 ? 1 : 0.3 }} transition={{ duration: 0.6 }} className="text-[18px]">↓</motion.span>
      </div>
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-500 ${i >= 2 ? 'bg-[#E2136E]/10' : 'bg-black/[.04] dark:bg-white/[.05]'}`}>
        <span className="text-[13px] font-medium text-[#E2136E]">{t('bKash', 'বিকাশ')}</span>
        <span className="flex items-center gap-1.5 text-[13px]">
          {i >= 2 ? <><Check size={14} weight="bold" className="text-[#0ABF8B]" /> {t('৳1,840 sent', '৳১,৮৪০ পাঠানো হয়েছে')}</> : <span className={muted}>{t('Min ৳100', 'সর্বনিম্ন ৳১০০')}</span>}
        </span>
      </div>
    </div>
  );
}
function MissionViz() {
  const { ref, i } = useLoop(11, 700);
  const { t, n } = useT();
  const done = Math.min(i, 8);
  return (
    <div ref={ref} className="flex items-center gap-5">
      <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3.5" className="stroke-black/[.07] dark:stroke-white/10" />
        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3.5" stroke="#0ABF8B" strokeLinecap="round" pathLength={1} strokeDasharray={`${done / 8} 1`} style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <div>
        <p className="text-[28px] font-semibold tabular-nums">{n(done)}/{n(8)}</p>
        <p className={`text-[13px] ${muted}`}>{done < 8 ? t(`${8 - done} more trips to finish today's mission`, `আজকের মিশন শেষ করতে আর ${n(8 - done)}টা ট্রিপ`) : t('Mission complete, bonus earned', 'মিশন শেষ, বোনাস আপনার')}</p>
      </div>
    </div>
  );
}
const WHY = [
  { icon: Clock, title: 'Set your own hours', titleBn: 'নিজের সময়ে চালান', copy: 'No shifts and no minimum hours. Go online when it suits you and offline when it does not.', copyBn: 'কোনো শিফট নেই, কোনো ন্যূনতম ঘণ্টা নেই। সুবিধামতো অনলাইন হোন, ইচ্ছেমতো অফলাইন।', Viz: HoursViz },
  { icon: Wallet, title: 'Your money, your way', titleBn: 'আপনার টাকা, আপনার নিয়মে', copy: 'Keep the cash on cash trips. In-app earnings land in your wallet, and you cash out to bKash from ৳100.', copyBn: 'ক্যাশ ট্রিপের পুরো টাকা আপনার হাতে। অ্যাপের আয় জমা হয় ওয়ালেটে, ৳১০০ থেকেই তুলে নিন বিকাশে।', Viz: CashoutViz },
  { icon: Target, title: 'Daily missions', titleBn: 'প্রতিদিনের মিশন', copy: 'Hit daily trip targets and weekly streaks to earn extra on top of your fares.', copyBn: 'দৈনিক ট্রিপ টার্গেট আর সাপ্তাহিক স্ট্রিক পূরণ করুন, ভাড়ার উপরে বাড়তি আয় করুন।', Viz: MissionViz },
];
export function WhyDrive() {
  const { t } = useT();
  return (
    <section className={wrap}>
      <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
        <h2 className={h2}>
          {t('Why drive', 'কেন চালাবেন')}
          <br />
          <span className={muted}>{t('with Arohon.', 'আরোহনে।')}</span>
        </h2>
        <p className={`max-w-md text-[17px] leading-relaxed md:justify-self-end md:pt-2 ${muted}`}>{t('Built around the way drivers in Bangladesh actually work: flexible days, cash in hand and a little extra for the busy ones.', 'বাংলাদেশের ড্রাইভাররা যেভাবে আসলে কাজ করেন, সেভাবেই বানানো: নিজের মতো দিন, হাতে নগদ টাকা, আর ব্যস্ত দিনে একটু বাড়তি।')}</p>
      </motion.div>
      <div className="mt-14 grid gap-3 md:grid-cols-3">
        {WHY.map((w, i) => (
          <motion.div key={w.title} {...fade(i * 0.08)} className={`${panel} flex flex-col p-6`}>
            <div className="flex min-h-[170px] items-center">
              <div className="w-full"><w.Viz /></div>
            </div>
            <div className="mt-6 border-t border-black/10 pt-5 dark:border-white/10">
              <p className="flex items-center gap-2 text-[16px] font-medium"><w.icon size={18} /> {t(w.title, w.titleBn)}</p>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{t(w.copy, w.copyBn)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Get on the road: vehicle tabs + document checklist that ticks itself off + 4 steps ── */
const VEH = [
  { v: 'bike', label: 'Bike', labelBn: 'বাইক', trips: 'City rides and parcels', tripsBn: 'শহরের রাইড আর পার্সেল' },
  { v: 'cng', label: 'CNG', labelBn: 'সিএনজি', trips: 'City rides', tripsBn: 'শহরের রাইড' },
  { v: 'car', label: 'Car', labelBn: 'কার', trips: 'City, intercity and rentals', tripsBn: 'শহর, আন্তঃজেলা আর রেন্টাল' },
  { v: 'micro', label: 'Micro', labelBn: 'মাইক্রো', trips: 'City, intercity and group trips', tripsBn: 'শহর, আন্তঃজেলা আর দলবেঁধে ট্রিপ' },
];
const DOCS = [
  { en: 'National ID, front and back', bn: 'জাতীয় পরিচয়পত্র, সামনে ও পেছনে' },
  { en: 'Driving licence, front and back', bn: 'ড্রাইভিং লাইসেন্স, সামনে ও পেছনে' },
  { en: 'Vehicle registration', bn: 'গাড়ির রেজিস্ট্রেশন' },
  { en: 'Insurance', bn: 'ইন্স্যুরেন্স' },
];
const STEPS = [
  { en: 'Download the app', bn: 'অ্যাপ ডাউনলোড করুন' },
  { en: 'Upload your papers', bn: 'কাগজপত্র আপলোড করুন' },
  { en: 'Get verified by our team', bn: 'আমাদের টিম যাচাই করবে' },
  { en: 'Go online', bn: 'অনলাইন হোন' },
];
export function Requirements() {
  const { t, n } = useT();
  const [v, setV] = useState(2);
  const { ref, i } = useLoop(DOCS.length + 3, 900);
  const ticked = Math.min(i, DOCS.length);
  return (
    <section className={wrap}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>{t('Get on the road', 'রাস্তায় নামুন')}</p>
        <h2 className={`mt-3 ${h2}`}>
          {t('What you need', 'চালানো শুরু করতে')}
          <br />
          <span className={muted}>{t('to start driving.', 'যা যা লাগবে।')}</span>
        </h2>
      </motion.div>
      <div className="mt-14 grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className={`${panel} p-6 sm:p-8`}>
          <p className={`text-[13px] ${muted}`}>{t('Your vehicle', 'আপনার গাড়ি')}</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {VEH.map((x, k) => (
              <button key={x.v} type="button" onClick={() => setV(k)} className={`flex flex-col items-center rounded-xl py-3 transition-all ${v === k ? 'bg-black/[.06] ring-2 ring-black dark:bg-white/[.08] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.06] dark:bg-white/[.04]'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/${x.v}.webp`} alt="" className="h-10 w-14 object-contain" />
                <span className={`mt-1 text-[12px] ${v === k ? 'font-semibold' : muted}`}>{t(x.label, x.labelBn)}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={v} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 text-[14px]">
              <span className={muted}>{t('Trips you can take: ', 'যে ট্রিপ নিতে পারবেন: ')}</span>{t(VEH[v].trips, VEH[v].tripsBn)}
            </motion.p>
          </AnimatePresence>

          <div ref={ref} className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
            <p className={`text-[13px] ${muted}`}>{t('Documents', 'কাগজপত্র')}</p>
            <ul className="mt-4 space-y-3">
              {DOCS.map((d, k) => (
                <li key={d.en} className="flex items-center gap-3 text-[14px]">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 ${k < ticked ? 'bg-[#0ABF8B] text-black' : 'border border-black/20 dark:border-white/20'}`}>
                    {k < ticked && <Check size={11} weight="bold" />}
                  </span>
                  <span className={k < ticked ? '' : muted}>{t(d.en, d.bn)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${panel} p-6 sm:p-8`}>
          <p className={`text-[13px] ${muted}`}>{t('Sign up in four steps', 'চার ধাপে সাইন আপ')}</p>
          <ol className="relative mt-6">
            <span aria-hidden className="absolute bottom-3 left-[13px] top-3 w-px bg-black/10 dark:bg-white/10" />
            <motion.span aria-hidden className="absolute left-[13px] top-3 w-px bg-[#0ABF8B]" animate={{ height: `${(Math.min(ticked, 3) / 3) * 100}%` }} transition={{ duration: 0.6 }} style={{ maxHeight: 'calc(100% - 24px)' }} />
            {STEPS.map((s, k) => {
              const done = k <= Math.min(ticked, 3) && ticked > 0 ? k < ticked : false;
              return (
                <li key={s.en} className="relative flex items-start gap-4 pb-8 last:pb-0">
                  <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] transition-colors duration-300 ${done ? 'bg-[#0ABF8B] text-black' : 'bg-[#FDFDFD] ring-1 ring-black/15 dark:bg-black dark:ring-white/20'}`}>
                    {done ? <Check size={12} weight="bold" /> : n(`0${k + 1}`)}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[15px] font-medium">{t(s.en, s.bn)}</p>
                    <p className={`mt-1 text-[13px] leading-relaxed ${muted}`}>
                      {t([
                        'Get Arohon Driver on Android and sign in with your phone number.',
                        'Photograph your NID, licence and vehicle papers in the app.',
                        'A real person on our team checks every document before your first trip.',
                        'Switch online and take your first trip request.',
                      ], [
                        'অ্যান্ড্রয়েডে আরোহন ড্রাইভার নামিয়ে ফোন নম্বর দিয়ে সাইন ইন করুন।',
                        'অ্যাপেই এনআইডি, লাইসেন্স আর গাড়ির কাগজের ছবি তুলুন।',
                        'প্রথম ট্রিপের আগে আমাদের টিমের একজন মানুষ প্রতিটা কাগজ নিজে দেখে নেন।',
                        'অনলাইন হোন, নিয়ে নিন প্রথম ট্রিপ।',
                      ])[k]}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── Driver jobs: car owners post jobs, drivers apply (real feature: JobPostsScreen) ── */
const JOBS = [
  { car: 'Toyota Axio', carBn: 'টয়োটা এক্সিও', area: 'Gulshan', areaBn: 'গুলশান', pay: 'Monthly', payBn: 'মাসিক', budget: '৳22,000', budgetBn: '৳২২,০০০', hours: '9 AM to 7 PM', hoursBn: 'সকাল ৯টা থেকে সন্ধ্যা ৭টা', exp: '3+ years', expBn: '৩+ বছর' },
  { car: 'Toyota Noah', carBn: 'টয়োটা নোয়া', area: 'Uttara', areaBn: 'উত্তরা', pay: 'Monthly', payBn: 'মাসিক', budget: '৳25,000', budgetBn: '৳২৫,০০০', hours: 'Office runs', hoursBn: 'অফিস যাতায়াত', exp: '5+ years', expBn: '৫+ বছর' },
  { car: 'Honda Vezel', carBn: 'হোন্ডা ভেজেল', area: 'Dhanmondi', areaBn: 'ধানমন্ডি', pay: 'Weekly', payBn: 'সাপ্তাহিক', budget: '৳5,500', budgetBn: '৳৫,৫০০', hours: 'School and office', hoursBn: 'স্কুল আর অফিস', exp: '2+ years', expBn: '২+ বছর' },
  { car: 'Toyota Premio', carBn: 'টয়োটা প্রিমিও', area: 'Banani', areaBn: 'বনানী', pay: 'Hourly', payBn: 'ঘণ্টাভিত্তিক', budget: '৳250/hr', budgetBn: '৳২৫০/ঘণ্টা', hours: 'Weekends', hoursBn: 'ছুটির দিন', exp: '2+ years', expBn: '২+ বছর' },
  { car: 'Mitsubishi Pajero', carBn: 'মিতসুবিশি পাজেরো', area: 'Baridhara', areaBn: 'বারিধারা', pay: 'Monthly', payBn: 'মাসিক', budget: '৳30,000', budgetBn: '৳৩০,০০০', hours: 'Family driver', hoursBn: 'পারিবারিক ড্রাইভার', exp: '6+ years', expBn: '৬+ বছর' },
];
export function DriverJobs() {
  const { t } = useT();
  const { ref, i } = useLoop(JOBS.length, 2800);
  const rows = [0, 1, 2].map((k) => JOBS[(k + i) % JOBS.length]);
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Driver jobs', 'ড্রাইভার চাকরি')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Want a steady job?', 'স্থায়ী চাকরি চান?')}
            <br />
            <span className={muted}>{t('Owners are hiring.', 'গাড়ির মালিকেরা খুঁজছেন।')}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            {t('Car owners post driver jobs on Arohon, paid by the hour, week or month. Browse them in the driver app, apply in a tap and get hired by someone who likes your profile.', 'গাড়ির মালিকেরা আরোহনে ড্রাইভার চাকরির পোস্ট দেন, বেতন ঘণ্টা, সপ্তাহ বা মাস হিসেবে। ড্রাইভার অ্যাপে দেখুন, এক ট্যাপে আবেদন করুন, প্রোফাইল পছন্দ হলেই চাকরি পাকা।')}
          </p>
        </motion.div>
        <div ref={ref} className={`${panel} p-2`}>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="flex items-center gap-2 text-[13px] font-medium"><Briefcase size={16} /> {t('Job posts', 'চাকরির পোস্ট')}</span>
            <span className={`text-[12px] ${muted}`}>{t('Sample posts', 'নমুনা পোস্ট')}</span>
          </div>
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((j) => (
              <motion.div key={j.car + j.area} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }} className="flex items-center gap-4 border-t border-black/[.06] px-4 py-4 dark:border-white/[.06]">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium">{t(`${j.car} driver`, `${j.carBn} ড্রাইভার`)}</p>
                  <p className={`mt-0.5 flex flex-wrap items-center gap-x-3 text-[12px] ${muted}`}>
                    <span className="flex items-center gap-1"><MapPin size={11} weight="fill" />{t(j.area, j.areaBn)}</span>
                    <span>{t(j.hours, j.hoursBn)}</span>
                    <span>{t(j.exp, j.expBn)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-semibold tabular-nums">{t(j.budget, j.budgetBn)}</p>
                  <p className={`text-[11px] ${muted}`}>{t(j.pay, j.payBn)}</p>
                </div>
                <span className="hidden rounded-full bg-black px-3.5 py-1.5 text-[12px] font-semibold text-white sm:block dark:bg-white dark:text-black">{t('Apply', 'আবেদন')}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ── Driver safety: Linear /security grid ── */
const SAFE = [
  { icon: Lock, title: 'OTP at pickup', titleBn: 'পিকআপে ওটিপি', copy: 'Every rider confirms with a one-time code, so you always pick up the right person.', copyBn: 'প্রতিটা যাত্রী একটা ওয়ান টাইম কোড দিয়ে নিশ্চিত করেন, তাই ভুল মানুষ তোলার ভয় নেই।' },
  { icon: Phone, title: 'One-tap help', titleBn: 'এক ট্যাপে সাহায্য', copy: 'Call support or your emergency contact from inside the trip screen.', copyBn: 'ট্রিপ স্ক্রিন থেকেই সাপোর্ট বা ইমার্জেন্সি কন্টাক্টকে কল করুন।' },
  { icon: ShieldCheck, title: 'Live trip sharing', titleBn: 'লাইভ ট্রিপ শেয়ার', copy: 'Share your live trip with someone you trust, and save an emergency contact in the app.', copyBn: 'বিশ্বস্ত কারও সাথে লাইভ ট্রিপ শেয়ার করুন, অ্যাপে ইমার্জেন্সি কন্টাক্ট সেভ রাখুন।' },
  { icon: Star, title: 'Two-way ratings', titleBn: 'দুই দিকেই রেটিং', copy: 'Riders are rated too, which keeps everyone respectful.', copyBn: 'যাত্রীরাও রেটিং পান, তাই সবাই থাকেন সম্মানের সাথে।' },
  { icon: Lifebuoy, title: 'Real support', titleBn: 'সত্যিকারের সাপোর্ট', copy: 'Questions about payouts, documents or a trip go to real people on our team.', copyBn: 'পেমেন্ট, কাগজপত্র বা ট্রিপ নিয়ে প্রশ্ন? উত্তর দেবেন আমাদের টিমের আসল মানুষ।' },
  { icon: CalendarCheck, title: 'Your preferences', titleBn: 'আপনার পছন্দমতো', copy: 'Filter requests by distance, zone and destination before you accept.', copyBn: 'গ্রহণ করার আগে দূরত্ব, এলাকা আর গন্তব্য দেখে রিকোয়েস্ট বেছে নিন।' },
];
export function DriverSafety() {
  const { t } = useT();
  return (
    <section className={wrap}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>{t('Safety', 'নিরাপত্তা')}</p>
        <h2 className={`mt-3 ${h2}`}>
          {t('Safe on every trip,', 'প্রতিটা ট্রিপে নিরাপদ,')}
          <br />
          <span className={muted}>{t('for drivers too.', 'ড্রাইভারের জন্যও।')}</span>
        </h2>
      </motion.div>
      <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {SAFE.map((s, i) => (
          <motion.div key={s.title} {...fade(i * 0.05)}>
            <p className="flex items-center gap-2 text-[15px] font-medium"><s.icon size={16} className="text-black/40 dark:text-white/40" /> {t(s.title, s.titleBn)}</p>
            <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{t(s.copy, s.copyBn)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Driver FAQ + close ── */
const DFAQ = [
  ['What do I need to sign up?', 'Your National ID, driving licence, vehicle registration and insurance. You upload them from your phone in the Arohon Driver app.', 'সাইন আপ করতে কী লাগবে?', 'জাতীয় পরিচয়পত্র, ড্রাইভিং লাইসেন্স, গাড়ির রেজিস্ট্রেশন আর ইন্স্যুরেন্স। আরোহন ড্রাইভার অ্যাপে ফোন থেকেই আপলোড করে দিন।'],
  ['Which vehicles can I drive with?', 'Bike, CNG, car, Car Plus, micro and Hiace for rides, plus pickups and trucks for goods and ambulances for medical trips.', 'কোন কোন গাড়ি নিয়ে চালানো যায়?', 'রাইডের জন্য বাইক, সিএনজি, কার, কার প্লাস, মাইক্রো আর হায়েস। মালামালের জন্য পিকআপ ও ট্রাক, আর রোগী পরিবহনে অ্যাম্বুলেন্স।'],
  ['How do I get paid?', 'On cash trips you keep the fare from the rider. In-app payments go to your Arohon wallet, and you can cash out to bKash from ৳100.', 'টাকা পাব কীভাবে?', 'ক্যাশ ট্রিপে যাত্রীর দেওয়া ভাড়া সরাসরি আপনার হাতে। অ্যাপে পেমেন্ট হলে জমা হয় আরোহন ওয়ালেটে, ৳১০০ থেকেই তুলে নিতে পারবেন বিকাশে।'],
  ['How much does Arohon take?', 'A flat 2% commission on each trip, plus a ৳3 safety charge and a booking fee from ৳5 to ৳20 depending on the fare. On a ৳100 trip that is ৳10 in total. Most ride apps take 15% to 25%.', 'আরোহন কত নেয়?', 'প্রতি ট্রিপে মাত্র ২% কমিশন, সাথে ৳৩ সেফটি চার্জ আর ভাড়া অনুযায়ী ৳৫ থেকে ৳২০ বুকিং ফি। ৳১০০ ভাড়ার ট্রিপে সব মিলিয়ে ৳১০, আপনার হাতে থাকে ৳৯০। বেশিরভাগ রাইড অ্যাপ নেয় ১৫% থেকে ২৫%।'],
  ['Do I have to drive fixed hours?', 'No. You decide when to go online and which requests to accept.', 'নির্দিষ্ট সময় ধরে চালাতে হবে?', 'না। কখন অনলাইন হবেন আর কোন রিকোয়েস্ট নেবেন, সেটা আপনিই ঠিক করবেন।'],
  ['Is the driver app on iPhone?', 'Arohon Driver is available on Android.', 'ড্রাইভার অ্যাপ কি আইফোনে আছে?', 'আরোহন ড্রাইভার পাওয়া যাচ্ছে অ্যান্ড্রয়েডে।'],
];
export function DriverFaq() {
  const { t } = useT();
  const [open, setOpen] = useState(0);
  return (
    <section className={`${wrap} grid gap-12 md:grid-cols-[1fr_1.6fr]`}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>{t('FAQ', 'প্রশ্নোত্তর')}</p>
        <h2 className={`mt-3 ${h2}`}>
          {t('Driver questions,', 'ড্রাইভারদের প্রশ্ন,')}
          <br />
          <span className={muted}>{t('answered.', 'উত্তরসহ।')}</span>
        </h2>
      </motion.div>
      <div className="border-t border-black/10 dark:border-white/10">
        {DFAQ.map(([q, a, qBn, aBn], i) => (
          <div key={q} className="border-b border-black/10 dark:border-white/10">
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="group flex w-full items-center justify-between gap-6 py-5 text-left">
              <span className={`text-[17px] font-medium ${open === i ? '' : 'text-black/70 group-hover:text-black dark:text-[#D0D6E0] dark:group-hover:text-white'}`}>{t(q, qBn)}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="shrink-0 text-[20px] leading-none text-black/40 dark:text-white/40">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                  <p className={`max-w-xl pb-6 text-[15px] leading-relaxed ${muted}`}>{t(a, aBn)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

export function DriveCTA() {
  const { t, href } = useT();
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
      <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
        {t('Your next trip', 'পরের ট্রিপ')}
        <br />
        <span className={muted}>{t('is a tap away.', 'মাত্র এক ট্যাপ দূরে।')}</span>
      </motion.h2>
      <motion.div {...fade(0.15)} className="mt-10 flex justify-center">
        <StoreButton kind="driver" variant="dark" />
      </motion.div>
      <a href={href('/ride')} className={`group mt-6 inline-flex items-center gap-1 text-sm font-medium ${muted} transition-colors hover:text-black dark:hover:text-white`}>
        {t('Looking for a ride instead?', 'রাইড খুঁজছেন?')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </section>
  );
}
