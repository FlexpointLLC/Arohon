'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Clock, Phone, ShieldCheck, Star, Lifebuoy, Lock, Briefcase, MapPin, Wallet, Target, CalendarCheck } from '@phosphor-icons/react';
import { StoreButton } from '../StoreButtons';
import { ease, fade, up } from '../motion';
import { RouteMarkers } from '../RouteMarkers';
import { cityBooking, SAFETY_FEE } from '@/lib/fares';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';
const rnd = (n: number) => Math.floor(Math.random() * n);
const AREAS = ['Gulshan 2', 'Banani', 'Dhanmondi 27', 'Mirpur 10', 'Uttara', 'Farmgate', 'Motijheel', 'Bashundhara', 'Mohakhali', 'Badda'];

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
type Req = { id: number; from: string; to: string; fare: number; km: number };
function newReq(): Req {
  const from = AREAS[rnd(AREAS.length)];
  let to = AREAS[rnd(AREAS.length)];
  while (to === from) to = AREAS[rnd(AREAS.length)];
  return { id: Date.now(), from, to, fare: 90 + rnd(30) * 10, km: +(2 + Math.random() * 9).toFixed(1) };
}
const WINDOW = 8;

function DriverConsole() {
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
          <p className="text-[12px] text-black/45 dark:text-white/45">Today, sample</p>
          <p className="text-[28px] font-semibold tabular-nums tracking-tight">
            <motion.span key={earned} initial={{ opacity: 0.3, y: -4 }} animate={{ opacity: 1, y: 0 }}>৳{earned.toLocaleString('en-US')}</motion.span>
          </p>
          <p className="text-[12px] text-black/45 dark:text-white/45">{trips} {trips === 1 ? 'trip' : 'trips'}</p>
        </div>
        <button
          type="button"
          onClick={() => setOnline((o) => !o)}
          aria-pressed={online}
          className={`relative flex h-11 w-[132px] items-center rounded-full px-1 text-[13px] font-semibold transition-colors duration-300 ${online ? 'bg-[#0ABF8B] text-black' : 'bg-black/[.07] text-black/60 dark:bg-white/10 dark:text-white/60'}`}
        >
          <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 35 }} className={`absolute h-9 w-9 rounded-full bg-white shadow ${online ? 'right-1' : 'left-1'}`} />
          <span className={`w-full text-center ${online ? 'pr-9' : 'pl-9'}`}>{online ? 'Online' : 'Go online'}</span>
        </button>
      </div>

      {/* all states share one grid cell with an invisible request card, so the height never changes */}
      <div className="grid p-5">
        <div aria-hidden className="invisible flex flex-col [grid-area:1/1]">
          <RequestBody req={{ id: 0, from: 'Gulshan 2', to: 'Bashundhara', fare: 160, km: 4.8 }} left={WINDOW} />
        </div>
        <div className="[grid-area:1/1]">
        <AnimatePresence mode="wait">
          {!online && (
            <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-[15px] font-medium">You&apos;re offline</p>
              <p className="mt-1 max-w-[220px] text-[13px] text-black/50 dark:text-white/50">Flip the switch to see how trip requests reach you.</p>
            </motion.div>
          )}
          {online && !req && (
            <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col items-center justify-center">
              <span className="relative flex h-14 w-14 items-center justify-center">
                <span className="absolute h-full w-full animate-ping rounded-full bg-black/15 dark:bg-white/25" />
                <span className="h-4 w-4 rounded-full bg-black dark:bg-white" />
              </span>
              <p className="mt-4 text-[13px] text-black/50 dark:text-white/50">Finding trips near you…</p>
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
  return (
    <>
      <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] text-black/45 dark:text-white/45">New trip request</p>
                  <p className="mt-0.5 text-[26px] font-semibold tabular-nums tracking-tight">৳{req.fare}</p>
                </div>
                {/* accept window ring */}
                <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" className="stroke-black/10 dark:stroke-white/10" />
                  <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3" stroke="#0ABF8B" strokeLinecap="round" pathLength={1} strokeDasharray={`${left / WINDOW} 1`} style={{ transition: 'stroke-dasharray 1s linear' }} />
                  <text x="18" y="22" textAnchor="middle" fontSize="11" className="rotate-90 fill-current" style={{ transformOrigin: '18px 18px' }}>{left}</text>
                </svg>
              </div>
              <div className="mt-3 text-[13px]">
                {/* pickup square and destination circle joined by a centred line, as in the app */}
                <div className="flex gap-2.5">
                  <RouteMarkers pad="py-[2px]" />
                  <div className="space-y-2.5">
                    <p className="leading-5">{req.from}</p>
                    <p className="leading-5">{req.to}</p>
                  </div>
                </div>
                <p className="my-3 text-black/45 dark:text-white/45">{req.km} km trip</p>
              </div>
              <button type="button" onClick={accept} className="rounded-xl bg-black py-3 text-[14px] font-semibold text-white transition-transform active:scale-[.98] dark:bg-white dark:text-black">
                Accept
              </button>
    </>
  );
}

