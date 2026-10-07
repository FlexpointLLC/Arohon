'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { fade, up } from '../motion';

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
  const { ref, t } = useTick(1800);
  const dark = t % 2 === 1;
  return (
    <div ref={ref} className={`${panel} flex items-center justify-center p-8`}>
      <div className={`w-[220px] rounded-[28px] p-4 shadow-xl ring-1 transition-colors duration-700 ${dark ? 'bg-[#111] text-white ring-white/10' : 'bg-white text-black ring-black/10'}`}>
        <div className={`h-24 rounded-2xl transition-colors duration-700 ${dark ? 'bg-[#1E1E1E]' : 'bg-[#EEF1F0]'}`} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[13px] font-semibold">You’re online</span>
          <span className="h-2 w-2 rounded-full bg-[#079A70]" />
        </div>
        <div className={`mt-3 rounded-full py-2 text-center text-[12px] font-semibold transition-colors duration-700 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>Accept</div>
        <p className={`mt-3 text-center text-[11px] transition-colors duration-700 ${dark ? 'text-white/50' : 'text-black/45'}`}>{dark ? 'Dark' : 'Light'}, follows your phone</p>
      </div>
    </div>
  );
}

function MarkerDemo() {
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
      <p className={`absolute bottom-4 left-5 text-[12px] ${muted}`}>12 vehicles, smooth glide, no jumps</p>
    </div>
  );
}

function EvDemo() {
  const { ref, t } = useTick(2600);
  const on = t > 0;
  const rows = [
    { k: 'Bike', v: 120, me: false },
    { k: 'EV bike', v: 93, me: true },
  ];
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>Same 6 km trip, sample fare</p>
      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <div key={r.k}>
            <div className="flex justify-between text-[15px]">
              <span className={r.me ? 'font-semibold' : ''}>{r.k}</span>
              <span className={`tabular-nums ${r.me ? 'font-semibold text-[#079A70] dark:text-[#0ABF8B]' : muted}`}>৳{r.v}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-black/[.05] dark:bg-white/[.07]">
              <div className={`h-full rounded-full transition-[width] duration-1000 ease-out ${r.me ? 'bg-[#079A70]' : 'bg-black/30 dark:bg-white/30'}`} style={{ width: on ? `${(r.v / 120) * 100}%` : '0%' }} />
            </div>
          </div>
        ))}
      </div>
      <p className={`mt-6 text-[13px] ${muted}`}>EV rides are 21% to 24% cheaper than a bike.</p>
    </div>
  );
}

function IslandDemo() {
  const { ref, t } = useTick(700);
  const p = (t % 16) / 15;
  const label = p < 0.15 ? 'Finding your driver' : p < 0.5 ? 'Karim is 3 min away' : p < 0.95 ? 'On the way to Banani' : 'You’ve arrived';
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
  const { ref, t } = useTick(140);
  const cols = 14;
  const head = t % (cols + 8);
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium">Daily missions</p>
        <span className="rounded-full bg-[#FF9500]/10 px-2.5 py-1 text-[12px] font-semibold text-[#C77700] dark:text-[#FF9F0A]">7 day streak</span>
      </div>
      <div className="mt-6 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
        {Array.from({ length: cols * 4 }, (_, i) => {
          const c = i % cols;
          const lit = c <= head && c > head - 6;
          return <span key={i} className="aspect-square rounded-[4px] bg-black/[.06] transition-colors duration-300 dark:bg-white/[.08]" style={lit ? { background: WAVE[Math.floor(i / cols) % 3] } : undefined} />;
        })}
      </div>
      <p className={`mt-6 text-[13px] ${muted}`}>Daily quests, a streak, a chest and weekly rewards.</p>
    </div>
  );
}

function BoostDemo() {
  const { ref, t } = useTick(1100);
  const step = t % 6;
  const fare = 180 + Math.min(step, 3) * 20;
  const found = step >= 4;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{found ? 'Driver found' : 'Searching nearby drivers…'}</p>
      <div className="mt-4 flex items-end justify-between">
        <motion.span key={fare} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[34px] font-semibold tabular-nums tracking-tight">৳{fare}</motion.span>
        <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${found ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black text-white dark:bg-white dark:text-black'}`}>{found ? 'Karim accepted' : '+৳20 boost'}</span>
      </div>
      <p className={`mt-4 text-[13px] ${muted}`}>Raise your fare while searching and nearby drivers see it at once.</p>
    </div>
  );
}

