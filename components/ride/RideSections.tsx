'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Check, CreditCard, Money, Ticket, DeviceMobile, User, AirplaneLanding } from '@phosphor-icons/react';
import { USER_APP_URL } from '@/lib/app-links';
import { ease, fade } from '../motion';
import { INTERCITY, quoteIntercity, type IntercityV } from '@/lib/fares';
import { useT } from '@/lib/i18n';

const BN_VEH: Record<IntercityV, string> = { bike: 'বাইক', cng: 'সিএনজি', car: 'কার', car_plus: 'কার প্লাস', micro: 'মাইক্রো', hiace: 'হায়েস' };

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';

/** runs a step counter while the element is on screen */
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

/* 1. Referral: you and a friend both get 20 points (real rule, apply_referral_code) */
export function Referral() {
  const { t, n } = useT();
  const { ref, i } = useLoop(5, 1400);
  const joined = i >= 2;
  const pts = (n: number) => (i >= 3 ? n + 20 : n);
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Refer a friend', 'বন্ধুকে রেফার করুন')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Bring a friend.', 'বন্ধুকে আনুন।')}
            <br />
            <span className={muted}>{t('You both ride cheaper.', 'দুজনেরই রাইড সস্তা।')}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            {t('Share your code. When your friend signs up with it, you each get 20 points, with no limit on how many friends you bring. Points turn into discount coupons for your next rides.', 'আপনার কোড শেয়ার করুন। বন্ধু সেই কোডে সাইন আপ করলেই দুজনে পাবেন ২০ পয়েন্ট করে, যত খুশি বন্ধু আনুন, কোনো লিমিট নেই। পয়েন্ট দিয়ে পাবেন পরের রাইডের ডিসকাউন্ট কুপন।')}
          </p>
          <a href={USER_APP_URL} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex items-center gap-1 text-sm font-medium">
            {t('Get your code in the app', 'অ্যাপে আপনার কোড নিন')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        <div ref={ref} className={`${panel} p-6 sm:p-8`}>
          <div className="flex items-center justify-between">
            <p className={`text-[13px] ${muted}`}>{t('Your code', 'আপনার কোড')}</p>
            <span className="rounded-lg border border-dashed border-black/20 px-3 py-1 font-mono text-[14px] tracking-[0.2em] dark:border-white/25">ARH-7Q2K</span>
          </div>
          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {(['You', 'Arrow', 'Friend'] as const).map((who) =>
              who === 'Arrow' ? (
                <motion.span key={who} animate={{ opacity: i >= 1 ? 1 : 0.2, x: i === 1 ? [0, 6, 0] : 0 }} transition={{ duration: 0.6 }} className="text-[20px]">→</motion.span>
              ) : (
                <div key={who} className={`rounded-xl p-4 text-center transition-all duration-500 ${who === 'Friend' && !joined ? 'bg-black/[.02] opacity-40 dark:bg-white/[.02]' : 'bg-black/[.04] dark:bg-white/[.05]'}`}>
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/10 dark:bg-white/10"><User size={18} weight="fill" /></span>
                  <p className="mt-2 text-[13px] font-medium">{who === 'You' ? t('You', 'আপনি') : t('Friend', 'বন্ধু')}</p>
                  <p className="mt-1 text-[22px] font-semibold tabular-nums">
                    <motion.span key={pts(who === 'You' ? 140 : 0)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>{n(pts(who === 'You' ? 140 : 0))}</motion.span>
                    <span className={`ml-1 text-[12px] font-normal ${muted}`}>{t('pts', 'পয়েন্ট')}</span>
                  </p>
                </div>
              ),
            )}
          </div>
          <div className="mt-6 h-12 border-t border-black/10 pt-4 text-[14px] dark:border-white/10">
            <AnimatePresence mode="wait">
              <motion.p key={Math.min(i, 4)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                {i === 0 && <span className={muted}>{t('Share your code with a friend', 'বন্ধুকে কোড পাঠান')}</span>}
                {i === 1 && <span className={muted}>{t('Sending invite…', 'ইনভাইট যাচ্ছে…')}</span>}
                {i === 2 && <span>{t('Your friend signed up with your code', 'বন্ধু আপনার কোডে সাইন আপ করেছে')}</span>}
                {i === 3 && <><Check size={16} weight="bold" className="text-brand-green" /><span>{t('+20 points each', 'দুজনেই +২০ পয়েন্ট')}</span></>}
                {i === 4 && <><Check size={16} weight="bold" className="text-brand-green" /><span>{t('Turn them into a coupon for your next ride', 'পরের রাইডের কুপন বানিয়ে নিন')}</span></>}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 2. Fare: real intercity rates from fare_config, receipt builds line by line per vehicle */
const ROUTE = { from: 'Dhaka', to: 'Chattogram', km: 250, min: 360 };
const FARE_VEH: IntercityV[] = ['bike', 'cng', 'car', 'car_plus', 'micro', 'hiace'];
export function FareBreakdown() {
  const { t, n } = useT();
  const [v, setV] = useState<IntercityV>('car');
  const q = quoteIntercity(v, ROUTE.km, ROUTE.min);
  const floored = q.fare === INTERCITY[v].min && q.base + q.dist + q.time < q.fare;
  // keep the shown lines summing exactly to the rounded fare
  const lines = floored
    ? [{ k: 'Minimum fare', bn: 'সর্বনিম্ন ভাড়া', val: q.fare }]
    : [
        { k: 'Base fare', bn: 'বেস ভাড়া', val: q.base },
        { k: `Distance, ${ROUTE.km} km`, bn: `দূরত্ব, ${n(ROUTE.km)} কিমি`, val: q.dist },
        { k: `Time, ${ROUTE.min / 60} hours`, bn: `সময়, ${n(ROUTE.min / 60)} ঘণ্টা`, val: q.fare - q.base - q.dist },
      ];
  const rows = [...lines, { k: 'Safety charge', bn: 'সেফটি চার্জ', val: q.safety }, { k: 'Booking fee', bn: 'বুকিং ফি', val: q.booking }];
  const { ref, i } = useLoop(rows.length + 4, 700);
  const shown = Math.min(i + 1, rows.length);
  const running = rows.slice(0, shown).reduce((a, r) => a + r.val, 0);
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div ref={ref} className={`${panel} order-2 p-6 sm:p-8 lg:order-1`}>
          <div className="flex flex-wrap gap-1.5">
            {FARE_VEH.map((x) => (
              <button key={x} type="button" onClick={() => setV(x)} className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${v === x ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07] dark:hover:bg-white/10'}`}>
                {t(INTERCITY[x].label, BN_VEH[x])}
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-[15px] font-medium">
              {t(`${ROUTE.from} to ${ROUTE.to}`, 'ঢাকা থেকে চট্টগ্রাম')}
            </p>
            <span className={`text-[12px] ${muted}`}>{t(`${ROUTE.km} km, about ${ROUTE.min / 60} hours`, `${n(ROUTE.km)} কিমি, প্রায় ${n(ROUTE.min / 60)} ঘণ্টা`)}</span>
          </div>
          <ul className="mt-5 min-h-[188px] space-y-3">
            {rows.slice(0, shown).map((r) => (
              <motion.li key={v + r.k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex justify-between text-[15px]">
                <span className={muted}>{t(r.k, r.bn)}</span>
                <span className="tabular-nums">৳{n(r.val.toLocaleString('en-US'))}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-black/10 pt-4 dark:border-white/10">
            <span className="text-[15px] font-semibold">{t('Total', 'মোট')}</span>
            <motion.span key={v + running} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-[32px] font-semibold tabular-nums tracking-tight">৳{n(running.toLocaleString('en-US'))}</motion.span>
          </div>
          <p className={`mt-3 text-[12px] ${muted}`}>{t('Calculated with our current intercity rates. Your exact fare depends on the route and is confirmed in the app before you book.', 'আমাদের বর্তমান আন্তঃজেলা রেটে হিসাব করা। আসল ভাড়া রুটের ওপর নির্ভর করে, বুক করার আগেই অ্যাপে কনফার্ম হয়ে যায়।')}</p>
        </div>
        <motion.div {...fade()} className="order-1 lg:order-2">
          <p className={`text-[13px] ${muted}`}>{t('Upfront fares', 'আগেই জানুন ভাড়া')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Know your fare', 'ভাড়া জানুন')}
            <br />
            <span className={muted}>{t('before you go.', 'রওনা দেওয়ার আগেই।')}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            {t('No bargaining at the door. Every fare is a base fare plus distance and time, with a ৳3 safety charge and a small booking fee. You see it in full before you confirm, and that is what you pay.', 'দরদাম করার ঝামেলা নেই। প্রতিটা ভাড়া মানে বেস ভাড়া, দূরত্ব আর সময়, সাথে ৳৩ সেফটি চার্জ আর ছোট্ট একটা বুকিং ফি। কনফার্ম করার আগেই পুরোটা দেখবেন, আর ঠিক সেটাই দেবেন।')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* 3. Airport: flight-board of scheduled pickups at Shahjalal (sample rows) */
const BOARD = [
  { from: 'Dubai', bn: 'দুবাই', flight: 'EK 582', time: '06:40', status: 'Driver waiting' },
  { from: 'Singapore', bn: 'সিঙ্গাপুর', flight: 'SQ 446', time: '08:15', status: 'Driver confirmed' },
  { from: 'Kuala Lumpur', bn: 'কুয়ালালামপুর', flight: 'MH 196', time: '09:30', status: 'Driver confirmed' },
  { from: 'Kolkata', bn: 'কলকাতা', flight: 'BG 092', time: '11:05', status: 'Scheduled' },
  { from: "Cox's Bazar", bn: 'কক্সবাজার', flight: 'BS 142', time: '12:20', status: 'Scheduled' },
];
function Flap({ text }: { text: string }) {
  return (
    <span className="inline-flex gap-[2px]">
      {(typeof Intl !== 'undefined' && 'Segmenter' in Intl ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment) : text.split('')).map((c, i) => (
        <motion.span key={i + c} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: i * 0.03, duration: 0.25 }} className="inline-block">
          {c === ' ' ? ' ' : c}
        </motion.span>
      ))}
    </span>
  );
}
export function AirportBoard() {
  const { t, n } = useT();
  const { ref, i } = useLoop(BOARD.length, 2600);
  const rows = BOARD.map((_, k) => BOARD[(k + i) % BOARD.length]);
  return (
    <section className={wrap}>
      <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
        <div>
          <p className={`text-[13px] ${muted}`}>{t('Airport rides', 'এয়ারপোর্ট রাইড')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Land. Your ride', 'নামলেন, রাইড')}
            <br />
            <span className={muted}>{t('is already here.', 'আগে থেকেই হাজির।')}</span>
          </h2>
        </div>
        <p className={`max-w-md text-[17px] leading-relaxed md:justify-self-end md:pt-2 ${muted}`}>
          {t('Book your pickup from Hazrat Shahjalal International Airport ahead of time. Your verified driver is confirmed before you land, so there is no bargaining at arrivals.', 'হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর থেকে পিকআপ আগেই বুক করে রাখুন। প্লেন নামার আগেই কনফার্ম হয়ে যায় আপনার ভেরিফায়েড ড্রাইভার, অ্যারাইভালে আর দরদাম নয়।')}
        </p>
      </motion.div>
      <div ref={ref} className="mt-14 overflow-hidden rounded-2xl bg-[#0B0B0C] p-2 font-mono text-[#E6E6E6] ring-1 ring-black/10 dark:ring-white/10">
        <div className="flex items-center justify-between px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span className="flex items-center gap-2"><AirplaneLanding size={14} /> {t('Arrivals, Dhaka DAC', 'অ্যারাইভাল, ঢাকা DAC')}</span>
          <span>{t('Arohon pickups', 'আরোহন পিকআপ')}</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 border-t border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-white/35 sm:grid-cols-[1.2fr_0.8fr_0.6fr_1fr]">
          <span>{t('From', 'যেখান থেকে')}</span><span className="hidden sm:block">{t('Flight', 'ফ্লাইট')}</span><span>{t('Time', 'সময়')}</span><span className="text-right">{t('Pickup', 'পিকআপ')}</span>
        </div>
        {rows.map((r) => (
          <div key={r.flight} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-6 border-t border-white/[.06] px-4 py-3.5 text-[14px] sm:grid-cols-[1.2fr_0.8fr_0.6fr_1fr] sm:text-[15px]">
            <span className="truncate uppercase"><Flap text={t(r.from, r.bn)} /></span>
            <span className="hidden text-white/60 sm:block"><Flap text={r.flight} /></span>
            <span className="tabular-nums">{n(r.time)}</span>
            <span className={`text-right text-[12px] uppercase tracking-wider sm:text-[13px] ${r.status === 'Driver waiting' ? 'text-[#0ABF8B]' : r.status === 'Driver confirmed' ? 'text-white' : 'text-white/40'}`}>
              {r.status === 'Driver waiting' && <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#0ABF8B] align-middle" />}
              {t(r.status, r.status === 'Driver waiting' ? 'ড্রাইভার অপেক্ষায়' : r.status === 'Driver confirmed' ? 'ড্রাইভার কনফার্মড' : 'শিডিউলড')}
            </span>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-[12px] ${muted}`}>{t('Sample board for illustration.', 'বোঝানোর জন্য নমুনা বোর্ড।')}</p>
    </section>
  );
}

/* 4. Tour share: seats fill as travellers join, price per person drops */
// real micro intercity fare, Dhaka to Cox's Bazar, about 400 km and 10 hours
const TRIP_TOTAL = quoteIntercity('micro', 400, 600).total;
export function TourShare() {
  const { t, n } = useT();
  const { ref, i } = useLoop(9, 1100);
  const filled = Math.min(1 + i, 7);
  const each = Math.round(TRIP_TOTAL / filled / 10) * 10;
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Share a trip', 'ট্রিপ শেয়ার')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t("Going to Cox's Bazar?", 'কক্সবাজার যাচ্ছেন?')}
            <br />
            <span className={muted}>{t('Split the ride.', 'ভাড়া ভাগ করে নিন।')}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            {t('Post your trip and travellers heading the same way can join. Every seat that fills brings the cost down for everyone.', 'ট্রিপ পোস্ট করুন, একই পথের যাত্রীরা যোগ দিতে পারবেন। প্রতিটা সিট ভরলেই সবার খরচ কমে।')}
          </p>
        </motion.div>
        <div ref={ref} className={`${panel} p-6 sm:p-8`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[15px] font-medium">{t("Dhaka to Cox's Bazar", 'ঢাকা থেকে কক্সবাজার')}</p>
              <p className={`text-[13px] ${muted}`}>{t(`Micro, 7 seats, about 400 km, ৳${TRIP_TOTAL.toLocaleString('en-US')} total`, `মাইক্রো, ৭ সিট, প্রায় ৪০০ কিমি, মোট ৳${n(TRIP_TOTAL.toLocaleString('en-US'))}`)}</p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/micro.webp" alt="" className="-mt-2 h-12 w-16 object-contain" />
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, s) => (
              <motion.span
                key={s}
                animate={{ scale: s === filled - 1 ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.4 }}
                className={`flex aspect-square items-center justify-center rounded-lg transition-colors duration-500 ${s < filled ? 'bg-black text-white dark:bg-white dark:text-black' : 'border border-dashed border-black/20 dark:border-white/20'}`}
              >
                {s < filled && <User size={14} weight="fill" />}
              </motion.span>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/10 pt-5 dark:border-white/10">
            <div>
              <p className={`text-[12px] ${muted}`}>{t('Travellers', 'যাত্রী')}</p>
              <p className="text-[24px] font-semibold tabular-nums">{n(filled)} / {n(7)}</p>
            </div>
            <div className="text-right">
              <p className={`text-[12px] ${muted}`}>{t('Each pays', 'জনপ্রতি')}</p>
              <motion.p key={each} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-[24px] font-semibold tabular-nums text-[#079A70] dark:text-[#0ABF8B]">৳{n(each.toLocaleString('en-US'))}</motion.p>
            </div>
          </div>
          <p className={`mt-3 text-[12px] ${muted}`}>{t('Total calculated with our current intercity micro rate.', 'মোট ভাড়া আমাদের বর্তমান আন্তঃজেলা মাইক্রো রেটে হিসাব করা।')}</p>
        </div>
      </div>
    </section>
  );
}

/* 5. Payments: auto-rotating switcher. Matches the app: rides are cash only; food orders also take bKash, Nagad and card */
const PAY = [
  { k: 'Cash', scope: 'Rides and food', icon: Money, copy: 'Pay your driver at the end of the trip, at the fare you saw when you booked. Food orders can be paid in cash on delivery.', bnK: 'ক্যাশ', bnScope: 'রাইড আর ফুড', bnCopy: 'ট্রিপ শেষে ড্রাইভারকে দিন, বুক করার সময় যে ভাড়া দেখেছেন ঠিক সেটাই। ফুড অর্ডারে ক্যাশ অন ডেলিভারি।' },
  { k: 'Reward coupons', scope: 'Rides', icon: Ticket, copy: 'Coupons from your points and promo codes come off automatically on your next eligible ride.', bnK: 'রিওয়ার্ড কুপন', bnScope: 'রাইড', bnCopy: 'পয়েন্ট আর প্রোমো কোডের কুপন পরের যোগ্য রাইডে নিজে থেকেই কেটে যায়।' },
  { k: 'bKash or Nagad', scope: 'Food orders', icon: DeviceMobile, copy: 'Pay for food and medicine orders from your bKash or Nagad account at checkout.', bnK: 'বিকাশ বা নগদ', bnScope: 'ফুড অর্ডার', bnCopy: 'চেকআউটে বিকাশ বা নগদ দিয়ে খাবার আর ওষুধের অর্ডারের দাম মেটান।' },
  { k: 'Card', scope: 'Food orders', icon: CreditCard, copy: 'Use a debit or credit card at checkout for food and medicine orders.', bnK: 'কার্ড', bnScope: 'ফুড অর্ডার', bnCopy: 'খাবার আর ওষুধের অর্ডারে চেকআউটে ডেবিট বা ক্রেডিট কার্ড ব্যবহার করুন।' },
];
export function PayYourWay() {
  const { t } = useT();
  const { ref, i } = useLoop(PAY.length, 2600);
  const [pick, setPick] = useState<number | null>(null);
  const cur = pick ?? i;
  const M = PAY[cur];
  return (
    <section className={wrap}>
      <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Payments', 'পেমেন্ট')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Simple to pay.', 'পেমেন্ট সহজ।')}
            <br />
            <span className={muted}>{t('No surprises.', 'কোনো চমক নেই।')}</span>
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {PAY.map((p, k) => (
              <button
                key={p.k}
                type="button"
                onMouseEnter={() => setPick(k)}
                onMouseLeave={() => setPick(null)}
                onClick={() => setPick(k)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[14px] transition-colors ${cur === k ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07] dark:hover:bg-white/10'}`}
              >
                <p.icon size={16} /> {t(p.k, p.bnK)}
              </button>
            ))}
          </div>
        </motion.div>
        <div className={`${panel} relative min-h-[220px] overflow-hidden p-8`}>
          <AnimatePresence mode="wait">
            <motion.div key={M.k} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[.05] dark:bg-white/[.07]"><M.icon size={24} /></span>
              <p className="mt-6 flex items-center gap-3 text-[22px] font-medium tracking-tight">
                {t(M.k, M.bnK)}
                <span className="rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] font-normal tracking-normal text-black/55 dark:border-white/15 dark:text-white/55">{t(M.scope, M.bnScope)}</span>
              </p>
              <p className={`mt-2 max-w-sm text-[15px] leading-relaxed ${muted}`}>{t(M.copy, M.bnCopy)}</p>
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-8 bottom-6 flex gap-1.5">
            {PAY.map((p, k) => (
              <span key={p.k} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${k === cur ? 'bg-black dark:bg-white' : 'bg-black/10 dark:bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
