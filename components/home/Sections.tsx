'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  ShieldCheck, MapTrifold, ShareNetwork, IdentificationCard, Phone, Star, Car, Headset, Plus, ArrowRight,
  } from '@phosphor-icons/react';
import { DISTRICTS } from '@/lib/districts';
import BD from '@/lib/bdDots.json';
import { StoreBadges, StoreButton } from '../StoreButtons';
import { CountUp, Reveal, SplitWords, ease, fade } from '../motion';

/* ───────────── Stats ───────────── */
export function Stats() {
  const stats = [
    { n: 12000, s: '+', l: 'Riders on Arohon', bn: 'রাইডার' },
    { n: 64, s: '', l: 'Districts covered', bn: 'জেলা' },
    { n: 500, s: '+', l: 'Partner drivers', bn: 'ড্রাইভার' },
    { n: 7, s: '', l: 'Airports served', bn: 'এয়ারপোর্ট' },
  ];
  return (
    <section className="mx-auto max-w-[1280px] px-6 md:px-16 py-24 sm:py-32">
      <h2 className="max-w-4xl u-h2">
        <SplitWords text="Bangladesh's fastest-growing way to move." />
      </h2>
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-black/10 lg:grid-cols-4 dark:bg-white/10">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08} className="bg-white p-6 sm:p-10 dark:bg-[#292929]">
            <p className="u-h2">
              <CountUp to={s.n} suffix={s.s} />
            </p>
            <p className="mt-3 font-semibold">{s.l}</p>
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
    lead: 'Every driver, checked.',
    rest: 'Nobody drives with Arohon until their identity, licence and vehicle have been verified by our team.',
    items: [
      { icon: IdentificationCard, title: 'NID verified', copy: 'National ID matched to the driver before their first trip.' },
      { icon: ShieldCheck, title: 'Licence checked', copy: 'Valid driving licence for the vehicle class they drive.' },
      { icon: Car, title: 'Vehicle papers', copy: 'Registration and fitness documents reviewed and kept on file.' },
      { icon: Star, title: 'Rated every trip', copy: 'Riders rate each ride, and low ratings are reviewed.' },
    ],
  },
  {
    icon: MapTrifold,
    label: 'During the ride',
    lead: 'Never alone on the road.',
    rest: 'Your trip is tracked from pickup to drop-off, and help is one tap away the whole time.',
    items: [
      { icon: MapTrifold, title: 'Live tracking', copy: 'Watch every turn of your trip in real time.' },
      { icon: ShareNetwork, title: 'Share your trip', copy: 'Send a live link so family can follow along.' },
      { icon: Phone, title: 'One-tap SOS', copy: 'Reach your emergency contact and our team instantly.' },
      { icon: Headset, title: 'Safety team 24/7', copy: 'Real people on standby, day and night.' },
    ],
  },
];

export function SafetyStory() {
  return (
    <section id="safety" className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()}>
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">Arohon Safety</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">Every ride, protected.</h2>
      </motion.div>

      <div className="mt-20 space-y-20">
        {SAFETY_GROUPS.map((g) => (
          <motion.div key={g.label} {...fade()} className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
            <div>
              <p className="flex items-center gap-2 text-[13px] text-black/60 dark:text-[#D0D6E0]">
                <g.icon size={15} className="text-black/40 dark:text-white/40" /> {g.label}
              </p>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-black/50 dark:text-[#8A8F98]">
                <span className="font-medium text-black dark:text-white">{g.lead}</span> {g.rest}
              </p>
            </div>
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {g.items.map((it) => (
                <div key={it.title}>
                  <p className="flex items-center gap-2 text-[15px] font-medium">
                    <it.icon size={16} className="text-black/40 dark:text-white/40" /> {it.title}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{it.copy}</p>
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
  const trail = useRef<SVGPathElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const [trip, setTrip] = useState<{ from: string; to: string; phase: 'fly' | 'land' | 'fade' }>({ from: first?.[0] ?? 'dhaka', to: first?.[1] ?? 'coxsbazar', phase: 'fade' });

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    const run = (from: string, to: string) => {
      const a = proj(DISTRICTS[from]);
      const b = proj(DISTRICTS[to]);
      const path = trail.current!;
      path.setAttribute('d', arc(a, b));
      const L = path.getTotalLength();
      setTrip({ from, to, phase: 'fly' });
      const FLY = 1200 + L * 2;
      const t0 = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
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
      setTrip({ from, to, phase: 'land' });
      const r = ring.current!;
      r.setAttribute('cx', String(b[0]));
      r.setAttribute('cy', String(b[1]));
      const t0 = performance.now();
      const burst = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - t0) / 1400);
        r.setAttribute('r', String(6 + Math.sin(t * Math.PI) * 3));
        r.style.opacity = String(0.5 * Math.sin(t * Math.PI));
        trail.current!.style.opacity = String(0.9 * (1 - t * t));
        if (t < 1) raf = requestAnimationFrame(burst);
        else {
          setTrip({ from, to, phase: 'fade' });
          setTimeout(next, 500);
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
    return () => { cancelled = true; clearTimeout(start); cancelAnimationFrame(raf); };
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
        <text x={a[0] - 10} y={a[1] + 5} textAnchor="end" fontSize="14" fontWeight="600" className="fill-black/60 dark:fill-white/60">{label(trip.from)}</text>
      </g>
      <g className="transition-opacity duration-500" style={{ opacity: trip.phase === 'land' ? 1 : 0 }}>
        <circle cx={b[0]} cy={b[1]} r="4.5" className="fill-[#111] dark:fill-white" />
        <text x={b[0] + 10} y={b[1] + 5} fontSize="15" fontWeight="600" className="fill-black dark:fill-white">{label(trip.to)}</text>
      </g>
    </>
  );
}

/** dotted Bangladesh (one block per district) with live trips between districts; shared by Coverage and Parcel */
export function BDMap({ label = 'Arohon trips across Bangladesh' }: { label?: string }) {
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
  return (
    <section id="cities" className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()} className="mx-auto max-w-2xl text-center">
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">Coverage</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">Teknaf to Tetulia.</h2>
        <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-black/50 dark:text-[#8A8F98]">City rides wherever you are, and intercity trips between any two of Bangladesh&apos;s 64 districts.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.2 }} className="relative mx-auto mt-14 w-full max-w-[520px]">
        <BDMap />
      </motion.div>

      <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 border-t border-black/10 pt-6 text-center dark:border-white/10">
        {[['64', 'Districts'], ['8', 'Airports'], ['24/7', 'Intercity']].map(([n, l]) => (
          <div key={l}>
            <p className="text-[28px] font-medium tracking-tight">{n}</p>
            <p className="mt-1 text-[13px] text-black/45 dark:text-[#8A8F98]">{l}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Rewards: Linear product-panel pattern, a sample rider climbing the real 16-tier ladder ───────────── */
// mirrors Arohon-customer src/constants/loyaltyTiers.ts (lifetime points = completed rides + delivered parcels)
const BANDS = ['Base', 'Classic', 'Pro', 'Super'] as const;
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
  const [feed, setFeed] = useState<{ id: number; text: string; tag: string }[]>([]);

  useEffect(() => {
    if (!inView) return;
    // demo rider: one ride at a time, loops back to Member after Legend
    const t = setTimeout(() => {
      const next = pts >= 79 ? 0 : pts + 1;
      setPts(next);
      if (next === 0) return setFeed([]);
      const up = tierAt(next) !== tierAt(next - 1);
      const kind = next % 6 === 0 ? 'Parcel delivered' : 'Ride completed';
      setFeed((f) => [{ id: next, text: up ? `Reached ${LADDER[tierAt(next)].name}` : kind, tag: up ? 'Tier up' : '+1 pt' }, ...f].slice(0, 4));
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
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">Sample rider</p>
        <div className="mt-5 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tier.badge} alt="" width={40} height={40} className="h-10 w-10" />
          <div>
            <p className="text-[17px] font-medium">{tier.name}</p>
            <p className="text-[12px] text-black/45 dark:text-[#8A8F98]">{tier.band} band, tier {ti + 1} of 16</p>
          </div>
        </div>
        <p className="mt-6 text-[40px] font-medium tabular-nums tracking-tight">
          {pts}
          <span className="ml-1.5 text-[15px] font-normal text-black/45 dark:text-[#8A8F98]">points</span>
        </p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div className="h-full bg-black transition-[width] duration-200 dark:bg-white" style={{ width: `${into * 100}%` }} />
        </div>
        <p className="mt-2 text-[12px] text-black/45 dark:text-[#8A8F98]">{nxt ? `${nxt.min - pts} to ${nxt.name}` : 'Top tier reached'}</p>
        <ul className="mt-6 min-h-[156px] divide-y divide-black/[.06] dark:divide-white/[.06]">
          {feed.map((f) => (
            <li key={f.id} className="flex animate-[fadein_.4s_ease] items-center justify-between py-2.5 text-[13px]">
              <span className={f.tag === 'Tier up' ? 'font-medium' : 'text-black/60 dark:text-[#D0D6E0]'}>{f.text}</span>
              <span className={`text-[11px] ${f.tag === 'Tier up' ? 'text-brand-green' : 'text-black/40 dark:text-white/35'}`}>{f.tag}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ladder: 16 tiers in four bands */}
      <div className="flex flex-col p-6 md:p-8">
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">16 tiers, Member to Legend</p>
        <div className="my-auto grid grid-cols-2 gap-x-3 gap-y-6 pt-6 sm:grid-cols-4 sm:gap-5">
          {BANDS.map((band, bi) => (
            <div key={band}>
              <div className="space-y-1.5">
                {LADDER.slice(bi * 4, bi * 4 + 4).reverse().map((t) => {
                  const i = LADDER.indexOf(t);
                  const reached = i <= ti;
                  const current = i === ti;
                  return (
                    <div
                      key={t.name}
                      className={`flex items-center gap-2 rounded-lg border px-2 py-2 transition-all duration-300 sm:px-2.5 ${current ? 'border-black/25 bg-black/[.05] dark:border-white/30 dark:bg-white/[.07]' : 'border-black/[.07] dark:border-white/[.07]'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.badge} alt="" width={20} height={20} className={`h-5 w-5 shrink-0 transition-all duration-300 ${reached ? '' : 'opacity-30 grayscale'}`} />
                      <span className={`truncate text-[12px] transition-colors sm:text-[13px] ${reached ? '' : 'text-black/35 dark:text-white/30'}`}>{t.name}</span>
                      <span className="ml-auto hidden font-mono text-[10px] text-black/30 lg:inline dark:text-white/25">{t.min}</span>
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
  { title: 'One point, every trip', copy: 'Every completed ride and delivered parcel earns a point, and points never expire.' },
  { title: 'Spend it on cheaper rides', copy: 'Turn points into discount coupons, applied automatically to your next ride. Your tier never drops.' },
  { title: 'Bring a friend', copy: 'When a friend joins with your code, you both get 20 points. There is no limit.' },
];

export function Rewards() {
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
        <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          Ride more.
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">Pay less.</span>
        </h2>
        <p className="max-w-md text-[17px] leading-relaxed text-black/50 md:justify-self-end md:pt-2 dark:text-[#8A8F98]">
          Arohon Rewards turns every trip into points. Climb sixteen tiers from Member to Legend and spend your points on discounts along the way.
        </p>
      </motion.div>

      <RewardsPanel />

      <div className="mt-10 grid gap-8 border-t border-black/10 pt-8 md:grid-cols-3 dark:border-white/10">
        {REWARD_FACTS.map((f) => (
          <div key={f.title}>
            <h3 className="text-[15px] font-medium">{f.title}</h3>
            <p className="mt-1.5 max-w-[320px] text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{f.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── Drive ───────────── */
/* Driver app mock in Linear's app-window style; sample trips stream in and earnings tick up */
const D_AREAS = ['Gulshan 2', 'Dhanmondi 27', 'Banani', 'Mirpur 10', 'Uttara', 'Farmgate', 'Motijheel', 'Bashundhara', 'Mohakhali', 'Badda', 'Tejgaon', 'Shyamoli'];
const D_NAV = ['Home', 'Trips', 'Earnings', 'Missions', 'Job posts'];
const MISSION = 10;
type DTrip = { id: number; route: string; fare: number; pay: 'Cash' | 'Wallet' };
const rnd = (n: number) => Math.floor(Math.random() * n);

function DriverApp() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-80px' });
  const [trips, setTrips] = useState<DTrip[]>([]);
  const [n, setN] = useState(0);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      const from = D_AREAS[rnd(D_AREAS.length)];
      let to = D_AREAS[rnd(D_AREAS.length)];
      while (to === from) to = D_AREAS[rnd(D_AREAS.length)];
      const fare = 90 + rnd(36) * 10;
      const next = n + 1 > MISSION ? 1 : n + 1;
      if (next === 1) setEarned(fare);
      else setEarned((e) => e + fare);
      setN(next);
      setTrips((l) => [{ id: Date.now(), route: `${from} to ${to}`, fare, pay: (rnd(3) ? 'Cash' : 'Wallet') as DTrip['pay'] }, ...(next === 1 ? [] : l)].slice(0, 4));
    }, n === 0 ? 700 : 2200);
    return () => clearTimeout(t);
  }, [n, inView]);

  return (
    <div ref={ref} className="mt-14 overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3 dark:border-white/10">
        {[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-black/10 dark:bg-white/15" />)}
        <span className="ml-3 text-[12px] text-black/40 dark:text-white/35">Arohon Driver</span>
      </div>
      <div className="grid md:grid-cols-[180px_1fr]">
        <nav className="hidden border-r border-black/10 p-3 md:block dark:border-white/10">
          {D_NAV.map((x, i) => (
            <p key={x} className={`rounded-md px-3 py-2 text-[13px] ${i === 0 ? 'bg-black/[.05] font-medium dark:bg-white/[.07]' : 'text-black/45 dark:text-[#8A8F98]'}`}>{x}</p>
          ))}
        </nav>
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">Today, sample driver</p>
              <p className="mt-1 text-[40px] font-medium tabular-nums tracking-tight">৳{earned.toLocaleString('en-US')}</p>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 text-[13px] dark:border-white/10">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-green" /> Online
            </span>
          </div>

          <div className="mt-6 rounded-xl border border-black/10 p-4 dark:border-white/10">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium">Daily mission</span>
              <span className="text-black/45 dark:text-[#8A8F98]">{n < MISSION ? `${MISSION - n} more trips` : 'Complete'}</span>
            </div>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: MISSION }, (_, i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i < n ? 'bg-black dark:bg-white' : 'bg-black/10 dark:bg-white/10'}`} />
              ))}
            </div>
          </div>

          <ul className="mt-6 min-h-[188px] divide-y divide-black/[.06] dark:divide-white/[.06]">
            {trips.map((t) => (
              <li key={t.id} className="flex animate-[fadein_.4s_ease] items-center gap-3 py-3 text-[13px]">
                <span className="min-w-0 flex-1 truncate">{t.route}</span>
                <span className="rounded-full border border-black/10 px-2 py-0.5 text-[11px] text-black/50 dark:border-white/10 dark:text-[#AFAFAF]">{t.pay}</span>
                <span className="w-14 text-right font-medium tabular-nums">৳{t.fare}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const D_STEPS = [
  { title: 'Download the app', copy: 'Get Arohon Driver on Android and sign in with your phone number.' },
  { title: 'Upload your papers', copy: 'NID, driving licence, vehicle registration and insurance, straight from your camera.' },
  { title: 'Get verified', copy: 'Our team checks every document by hand before your first trip.' },
  { title: 'Go online', copy: 'Drive when you want. Keep cash fares and cash out wallet earnings to bKash.' },
];

export function Drive() {
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <motion.div {...fade()} className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">Drive with Arohon</p>
          <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
            Your car. Your hours.
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">Your money.</span>
          </h2>
        </div>
        <div className="md:justify-self-end md:pt-8">
          <p className="max-w-md text-[17px] leading-relaxed text-black/50 dark:text-[#8A8F98]">
            Just 2% commission, while most apps take 15% to 25%. Go online when you want, take the trips you want, and finish daily missions for extra earnings.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <StoreButton kind="driver" variant="dark" />
            <Link href="/driver" className="group inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
              How it works <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </motion.div>

      <DriverApp />

      <div className="mt-10 grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10">
        {D_STEPS.map((st, i) => (
          <motion.div key={st.title} {...fade(i * 0.08)}>
            <p className="font-mono text-[11px] text-black/35 dark:text-white/30">0{i + 1}</p>
            <h3 className="mt-2 text-[15px] font-medium">{st.title}</h3>
            <p className="mt-1.5 text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{st.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */
const FAQ = [
  ['How do I book a ride on Arohon?', 'Get the Arohon app on Google Play or the App Store, set your pickup and destination, choose a vehicle and confirm. You see the fare before you book.'],
  ['Which vehicles can I book?', 'Bike, EV bike, CNG, Car, Car Plus, Micro, Hiace and Ambulance, plus pickups and trucks for goods.'],
  ['Does Arohon work outside Dhaka?', 'Yes. Arohon covers all 64 districts with city rides and intercity trips between any two of them.'],
  ['How can I pay?', 'Rides are paid in cash to your driver at the end of the trip, at the fare you saw when you booked. Reward coupons and promo codes come off automatically. Food and medicine orders can also be paid by bKash, Nagad or card.'],
  ['Can I schedule a ride in advance?', 'Yes, you can book airport runs, intercity trips and rentals ahead of time. For ambulances and pickups, you and the driver agree on the price before the trip.'],
  ['How do I become an Arohon driver?', 'Download the Arohon Driver app on Android, upload your NID, licence and vehicle papers, and start driving once our team has verified you.'],
];
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto grid max-w-[1280px] gap-12 border-t border-black/10 px-6 py-24 sm:py-32 md:grid-cols-[1fr_1.6fr] md:px-16 dark:border-white/10">
      <motion.div {...fade()}>
        <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">FAQ</p>
        <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
          Questions,
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">answered.</span>
        </h2>
        <Link href="/contact" className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
          Still have a question? Contact us <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </motion.div>
      <div className="border-t border-black/10 dark:border-white/10">
        {FAQ.map(([q, a], i) => (
          <div key={q} className="border-b border-black/10 dark:border-white/10">
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
        ))}
      </div>
    </section>
  );
}

/* ───────────── Final CTA ───────────── */
export function FinalCTA() {
  // Linear closing pattern: centred two-line statement, two calm actions, lots of air
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
      <motion.h2
        {...fade()}
        className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]"
      >
        Your next ride
        <br />
        <span className="text-black/45 dark:text-[#8A8F98]">is one tap away.</span>
      </motion.h2>
      <motion.div
        {...fade(0.15)}
        className="mt-10 flex flex-wrap items-center justify-center gap-4"
      >
        <StoreBadges className="justify-center" />
      </motion.div>
      <Link href="/driver" className="group mt-6 inline-flex items-center gap-1 text-sm font-medium text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
        Want to drive instead? <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </section>
  );
}
