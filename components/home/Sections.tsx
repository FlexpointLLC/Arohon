'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, animate, motion, useInView } from 'framer-motion';
import {
  ShieldCheck, MapTrifold, ShareNetwork, IdentificationCard, Phone, Star, Car, Headset, Plus, ArrowRight,
  } from '@phosphor-icons/react';
import { DISTRICTS } from '@/lib/districts';
import BD from '@/lib/bdDots.json';
import { StoreBadges, StoreButton } from '../StoreButtons';
import { CountUp, Reveal, SplitWords, ease, fade } from '../motion';
import { useT, bnDigits } from '@/lib/i18n';

/** CountUp twin for /bn: same easing and timing, Bangla digits */
function BnCountUp({ to, suffix = '', duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {bnDigits(v.toLocaleString('en-US'))}
      {suffix}
    </span>
  );
}

/* ───────────── Stats ───────────── */
export function Stats() {
  const { t, bn } = useT();
  const stats = [
    { n: 12000, s: '+', l: 'Riders on Arohon', bn: 'আরোহনে রাইডার' },
    { n: 64, s: '', l: 'Districts covered', bn: 'জেলায় সার্ভিস' },
    { n: 500, s: '+', l: 'Partner drivers', bn: 'পার্টনার ড্রাইভার' },
    { n: 8, s: '', l: 'Airports served', bn: 'এয়ারপোর্টে সার্ভিস' },
  ];
  return (
    <section className="mx-auto max-w-[1280px] px-6 md:px-16 py-24 sm:py-32">
      <h2 className="max-w-4xl u-h2">
        <SplitWords text={t("Bangladesh's fastest-growing way to move.", 'বাংলাদেশে সবচেয়ে দ্রুত বাড়তে থাকা চলাচলের উপায়।')} />
      </h2>
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-black/10 lg:grid-cols-4 dark:bg-white/10">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08} className="bg-white p-6 sm:p-10 dark:bg-[#292929]">
            <p className="u-h2">
              {bn ? <BnCountUp to={s.n} suffix={s.s} /> : <CountUp to={s.n} suffix={s.s} />}
            </p>
            <p className="mt-3 font-semibold">{t(s.l, s.bn)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Safety, Linear /security pattern: grouped label + lead, 2x2 item grid ───────────── */
const SAFETY_GROUPS = [
  {
    icon: IdentificationCard,
    label: 'Before you ride',
    labelBn: 'রাইডের আগে',
    lead: 'Every driver, checked.',
    leadBn: 'প্রত্যেক ড্রাইভার যাচাই করা।',
    rest: 'Nobody drives with Arohon until their identity, licence and vehicle have been verified by our team.',
    restBn: 'পরিচয়, লাইসেন্স আর গাড়ি আমাদের টিম যাচাই না করা পর্যন্ত কেউ আরোহনে গাড়ি চালাতে পারেন না।',
    items: [
      { icon: IdentificationCard, title: 'NID verified', copy: 'National ID matched to the driver before their first trip.', titleBn: 'এনআইডি যাচাই', copyBn: 'প্রথম ট্রিপের আগেই ড্রাইভারের সাথে জাতীয় পরিচয়পত্র মিলিয়ে দেখা হয়।' },
      { icon: ShieldCheck, title: 'Licence checked', copy: 'Valid driving licence for the vehicle class they drive.', titleBn: 'লাইসেন্স চেক', copyBn: 'যে গাড়ি চালান, সেই ধরনের বৈধ ড্রাইভিং লাইসেন্স।' },
      { icon: Car, title: 'Vehicle papers', copy: 'Registration and fitness documents reviewed and kept on file.', titleBn: 'গাড়ির কাগজপত্র', copyBn: 'রেজিস্ট্রেশন আর ফিটনেসের কাগজ যাচাই করে সংরক্ষণ করা হয়।' },
      { icon: Star, title: 'Rated every trip', copy: 'Riders rate each ride, and low ratings are reviewed.', titleBn: 'প্রতি ট্রিপে রেটিং', copyBn: 'প্রতিটি রাইডে রাইডাররা রেটিং দেন, কম রেটিং আমরা খতিয়ে দেখি।' },
    ],
  },
  {
    icon: MapTrifold,
    label: 'During the ride',
    labelBn: 'রাইডের সময়',
    lead: 'Never alone on the road.',
    leadBn: 'পথে আপনি কখনো একা নন।',
    rest: 'Your trip is tracked from pickup to drop-off, and help is one tap away the whole time.',
    restBn: 'পিকআপ থেকে ড্রপ পর্যন্ত পুরো ট্রিপ ট্র্যাক হয়, আর সাহায্য সবসময় এক ট্যাপ দূরে।',
    items: [
      { icon: MapTrifold, title: 'Live tracking', copy: 'Watch every turn of your trip in real time.', titleBn: 'লাইভ ট্র্যাকিং', copyBn: 'ট্রিপের প্রতিটি বাঁক দেখুন রিয়েল টাইমে।' },
      { icon: ShareNetwork, title: 'Share your trip', copy: 'Send a live link so family can follow along.', titleBn: 'ট্রিপ শেয়ার করুন', copyBn: 'লাইভ লিংক পাঠান, পরিবার সাথে সাথে দেখতে পাবে।' },
      { icon: Phone, title: 'One-tap SOS', copy: 'Reach your emergency contact and our team instantly.', titleBn: 'এক ট্যাপে SOS', copyBn: 'সাথে সাথে পৌঁছে যান আপনার ইমার্জেন্সি কন্টাক্ট আর আমাদের টিমের কাছে।' },
      { icon: Headset, title: 'Safety team 24/7', copy: 'Real people on standby, day and night.', titleBn: 'সেফটি টিম ২৪/৭', copyBn: 'দিনরাত প্রস্তুত সত্যিকারের মানুষ।' },
    ],
  },
];

export function SafetyStory() {
  const { t } = useT();
  return (
    <section id="safety" className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()}>
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Arohon Safety', 'আরোহন সেফটি')}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">{t('Every ride, protected.', 'প্রতিটি রাইড, সুরক্ষিত।')}</h2>
      </motion.div>

      <div className="mt-20 space-y-20">
        {SAFETY_GROUPS.map((g) => (
          <motion.div key={g.label} {...fade()} className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <div>
              <p className="flex items-center gap-2 text-[13px] text-black/60 dark:text-[#D0D6E0]">
                <g.icon size={15} className="text-black/40 dark:text-white/40" /> {t(g.label, g.labelBn)}
              </p>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">
                <span className="font-medium text-black dark:text-white">{t(g.lead, g.leadBn)}</span> {t(g.rest, g.restBn)}
              </p>
            </div>
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {g.items.map((it) => (
                <div key={it.title}>
                  <p className="flex items-center gap-2 text-[15px] font-medium">
                    <it.icon size={16} className="text-black/40 dark:text-white/40" /> {t(it.title, it.titleBn)}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{t(it.copy, it.copyBn)}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Coverage map ───────────── */
// Dotted Bangladesh (real geoBoundaries outline rasterised to a grid), GitHub-globe style arcs from Dhaka
export const MAP = BD as unknown as { w: number; h: number; lon0: number; lat1: number; k: number; s: number; districts: Record<string, [number, number][]> };
export const proj = ([lat, lng]: [number, number]) => [(lng - MAP.lon0) * MAP.k * MAP.s, (MAP.lat1 - lat) * MAP.s] as const;
// one path of zero-length round-capped segments renders thousands of dots as a single element
// one path per district; a one-dot gutter between districts makes each read as its own block
export const DIST_D = Object.fromEntries(Object.entries(MAP.districts).map(([k, pts]) => [k, pts.map(([x, y]) => `M${x} ${y}h0`).join('')]));
function arc(a: readonly [number, number], b: readonly [number, number]) {
  // control point lifted perpendicular to the chord so every route bows like a flight arc
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const lift = Math.hypot(dx, dy) * 0.14; // gentle road-like bend, high arcs read as missiles
  const len = Math.hypot(dx, dy) || 1;
  // pick the perpendicular that points up the screen so every route arches like an n, never a u
  let [px, py] = [dy / len, -dx / len];
  if (py > 0) [px, py] = [-px, -py];
  return `M${a[0]} ${a[1]} Q${mx + px * lift} ${my + py * lift} ${b[0]} ${b[1]}`;
}

const label = (k: string) => (k === 'coxsbazar' ? "Cox's Bazar" : k === 'chapainawabganj' ? 'Chapai Nawabganj' : k[0].toUpperCase() + k.slice(1));
const BN_DISTRICT: Record<string, string> = {
  barguna: 'বরগুনা', barisal: 'বরিশাল', bhola: 'ভোলা', jhalakathi: 'ঝালকাঠি', patuakhali: 'পটুয়াখালী', pirojpur: 'পিরোজপুর',
  bandarban: 'বান্দরবান', brahmanbaria: 'ব্রাহ্মণবাড়িয়া', chandpur: 'চাঁদপুর', chattogram: 'চট্টগ্রাম', comilla: 'কুমিল্লা', coxsbazar: 'কক্সবাজার',
  feni: 'ফেনী', khagrachhari: 'খাগড়াছড়ি', lakshmipur: 'লক্ষ্মীপুর', noakhali: 'নোয়াখালী', rangamati: 'রাঙামাটি', dhaka: 'ঢাকা',
  faridpur: 'ফরিদপুর', gazipur: 'গাজীপুর', gopalganj: 'গোপালগঞ্জ', kishoreganj: 'কিশোরগঞ্জ', madaripur: 'মাদারীপুর', manikganj: 'মানিকগঞ্জ',
  munshiganj: 'মুন্সিগঞ্জ', narayanganj: 'নারায়ণগঞ্জ', narsingdi: 'নরসিংদী', rajbari: 'রাজবাড়ী', shariatpur: 'শরীয়তপুর', tangail: 'টাঙ্গাইল',
  bagerhat: 'বাগেরহাট', chuadanga: 'চুয়াডাঙ্গা', jashore: 'যশোর', jhenaidah: 'ঝিনাইদহ', khulna: 'খুলনা', kushtia: 'কুষ্টিয়া',
  magura: 'মাগুরা', meherpur: 'মেহেরপুর', narail: 'নড়াইল', satkhira: 'সাতক্ষীরা', jamalpur: 'জামালপুর', mymensingh: 'ময়মনসিংহ',
  netrokona: 'নেত্রকোনা', sherpur: 'শেরপুর', bogura: 'বগুড়া', joypurhat: 'জয়পুরহাট', naogaon: 'নওগাঁ', natore: 'নাটোর',
  chapainawabganj: 'চাঁপাইনবাবগঞ্জ', pabna: 'পাবনা', rajshahi: 'রাজশাহী', sirajganj: 'সিরাজগঞ্জ', dinajpur: 'দিনাজপুর', gaibandha: 'গাইবান্ধা',
  kurigram: 'কুড়িগ্রাম', lalmonirhat: 'লালমনিরহাট', nilphamari: 'নীলফামারী', panchagarh: 'পঞ্চগড়', rangpur: 'রংপুর', thakurgaon: 'ঠাকুরগাঁও',
  habiganj: 'হবিগঞ্জ', moulvibazar: 'মৌলভীবাজার', sunamganj: 'সুনামগঞ্জ', sylhet: 'সিলেট',
};
const KEYS = Object.keys(DISTRICTS);

/** Four lanes run in parallel, staggered; each lane flies one trip, lands, fades, then fires the next. */
function Comets() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Lane key={i} delay={i * 900} first={i === 0 ? ['dhaka', 'coxsbazar'] : undefined} />
      ))}
    </>
  );
}

function Lane({ delay, first }: { delay: number; first?: [string, string] }) {
  const { t } = useT();
  const place = (k: string) => t(label(k), BN_DISTRICT[k] ?? label(k));
  const trail = useRef<SVGPathElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const [trip, setTrip] = useState<{ from: string; to: string; phase: 'fly' | 'land' | 'fade' }>({ from: first?.[0] ?? 'dhaka', to: first?.[1] ?? 'coxsbazar', phase: 'fade' });

  useEffect(() => {
    let raf = 0;
    let wait: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const run = (from: string, to: string) => {
      const a = proj(DISTRICTS[from]);
      const b = proj(DISTRICTS[to]);
      // the map can unmount mid trip (route change, hot reload), so every frame checks the elements still exist
      const path = trail.current;
      if (cancelled || !path) return;
      path.setAttribute('d', arc(a, b));
      const L = path.getTotalLength();
      setTrip({ from, to, phase: 'fly' });
      const FLY = 1200 + L * 2;
      const t0 = performance.now();
      const tick = (now: number) => {
        if (cancelled || !path.isConnected) return;
        const t = Math.min(1, (now - t0) / FLY);
        const e = Math.sin((t * Math.PI) / 2) * 0.35 + t * 0.65; // mostly steady glide, eases into the stop without hanging
        const head = e * L;
        // just a line that draws from origin to destination
        path.style.strokeDasharray = `${head} ${L}`;
        path.style.opacity = '0.9';
        if (t < 1) raf = requestAnimationFrame(tick);
        else land(b, from, to);
      };
      raf = requestAnimationFrame(tick);
    };
    const land = (b: readonly [number, number], from: string, to: string) => {
      const r = ring.current;
      if (cancelled || !r) return;
      setTrip({ from, to, phase: 'land' });
      r.setAttribute('cx', String(b[0]));
      r.setAttribute('cy', String(b[1]));
      const t0 = performance.now();
      const burst = (now: number) => {
        const path = trail.current;
        if (cancelled || !path || !r.isConnected) return;
        const t = Math.min(1, (now - t0) / 1400);
        r.setAttribute('r', String(6 + Math.sin(t * Math.PI) * 3));
        r.style.opacity = String(0.5 * Math.sin(t * Math.PI));
        path.style.opacity = String(0.9 * (1 - t * t));
        if (t < 1) raf = requestAnimationFrame(burst);
        else {
          setTrip({ from, to, phase: 'fade' });
          wait = setTimeout(next, 500);
        }
      };
      raf = requestAnimationFrame(burst);
    };
    const next = () => {
      if (cancelled) return;
      let from = KEYS[Math.floor(Math.random() * KEYS.length)];
      let to = from;
      // keep trips long enough to read as a journey
      while (to === from || Math.hypot(...(proj(DISTRICTS[from]).map((v, i) => v - proj(DISTRICTS[to])[i]) as [number, number])) < 140) {
        from = KEYS[Math.floor(Math.random() * KEYS.length)];
        to = KEYS[Math.floor(Math.random() * KEYS.length)];
      }
      run(from, to);
    };
    const start = setTimeout(() => (first ? run(first[0], first[1]) : next()), delay);
    return () => { cancelled = true; clearTimeout(start); clearTimeout(wait); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const a = proj(DISTRICTS[trip.from]);
  const b = proj(DISTRICTS[trip.to]);
  const show = trip.phase !== 'fade';
  return (
    <>
      {/* light up the two district blocks this trip connects */}
      <path d={DIST_D[trip.from]} className="stroke-black/45 transition-opacity duration-700 dark:stroke-white/45" strokeWidth="3.2" strokeLinecap="round" style={{ opacity: trip.phase === 'fade' ? 0 : 1 }} />
      <path d={DIST_D[trip.to]} className="stroke-black/60 transition-opacity duration-700 dark:stroke-white/60" strokeWidth="3.2" strokeLinecap="round" style={{ opacity: trip.phase === 'land' ? 1 : 0 }} />
      <path ref={trail} fill="none" className="stroke-[#111] dark:stroke-white" strokeWidth="1" strokeLinecap="round" />
      <circle ref={ring} r="4" fill="none" className="stroke-[#111] dark:stroke-white" strokeWidth="1.5" style={{ opacity: 0 }} />
      <g className="transition-opacity duration-500" style={{ opacity: show ? 1 : 0 }}>
        <circle cx={a[0]} cy={a[1]} r="4" fill="#0ABF8B" />
        <text x={a[0] - 10} y={a[1] + 5} textAnchor="end" fontSize="14" fontWeight="600" className="fill-black/60 dark:fill-white/60">{place(trip.from)}</text>
      </g>
      <g className="transition-opacity duration-500" style={{ opacity: trip.phase === 'land' ? 1 : 0 }}>
        <circle cx={b[0]} cy={b[1]} r="4.5" className="fill-[#111] dark:fill-white" />
        <text x={b[0] + 10} y={b[1] + 5} fontSize="15" fontWeight="600" className="fill-black dark:fill-white">{place(trip.to)}</text>
      </g>
    </>
  );
}

/** dotted Bangladesh (one block per district) with live trips between districts; shared by Coverage and Parcel */
export function BDMap({ label: ariaLabel }: { label?: string }) {
  const { t } = useT();
  const label = ariaLabel ?? t('Arohon trips across Bangladesh', 'সারা বাংলাদেশে আরোহনের ট্রিপ');
  return (
    <svg viewBox={`-20 -20 ${MAP.w + 40} ${MAP.h + 40}`} className="w-full overflow-visible" role="img" aria-label={label}>
      {Object.entries(DIST_D).map(([k, d]) => (
        <path key={k} d={d} className="stroke-black/20 dark:stroke-white/20" strokeWidth="3.2" strokeLinecap="round" />
      ))}
      <Comets />
    </svg>
  );
}

export function Coverage() {
  const { t, n } = useT();
  return (
    <section id="cities" className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()} className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Coverage', 'কভারেজ')}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">{t('Teknaf to Tetulia.', 'টেকনাফ থেকে তেঁতুলিয়া।')}</h2>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{t("City rides wherever you are, and intercity trips between any two of Bangladesh's 64 districts.", 'যেখানেই থাকুন শহরের রাইড, আর বাংলাদেশের ৬৪ জেলার যেকোনো দুটির মধ্যে ইন্টারসিটি ট্রিপ।')}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.2 }} className="relative mx-auto mt-14 w-full max-w-[520px]">
        <BDMap />
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 border-t border-black/10 pt-6 text-center dark:border-white/10">
        {[['64', 'Districts', 'জেলা'], ['8', 'Airports', 'এয়ারপোর্ট'], ['24/7', 'Intercity', 'ইন্টারসিটি']].map(([num, l, lBn]) => (
          <div key={l}>
            <p className="text-[28px] font-medium tracking-tight">{n(num)}</p>
            <p className="mt-1 text-[13px] text-black/45 dark:text-[#8A8F98]">{t(l, lBn)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Rewards: Linear product-panel pattern, a sample rider climbing the real 16-tier ladder ───────────── */
// mirrors Arohon-customer src/constants/loyaltyTiers.ts (lifetime points = completed rides + delivered parcels)
const BANDS = ['Base', 'Classic', 'Pro', 'Super'] as const;
// feed entries store a kind so the copy follows the page language
type FeedKind = 'ride' | 'parcel' | 'up';
const LADDER = [
  'Member', 'Active', 'Regular', 'Prime',
  'Bronze', 'Silver', 'Gold', 'Platinum',
  'Onyx', 'Emerald', 'Sapphire', 'Ruby',
  'Diamond', 'Elite', 'VIP', 'Legend',
].map((name, i) => ({ name, min: i * 5, band: BANDS[Math.floor(i / 4)], badge: `/badges/${BANDS[Math.floor(i / 4)].toLowerCase()}-${(i % 4) + 1}.webp` }));
const tierAt = (p: number) => LADDER.reduce((t, x, i) => (p >= x.min ? i : t), 0);

function RewardsPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const [pts, setPts] = useState(0);
  const { t, n } = useT();
  const [feed, setFeed] = useState<{ id: number; kind: FeedKind; tier: string }[]>([]);

  useEffect(() => {
    if (!inView) return;
    // demo rider: one ride at a time, loops back to Member after Legend
    const t = setTimeout(() => {
      const next = pts >= 79 ? 0 : pts + 1;
      setPts(next);
      if (next === 0) return setFeed([]);
      const up = tierAt(next) !== tierAt(next - 1);
      const kind: FeedKind = up ? 'up' : next % 6 === 0 ? 'parcel' : 'ride';
      setFeed((f) => [{ id: next, kind, tier: LADDER[tierAt(next)].name }, ...f].slice(0, 4));
    }, pts === 0 ? 900 : 260);
    return () => clearTimeout(t);
  }, [pts, inView]);

  const ti = tierAt(pts);
  const tier = LADDER[ti];
  const nxt = LADDER[ti + 1];
  const into = nxt ? (pts - tier.min) / (nxt.min - tier.min) : 1;

  return (
    <div ref={ref} className="mt-14 grid overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent md:grid-cols-[0.9fr_1.6fr] dark:border-white/10 dark:from-white/[.03]">
      {/* sample rider */}
      <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r md:p-8 dark:border-white/10">
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Sample rider', 'নমুনা রাইডার')}</p>
        <div className="mt-5 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tier.badge} alt="" width={40} height={40} className="h-10 w-10" />
          <div>
            <p className="text-[17px] font-medium">{tier.name}</p>
            <p className="text-[12px] text-black/45 dark:text-[#8A8F98]">{t(`${tier.band} band, tier ${ti + 1} of 16`, `${tier.band} ব্যান্ড, ১৬টির মধ্যে ${n(ti + 1)} নম্বর টিয়ার`)}</p>
          </div>
        </div>
        <p className="mt-6 text-[40px] font-medium tabular-nums tracking-tight">
          {n(pts)}
          <span className="ml-1.5 text-[15px] font-normal text-black/45 dark:text-[#8A8F98]">{t('points', 'পয়েন্ট')}</span>
        </p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full bg-black transition-[width] duration-200 dark:bg-white" style={{ width: `${into * 100}%` }} />
        </div>
        <p className="mt-2 text-[12px] text-black/45 dark:text-[#8A8F98]">{nxt ? t(`${nxt.min - pts} to ${nxt.name}`, `${nxt.name} আর ${n(nxt.min - pts)} পয়েন্ট দূরে`) : t('Top tier reached', 'সবার উপরের টিয়ারে পৌঁছে গেছেন')}</p>
        <ul className="mt-6 min-h-[156px] divide-y divide-black/[.06] dark:divide-white/[.06]">
          {feed.map((f) => (
            <li key={f.id} className="flex animate-[fadein_.4s_ease] items-center justify-between py-2.5 text-[13px]">
              <span className={f.kind === 'up' ? 'font-medium' : 'text-black/60 dark:text-[#D0D6E0]'}>
                {f.kind === 'up' ? t(`Reached ${f.tier}`, `${f.tier} এ পৌঁছেছেন`) : f.kind === 'parcel' ? t('Parcel delivered', 'পার্সেল ডেলিভারি হয়েছে') : t('Ride completed', 'রাইড সম্পন্ন')}
              </span>
              <span className={`text-[11px] ${f.kind === 'up' ? 'text-brand-green' : 'text-black/40 dark:text-white/35'}`}>{f.kind === 'up' ? t('Tier up', 'টিয়ার আপ') : t('+1 pt', '+১ পয়েন্ট')}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ladder: 16 tiers in four bands */}
      <div className="flex flex-col p-6 md:p-8">
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('16 tiers, Member to Legend', '১৬টি টিয়ার, Member থেকে Legend')}</p>
        <div className="my-auto grid grid-cols-2 gap-x-3 gap-y-6 pt-6 sm:grid-cols-4 sm:gap-5">
          {BANDS.map((band, bi) => (
            <div key={band}>
              <div className="space-y-1.5">
                {LADDER.slice(bi * 4, bi * 4 + 4).reverse().map((tr) => {
                  const i = LADDER.indexOf(tr);
                  const reached = i <= ti;
                  const current = i === ti;
                  return (
                    <div
                      key={tr.name}
                      className={`flex items-center gap-2 rounded-lg border px-2 py-2 transition-all duration-300 sm:px-2.5 ${current ? 'border-black/25 bg-black/[.05] dark:border-white/30 dark:bg-white/[.07]' : 'border-black/[.07] dark:border-white/[.07]'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tr.badge} alt="" width={20} height={20} className={`h-5 w-5 shrink-0 transition-all duration-300 ${reached ? '' : 'opacity-30 grayscale'}`} />
                      <span className={`truncate text-[12px] transition-colors sm:text-[13px] ${reached ? '' : 'text-black/35 dark:text-white/30'}`}>{tr.name}</span>
                      <span className="ml-auto hidden font-mono text-[10px] text-black/30 lg:inline dark:text-white/25">{n(tr.min)}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] text-black/45 dark:text-[#8A8F98]">{band}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const REWARD_FACTS = [
  { title: 'One point, every trip', copy: 'Every completed ride and delivered parcel earns a point, and points never expire.', titleBn: 'প্রতি ট্রিপে এক পয়েন্ট', copyBn: 'প্রতিটি সম্পন্ন রাইড আর ডেলিভারি হওয়া পার্সেলে এক পয়েন্ট, আর পয়েন্টের কোনো মেয়াদ নেই।' },
  { title: 'Spend it on cheaper rides', copy: 'Turn points into discount coupons, applied automatically to your next ride. Your tier never drops.', titleBn: 'খরচ করুন সস্তা রাইডে', copyBn: 'পয়েন্ট দিয়ে নিন ডিসকাউন্ট কুপন, পরের রাইডে নিজে থেকেই লেগে যাবে। আপনার টিয়ার কখনো নামে না।' },
  { title: 'Bring a friend', copy: 'When a friend joins with your code, you both get 20 points. There is no limit.', titleBn: 'বন্ধুকে আনুন', copyBn: 'আপনার কোড দিয়ে বন্ধু জয়েন করলে দুজনেই পাবেন ২০ পয়েন্ট। কোনো লিমিট নেই।' },
];

export function Rewards() {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
        <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          {t('Ride more.', 'বেশি চড়ুন।')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('Pay less.', 'কম খরচ করুন।')}</span>
        </h2>
        <p className="max-w-md text-[17px] leading-relaxed text-black/50 md:justify-self-end md:pt-2 dark:text-[#8A8F98]">
          {t('Arohon Rewards turns every trip into points. Climb sixteen tiers from Member to Legend and spend your points on discounts along the way.', 'আরোহন রিওয়ার্ডসে প্রতিটি ট্রিপ মানেই পয়েন্ট। Member থেকে Legend পর্যন্ত ষোলোটি টিয়ার পার হোন, পথে পথে পয়েন্ট খরচ করুন ডিসকাউন্টে।')}
        </p>
      </motion.div>

      <RewardsPanel />

      <div className="mt-10 grid gap-8 border-t border-black/10 pt-8 md:grid-cols-3 dark:border-white/10">
        {REWARD_FACTS.map((f) => (
          <div key={f.title}>
            <h3 className="text-[15px] font-medium">{t(f.title, f.titleBn)}</h3>
            <p className="mt-1.5 max-w-[320px] text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{t(f.copy, f.copyBn)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Drive ───────────── */
/* Driver app mock in Linear's app-window style; sample trips stream in and earnings tick up */
const D_AREAS = ['Gulshan 2', 'Dhanmondi 27', 'Banani', 'Mirpur 10', 'Uttara', 'Farmgate', 'Motijheel', 'Bashundhara', 'Mohakhali', 'Badda', 'Tejgaon', 'Shyamoli'];
const D_AREAS_BN = ['গুলশান ২', 'ধানমন্ডি ২৭', 'বনানী', 'মিরপুর ১০', 'উত্তরা', 'ফার্মগেট', 'মতিঝিল', 'বসুন্ধরা', 'মহাখালী', 'বাড্ডা', 'তেজগাঁও', 'শ্যামলী'];
const D_NAV = ['Home', 'Trips', 'Earnings', 'Missions', 'Job posts'];
const D_NAV_BN = ['হোম', 'ট্রিপ', 'আয়', 'মিশন', 'জব পোস্ট'];
const MISSION = 10;
type DTrip = { id: number; from: number; to: number; fare: number; pay: 'Cash' | 'Wallet' };
const rnd = (n: number) => Math.floor(Math.random() * n);

function DriverApp() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const { t, n: num } = useT();
  const [trips, setTrips] = useState<DTrip[]>([]);
  const [n, setN] = useState(0);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const from = rnd(D_AREAS.length);
      let to = rnd(D_AREAS.length);
      while (to === from) to = rnd(D_AREAS.length);
      const fare = 90 + rnd(36) * 10;
      const next = n + 1 > MISSION ? 1 : n + 1;
      if (next === 1) setEarned(fare);
      else setEarned((e) => e + fare);
      setN(next);
      setTrips((l) => [{ id: Date.now(), from, to, fare, pay: (rnd(3) ? 'Cash' : 'Wallet') as DTrip['pay'] }, ...(next === 1 ? [] : l)].slice(0, 4));
    }, n === 0 ? 700 : 2200);
    return () => clearTimeout(t);
  }, [n, inView]);

  return (
    <div ref={ref} className="mt-14 overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3 dark:border-white/10">
        {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-black/10 dark:bg-white/15" />)}
        <span className="ml-3 text-[12px] text-black/40 dark:text-white/35">{t('Arohon Driver', 'আরোহন ড্রাইভার')}</span>
      </div>
      <div className="grid md:grid-cols-[180px_1fr]">
        <nav className="hidden border-r border-black/10 p-3 md:block dark:border-white/10">
          {D_NAV.map((x, i) => (
            <p key={x} className={`rounded-md px-3 py-2 text-[13px] ${i === 0 ? 'bg-black/[.05] font-medium dark:bg-white/[.07]' : 'text-black/45 dark:text-[#8A8F98]'}`}>{t(x, D_NAV_BN[i])}</p>
          ))}
        </nav>
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Today, sample driver', 'আজ, নমুনা ড্রাইভার')}</p>
              <p className="mt-1 text-[40px] font-medium tabular-nums tracking-tight">৳{num(earned.toLocaleString('en-US'))}</p>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-[13px] dark:border-white/10">
              <span className="h-2 w-2 rounded-full bg-brand-green" /> {t('Online', 'অনলাইন')}
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-black/10 p-4 dark:border-white/10">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium">{t('Daily mission', 'দৈনিক মিশন')}</span>
              <span className="text-black/45 dark:text-[#8A8F98]">{n < MISSION ? t(`${MISSION - n} more trips`, `আর ${num(MISSION - n)}টি ট্রিপ`) : t('Complete', 'সম্পন্ন')}</span>
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: MISSION }, (_, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < n ? 'bg-black dark:bg-white' : 'bg-black/10 dark:bg-white/10'}`} />
              ))}
            </div>
          </div>

          <ul className="mt-6 min-h-[188px] divide-y divide-black/[.06] dark:divide-white/[.06]">
            {trips.map((tr) => (
              <li key={tr.id} className="flex animate-[fadein_.4s_ease] items-center gap-3 py-3 text-[13px]">
                <span className="min-w-0 flex-1 truncate">{t(`${D_AREAS[tr.from]} to ${D_AREAS[tr.to]}`, `${D_AREAS_BN[tr.from]} থেকে ${D_AREAS_BN[tr.to]}`)}</span>
                <span className="rounded-full border border-black/10 px-2 py-0.5 text-[11px] text-black/50 dark:border-white/10 dark:text-[#AFAFAF]">{tr.pay === 'Cash' ? t('Cash', 'ক্যাশ') : t('Wallet', 'ওয়ালেট')}</span>
                <span className="w-14 text-right font-medium tabular-nums">৳{num(tr.fare)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const D_STEPS = [
  { title: 'Download the app', copy: 'Get Arohon Driver on Android and sign in with your phone number.', titleBn: 'অ্যাপ ডাউনলোড করুন', copyBn: 'অ্যান্ড্রয়েডে আরোহন ড্রাইভার নামিয়ে ফোন নম্বর দিয়ে সাইন ইন করুন।' },
  { title: 'Upload your papers', copy: 'NID, driving licence, vehicle registration and insurance, straight from your camera.', titleBn: 'কাগজপত্র আপলোড করুন', copyBn: 'এনআইডি, ড্রাইভিং লাইসেন্স, গাড়ির রেজিস্ট্রেশন আর ইন্স্যুরেন্স, সরাসরি ক্যামেরা থেকে।' },
  { title: 'Get verified', copy: 'Our team checks every document by hand before your first trip.', titleBn: 'ভেরিফাইড হোন', copyBn: 'প্রথম ট্রিপের আগে আমাদের টিম প্রতিটি কাগজ নিজ হাতে যাচাই করে।' },
  { title: 'Go online', copy: 'Drive when you want. Keep cash fares and cash out wallet earnings to bKash.', titleBn: 'অনলাইনে যান', copyBn: 'যখন খুশি চালান। ক্যাশ ভাড়া আপনার, আর ওয়ালেটের আয় তুলে নিন বিকাশে।' },
];

export function Drive() {
  const { t, n, href } = useT();
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()} className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('Drive with Arohon', 'আরোহনে গাড়ি চালান')}</p>
          <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
            {t('Your car. Your hours.', 'আপনার গাড়ি। আপনার সময়।')}
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">{t('Your money.', 'আপনার আয়।')}</span>
          </h2>
        </div>
        <div className="md:justify-self-end md:pt-8">
          <p className="max-w-md text-[17px] leading-relaxed text-black/50 dark:text-[#8A8F98]">
            {t('Just 2% commission, while most apps take 15% to 25%. Go online when you want, take the trips you want, and finish daily missions for extra earnings.', 'কমিশন মাত্র ২%, যেখানে বেশিরভাগ অ্যাপ নেয় ১৫% থেকে ২৫%। যখন খুশি অনলাইনে যান, পছন্দের ট্রিপ নিন, আর দৈনিক মিশন শেষ করে বাড়তি আয় করুন।')}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <StoreButton kind="driver" variant="dark" />
            <Link href={href('/driver')} className="group inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
              {t('How it works', 'কীভাবে কাজ করে')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      <DriverApp />

      <div className="mt-10 grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
        {D_STEPS.map((st, i) => (
          <motion.div key={st.title} {...fade(i * 0.08)}>
            <p className="font-mono text-[11px] text-black/35 dark:text-white/30">{n(`0${i + 1}`)}</p>
            <h3 className="mt-2 text-[15px] font-medium">{t(st.title, st.titleBn)}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{t(st.copy, st.copyBn)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
const FAQ = [
  ['How do I book a ride on Arohon?', 'Get the Arohon app on Google Play or the App Store, set your pickup and destination, choose a vehicle and confirm. You see the fare before you book.', 'আরোহনে রাইড বুক করব কীভাবে?', 'গুগল প্লে বা অ্যাপ স্টোর থেকে আরোহন অ্যাপ নিন, পিকআপ আর গন্তব্য দিন, গাড়ি বেছে নিয়ে কনফার্ম করুন। বুক করার আগেই ভাড়া দেখতে পাবেন।'],
  ['Which vehicles can I book?', 'Bike, EV bike, CNG, Car, Car Plus, Micro, Hiace and Ambulance, plus pickups and trucks for goods.', 'কোন কোন গাড়ি বুক করা যায়?', 'বাইক, ইভি বাইক, সিএনজি, কার, কার প্লাস, মাইক্রো, হায়েস আর অ্যাম্বুলেন্স, সাথে মালামালের জন্য পিকআপ আর ট্রাক।'],
  ['Does Arohon work outside Dhaka?', 'Yes. Arohon covers all 64 districts with city rides and intercity trips between any two of them.', 'ঢাকার বাইরেও কি আরোহন চলে?', 'হ্যাঁ। আরোহন চলে দেশের ৬৪ জেলাতেই, শহরের রাইড আর যেকোনো দুই জেলার মধ্যে ইন্টারসিটি ট্রিপ নিয়ে।'],
  ['How can I pay?', 'Rides are paid in cash to your driver at the end of the trip, at the fare you saw when you booked. Reward coupons and promo codes come off automatically. Food and medicine orders can also be paid by bKash, Nagad or card.', 'পেমেন্ট করব কীভাবে?', 'রাইডের ভাড়া ট্রিপ শেষে ড্রাইভারকে ক্যাশে দেবেন, বুক করার সময় যে ভাড়া দেখেছিলেন সেটাই। রিওয়ার্ড কুপন আর প্রোমো কোড নিজে থেকেই কেটে যায়। খাবার আর ওষুধের অর্ডার বিকাশ, নগদ বা কার্ডেও পরিশোধ করা যায়।'],
  ['Can I schedule a ride in advance?', 'Yes, you can book airport runs, intercity trips and rentals ahead of time. For ambulances and pickups, you and the driver agree on the price before the trip.', 'আগে থেকে রাইড শিডিউল করা যায়?', 'হ্যাঁ, এয়ারপোর্ট ট্রিপ, ইন্টারসিটি ট্রিপ আর রেন্টাল আগে থেকেই বুক করতে পারবেন। অ্যাম্বুলেন্স আর পিকআপের ক্ষেত্রে ট্রিপের আগে আপনি আর ড্রাইভার মিলে ভাড়া ঠিক করে নেবেন।'],
  ['How do I become an Arohon driver?', 'Download the Arohon Driver app on Android, upload your NID, licence and vehicle papers, and start driving once our team has verified you.', 'আরোহন ড্রাইভার হব কীভাবে?', 'অ্যান্ড্রয়েডে আরোহন ড্রাইভার অ্যাপ ডাউনলোড করুন, এনআইডি, লাইসেন্স আর গাড়ির কাগজ আপলোড করুন, আমাদের টিম ভেরিফাই করলেই চালানো শুরু।'],
];
export function Faq() {
  const { t, href } = useT();
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto grid max-w-[1280px] gap-12 border-t border-black/10 px-6 py-24 sm:py-32 md:grid-cols-[1fr_1.6fr] md:px-16 dark:border-white/10">
      <motion.div {...fade()}>
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">{t('FAQ', 'সাধারণ প্রশ্ন')}</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          {t('Questions,', 'প্রশ্ন আছে,')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('answered.', 'উত্তরও আছে।')}</span>
        </h2>
        <Link href={href('/contact')} className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
          {t('Still have a question? Contact us', 'আরও কিছু জানতে চান? যোগাযোগ করুন')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
      <div className="border-t border-black/10 dark:border-white/10">
        {FAQ.map(([qEn, aEn, qBn, aBn], i) => {
          const q = t(qEn, qBn);
          const a = t(aEn, aBn);
          return (
          <div key={qEn} className="border-b border-black/10 dark:border-white/10">
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="group flex w-full items-center justify-between gap-6 py-5 text-left">
              <span className={`text-[17px] font-medium transition-colors ${open === i ? '' : 'text-black/70 group-hover:text-black dark:text-[#D0D6E0] dark:group-hover:text-white'}`}>{q}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3, ease }} className="shrink-0 text-black/40 dark:text-white/40">
                <Plus size={16} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                  <p className="max-w-xl pb-6 text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          );
        })}
      </div>
    </section>
  );
}

/* ───────────── Final CTA ───────────── */
export function FinalCTA() {
  const { t, href } = useT();
  // Linear closing pattern: centred two-line statement, two calm actions, lots of air
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
      <motion.h2
        {...fade()}
        className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]"
      >
        {t('Your next ride', 'আপনার পরের রাইড')}
        <br />
        <span className="text-black/45 dark:text-[#8A8F98]">{t('is one tap away.', 'মাত্র এক ট্যাপ দূরে।')}</span>
      </motion.h2>
      <motion.div
        {...fade(0.15)}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <StoreBadges className="justify-center" />
      </motion.div>
      <Link href={href('/driver')} className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
        {t('Want to drive instead?', 'গাড়ি চালাতে চান?')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