export function DriveHero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFDFD] pb-24 pt-28 dark:bg-black sm:pt-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1fr_380px] lg:gap-20">
        <div>
          <motion.p {...fade(0.05)} className={`text-[13px] ${muted}`}>Drive with Arohon</motion.p>
          <motion.h1 {...fade(0.1)} className="mt-4 u-h1">
            Just 2% commission.
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">Keep almost every taka.</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>
            Most ride apps take 15% to 25% of every fare. Arohon takes a flat 2%. Drive your bike, CNG, car or micro whenever you like and cash out to bKash.
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
          <p className={`text-[13px] ${muted}`}>Commission</p>
          <h2 className={`mt-3 ${h2}`}>
            See what you keep.
            <br />
            <span className={muted}>On every single trip.</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            Most ride apps in Bangladesh take 15% to 25% of every fare. Arohon takes a flat 2%, plus a small safety charge and booking fee. Nothing hidden.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['2% commission', '৳3 safety charge', '৳5 to ৳20 booking fee'].map((c) => (
              <span key={c} className="rounded-full border border-black/10 px-3.5 py-1.5 text-[13px] dark:border-white/15">{c}</span>
            ))}
          </div>
        </motion.div>

        <motion.div {...fade(0.1)} className={`${panel} p-6 sm:p-8`}>
          <div className="flex items-baseline justify-between">
            <p className={`text-[13px] ${muted}`}>Trip fare</p>
            <p className="text-[22px] font-semibold tabular-nums">৳{fare.toLocaleString('en-US')}</p>
          </div>
          <input
            type="range"
            min={100}
            max={1500}
            step={10}
            value={fare}
            onChange={(e) => setFare(+e.target.value)}
            aria-label="Trip fare"
            className="mt-3 w-full accent-[#0ABF8B]"
          />

          <div className="mt-8 space-y-5">
            <div>
              <div className="flex justify-between text-[13px]">
                <span className="font-medium">Arohon takes</span>
                <span className="tabular-nums">৳{ours}</span>
              </div>
              <p className={`mt-1 text-[11px] tabular-nums ${muted}`}>৳{Math.round(fare * 0.02)} commission + ৳{SAFETY_FEE} safety + ৳{fee} booking</p>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/[.06] dark:bg-white/[.08]">
                <motion.div className="h-full rounded-full bg-[#0ABF8B]" animate={{ width: scale(ours) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[13px]">
                <span className={muted}>Most ride apps take</span>
                <span className={`tabular-nums ${muted}`}>৳{lo} to ৳{hi}</span>
              </div>
              <div className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-black/[.06] dark:bg-white/[.08]">
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-black/25 dark:bg-white/25" animate={{ width: scale(hi) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-black/45 dark:bg-white/45" animate={{ width: scale(lo) }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-black/10 pt-6 dark:border-white/10">
            <div>
              <p className={`text-[12px] ${muted}`}>You keep</p>
              <motion.p key={fare - ours} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-[30px] font-semibold tabular-nums tracking-tight text-[#079A70] dark:text-[#0ABF8B]">
                ৳{(fare - ours).toLocaleString('en-US')}
              </motion.p>
            </div>
            <div className="text-right">
              <p className={`text-[12px] ${muted}`}>Over 10 trips like this</p>
              <p className="text-[30px] font-semibold tabular-nums tracking-tight">+৳{extra10.toLocaleString('en-US')}</p>
              <p className={`text-[11px] ${muted}`}>more than an app taking 20%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Why drive: three benefits, each with its own live visual ── */
const DAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
function HoursViz() {
  const { ref, i } = useLoop(6, 1300);
  // a different pattern of online hours each beat: your week, your call
  const on = (d: number, h: number) => ((d * 3 + h * 5 + i * 7) % 11) < 4 + (i % 3);
  return (
    <div ref={ref} className="space-y-1">
      {DAYS.map((d, di) => (
        <div key={d} className="flex items-center gap-2">
          <span className={`w-7 text-[10px] ${muted}`}>{d}</span>
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
  const bal = [1840, 1840, 0, 0][i];
  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-center justify-between rounded-xl bg-black/[.04] px-4 py-3 dark:bg-white/[.05]">
        <span className="flex items-center gap-2 text-[13px]"><Wallet size={16} /> Wallet</span>
        <motion.span key={bal} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="text-[15px] font-semibold tabular-nums">৳{bal.toLocaleString('en-US')}</motion.span>
      </div>
      <div className="flex justify-center">
        <motion.span animate={{ y: i === 1 ? [0, 6, 0] : 0, opacity: i === 1 ? 1 : 0.3 }} transition={{ duration: 0.6 }} className="text-[18px]">↓</motion.span>
      </div>
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-500 ${i >= 2 ? 'bg-[#E2136E]/10' : 'bg-black/[.04] dark:bg-white/[.05]'}`}>
        <span className="text-[13px] font-medium text-[#E2136E]">bKash</span>
        <span className="flex items-center gap-1.5 text-[13px]">
          {i >= 2 ? <><Check size={14} weight="bold" className="text-[#0ABF8B]" /> ৳1,840 sent</> : <span className={muted}>Min ৳100</span>}
        </span>
      </div>
    </div>
  );
}
function MissionViz() {
  const { ref, i } = useLoop(11, 700);
  const done = Math.min(i, 8);
  return (
    <div ref={ref} className="flex items-center gap-5">
      <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3.5" className="stroke-black/[.07] dark:stroke-white/10" />
        <circle cx="18" cy="18" r="15" fill="none" strokeWidth="3.5" stroke="#0ABF8B" strokeLinecap="round" pathLength={1} strokeDasharray={`${done / 8} 1`} style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <div>
        <p className="text-[28px] font-semibold tabular-nums">{done}/8</p>
        <p className={`text-[13px] ${muted}`}>{done < 8 ? `${8 - done} more trips to finish today's mission` : 'Mission complete, bonus earned'}</p>
      </div>
    </div>
  );
}
const WHY = [
  { icon: Clock, title: 'Set your own hours', copy: 'No shifts and no minimum hours. Go online when it suits you and offline when it does not.', Viz: HoursViz },
  { icon: Wallet, title: 'Your money, your way', copy: 'Keep the cash on cash trips. In-app earnings land in your wallet, and you cash out to bKash from ৳100.', Viz: CashoutViz },
  { icon: Target, title: 'Daily missions', copy: 'Hit daily trip targets and weekly streaks to earn extra on top of your fares.', Viz: MissionViz },
];
export function WhyDrive() {
  return (
    <section className={wrap}>
      <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
        <h2 className={h2}>
          Why drive
          <br />
          <span className={muted}>with Arohon.</span>
        </h2>
        <p className={`max-w-md text-[17px] leading-relaxed md:justify-self-end md:pt-2 ${muted}`}>Built around the way drivers in Bangladesh actually work: flexible days, cash in hand and a little extra for the busy ones.</p>
      </motion.div>
      <div className="mt-14 grid gap-3 md:grid-cols-3">
        {WHY.map((w, i) => (
          <motion.div key={w.title} {...fade(i * 0.08)} className={`${panel} flex flex-col p-6`}>
            <div className="flex min-h-[170px] items-center">
              <div className="w-full"><w.Viz /></div>
            </div>
            <div className="mt-6 border-t border-black/10 pt-5 dark:border-white/10">
              <p className="flex items-center gap-2 text-[16px] font-medium"><w.icon size={18} /> {w.title}</p>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{w.copy}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Get on the road: vehicle tabs + document checklist that ticks itself off + 4 steps ── */
const VEH = [
  { v: 'bike', label: 'Bike', trips: 'City rides and parcels' },
  { v: 'cng', label: 'CNG', trips: 'City rides' },
  { v: 'car', label: 'Car', trips: 'City, intercity and rentals' },
  { v: 'micro', label: 'Micro', trips: 'City, intercity and group trips' },
];
const DOCS = ['National ID, front and back', 'Driving licence, front and back', 'Vehicle registration', 'Insurance'];
const STEPS = ['Download the app', 'Upload your papers', 'Get verified by our team', 'Go online'];
export function Requirements() {
  const [v, setV] = useState(2);
  const { ref, i } = useLoop(DOCS.length + 3, 900);
  const ticked = Math.min(i, DOCS.length);
  return (
    <section className={wrap}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>Get on the road</p>
        <h2 className={`mt-3 ${h2}`}>
          What you need
          <br />
          <span className={muted}>to start driving.</span>
        </h2>
      </motion.div>
      <div className="mt-14 grid gap-3 lg:grid-cols-[1fr_1.2fr]">
        <div className={`${panel} p-6 sm:p-8`}>
          <p className={`text-[13px] ${muted}`}>Your vehicle</p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {VEH.map((x, k) => (
              <button key={x.v} type="button" onClick={() => setV(k)} className={`flex flex-col items-center rounded-xl py-3 transition-all ${v === k ? 'bg-black/[.06] ring-2 ring-black dark:bg-white/[.08] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.06] dark:bg-white/[.04]'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/${x.v}.webp`} alt="" className="h-10 w-14 object-contain" />
                <span className={`mt-1 text-[12px] ${v === k ? 'font-semibold' : muted}`}>{x.label}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={v} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 text-[14px]">
              <span className={muted}>Trips you can take: </span>{VEH[v].trips}
            </motion.p>
          </AnimatePresence>

          <div ref={ref} className="mt-8 border-t border-black/10 pt-6 dark:border-white/10">
            <p className={`text-[13px] ${muted}`}>Documents</p>
            <ul className="mt-4 space-y-3">
              {DOCS.map((d, k) => (
                <li key={d} className="flex items-center gap-3 text-[14px]">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 ${k < ticked ? 'bg-[#0ABF8B] text-black' : 'border border-black/20 dark:border-white/20'}`}>
                    {k < ticked && <Check size={11} weight="bold" />}
                  </span>
                  <span className={k < ticked ? '' : muted}>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${panel} p-6 sm:p-8`}>
          <p className={`text-[13px] ${muted}`}>Sign up in four steps</p>
          <ol className="relative mt-6">
            <span aria-hidden className="absolute bottom-3 left-[13px] top-3 w-px bg-black/10 dark:bg-white/10" />
            <motion.span aria-hidden className="absolute left-[13px] top-3 w-px bg-[#0ABF8B]" animate={{ height: `${(Math.min(ticked, 3) / 3) * 100}%` }} transition={{ duration: 0.6 }} style={{ maxHeight: 'calc(100% - 24px)' }} />
            {STEPS.map((s, k) => {
              const done = k <= Math.min(ticked, 3) && ticked > 0 ? k < ticked : false;
              return (
                <li key={s} className="relative flex items-start gap-4 pb-8 last:pb-0">
                  <span className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] transition-colors duration-300 ${done ? 'bg-[#0ABF8B] text-black' : 'bg-[#FDFDFD] ring-1 ring-black/15 dark:bg-black dark:ring-white/20'}`}>
                    {done ? <Check size={12} weight="bold" /> : `0${k + 1}`}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[15px] font-medium">{s}</p>
                    <p className={`mt-1 text-[13px] leading-relaxed ${muted}`}>
                      {[
                        'Get Arohon Driver on Android and sign in with your phone number.',
                        'Photograph your NID, licence and vehicle papers in the app.',
                        'A real person on our team checks every document before your first trip.',
                        'Switch online and take your first trip request.',
                      ][k]}
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
  { car: 'Toyota Axio', area: 'Gulshan', pay: 'Monthly', budget: '৳22,000', hours: '9 AM to 7 PM', exp: '3+ years' },
  { car: 'Toyota Noah', area: 'Uttara', pay: 'Monthly', budget: '৳25,000', hours: 'Office runs', exp: '5+ years' },
  { car: 'Honda Vezel', area: 'Dhanmondi', pay: 'Weekly', budget: '৳5,500', hours: 'School and office', exp: '2+ years' },
  { car: 'Toyota Premio', area: 'Banani', pay: 'Hourly', budget: '৳250/hr', hours: 'Weekends', exp: '2+ years' },
  { car: 'Mitsubishi Pajero', area: 'Baridhara', pay: 'Monthly', budget: '৳30,000', hours: 'Family driver', exp: '6+ years' },
];
export function DriverJobs() {
  const { ref, i } = useLoop(JOBS.length, 2800);
  const rows = [0, 1, 2].map((k) => JOBS[(k + i) % JOBS.length]);
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>Driver jobs</p>
          <h2 className={`mt-3 ${h2}`}>
            Want a steady job?
            <br />
            <span className={muted}>Owners are hiring.</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>
            Car owners post driver jobs on Arohon, paid by the hour, week or month. Browse them in the driver app, apply in a tap and get hired by someone who likes your profile.
          </p>
        </motion.div>
        <div ref={ref} className={`${panel} p-2`}>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="flex items-center gap-2 text-[13px] font-medium"><Briefcase size={16} /> Job posts</span>
            <span className={`text-[12px] ${muted}`}>Sample posts</span>
          </div>
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((j) => (
              <motion.div key={j.car + j.area} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease }} className="flex items-center gap-4 border-t border-black/[.06] px-4 py-4 dark:border-white/[.06]">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium">{j.car} driver</p>
                  <p className={`mt-0.5 flex flex-wrap items-center gap-x-3 text-[12px] ${muted}`}>
                    <span className="flex items-center gap-1"><MapPin size={11} weight="fill" />{j.area}</span>
                    <span>{j.hours}</span>
                    <span>{j.exp}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-semibold tabular-nums">{j.budget}</p>
                  <p className={`text-[11px] ${muted}`}>{j.pay}</p>
                </div>
                <span className="hidden rounded-full bg-black px-3.5 py-1.5 text-[12px] font-semibold text-white sm:block dark:bg-white dark:text-black">Apply</span>
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
  { icon: Lock, title: 'OTP at pickup', copy: 'Every rider confirms with a one-time code, so you always pick up the right person.' },
  { icon: Phone, title: 'One-tap help', copy: 'Call support or your emergency contact from inside the trip screen.' },
  { icon: ShieldCheck, title: 'Live trip sharing', copy: 'Share your live trip with someone you trust, and save an emergency contact in the app.' },
  { icon: Star, title: 'Two-way ratings', copy: 'Riders are rated too, which keeps everyone respectful.' },
  { icon: Lifebuoy, title: 'Real support', copy: 'Questions about payouts, documents or a trip go to real people on our team.' },
  { icon: CalendarCheck, title: 'Your preferences', copy: 'Filter requests by distance, zone and destination before you accept.' },
];
export function DriverSafety() {
  return (
    <section className={wrap}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>Safety</p>
        <h2 className={`mt-3 ${h2}`}>
          Safe on every trip,
          <br />
          <span className={muted}>for drivers too.</span>
        </h2>
      </motion.div>
      <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {SAFE.map((s, i) => (
          <motion.div key={s.title} {...fade(i * 0.05)}>
            <p className="flex items-center gap-2 text-[15px] font-medium"><s.icon size={16} className="text-black/40 dark:text-white/40" /> {s.title}</p>
            <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{s.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ── Driver FAQ + close ── */
const DFAQ = [
  ['What do I need to sign up?', 'Your National ID, driving licence, vehicle registration and insurance. You upload them from your phone in the Arohon Driver app.'],
  ['Which vehicles can I drive with?', 'Bike, CNG, car, Car Plus, micro and Hiace for rides, plus pickups and trucks for goods and ambulances for medical trips.'],
  ['How do I get paid?', 'On cash trips you keep the fare from the rider. In-app payments go to your Arohon wallet, and you can cash out to bKash from ৳100.'],
  ['How much does Arohon take?', 'A flat 2% commission on each trip, plus a ৳3 safety charge and a booking fee from ৳5 to ৳20 depending on the fare. On a ৳100 trip that is ৳10 in total. Most ride apps take 15% to 25%.'],
  ['Do I have to drive fixed hours?', 'No. You decide when to go online and which requests to accept.'],
  ['Is the driver app on iPhone?', 'Arohon Driver is available on Android.'],
];
export function DriverFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className={`${wrap} grid gap-12 md:grid-cols-[1fr_1.6fr]`}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>FAQ</p>
        <h2 className={`mt-3 ${h2}`}>
          Driver questions,
          <br />
          <span className={muted}>answered.</span>
        </h2>
      </motion.div>
      <div className="border-t border-black/10 dark:border-white/10">
        {DFAQ.map(([q, a], i) => (
          <div key={q} className="border-b border-black/10 dark:border-white/10">
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="group flex w-full items-center justify-between gap-6 py-5 text-left">
              <span className={`text-[17px] font-medium ${open === i ? '' : 'text-black/70 group-hover:text-black dark:text-[#D0D6E0] dark:group-hover:text-white'}`}>{q}</span>
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="shrink-0 text-[20px] leading-none text-black/40 dark:text-white/40">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                  <p className={`max-w-xl pb-6 text-[15px] leading-relaxed ${muted}`}>{a}</p>
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
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
      <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
        Your next trip
        <br />
        <span className={muted}>is a tap away.</span>
      </motion.h2>
      <motion.div {...fade(0.15)} className="mt-10 flex justify-center">
        <StoreButton kind="driver" variant="dark" />
      </motion.div>
      <a href="/ride" className={`group mt-6 inline-flex items-center gap-1 text-sm font-medium ${muted} transition-colors hover:text-black dark:hover:text-white`}>
        Looking for a ride instead? <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </a>
    </section>
  );
}
