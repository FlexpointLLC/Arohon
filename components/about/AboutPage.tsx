'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, LinkedinLogo } from '@phosphor-icons/react';
import { RouteMarkers } from '../RouteMarkers';
import { ease, fade, up } from '../motion';
import { BDMap } from '../home/Sections';
import { StoreBadges } from '../StoreButtons';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';

/* ── Letter: paragraphs rise in as you read, the signature writes itself at the end ── */
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
  const status = ['Finding your founder…', 'Ashik accepted your ride', 'Arriving in 1 tap'][step];
  return (
    <div ref={ref} className="mt-14">
      <p className="font-[family-name:var(--font-sign)] text-[34px] leading-none text-black/80 dark:text-white/80">P.S.</p>
      <p className="mt-3 text-[18px] leading-[1.7] text-black/80 dark:text-white/80">I answer every message myself. Want to talk about Arohon, design or Bangladesh? The ride is on me.</p>
      <div className="group mt-6 rounded-[24px] bg-white p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:ring-white/10">
        <div className="flex items-center gap-2 text-[13px]">
          <span className={`h-2 w-2 rounded-full ${step === 0 ? 'animate-pulse bg-black/40 dark:bg-white/40' : 'bg-[#079A70]'}`} />
          <span className="relative h-5 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease }} className="absolute inset-0 font-medium">{status}</motion.span>
            </AnimatePresence>
          </span>
        </div>
        <div className="mt-5 flex gap-3">
          <RouteMarkers pad="py-[3px]" />
          <div className="flex-1 space-y-3 text-[15px]">
            <p className="leading-[22px]">You, right here</p>
            <p className="leading-[22px] font-medium">Ashik Prottoy, on LinkedIn</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-4 border-t border-black/[.07] pt-5 dark:border-white/[.07]">
          <span className="relative h-11 w-16 shrink-0">
            <img src="/icons/line_cng.png" alt="" className="absolute inset-0 h-full w-full object-contain opacity-60 transition-opacity duration-500 group-hover:opacity-0 dark:invert" />
            <img src="/icons/cng.webp" alt="" className="absolute inset-0 h-full w-full -translate-x-2 object-contain opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
          </span>
          <span className="flex-1">
            <span className="block text-[14px] font-semibold">CNG, his usual</span>
            <span className={`text-[12px] ${muted}`}>Co-founder and CEO</span>
          </span>
          <span className="text-right">
            <span className="block text-[12px] text-black/40 line-through dark:text-white/40">৳180</span>
            <span className="text-[17px] font-semibold tabular-nums">৳0</span>
          </span>
        </div>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-black/[.05] py-3.5 text-[15px] font-semibold transition-colors duration-300 group-hover:bg-black group-hover:text-white dark:bg-white/[.08] dark:group-hover:bg-white dark:group-hover:text-black">
          <LinkedinLogo size={18} weight="fill" /> Connect on LinkedIn <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

function Letter() {
  const end = useRef<HTMLDivElement>(null);
  const signed = useInView(end, { once: true, margin: '-80px' });
  return (
    <article className="mx-auto max-w-[640px]">
      <motion.p {...fade()} className={`text-[13px] ${muted}`}>A letter from our co-founder</motion.p>
      <motion.h2 {...fade(0.05)} className={`mt-3 ${h2}`}>
        Why we built
        <br />
        <span className={muted}>Arohon.</span>
      </motion.h2>
      <div className="mt-12 space-y-6 text-[18px] leading-[1.7] text-black/80 dark:text-white/80">
        <motion.p {...fade()}>Dear rider, dear driver,</motion.p>
        {LETTER.map((p) => (
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
          <p className="mt-1 text-[15px] font-medium">Ashik Prottoy</p>
          <p className={`text-[14px] ${muted}`}>Co-founder and CEO, Arohon</p>
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
  const rows = [
    { k: 'Most ride apps', v: '15% to 25%', w: 25, me: false },
    { k: 'Arohon', v: '2%', w: 2, me: true },
  ];
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>Commission on every fare</p>
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
      <p className={`mt-6 border-t border-black/10 pt-5 text-[14px] dark:border-white/10 ${muted}`}>Plus a ৳3 safety charge and a small booking fee. On a ৳100 trip, the driver keeps ৳90.</p>
    </div>
  );
}

const TEAM = [
  { n: 'Ashik Prottoy', r: 'Co-founder and CEO', v: 'cng', ride: 'CNG' },
  { n: 'Sabbir Hossain', r: 'Co-founder and Head of Engineering', v: 'bike', ride: 'Bike' },
  { n: 'Ashiquzzaman', r: 'Head of Operations', v: 'car_plus', ride: 'Car Plus' },
  { n: 'Md Nazim', r: 'Head of Driver Experience', v: 'pickup', ride: 'Pickup, full of T-shirts' },
  { n: 'Symoon Haque Siam', r: 'Marketing Lead', v: 'ev_bike', ride: 'EV bike' },
  { n: 'Momen Sarkar', r: 'Business Analyst', v: 'micro', ride: 'Micro' },
];
/** Hover (or tap) a person and their usual ride drives into the tile. */
function Team() {
  return (
    <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
      {TEAM.map((p, i) => (
        <motion.div key={p.n} {...fade(i * 0.06)} tabIndex={0} className="group outline-none">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/[.03] dark:bg-white/[.05]">
            {/* line drawing by default, the real vehicle on hover or tap */}
            <img src={`/icons/line_${p.v}.png`} alt="" className="absolute inset-0 m-auto h-[56%] w-[80%] object-contain opacity-60 transition-all duration-500 group-hover:scale-95 group-hover:opacity-0 group-focus:scale-95 group-focus:opacity-0 dark:invert" />
            <img src={`/icons/${p.v}.webp`} alt="" className="absolute inset-0 m-auto h-[56%] w-[80%] scale-90 object-contain opacity-0 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-100 group-hover:opacity-100 group-focus:-translate-y-2 group-focus:scale-100 group-focus:opacity-100" />
            <p className={`absolute inset-x-0 bottom-3 text-center text-[12px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus:opacity-100 ${muted}`}>
              Usually rides <span className="font-medium text-black dark:text-white">{p.ride}</span>
            </p>
          </div>
          <p className="mt-4 text-[15px] font-medium">{p.n}</p>
          <p className={`mt-0.5 text-[13px] leading-snug ${muted}`}>{p.r}</p>
        </motion.div>
      ))}
    </div>
  );
}

const BELIEFS = [
  { t: 'Fair to drivers', c: 'A flat 2% commission. Drivers are the product, and they should keep what they earn.' },
  { t: 'Clear to riders', c: 'The fare is set before you book. No bargaining at the door, no surprise at the end.' },
  { t: 'Safe by default', c: 'Every driver’s ID, licence and papers are checked by our team before their first trip.' },
  { t: 'Built here', c: 'Designed in Dhaka for Bangladeshi roads, Bangladeshi prices and Bangladeshi families.' },
];

const SERVICES = [
  { k: 'Rides', c: 'Bike, CNG, car, micro and Hiace', v: 'car', href: '/ride' },
  { k: 'Parcel', c: 'Across Dhaka or to any district', v: 'bike', href: '/services/parcel' },
  { k: 'Rental', c: 'A car and driver by the hour or month', v: 'car_plus', href: '/services/rental' },
  { k: 'Business', c: 'Office rides and deliveries', v: 'hiace', href: '/services/business' },
  { k: 'Airport rides', c: 'Eight airports, booked ahead', v: 'micro', href: '/services/airport' },
  { k: 'Ambulance', c: 'Any hour, from the same app', v: 'ambulance', href: '/services/ambulance' },
];

export function AboutPage() {
  return (
    <>
      <section className="bg-[#FDFDFD] px-6 pb-20 pt-28 text-center dark:bg-black sm:pt-36">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>About Arohon</motion.p>
        <motion.h1 {...up(0.1)} className="mx-auto mt-4 max-w-4xl u-h1">
          Moving Bangladesh,
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">fairly.</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mx-auto mt-6 max-w-xl text-[17px] leading-relaxed ${muted}`}>Arohon is a Bangladeshi ride and delivery app. One app for getting around, sending things and getting help, built to be fair to the people who ride and the people who drive.</motion.p>
      </section>

      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <motion.div {...fade()}>
            <p className={`text-[13px] ${muted}`}>Who we are</p>
            <h2 className={`mt-3 ${h2}`}>
              A ride app
              <br />
              <span className={muted}>that starts with the driver.</span>
            </h2>
            <div className={`mt-8 max-w-lg space-y-5 text-[16px] leading-relaxed ${muted}`}>
              <p>When drivers keep what they earn, they stay, they care, and riders get better trips. That idea shapes everything we build, from the 2% commission to how we check every driver before their first ride.</p>
              <p>Today Arohon covers city rides, intercity trips, parcels, rentals, business transport, airport rides and ambulances, with drivers joining from every division of the country.</p>
            </div>
          </motion.div>
          <motion.div {...fade(0.1)} className="mx-auto w-full max-w-[440px]">
            <BDMap label="Arohon trips across Bangladesh" />
          </motion.div>
        </div>
      </section>

      <section className={wrap}>
        <Letter />
      </section>

      <section className={wrap}>
        <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
          <div>
            <p className={`text-[13px] ${muted}`}>Team</p>
            <h2 className={`mt-3 ${h2}`}>
              The people
              <br />
              <span className={muted}>behind Arohon.</span>
            </h2>
          </div>
          <p className={`self-end text-[16px] leading-relaxed ${muted}`}>A small team in Dhaka building the ride app we always wanted to use. Hover over anyone to see how they get to work.</p>
        </motion.div>
        <Team />
      </section>

      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <motion.div {...fade()}>
            <p className={`text-[13px] ${muted}`}>What we believe</p>
            <h2 className={`mt-3 ${h2}`}>
              Fair is a feature.
              <br />
              <span className={muted}>Not a promotion.</span>
            </h2>
          </motion.div>
          <CommissionBars />
        </div>
        <div className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
          {BELIEFS.map((b, i) => (
            <motion.div key={b.t} {...fade(i * 0.06)} className="bg-[#FDFDFD] p-7 dark:bg-black">
              <p className={`font-mono text-[11px] ${muted}`}>0{i + 1}</p>
              <p className="mt-6 text-[18px] font-medium tracking-tight">{b.t}</p>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{b.c}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={wrap}>
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>One app</p>
          <h2 className={`mt-3 ${h2}`}>
            Everything that moves,
            <br />
            <span className={muted}>in one place.</span>
          </h2>
        </motion.div>
        <ul className="mt-14 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
          {SERVICES.map((s, i) => (
            <motion.li key={s.k} {...fade(i * 0.04)}>
              <Link href={s.href} className="group flex items-center gap-5 py-4 sm:gap-8">
                <span className="relative h-12 w-20 shrink-0">
                  <img src={`/icons/line_${s.v}.png`} alt="" className="absolute inset-0 h-full w-full object-contain opacity-60 transition-opacity duration-300 group-hover:opacity-0 dark:invert" />
                  <img src={`/icons/${s.v}.webp`} alt="" className="absolute inset-0 h-full w-full scale-90 object-contain opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                </span>
                <span className="flex-1 sm:flex sm:items-baseline sm:gap-6">
                  <span className="block text-[18px] font-medium tracking-tight sm:w-48">{s.k}</span>
                  <span className={`text-[14px] ${muted}`}>{s.c}</span>
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
            { k: 'Company', v: 'Arohon Limited', c: 'Navana HR Tower 1, Gulshan Link Road, Dhaka', href: '/contact', cta: 'Contact us' },
            { k: 'Careers', v: 'Build it with us', c: 'Engineers, designers and operators who care about Bangladesh.', href: '/join-our-team', cta: 'Open roles' },
            { k: 'Drivers', v: 'Just 2% commission', c: 'Bring your bike, CNG, car or micro and drive on your hours.', href: '/drive', cta: 'Drive with Arohon' },
          ].map((x, i) => (
            <motion.div key={x.k} {...fade(i * 0.06)} className="flex flex-col bg-[#FDFDFD] p-7 dark:bg-black">
              <p className={`text-[13px] ${muted}`}>{x.k}</p>
              <p className="mt-6 text-[20px] font-medium tracking-tight">{x.v}</p>
              <p className={`mt-2 flex-1 text-[14px] leading-relaxed ${muted}`}>{x.c}</p>
              <Link href={x.href} className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium">{x.cta} <ArrowRight size={13} /></Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
        <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
          Come along
          <br />
          <span className={muted}>for the ride.</span>
        </motion.h2>
        <motion.div {...fade(0.15)} className="mt-10 flex justify-center"><StoreBadges className="justify-center" /></motion.div>
      </section>
    </>
  );
}