/* ── the log ── */
type App = 'Rider app' | 'Driver app' | 'Shops';
type Entry = { date: string; app: App; title: string; copy: string; demo?: React.ReactNode; also?: string[] };
const LOG: { month: string; entries: Entry[] }[] = [
  {
    month: 'October 2026',
    entries: [
      { date: 'Oct 7', app: 'Driver app', title: 'Dark mode and a calmer ride flow', copy: 'The driver app now follows your phone’s light or dark setting. Ride requests, the trip screen and receipts were rebuilt to be clearer at a glance, day or night.', demo: <DarkModeDemo />, also: ['bKash number and referral reward now come from the server', 'Rental off days and driving experience on job posts'] },
      { date: 'Oct 6', app: 'Rider app', title: 'Live 3D vehicles on the map', copy: 'All 12 vehicle types now appear as 3D models that turn with the road and glide smoothly between updates, instead of jumping from point to point.', demo: <MarkerDemo />, also: ['In-app updates on Android, update card on iOS', 'Smoother switching between vehicle types'] },
      { date: 'Oct 6', app: 'Driver app', title: 'Sign up in fewer steps', copy: 'A new checklist walks drivers through every document, with help on each step and a “why we ask for this” note. Photos are compressed before upload, and EV bikes can now register.', also: ['Floating request bubble with a draining Accept timer', 'Switch between English and Bangla without restarting'] },
      { date: 'Oct 5', app: 'Rider app', title: 'EV bike is here', copy: 'EV bikes are now a real ride type with their own drivers, arrival times and fares, 21% to 24% cheaper than a regular bike.', demo: <EvDemo /> },
      { date: 'Oct 5', app: 'Rider app', title: 'Your ride on the lock screen', copy: 'On iPhone, your trip now lives in the Dynamic Island and on the lock screen, from finding a driver to arriving.', demo: <IslandDemo />, also: ['Airports and Hospitals tabs in Where to', 'New weather card with rain watch', 'Redesigned ambulance booking'] },
      { date: 'Oct 4', app: 'Rider app', title: 'More than one ride at a time', copy: 'Book a second ride while the first is still going, with an in-trip safety check and fares priced on our servers for everyone.' },
      { date: 'Oct 3', app: 'Rider app', title: 'Daily missions', copy: 'Complete small daily quests, keep your streak alive and open a chest for extra points. Weekly and streak rewards stack on top of your tier.', demo: <MissionsDemo /> },
    ],
  },
  {
    month: 'September 2026',
    entries: [
      { date: 'Sep 22', app: 'Rider app', title: 'Rentals, end to end', copy: 'Post a rental, get bids from drivers, approve the one you like and track weekly attendance for monthly hires. Status changes now arrive as notifications.' },
      { date: 'Sep 13', app: 'Driver app', title: 'Fewer missed requests', copy: 'Drivers whose app was closed are now woken up quietly so they stay online, and the map no longer flickers on a weak connection.' },
    ],
  },
  {
    month: 'July 2026',
    entries: [
      { date: 'Jul 22', app: 'Shops', title: 'Arohon Shop for restaurants and pharmacies', copy: 'A new order board for shops: new orders appear in real time, accept starts preparing, and an Arohon rider picks up when it’s ready.', also: ['Food and medicine orders dispatched to the nearest rider', 'Multi branch shops supported'] },
      { date: 'Jul 6', app: 'Rider app', title: 'Ambulance and pickup through bidding', copy: 'Ambulance and pickup requests now reach nearby drivers through the same fast dispatch as rides, and drivers send their offers.' },
      { date: 'Jul 4', app: 'Rider app', title: 'Fare boost while searching', copy: 'If no one has accepted yet, raise your fare from the search screen. It goes out as a fresh request to every nearby driver.', demo: <BoostDemo /> },
    ],
  },
];
const FILTERS: ('All' | App)[] = ['All', 'Rider app', 'Driver app', 'Shops'];

export function WhatsNewPage() {
  const [f, setF] = useState<(typeof FILTERS)[number]>('All');
  return (
    <>
      <section className="mx-auto max-w-[1080px] px-6 pb-12 pt-28 sm:pt-36 md:px-16">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>Changelog</motion.p>
        <motion.h1 {...up(0.1)} className="mt-4 u-h1">
          What’s new
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">in Arohon.</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>New features and improvements across the rider app, the driver app and Arohon Shop. We ship every week.</motion.p>
        <motion.div {...up(0.3)} className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((x) => (
            <button key={x} type="button" onClick={() => setF(x)} className={`rounded-full px-4 py-2 text-[13px] transition-colors ${f === x ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07] dark:hover:bg-white/[.1]'}`}>
              {x}
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
              <p className="text-[13px] font-medium">{m.month}</p>
              <div className="mt-6">
                {list.map((e) => (
                  <motion.article key={e.date + e.title} {...fade()} className="grid gap-6 pb-20 md:grid-cols-[180px_1fr] md:gap-10">
                    <div className="md:sticky md:top-28 md:self-start">
                      <p className={`text-[14px] ${muted}`}>{e.date}</p>
                      <span className="mt-2 inline-block rounded-full bg-black/[.05] px-2.5 py-1 text-[11px] font-medium dark:bg-white/[.08]">{e.app}</span>
                    </div>
                    <div>
                      <h2 className="text-[24px] font-medium leading-tight tracking-[-0.015em] sm:text-[28px]">{e.title}</h2>
                      <p className={`mt-3 max-w-2xl text-[16px] leading-relaxed ${muted}`}>{e.copy}</p>
                      {e.demo && <div className="mt-8 max-w-2xl">{e.demo}</div>}
                      {e.also && (
                        <ul className="mt-6 max-w-2xl space-y-1.5 border-l border-black/10 pl-4 text-[14px] dark:border-white/10">
                          {e.also.map((a) => (
                            <li key={a} className={muted}>{a}</li>
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
