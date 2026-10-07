'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Package, Storefront, User, Star, Clock, ForkKnife, Pill, Phone } from '@phosphor-icons/react';
import { StoreBadges } from '../StoreButtons';
import { ease, fade, up } from '../motion';
import { RouteMarkers } from '../RouteMarkers';
import { BDMap, SafetyStory, DIST_D, MAP, proj } from '../home/Sections';
import { DISTRICTS } from '@/lib/districts';
import { FareExplorer } from './ServicesPage';
import { PayYourWay } from '../ride/RideSections';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
// illustrated avatars in /public/avatars, one per sample first name
const avatar = (name: string) => `/avatars/${name.split(' ')[0].toLowerCase()}.webp`;
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';
const card = 'rounded-[24px] bg-white text-black shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:text-white dark:ring-white/10';

function useLoop(steps: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { margin: '-40px' });
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setI((x) => (x + 1) % steps), ms);
    return () => clearTimeout(t);
  }, [i, on, steps, ms]);
  return { ref, i };
}

/** shared hero: statement left, live product visual right */
function Hero({ label, title, rest, copy, children, cta }: { label: string; title: string; rest: string; copy: string; children: React.ReactNode; cta?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#FDFDFD] pb-24 pt-28 dark:bg-black sm:pt-32">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1fr_400px] lg:gap-20">
        <div>
          <motion.p {...fade(0.05)} className={`text-[13px] ${muted}`}>{label}</motion.p>
          <motion.h1 {...fade(0.1)} className="mt-4 u-h1">
            {title}
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">{rest}</span>
          </motion.h1>
          <motion.p {...fade(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>{copy}</motion.p>
          <motion.div {...fade(0.3)} className="mt-8">{cta ?? <StoreBadges />}</motion.div>
        </div>
        <motion.div {...up(0.4)}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function Head({ label, title, rest, copy, inline }: { label: string; title: string; rest: string; copy?: string; inline?: boolean }) {
  return (
    // only split into two columns when there is copy to sit beside the title
    <motion.div {...fade()} className={`grid gap-6 ${copy ? 'md:grid-cols-2' : ''}`}>
      <div>
        <p className={`text-[13px] ${muted}`}>{label}</p>
        <h2 className={`mt-3 ${h2}`}>
          {title}
          {inline ? ' ' : <br />}
          <span className={muted}>{rest}</span>
        </h2>
      </div>
      {copy && <p className={`max-w-md text-[17px] leading-relaxed md:justify-self-end md:pt-8 ${muted}`}>{copy}</p>}
    </motion.div>
  );
}

/** Linear-style feature grid used by every page */
function Grid({ items }: { items: { title: string; copy: string; icon?: React.ElementType }[] }) {
  return (
    <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <motion.div key={s.title} {...fade(i * 0.05)}>
          <p className="flex items-center gap-2 text-[15px] font-medium">{s.icon && <s.icon size={16} className="text-black/40 dark:text-white/40" />}{s.title}</p>
          <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{s.copy}</p>
        </motion.div>
      ))}
    </div>
  );
}

function Close({ title, rest, children }: { title: string; rest: string; children?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
      <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
        {title}
        <br />
        <span className={muted}>{rest}</span>
      </motion.h2>
      <motion.div {...fade(0.15)} className="mt-10 flex justify-center">{children ?? <StoreBadges className="justify-center" />}</motion.div>
    </section>
  );
}


/** compact FAQ in the site's Linear style */
function Faq({ title, rest, items }: { title: string; rest: string; items: [string, string][] }) {
  const [open, setOpen] = useState(0);
  return (
    <section className={`${wrap} grid gap-12 md:grid-cols-[1fr_1.6fr]`}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>FAQ</p>
        <h2 className={`mt-3 ${h2}`}>
          {title}
          <br />
          <span className={muted}>{rest}</span>
        </h2>
      </motion.div>
      <div className="border-t border-black/10 dark:border-white/10">
        {items.map(([q, a], i) => (
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

/* ═════════════ BUSINESS ═════════════ */
const WEEK = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WORKDAYS = 5;
function CommuteLog() {
  // ten trips a week (morning + evening, Sat to Wed) fill in one at a time; the next one is the only green
  const { ref, i } = useLoop(WORKDAYS * 2 + 3, 650);
  const done = Math.min(i, WORKDAYS * 2);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-black/45 dark:text-white/45">Office ride, sample</p>
        <span className="rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] text-black/60 dark:border-white/15 dark:text-white/60">Monthly plan</span>
      </div>

      {/* route, with the app's pickup square and destination circle */}
      <div className="mt-4 flex gap-3">
        <RouteMarkers pad="py-[3px]" />
        <div className="flex-1 space-y-3">
          <p className="flex items-baseline justify-between text-[15px] font-medium">Home, Uttara <span className="text-[12px] font-normal tabular-nums text-black/45 dark:text-white/45">8:30 AM</span></p>
          <p className="flex items-baseline justify-between text-[15px] font-medium">Office, Gulshan 1 <span className="text-[12px] font-normal tabular-nums text-black/45 dark:text-white/45">6:00 PM back</span></p>
        </div>
      </div>

      {/* week strip: two quiet dots per workday */}
      <div className="mt-6 grid grid-cols-7 border-y border-black/[.07] py-4 dark:border-white/[.07]">
        {WEEK.map((d, k) => {
          const work = k < WORKDAYS;
          return (
            <div key={d} className="flex flex-col items-center gap-2">
              <span className={`text-[11px] ${work ? 'text-black/55 dark:text-white/55' : 'text-black/20 dark:text-white/20'}`}>{d}</span>
              <div className="flex gap-1">
                {[0, 1].map((t) => {
                  const n = k * 2 + t;
                  const isDone = work && n < done;
                  const isNext = work && n === done;
                  return (
                    <motion.span
                      key={t}
                      animate={{ scale: isNext ? [1, 1.35, 1] : 1 }}
                      transition={{ duration: 1.2, repeat: isNext ? Infinity : 0 }}
                      className={`h-2 w-2 rounded-full transition-colors duration-300 ${!work ? 'bg-black/[.06] dark:bg-white/[.06]' : isNext ? 'bg-[#0ABF8B]' : isDone ? 'bg-black dark:bg-white' : 'bg-black/15 dark:bg-white/15'}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* driver, one line */}
      <div className="mt-4 flex items-center gap-3">
        <img src={avatar('Rakib')} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
        <p className="min-w-0 flex-1 truncate text-[13px]">
          <span className="font-semibold">Rakib</span>
          <span className="text-black/50 dark:text-white/50"> · Toyota Axio · ★ 4.9</span>
        </p>
        <span className="text-[12px] tabular-nums text-black/50 dark:text-white/50">{done}/10 trips</span>
      </div>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-black/[.07] dark:bg-white/10">
        <motion.div className="h-full rounded-full bg-black dark:bg-white" animate={{ width: `${(done / 10) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  );
}
const MERCHANT = [
  { id: 'Order 1042', to: 'Dhanmondi 9/A', st: 'Out for delivery' },
  { id: 'Order 1041', to: 'Mirpur 2', st: 'In transit' },
  { id: 'Order 1040', to: 'Bashundhara R/A', st: 'Picked up' },
  { id: 'Order 1039', to: 'Mohammadpur', st: 'Delivered' },
];
function MerchantConsole() {
  const { ref, i } = useLoop(MERCHANT.length, 2200);
  const rows = MERCHANT.map((_, k) => MERCHANT[(k + i) % MERCHANT.length]);
  return (
    <div ref={ref} className={`${panel} p-2`}>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2 text-[13px] font-medium"><Storefront size={16} /> Your shop deliveries</span>
        <span className={`text-[12px] ${muted}`}>Sample</span>
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((r) => (
          <motion.div key={r.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="flex items-center gap-4 border-t border-black/[.06] px-4 py-3.5 text-[14px] dark:border-white/[.06]">
            <span className="w-24 font-medium">{r.id}</span>
            <span className={`flex-1 ${muted}`}>{r.to}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${r.st === 'Delivered' ? 'bg-[#0ABF8B]/15 text-[#079A70] dark:text-[#0ABF8B]' : 'border border-black/10 dark:border-white/10'}`}>{r.st}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const AUDIENCE = [
  { v: 'car', title: 'Offices', copy: 'A monthly ride for staff who need to be at their desk on time, with the same driver every day.' },
  { v: 'hiace', title: 'Event days', copy: 'Off-sites, trainings and dinners: a micro, Hiace or bus moves the whole team together.' },
  { v: 'bike', title: 'Online shops', copy: 'Book pickups and send orders across town or to any district from your shop console.' },
  { v: 'car_plus', title: 'Guests and clients', copy: 'A Car Plus with a top-rated driver to meet visitors at the airport or the office.' },
];
function WhoFor() {
  return (
    <section className={wrap}>
      <Head label="Who it’s for" title="Built for teams" rest="of every size." />
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE.map((a, i) => (
          <motion.div key={a.title} {...fade(i * 0.06)} className={`${panel} group p-6`}>
            <RentalArt v={a.v} />
            <p className="mt-4 text-[16px] font-medium">{a.title}</p>
            <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{a.copy}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function BusinessPage() {
  return (
    <>
      <Hero
        label="Arohon for Business"
        title="Move your team."
        rest="Every working day."
        copy="Monthly office rides with the same driver, transport for the whole team on event days, and same-day deliveries for your shop."
        cta={<Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-[15px] font-semibold text-white max-sm:w-full max-sm:justify-center dark:bg-white dark:text-black">Talk to our team <ArrowRight size={15} /></Link>}
      >
        <CommuteLog />
      </Hero>
      <section className={wrap}>
        <Head label="Office commute" title="One driver." rest="One monthly price." copy="Book a daily office ride by the month or the week. The same trusted driver picks you up in the morning and takes you home in the evening, with every trip logged." />
        <Grid
          items={[
            { icon: User, title: 'Same driver, every day', copy: 'No new faces at the gate each morning. You ride with one driver you know.' },
            { icon: Clock, title: 'Fixed monthly fare', copy: 'One price for the month, with no daily surprises. Weekly plans are there too.' },
            { icon: Check, title: 'Every trip logged', copy: 'Each workday’s pickup and drop is recorded, Saturday to Friday.' },
          ]}
        />
      </section>
      <section className={wrap}>
        <Head label="Team transport" title="The whole office," rest="in one booking." copy="Off-sites, training days and events: book a micro, a Hiace or a bus for the group, with a driver, by the hour, the day or across districts." />
        <motion.div {...fade(0.1)} className="mt-14 grid grid-cols-3 gap-3">
          {[['micro', 'Micro', '7 seats'], ['hiace', 'Hiace', '12 seats'], ['car_plus', 'Car Plus', 'For guests']].map(([v, n, m]) => (
            <div key={v} className={`${panel} group p-5`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/icons/${v}.webp`} alt="" className="mx-auto h-24 w-full object-contain transition-transform duration-500 group-hover:-translate-y-1" />
              <p className="mt-3 text-[15px] font-medium">{n}</p>
              <p className={`text-[13px] ${muted}`}>{m}</p>
            </div>
          ))}
        </motion.div>
      </section>
      <section className={wrap}>
        <Head label="Business deliveries" title="Sell online?" rest="We deliver it." inline copy="Shops get their own delivery console: book pickups, follow every parcel from pickup to doorstep and see what has been delivered or returned." />
        <div className="mt-14">
          <MerchantConsole />
        </div>
      </section>
      <WhoFor />
      <FareExplorer
        label="Team trips"
        title="Planning an off-site?"
        rest="Price it in seconds."
        copy="Pick a destination and see what a micro or Hiace costs for the whole team, and what that comes to per person."
        vehicles={['micro', 'hiace']}
        seats={{ micro: 7, hiace: 12 }}
      />
      <Close title="Let’s move" rest="your business.">
        <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-[15px] font-semibold text-white dark:bg-white dark:text-black">Talk to our team <ArrowRight size={15} /></Link>
      </Close>
    </>
  );
}

/* ═════════════ PARCEL ═════════════ */
const P_STEPS = ['Confirmed', 'Picked up', 'In transit', 'Out for delivery', 'Delivered'];
function ParcelTracker() {
  const { ref, i } = useLoop(P_STEPS.length + 2, 1200);
  const at = Math.min(i, P_STEPS.length - 1);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] text-black/45 dark:text-white/45">Same Day Delivery, sample</p>
          <p className="mt-0.5 text-[17px] font-semibold">Banani to Dhanmondi</p>
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/[.05] dark:bg-white/[.08]"><Package size={22} /></span>
      </div>
      <ol className="relative mt-6">
        <span aria-hidden className="absolute bottom-2 left-[9px] top-2 w-px bg-black/10 dark:bg-white/10" />
        <motion.span aria-hidden className="absolute left-[9px] top-2 w-px bg-[#0ABF8B]" animate={{ height: `${(at / (P_STEPS.length - 1)) * 92}%` }} transition={{ duration: 0.5 }} />
        {P_STEPS.map((s, k) => (
          <li key={s} className="relative flex items-center gap-4 py-2.5">
            <span className={`relative z-10 flex h-[19px] w-[19px] items-center justify-center rounded-full transition-colors duration-300 ${k <= at ? 'bg-[#0ABF8B]' : 'bg-white ring-1 ring-black/15 dark:bg-[#1C1C1E] dark:ring-white/20'}`}>
              {k < at && <Check size={10} weight="bold" className="text-black" />}
              {k === at && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
            <span className={`text-[14px] transition-colors ${k === at ? 'font-semibold' : k < at ? '' : 'text-black/35 dark:text-white/30'}`}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
const SPEEDS = [
  { name: 'Quick Delivery', promise: 'Within 1 hour', note: 'Short hops across the city' },
  { name: '4-Hour Delivery', promise: 'Within 4 hours', note: 'Across Dhaka, the same afternoon' },
  { name: 'Same Day Delivery', promise: 'Today', note: 'Longer city runs, delivered by tonight' },
  { name: 'Nationwide', promise: '1 to 3 days', note: 'To any district in Bangladesh' },
];
const TYPES = ['Documents', 'Food', 'Homemade food', 'Clothes', 'Gifts', 'Cosmetics', 'Medicine', 'Accessories', 'Electronics', 'Other items'];
const WEIGHTS = ['0 to 2 kg', '2 to 4 kg', '4 to 6 kg', '6 to 8 kg'];
function WhatCanISend() {
  const [t, setT] = useState(0);
  const [w, setW] = useState(0);
  return (
    <div className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>What are you sending?</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {TYPES.map((x, k) => (
          <button key={x} type="button" onClick={() => setT(k)} className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${k === t ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07]'}`}>{x}</button>
        ))}
      </div>
      <p className={`mt-6 text-[13px] ${muted}`}>How heavy?</p>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {WEIGHTS.map((x, k) => (
          <button key={x} type="button" onClick={() => setW(k)} className={`rounded-xl py-2.5 text-[13px] transition-colors ${k === w ? 'bg-black font-semibold text-white dark:bg-white dark:text-black' : 'bg-black/[.04] hover:bg-black/[.08] dark:bg-white/[.06]'}`}>{x}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={t + '-' + w} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 flex items-center gap-2 border-t border-black/10 pt-5 text-[15px] dark:border-white/10">
          <Check size={18} weight="bold" className="text-brand-green" /> {TYPES[t]}, {WEIGHTS[w]}: good to go.
        </motion.p>
      </AnimatePresence>
      <p className={`mt-2 text-[12px] ${muted}`}>Up to 8 kg per parcel. Documents exclude passports and bank cheques.</p>
    </div>
  );
}

const NOPE = [
  ['Passports', 'Send them through an official courier instead.'],
  ['Bank cheques', 'Hand these over in person or through your bank.'],
  ['Over 8 kg', 'Split it into smaller parcels, or book a pickup or truck.'],
];
function ParcelNationwide() {
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>Nationwide</p>
          <h2 className={`mt-3 ${h2}`}>
            Any district,
            <br />
            <span className={muted}>in 1 to 3 days.</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>From Panchagarh to Teknaf, parcels leave Dhaka for all 64 districts every day, and you follow every step in the app.</p>
        </motion.div>
        <motion.div {...fade(0.1)} className="mx-auto w-full max-w-[440px]">
          <BDMap label="Parcels travelling between districts across Bangladesh" />
        </motion.div>
      </div>
    </section>
  );
}
function ParcelRules() {
  return (
    <section className={wrap}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <motion.div {...fade()} className={`${panel} p-6 sm:p-8`}>
          <p className={`text-[13px] ${muted}`}>Please don’t send</p>
          <ul className="mt-5 space-y-4">
            {NOPE.map(([t, c]) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF3B30]/15 text-[12px] font-bold text-[#FF3B30]">×</span>
                <span>
                  <span className="block text-[15px] font-medium">{t}</span>
                  <span className={`block text-[13px] ${muted}`}>{c}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fade(0.08)} className={`${panel} flex flex-col p-6 sm:p-8`}>
          <p className={`text-[13px] ${muted}`}>For online sellers</p>
          <p className="mt-5 text-[22px] font-medium tracking-tight">Sending every day?</p>
          <p className={`mt-2 max-w-sm text-[15px] leading-relaxed ${muted}`}>Shops get their own delivery console to book pickups and follow every order to the customer’s door.</p>
          <Link href="/services/business" className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-medium">See Arohon for Business <ArrowRight size={13} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

export function ParcelPage() {
  return (
    <>
      <Hero label="Parcel" title="Send it across town." rest="Or across the country." copy="From a document across Dhaka in an hour to a gift to Sylhet in a few days. Book in the app and follow it to the door.">
        <ParcelTracker />
      </Hero>
      <section className={wrap}>
        <Head label="Delivery speeds" title="As fast" rest="as you need it." />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPEEDS.map((s, i) => (
            <motion.div key={s.name} {...fade(i * 0.06)} className={`${panel} p-6`}>
              <p className={`font-mono text-[11px] ${muted}`}>0{i + 1}</p>
              <p className="mt-6 text-[28px] font-semibold tracking-tight">{s.promise}</p>
              <p className="mt-4 text-[15px] font-medium">{s.name}</p>
              <p className={`mt-1 text-[13px] ${muted}`}>{s.note}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Head label="What you can send" title="Almost anything" rest="up to 8 kg." />
          <WhatCanISend />
        </div>
      </section>
      <section className={wrap}>
        <Head label="Two ways to send" title="We pick it up," rest="or you drop it off." />
        <Grid
          items={[
            { icon: Package, title: 'Instant delivery', copy: 'A rider collects from your door and takes it straight to the receiver, within the city.' },
            { icon: Storefront, title: 'Pickup from home', copy: 'Our representative collects your parcel and sends it on, including to other districts.' },
            { icon: Check, title: 'Track every step', copy: 'Confirmed, picked up, in transit, out for delivery and delivered, all in the app.' },
          ]}
        />
      </section>
      <ParcelNationwide />
      <ParcelRules />
      <Close title="Ready to send?" rest="It takes a minute." />
    </>
  );
}

/* ═════════════ RENTAL ═════════════ */
const BIDS = [
  { name: 'Sohel', rating: '4.9', price: 2400, car: 'Toyota Axio' },
  { name: 'Kamal', rating: '4.8', price: 2200, car: 'Toyota Premio' },
  { name: 'Faruk', rating: '5.0', price: 2600, car: 'Toyota Allion' },
];
function BidBoard() {
  const { ref, i } = useLoop(6, 1300);
  const shown = Math.min(i, BIDS.length);
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => {
    if (i === 0) setPick(null);
  }, [i]);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <p className="text-[12px] text-black/45 dark:text-white/45">Your request, sample</p>
      <p className="mt-0.5 text-[17px] font-semibold">Car with driver, 6 hours</p>
      <p className="text-[13px] text-black/50 dark:text-white/50">Gulshan, Saturday from 10:00 AM</p>
      <p className="mt-5 text-[12px] text-black/45 dark:text-white/45">{shown ? `${shown} drivers bid` : 'Waiting for bids…'}</p>
      <ul className="mt-2 min-h-[198px] space-y-2">
        <AnimatePresence>
          {BIDS.slice(0, shown).map((b, k) => (
            <motion.li key={b.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
              <button type="button" onClick={() => setPick(k)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${pick === k ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.05] dark:bg-white/[.04]'}`}>
                <img src={avatar(b.name)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{b.name}</span>
                  <span className="flex items-center gap-1 text-[12px] text-black/50 dark:text-white/50"><Star size={10} weight="fill" className="text-[#FF9500]" />{b.rating}, {b.car}</span>
                </span>
                <span className="text-[16px] font-semibold tabular-nums">৳{b.price.toLocaleString('en-US')}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-2 text-center text-[12px] text-black/45 dark:text-white/40">{pick === null ? 'Tap a bid to choose your driver' : `${BIDS[pick].name} confirmed for Saturday`}</p>
    </div>
  );
}
const RENTALS = [
  { v: 'car', name: 'Hourly', copy: 'A car and driver by the hour, for errands or a day out.' },
  { v: 'car', name: 'Weekly or monthly', copy: 'Hire a car and driver for the week or the month, for your commute.' },
  { v: 'car_plus', name: 'Premium with chauffeur', copy: 'Premium cars and experienced chauffeurs for important days.' },
  { v: 'hiace', name: 'Bus, micro and Hiace', copy: 'Group transport for tours, trips and team days.' },
  { v: 'car_plus', name: 'Wedding car', copy: 'A car for the big day, booked ahead with a driver who is on time.' },
  { v: 'micro', name: 'Outstation', copy: 'Multi-day trips outside Dhaka, to Cox’s Bazar, Sylhet and beyond.' },
];
function RentalArt({ v }: { v: string }) {
  const mask = `url(/icons/line_${v}.png) center / contain no-repeat`;
  return (
    <div className="relative flex h-[110px] items-center justify-center">
      <div aria-hidden className="h-[88px] w-[72%] bg-black/55 transition-opacity duration-500 group-hover:opacity-0 dark:bg-white/65" style={{ WebkitMask: mask, mask }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/icons/${v}.webp`} alt="" aria-hidden loading="lazy" className="absolute h-[88px] w-[72%] scale-95 object-contain opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
    </div>
  );
}

const R_VEH = [
  { v: 'car', label: 'Car' },
  { v: 'car_plus', label: 'Car Plus' },
  { v: 'micro', label: 'Micro' },
  { v: 'hiace', label: 'Hiace' },
];
const PLANS = [
  { k: 'Hourly', opts: ['4 hours', '6 hours', '8 hours', '12 hours'] },
  { k: 'Weekly', opts: ['1 week', '2 weeks'] },
  { k: 'Monthly', opts: ['1 month', '3 months'] },
];
function RentalPlanner() {
  const [v, setV] = useState(0);
  const [plan, setPlan] = useState(0);
  const [opt, setOpt] = useState(1);
  const [day, setDay] = useState(1);
  const [days, setDays] = useState<Date[]>([]);
  // built on the client so the dates always match the visitor's today
  useEffect(() => {
    const n = new Date();
    setDays(Array.from({ length: 7 }, (_, i) => new Date(n.getFullYear(), n.getMonth(), n.getDate() + i)));
  }, []);
  const P = PLANS[plan];
  const o = Math.min(opt, P.opts.length - 1);
  const chip = (on: boolean) => `rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${on ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07] dark:hover:bg-white/10'}`;
  return (
    <section className={wrap}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>Plan a rental</p>
          <h2 className={`mt-3 ${h2}`}>
            Build your request.
            <br />
            <span className={muted}>Drivers do the rest.</span>
          </h2>
          <div className="mt-10 space-y-6">
            <div>
              <p className={`text-[13px] ${muted}`}>Vehicle</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{R_VEH.map((x, k) => <button key={x.v} type="button" onClick={() => setV(k)} className={chip(k === v)}>{x.label}</button>)}</div>
            </div>
            <div>
              <p className={`text-[13px] ${muted}`}>Plan</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{PLANS.map((x, k) => <button key={x.k} type="button" onClick={() => { setPlan(k); setOpt(0); }} className={chip(k === plan)}>{x.k}</button>)}</div>
            </div>
            <div>
              <p className={`text-[13px] ${muted}`}>How long</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{P.opts.map((x, k) => <button key={x} type="button" onClick={() => setOpt(k)} className={chip(k === o)}>{x}</button>)}</div>
            </div>
            <div>
              <p className={`text-[13px] ${muted}`}>Starting</p>
              <div className="mt-2 grid max-w-md grid-cols-7 gap-1">
                {days.map((d, k) => (
                  <button key={k} type="button" onClick={() => setDay(k)} className={`flex flex-col items-center rounded-xl py-2 transition-colors ${k === day ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-black/[.05] dark:hover:bg-white/[.07]'}`}>
                    <span className="text-[10px] opacity-60">{k === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-[15px] font-semibold tabular-nums">{d.getDate()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* the request card the planner builds */}
        <motion.div {...fade(0.1)} className="lg:pt-20">
          <div className={`${card} p-6`}>
            <p className="text-[12px] text-black/45 dark:text-white/45">Your rental request</p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={`${v}-${plan}-${o}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease }} className="mt-2 flex items-center justify-between gap-4">
                <p className="text-[22px] font-semibold leading-tight tracking-tight">
                  {R_VEH[v].label} with driver
                  <br />
                  <span className="text-black/50 dark:text-white/50">{P.opts[o]}</span>
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/${R_VEH[v].v}.webp`} alt="" className="h-16 w-24 object-contain" />
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 grid grid-cols-2 gap-2 text-[13px]">
              <div className="rounded-xl bg-black/[.04] px-3 py-2.5 dark:bg-white/[.06]">
                <p className="text-black/45 dark:text-white/45">Plan</p>
                <p className="mt-0.5 font-medium">{P.k}</p>
              </div>
              <div className="rounded-xl bg-black/[.04] px-3 py-2.5 dark:bg-white/[.06]">
                <p className="text-black/45 dark:text-white/45">Starts</p>
                <p className="mt-0.5 font-medium">{days[day] ? days[day].toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : ' '}</p>
              </div>
            </div>
            <p className="mt-5 border-t border-black/[.07] pt-4 text-[13px] text-black/55 dark:border-white/[.07] dark:text-white/55">Post this in the app and verified drivers send you their price. You choose who drives.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
function MonthlyHire() {
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>Weekly and monthly</p>
          <h2 className={`mt-3 ${h2}`}>
            Hire a driver
            <br />
            <span className={muted}>for the whole month.</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>For the daily commute or the school and office run: the same car and driver every day, with every trip logged so you always know it happened.</p>
        </motion.div>
        <motion.div {...fade(0.1)}>
          <CommuteLog />
        </motion.div>
      </div>
    </section>
  );
}
const RENTAL_FAQ: [string, string][] = [
  ['Is a driver included?', 'Yes. Every Arohon rental comes with a verified driver, from a few hours to a full month.'],
  ['How is the price set?', 'You post what you need and drivers send their price. It depends on the vehicle, how long you need it and how far you go, and you choose the bid you like.'],
  ['Can I rent for more than a day?', 'Yes. Book weekly or monthly hire for regular trips, or a multi-day outstation trip to places like Cox’s Bazar and Sylhet.'],
  ['Which vehicles can I rent?', 'Car, premium cars with a chauffeur, micro, Hiace and buses for groups, plus wedding cars.'],
];

export function RentalPage() {
  return (
    <>
      <Hero label="Rental" title="A car and a driver." rest="For as long as you need." copy="By the hour, the week or the month. Post what you need, drivers send you their price, and you choose who drives.">
        <BidBoard />
      </Hero>
      <section className={wrap}>
        <Head label="Ways to rent" title="Every kind of rental," rest="always with a driver." />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RENTALS.map((r, i) => (
            <motion.div key={r.name} {...fade(i * 0.05)} className={`${panel} group p-6`}>
              <RentalArt v={r.v} />
              <p className="mt-4 text-[16px] font-medium">{r.name}</p>
              <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{r.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={wrap}>
        <Head label="How it works" title="You set the plan." rest="Drivers bid." />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            ['Post your request', 'Choose the vehicle, the date and how long you need it.'],
            ['Get driver bids', 'Verified drivers send their price for your trip.'],
            ['Pick and go', 'Choose the bid you like and your rental is confirmed.'],
          ].map(([t, c], i) => (
            <motion.div key={t} {...fade(i * 0.1)}>
              <p className={`font-mono text-[11px] ${muted}`}>0{i + 1}</p>
              <p className="mt-2 text-[20px] font-medium tracking-tight">{t}</p>
              <p className={`mt-2 max-w-[300px] text-[15px] leading-relaxed ${muted}`}>{c}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <MonthlyHire />
      <RentalPlanner />
      <Faq title="Rental questions," rest="answered." items={RENTAL_FAQ} />
      <Close title="Need a car" rest="and a driver?" />
    </>
  );
}


/* ═════════════ shared: request card with bids arriving (rental, ambulance and airport all work by bidding) ═════════════ */
type Bid = { name: string; rating: string; price: number; note: string };
function RequestBids({ eyebrow, from, to, chips, bids, waiting, done }: { eyebrow: string; from: string; to: string; chips: string[]; bids: Bid[]; waiting: string; done: (b: Bid) => string }) {
  const { ref, i } = useLoop(bids.length + 4, 1300);
  const shown = Math.min(i, bids.length);
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => {
    if (i === 0) setPick(null);
  }, [i]);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <p className="text-[12px] text-black/45 dark:text-white/45">{eyebrow}</p>
      <div className="mt-3 flex gap-3">
        <RouteMarkers pad="py-[3px]" />
        <div className="flex-1 space-y-3 text-[15px] font-medium">
          <p className="leading-[22px]">{from}</p>
          <p className="leading-[22px]">{to}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {chips.map((c) => <span key={c} className="rounded-full bg-black/[.05] px-2.5 py-1 text-[11px] dark:bg-white/[.08]">{c}</span>)}
      </div>
      <p className="mt-5 text-[12px] text-black/45 dark:text-white/45">{shown ? `${shown} ${shown === 1 ? 'offer' : 'offers'}` : waiting}</p>
      <ul className="mt-2 min-h-[198px] space-y-2">
        <AnimatePresence>
          {bids.slice(0, shown).map((b, k) => (
            <motion.li key={b.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
              <button type="button" onClick={() => setPick(k)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${pick === k ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.05] dark:bg-white/[.04]'}`}>
                <img src={avatar(b.name)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{b.name}</span>
                  <span className="flex items-center gap-1 text-[12px] text-black/50 dark:text-white/50"><Star size={10} weight="fill" className="text-[#FF9500]" />{b.rating}, {b.note}</span>
                </span>
                <span className="text-[16px] font-semibold tabular-nums">৳{b.price.toLocaleString('en-US')}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-2 text-center text-[12px] text-black/45 dark:text-white/40">{pick === null ? 'Tap an offer to choose' : done(bids[pick])}</p>
    </div>
  );
}

/* ═════════════ AMBULANCE ═════════════ */
// from Arohon-customer: hospitals tab (src/constants/hospitals.ts), needs (SearchScreen AMBULANCE_NEEDS), bidding, now or scheduled, 999 line
const HOSPITALS = ['Dhaka Medical College Hospital', 'United Hospital', 'Labaid Specialized', 'Ibn Sina Hospital', 'Shaheed Suhrawardy', 'Bangladesh Specialized', 'Uttara Adhunik', 'Evercare Hospital', 'Square Hospital', 'Popular Medical College', 'Kurmitola General', 'National Heart Foundation'];
const NEEDS = [
  { k: 'Stretcher', copy: 'For a patient who can’t sit or walk.' },
  { k: 'Oxygen', copy: 'Oxygen support on the way to the hospital.' },
  { k: 'Wheelchair', copy: 'Help getting from the door to the ambulance.' },
  { k: 'Companion', copy: 'A family member rides along with the patient.' },
];
function NeedsPicker() {
  const [on, setOn] = useState<string[]>(['Stretcher']);
  const toggle = (k: string) => setOn((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]));
  return (
    <div className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>Anything the crew should know?</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {NEEDS.map((n) => {
          const sel = on.includes(n.k);
          return (
            <button key={n.k} type="button" onClick={() => toggle(n.k)} className={`rounded-xl p-4 text-left transition-all ${sel ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.05] dark:bg-white/[.04]'}`}>
              <span className="flex items-center justify-between text-[15px] font-medium">{n.k}{sel && <Check size={15} weight="bold" className="text-brand-green" />}</span>
              <span className={`mt-1 block text-[12px] leading-relaxed ${muted}`}>{n.copy}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={on.join()} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 border-t border-black/10 pt-4 text-[14px] dark:border-white/10">
          {on.length ? <>Sent with your request: <span className="font-medium">{on.join(', ')}</span></> : <span className={muted}>Nothing extra, that’s fine too.</span>}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
function HospitalList() {
  const { ref, i } = useLoop(HOSPITALS.length, 1100);
  return (
    <div ref={ref} className="mt-14 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {HOSPITALS.map((h, k) => (
        <div key={h} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-[14px] transition-colors duration-500 ${k === i ? 'bg-black/[.05] dark:bg-white/[.07]' : ''}`}>
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-500 ${k === i ? 'bg-[#FF3B30] text-white' : 'bg-black/[.05] text-black/40 dark:bg-white/[.07] dark:text-white/40'}`}>+</span>
          {h}
        </div>
      ))}
    </div>
  );
}
export function AmbulancePage() {
  return (
    <>
      <Hero label="Ambulance" title="When someone is sick," rest="help is on the way." copy="Book an ambulance from the same app you ride with, any hour. Pick the hospital, tell the crew what the patient needs, and nearby ambulances send you offers.">
        <RequestBids
          eyebrow="Ambulance request, sample"
          from="Your location, Dhanmondi"
          to="Square Hospital, Panthapath"
          chips={['Pickup now', 'Stretcher', 'Oxygen']}
          waiting="Ambulances near you can see your request…"
          bids={[
            { name: 'Mizan', rating: '4.9', price: 1200, note: '6 min away' },
            { name: 'Habib', rating: '4.8', price: 1100, note: '9 min away' },
            { name: 'Rafiq', rating: '5.0', price: 1350, note: '4 min away' },
          ]}
          done={(b) => `${b.name} is on the way`}
        />
      </Hero>
      <section className="mx-auto max-w-[1280px] px-6 md:px-16">
        <motion.div {...fade()} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FF3B30]/30 bg-[#FF3B30]/[.06] px-6 py-5">
          <p className="text-[15px]"><span className="font-semibold text-[#FF3B30]">Life threatening?</span> Call 999 now, then book your ambulance here.</p>
          <a href="tel:999" className="rounded-full bg-[#FF3B30] px-5 py-2.5 text-[14px] font-semibold text-white max-sm:w-full max-sm:text-center">Call 999</a>
        </motion.div>
      </section>
      <section className={wrap}>
        <Head label="How it works" title="Three taps" rest="to an ambulance." />
        <Grid
          items={[
            { icon: Package, title: 'Pick the hospital', copy: 'Choose from the hospitals list, sorted nearest first, or search any place.' },
            { icon: Check, title: 'Tell the crew', copy: 'Add a stretcher, oxygen, a wheelchair or a companion so they arrive prepared.' },
            { icon: Clock, title: 'Now or scheduled', copy: 'Book for right now, or schedule a pickup for a hospital visit later.' },
            { icon: Star, title: 'Choose an offer', copy: 'Nearby ambulances send their price. Pick the one that suits you.' },
            { icon: Phone, title: 'Pay in cash', copy: 'Pay the agreed price in cash to the crew at the end of the trip.' },
            { icon: User, title: 'Someone can ride along', copy: 'A family member can travel with the patient.' },
          ]}
        />
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Head label="Prepared crew" title="They’ll know" rest="before they arrive." />
          <NeedsPicker />
        </div>
      </section>
      <section className={wrap}>
        <Head label="Hospitals" title="Dhaka’s hospitals," rest="one tap away." copy="The app suggests hospitals nearest to you first. These are some of the hospitals in the list." />
        <HospitalList />
      </section>
      <Close title="Hope you never need it." rest="It’s here if you do." />
    </>
  );
}

/* ═════════════ AIRPORT ═════════════ */
// from Arohon-customer: src/constants/airports.ts (8 airports), rental "airport" request form + driver bids, 24 to 48h advice
const AIRPORTS = [
  { code: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka' },
  { code: 'CGP', name: 'Shah Amanat International', city: 'Chattogram' },
  { code: 'ZYL', name: 'Osmani International', city: 'Sylhet' },
  { code: 'CXB', name: 'Cox’s Bazar Airport', city: 'Cox’s Bazar' },
  { code: 'JSR', name: 'Jashore Airport', city: 'Jashore' },
  { code: 'RJH', name: 'Shah Makhdum Airport', city: 'Rajshahi' },
  { code: 'SPD', name: 'Saidpur Airport', city: 'Saidpur' },
  { code: 'BZL', name: 'Barishal Airport', city: 'Barishal' },
];
function AirportGrid() {
  const { ref, i } = useLoop(AIRPORTS.length, 1400);
  return (
    <div ref={ref} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {AIRPORTS.map((a, k) => (
        <motion.div key={a.code} {...fade(k * 0.04)} className={`${panel} p-5 transition-colors duration-500 ${k === i ? '!border-black/30 dark:!border-white/30' : ''}`}>
          <p className="font-mono text-[28px] font-semibold tracking-[0.12em]">{a.code}</p>
          <p className="mt-3 text-[14px] font-medium">{a.city}</p>
          <p className={`text-[12px] ${muted}`}>{a.name}</p>
        </motion.div>
      ))}
    </div>
  );
}
export function AirportPage() {
  return (
    <>
      <Hero label="Airport rides" title="Never miss a flight." rest="Never wait at arrivals." copy="Book your airport ride ahead. Tell us when and where, drivers send their offers, and your ride is confirmed before you set off.">
        <RequestBids
          eyebrow="Airport ride request, sample"
          from="Gulshan 2, Dhaka"
          to="DAC, Hazrat Shahjalal"
          chips={['Sat, 5:30 AM', '3 passengers', 'Car Plus']}
          waiting="Drivers can see your request…"
          bids={[
            { name: 'Sohel', rating: '4.9', price: 950, note: 'Toyota Premio' },
            { name: 'Kamal', rating: '4.8', price: 880, note: 'Toyota Axio' },
            { name: 'Faruk', rating: '5.0', price: 1000, note: 'Toyota Allion' },
          ]}
          done={(b) => `${b.name} confirmed for Saturday 5:30 AM`}
        />
      </Hero>
      <section className={wrap}>
        <Head label="Airports" title="Eight airports," rest="one app." copy="Rides to and from every major airport in Bangladesh, for the flight out and the flight home." />
        <AirportGrid />
      </section>
      <section className={wrap}>
        <Head label="How it works" title="Book ahead." rest="Relax on the day." />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            ['Send your request', 'Pickup, drop, date and time, how many people and which vehicle. Add a budget if you like.'],
            ['Get offers', 'Drivers send their price for your trip, and you choose the one you like.'],
            ['Your ride is confirmed', 'Your driver is set before the day. For flights we suggest booking 24 to 48 hours ahead.'],
          ].map(([t, c], i) => (
            <motion.div key={t} {...fade(i * 0.1)}>
              <p className={`font-mono text-[11px] ${muted}`}>0{i + 1}</p>
              <p className="mt-2 text-[20px] font-medium tracking-tight">{t}</p>
              <p className={`mt-2 max-w-[300px] text-[15px] leading-relaxed ${muted}`}>{c}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Close title="Next flight booked?" rest="Book the ride too." />
    </>
  );
}

/* ═════════════ PAYMENTS ═════════════ */
// matches the app: rides are cash only; coupons and promo codes apply automatically; food orders also take bKash, Nagad and card
function CashReceipt() {
  const { ref, i } = useLoop(6, 900);
  const lines: [string, number, boolean?][] = [['Ride fare', 300], ['Reward coupon, 20% off', -60, true]];
  const shown = Math.min(i + 1, lines.length); // fare is always there, the coupon lands next
  const total = lines.slice(0, shown).reduce((a, l) => a + l[1], 0);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <p className="text-[12px] text-black/45 dark:text-white/45">Trip complete, sample</p>
      <p className="mt-1 text-[17px] font-semibold">Banani to Dhanmondi 27</p>
      <ul className="mt-5 min-h-[56px] space-y-2 text-[14px]">
        {lines.slice(0, shown).map(([k, v, g]) => (
          <motion.li key={k} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`flex justify-between ${g ? 'text-[#079A70] dark:text-[#0ABF8B]' : ''}`}>
            <span className={g ? '' : 'text-black/55 dark:text-white/55'}>{k}</span>
            <span className="tabular-nums">{v < 0 ? `−৳${-v}` : `৳${v}`}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-4 flex items-end justify-between border-t border-black/[.07] pt-4 dark:border-white/[.07]">
        <span className="text-[14px] font-semibold">Pay in cash</span>
        <motion.span key={total} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-[30px] font-semibold tabular-nums tracking-tight">৳{total}</motion.span>
      </div>
      <p className="mt-2 text-[12px] text-black/45 dark:text-white/45">Hand it to your driver when you arrive.</p>
    </div>
  );
}
function PromoTry() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<null | { ok: boolean; t: string }>(null);
  const apply = () => {
    const c = code.trim().toUpperCase();
    // demo only: shows the app's real messages, nothing is redeemed here
    setMsg(!c ? null : c === 'AROHON20' ? { ok: true, t: 'Applied. The discount comes off your matching rides automatically.' } : c === 'EXPIRED' ? { ok: false, t: 'This promo code has expired' } : { ok: false, t: 'Invalid promo code' });
  };
  return (
    <div className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>Try it, sample code AROHON20</p>
      <div className="mt-4 flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder="Promo code" aria-label="Promo code" className="min-w-0 flex-1 rounded-xl bg-black/[.05] px-4 py-3 font-mono text-[14px] uppercase tracking-wider outline-none ring-black/20 focus:ring-2 dark:bg-white/[.07] dark:ring-white/30" />
        <button type="button" onClick={apply} className="rounded-xl bg-black px-5 text-[14px] font-semibold text-white dark:bg-white dark:text-black">Apply</button>
      </div>
      <AnimatePresence mode="wait">
        {msg && (
          <motion.p key={msg.t} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mt-4 flex items-center gap-2 text-[14px] ${msg.ok ? 'text-[#079A70] dark:text-[#0ABF8B]' : 'text-[#FF3B30]'}`}>
            {msg.ok ? <Check size={16} weight="bold" /> : <span className="font-bold">×</span>} {msg.t}
          </motion.p>
        )}
      </AnimatePresence>
      <p className={`mt-4 text-[12px] ${muted}`}>In the app, a code is used up once the ride it applies to is completed.</p>
    </div>
  );
}
export function PaymentsPage() {
  return (
    <>
      <Hero label="Payments" title="Pay in cash." rest="Save with points." copy="Every ride is paid in cash to your driver at the end of the trip, at the fare you saw when you booked. Coupons and promo codes come off automatically.">
        <CashReceipt />
      </Hero>
      <PayYourWay />
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Head label="Promo codes" title="Got a code?" rest="It applies itself." />
          <PromoTry />
        </div>
      </section>
      <section className={wrap}>
        <Head label="Rewards" title="Every trip" rest="earns you points." copy="Each completed ride and delivered parcel earns a point. Turn points into coupons of up to 50% off, applied to your next eligible ride." />
        <motion.div {...fade(0.1)} className="mt-10">
          <Link href="/#rewards" className="inline-flex items-center gap-1.5 text-[14px] font-medium">See how rewards work <ArrowRight size={13} /></Link>
        </motion.div>
      </section>
      <Close title="Simple fares," rest="simple payment." />
    </>
  );
}


/* ═════════════ SAFETY ═════════════ */
// what a family member sees on a shared trip: the car moves along the route, then "arrived safely"
function SharedTrip() {
  const { ref, i } = useLoop(9, 1100);
  const pct = Math.min(i, 7) / 7;
  const arrived = i >= 7;
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center gap-3">
        <img src={avatar('Nadia')} alt="" className="h-10 w-10 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
        <div className="flex-1">
          <p className="text-[12px] text-black/45 dark:text-white/45">Nadia shared her trip with you</p>
          <div className="relative h-[22px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={arrived ? 'a' : 'm'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }} className="absolute inset-0 text-[16px] font-semibold">
                {arrived ? 'Arrived safely' : `${Math.max(1, 14 - Math.round(pct * 14))} min to Uttara`}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${arrived ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black/[.05] dark:bg-white/[.08]'}`}>{arrived ? 'Done' : 'Live'}</span>
      </div>
      <div className="mt-6 flex gap-3">
        <RouteMarkers pad="py-[3px]" />
        <div className="flex-1 space-y-3 text-[14px]">
          <p className="leading-[22px]">Dhanmondi 27</p>
          <p className="leading-[22px]">Sector 7, Uttara</p>
        </div>
      </div>
      <div className="relative mt-6 h-1.5 rounded-full bg-black/[.06] dark:bg-white/10">
        <div className="h-full rounded-full bg-black transition-[width] duration-1000 ease-out dark:bg-white" style={{ width: `${pct * 100}%` }} />
        <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow transition-[left] duration-1000 ease-out dark:border-[#1C1C1E] dark:bg-white" style={{ left: `${pct * 100}%` }} />
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-black/[.07] pt-4 text-[13px] dark:border-white/[.07]">
        <img src={avatar('Karim')} alt="" className="h-8 w-8 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
        <span className="flex-1"><span className="font-semibold">Karim</span> <span className="text-black/50 dark:text-white/50">Toyota Axio, DHAKA METRO GA 31 4417</span></span>
        <span className="flex items-center gap-1 text-black/60 dark:text-white/60"><Star size={11} weight="fill" className="text-[#FF9500]" />4.9</span>
      </div>
    </div>
  );
}

const DOCS = ['National ID', 'Driving licence', 'Vehicle registration', 'Fitness certificate', 'Tax token', 'Profile selfie'];
function DriverCheck() {
  const { ref, i } = useLoop(DOCS.length + 3, 700);
  const done = Math.min(i, DOCS.length);
  const ok = i > DOCS.length;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <div className="flex items-center justify-between">
        <p className={`text-[13px] ${muted}`}>Driver application, sample</p>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${ok ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black/[.05] text-black/60 dark:bg-white/[.08] dark:text-white/60'}`}>{ok ? 'Approved to drive' : 'In review'}</span>
      </div>
      <ul className="mt-5 divide-y divide-black/[.06] dark:divide-white/[.06]">
        {DOCS.map((d, k) => (
          <li key={d} className="flex items-center justify-between py-3 text-[15px]">
            {d}
            <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 ${k < done ? 'scale-100 bg-[#079A70] text-white' : 'scale-90 bg-black/[.06] dark:bg-white/10'}`}>
              {k < done && <Check size={11} weight="bold" />}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// press and hold to send an SOS; it also plays itself while on screen
const SOS_TO = ['Alerting your emergency contact', 'Alerting the Arohon safety team', 'Sharing your live location'];
function SosDemo() {
  const { ref, i } = useLoop(10, 600);
  const [held, setHeld] = useState(false);
  const auto = i >= 2 && i < 5 ? 'hold' : i >= 5 ? 'sent' : 'idle';
  const state = held ? 'hold' : auto;
  return (
    <div ref={ref} className={`${panel} flex flex-col items-center p-8 text-center`}>
      <button
        type="button"
        aria-label="Hold for SOS"
        onPointerDown={() => setHeld(true)}
        onPointerUp={() => setHeld(false)}
        onPointerLeave={() => setHeld(false)}
        className="relative flex h-32 w-32 select-none items-center justify-center rounded-full bg-[#FF3B30] text-[22px] font-bold tracking-wide text-white shadow-[0_12px_40px_-8px_rgba(255,59,48,.6)]"
      >
        <svg className="absolute -inset-2 h-[144px] w-[144px] -rotate-90" viewBox="0 0 144 144" aria-hidden>
          <circle cx="72" cy="72" r="69" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#FF3B30]/20" />
          <circle cx="72" cy="72" r="69" fill="none" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round" strokeDasharray={434} strokeDashoffset={state === 'idle' ? 434 : 0} style={{ transition: state === 'hold' ? 'stroke-dashoffset 1.8s linear' : 'stroke-dashoffset .3s' }} />
        </svg>
        SOS
      </button>
      <p className={`mt-6 text-[13px] ${muted}`}>{state === 'sent' ? 'Help is on the way' : state === 'hold' ? 'Keep holding…' : 'Press and hold for SOS'}</p>
      <ul className="mt-5 w-full max-w-[280px] space-y-2 text-left">
        {SOS_TO.map((t, k) => (
          <li key={t} className={`flex items-center gap-3 rounded-xl bg-black/[.03] px-4 py-3 text-[14px] transition-all duration-500 dark:bg-white/[.04] ${state === 'sent' ? 'opacity-100' : 'opacity-40'}`} style={{ transitionDelay: state === 'sent' ? `${k * 0.15}s` : '0s' }}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-500 ${state === 'sent' ? 'bg-[#FF3B30] text-white' : 'bg-black/[.06] dark:bg-white/10'}`} style={{ transitionDelay: state === 'sent' ? `${k * 0.15}s` : '0s' }}>
              {state === 'sent' && <Check size={11} weight="bold" />}
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

const REPORT = ['Driver behaviour', 'Vehicle', 'Payment', 'Safety concern', 'Route', 'Other'];
function AfterRide() {
  const { ref, i } = useLoop(10, 650);
  const stars = Math.min(i, 5);
  const pick = i >= 6 ? 3 : -1;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>How was your ride with Karim?</p>
      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((k) => (
          <Star key={k} size={30} weight="fill" className={`transition-all duration-300 ${k < stars ? 'scale-100 text-[#FF9500]' : 'scale-90 text-black/10 dark:text-white/10'}`} />
        ))}
      </div>
      <p className="mt-7 border-t border-black/10 pt-6 text-[14px] font-medium dark:border-white/10">Something not right? Report it.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {REPORT.map((r, k) => (
          <span key={r} className={`rounded-full px-3 py-1.5 text-[13px] transition-all duration-300 ${k === pick ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] dark:bg-white/[.07]'}`}>{r}</span>
        ))}
      </div>
      <p className={`mt-4 h-5 text-[13px] transition-opacity duration-500 ${pick >= 0 ? 'opacity-100' : 'opacity-0'} ${muted}`}>Sent to our support team, we’ll get back to you.</p>
    </div>
  );
}

export function SafetyPage() {
  return (
    <>
      <Hero label="Safety" title="Safe from pickup" rest="to drop off." copy="Checked drivers, trips your family can follow, and help one tap away. Safety is built into every Arohon ride, for riders and for drivers.">
        <SharedTrip />
      </Hero>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Head label="Before you ride" title="Every driver," rest="checked by people." />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>Nobody drives with Arohon until our team has reviewed their ID, licence, vehicle papers and photo. Your app shows the driver’s name, photo, car and plate before they arrive.</motion.p>
          </div>
          <DriverCheck />
        </div>
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Head label="During the ride" title="Help is" rest="one tap away." />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>If something feels wrong, press and hold SOS. Your emergency contact and our safety team are alerted with your live location. Add your emergency contact in Profile, Trip safety.</motion.p>
          </div>
          <div className="lg:order-first">
            <SosDemo />
          </div>
        </div>
      </section>
      <SafetyStory />
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Head label="After the ride" title="Your rating" rest="keeps everyone honest." />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>Rate every trip. If something went wrong, report it from the app and our support team reviews every report.</motion.p>
          </div>
          <AfterRide />
        </div>
      </section>
      <section className={wrap}>
        <Head label="For drivers" title="Drivers are" rest="protected too." copy="Safety works both ways. Drivers get the same tools to stay safe on every trip." />
        <Grid
          items={[
            { icon: Phone, title: 'Emergency contact', copy: 'Drivers add a number that is called when they press the emergency button on a trip.' },
            { icon: Check, title: 'Report a rider', copy: 'Rider behaviour, payment or safety issues can be reported straight from the app.' },
            { icon: Star, title: '৳3 safety charge', copy: 'A small charge on each city trip goes toward keeping rides safe.' },
          ]}
        />
        <motion.div {...fade(0.1)} className="mt-10">
          <Link href="/drive" className="inline-flex items-center gap-1.5 text-[14px] font-medium">Drive with Arohon <ArrowRight size={13} /></Link>
        </motion.div>
      </section>
      <section className="mx-auto max-w-[1280px] px-6 pb-8 md:px-16">
        <motion.div {...fade()} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FF3B30]/30 bg-[#FF3B30]/[.06] px-6 py-5">
          <p className="text-[15px]"><span className="font-semibold text-[#FF3B30]">In immediate danger?</span> Call 999 first, then let us know.</p>
          <a href="tel:999" className="rounded-full bg-[#FF3B30] px-5 py-2.5 text-[14px] font-semibold text-white max-sm:w-full max-sm:text-center">Call 999</a>
        </motion.div>
      </section>
      <Close title="Ride with peace of mind." rest="Every time." />
    </>
  );
}


/* ═════════════ CITIES ═════════════ */
// districts where drivers have registered so far (Oct 2026), largest first; counts stay private, the map just lights up
const DIVISIONS: { name: string; districts: string[] }[] = [
  { name: 'Dhaka', districts: ['dhaka', 'narayanganj', 'gazipur', 'narsingdi', 'madaripur', 'kishoreganj', 'munshiganj', 'manikganj', 'tangail', 'faridpur', 'rajbari', 'shariatpur'] },
  { name: 'Chattogram', districts: ['chattogram', 'noakhali', 'comilla', 'feni', 'brahmanbaria', 'rangamati', 'khagrachhari', 'chandpur', 'coxsbazar', 'lakshmipur'] },
  { name: 'Mymensingh', districts: ['mymensingh', 'jamalpur', 'sherpur', 'netrokona'] },
  { name: 'Barishal', districts: ['barisal', 'barguna', 'jhalakathi', 'patuakhali', 'pirojpur'] },
  { name: 'Sylhet', districts: ['sylhet'] },
  { name: 'Rangpur', districts: ['rangpur', 'gaibandha', 'nilphamari', 'thakurgaon', 'dinajpur'] },
  { name: 'Khulna', districts: ['kushtia', 'chuadanga', 'satkhira', 'khulna', 'narail'] },
  { name: 'Rajshahi', districts: ['bogura', 'pabna', 'chapainawabganj', 'sirajganj', 'naogaon', 'natore'] },
];
const LIVE = DIVISIONS.flatMap((d) => d.districts);
const dName = (k: string) => (k === 'coxsbazar' ? 'Cox’s Bazar' : k === 'chapainawabganj' ? 'Chapai Nawabganj' : k === 'barisal' ? 'Barishal' : k === 'comilla' ? 'Cumilla' : k[0].toUpperCase() + k.slice(1));

/** Districts light up in the order drivers joined, then a ping keeps landing somewhere new, "still counting". */
function CitiesMap({ focus }: { focus: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: '-60px' });
  const [ping, setPing] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPing((p) => p + 1), 1400);
    return () => clearInterval(t);
  }, []);
  const pk = LIVE[(ping * 7) % LIVE.length]; // stride through the list so pings jump around the country
  const at = DISTRICTS[pk] ? proj(DISTRICTS[pk]) : null;
  const inFocus = (k: string) => !focus || DIVISIONS.find((d) => d.name === focus)!.districts.includes(k);
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[520px]">
      <svg viewBox={`-20 -20 ${MAP.w + 40} ${MAP.h + 40}`} className="w-full overflow-visible" role="img" aria-label="Districts where Arohon drivers have joined">
        {Object.entries(DIST_D).map(([k, d]) => {
          const i = LIVE.indexOf(k);
          const lit = seen && i >= 0;
          return (
            <path
              key={k}
              d={d}
              strokeWidth="3.2"
              strokeLinecap="round"
              className={`transition-[stroke,opacity] duration-700 ${lit ? 'stroke-black dark:stroke-white' : 'stroke-black/10 dark:stroke-white/10'} ${lit && !inFocus(k) ? 'opacity-25' : 'opacity-100'}`}
              style={{ transitionDelay: seen && !focus ? `${0.3 + Math.max(i, 0) * 0.04}s` : '0s' }}
            />
          );
        })}
        {seen && at && (
          <g key={ping} transform={`translate(${at[0]} ${at[1]})`}>
            <circle r="5" className="fill-[#079A70]" />
            <circle r="5" className="city-ping fill-none stroke-[#079A70]" strokeWidth="2" />
          </g>
        )}
      </svg>
      <p className={`mt-6 flex items-center justify-center gap-2 text-[13px] ${muted}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#079A70]" />
        <span className="relative inline-block h-5 w-[170px] overflow-hidden text-left">
          <AnimatePresence initial={false}>
            <motion.span key={pk} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.35, ease }} className="absolute inset-0">
              New driver in {dName(pk)}
            </motion.span>
          </AnimatePresence>
        </span>
      </p>
    </div>
  );
}

function Divisions() {
  const [focus, setFocus] = useState<string | null>(null);
  return (
    <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div className="lg:sticky lg:top-28">
        <CitiesMap focus={focus} />
      </div>
      <ul className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10" onMouseLeave={() => setFocus(null)}>
        {DIVISIONS.map((d, k) => (
          <motion.li key={d.name} {...fade(k * 0.04)}>
            <button
              type="button"
              onMouseEnter={() => setFocus(d.name)}
              onFocus={() => setFocus(d.name)}
              onClick={() => setFocus((f) => (f === d.name ? null : d.name))}
              className={`w-full py-5 text-left transition-opacity duration-300 ${focus && focus !== d.name ? 'opacity-40' : ''}`}
            >
              <span className="text-[20px] font-medium tracking-tight">{d.name}</span>
              <span className={`mt-2 block text-[14px] leading-relaxed ${muted}`}>{d.districts.map(dName).join(', ')}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function CitiesPage() {
  return (
    <>
      <section className="bg-[#FDFDFD] px-6 pb-8 pt-28 text-center dark:bg-black sm:pt-36">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>Cities</motion.p>
        <motion.h1 {...up(0.1)} className="mx-auto mt-4 max-w-3xl u-h1">
          Already across Bangladesh.
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">Still counting.</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mx-auto mt-6 max-w-xl text-[17px] leading-relaxed ${muted}`}>Drivers have joined Arohon from every division in the country, and new districts light up every week. Here is where we are so far.</motion.p>
      </section>
      <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-16">
        <Divisions />
      </section>
      <section className={wrap}>
        <Head label="Intercity" title="Any two districts," rest="one booking." copy="Even where city rides are still growing, you can book a car, micro or Hiace between any of Bangladesh’s 64 districts." />
        <motion.div {...fade(0.1)} className="mt-10">
          <Link href="/ride" className="inline-flex items-center gap-1.5 text-[14px] font-medium">Book a ride <ArrowRight size={13} /></Link>
        </motion.div>
      </section>
      <Close title="Not on the map yet?" rest="Be the first in your district.">
        <Link href="/drive" className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white sm:w-auto dark:bg-white dark:text-black">Drive with Arohon <ArrowRight size={14} /></Link>
      </Close>
    </>
  );
}


/* ═════════════ PARTNERS ═════════════ */
// facts from Arohon-captain (৳60 per verified signup, 5 step onboarding), Arohon-shop / agent (merchant order flow), Driver app job posts
const SIGNUPS = [
  { n: 'Rahim Uddin', v: 'CNG' },
  { n: 'Jahid Hasan', v: 'Bike' },
  { n: 'Kamrul Islam', v: 'Car' },
  { n: 'Sumon Mia', v: 'Bike' },
];
function CaptainHome() {
  const { ref, i } = useLoop(SIGNUPS.length * 2 + 3, 900);
  // each signup lands as pending, then flips to verified and pays ৳60
  const status = (k: number) => (i >= k * 2 + 2 ? 'Verified' : i >= k * 2 + 1 ? 'Pending' : null);
  const verified = SIGNUPS.filter((_, k) => status(k) === 'Verified').length;
  const target = 6;
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] text-black/45 dark:text-white/45">Today’s target, Mirpur zone</p>
          <p className="mt-1 text-[22px] font-semibold tabular-nums tracking-tight">{verified} / {target} drivers</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-black/45 dark:text-white/45">Earned today</p>
          <motion.p key={verified} initial={{ opacity: 0.3, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-[22px] font-semibold tabular-nums tracking-tight text-[#079A70] dark:text-[#0ABF8B]">৳{verified * 60}</motion.p>
        </div>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-black/[.06] dark:bg-white/10">
        <div className="h-full rounded-full bg-black transition-[width] duration-700 ease-out dark:bg-white" style={{ width: `${(verified / target) * 100}%` }} />
      </div>
      <p className="mt-6 text-[12px] text-black/45 dark:text-white/45">My signups</p>
      <ul className="mt-2 min-h-[216px] space-y-2">
        <AnimatePresence>
          {SIGNUPS.map((d, k) => {
            const st = status(k);
            if (!st) return null;
            return (
              <motion.li key={d.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="flex items-center gap-3 rounded-xl bg-black/[.03] p-3 dark:bg-white/[.04]">
                <img src={avatar(d.n)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{d.n}</span>
                  <span className="text-[12px] text-black/50 dark:text-white/50">{d.v} driver</span>
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${st === 'Verified' ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-[#FF9500]/10 text-[#C77700] dark:text-[#FF9F0A]'}`}>
                  {st === 'Verified' ? '+৳60' : 'Pending'}
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}

const APPLICANTS = [
  { n: 'Habib', r: '4.9', t: '3 years, Toyota Axio' },
  { n: 'Shakil', r: '4.8', t: '5 years, any sedan' },
  { n: 'Arif', r: '5.0', t: '2 years, Premio and Allion' },
];
function JobPost() {
  const { ref, i } = useLoop(APPLICANTS.length + 4, 1000);
  const shown = Math.min(i, APPLICANTS.length);
  const hired = i >= APPLICANTS.length + 1;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[13px] ${muted}`}>Job post, sample</p>
          <p className="mt-1 text-[18px] font-medium tracking-tight">Driver for a Toyota Axio</p>
          <p className={`mt-1 text-[14px] ${muted}`}>Uttara, full time, starts Sunday</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${hired ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black/[.05] dark:bg-white/[.08]'}`}>{hired ? 'Hired' : 'Open'}</span>
      </div>
      <ul className="mt-6 min-h-[200px] space-y-2">
        {APPLICANTS.slice(0, shown).map((a, k) => (
          <motion.li key={a.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: hired && k !== 2 ? 0.4 : 1, y: 0 }} transition={{ duration: 0.3, ease }} className={`flex items-center gap-3 rounded-xl p-3 transition-shadow ${hired && k === 2 ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] dark:bg-white/[.04]'}`}>
            <img src={avatar(a.n)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
            <span className="flex-1">
              <span className="block text-[14px] font-semibold">{a.n}</span>
              <span className="flex items-center gap-1 text-[12px] text-black/50 dark:text-white/50"><Star size={10} weight="fill" className="text-[#FF9500]" />{a.r}, {a.t}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const PARTNER_TYPES = [
  { k: 'Shops and pharmacies', c: 'Sell food and medicine', href: '#shops' },
  { k: 'Captains', c: 'Sign up drivers, earn per driver', href: '#captains' },
  { k: 'Vehicle owners', c: 'Find a checked driver', href: '#owners' },
  { k: 'Businesses', c: 'Rides and deliveries for your team', href: '/services/business' },
];

export function PartnersPage() {
  const { ref, i } = useLoop(PARTNER_TYPES.length, 1600);
  return (
    <>
      <section className="bg-[#FDFDFD] px-6 pb-20 pt-28 text-center dark:bg-black sm:pt-36">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>Partners</motion.p>
        <motion.h1 {...up(0.1)} className="mx-auto mt-4 max-w-3xl u-h1">
          Grow with Arohon.
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">Every way to partner.</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mx-auto mt-6 max-w-xl text-[17px] leading-relaxed ${muted}`}>Shops reach new customers, captains earn by bringing drivers on board, and vehicle owners find drivers they can trust.</motion.p>
        <motion.div {...up(0.3)} ref={ref} className="mx-auto mt-12 grid max-w-4xl gap-2 text-left sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_TYPES.map((t, k) => (
            <a key={t.k} href={t.href} className={`${panel} group block p-5 transition-colors duration-500 ${k === i ? '!border-black/30 dark:!border-white/30' : ''}`}>
              <p className="text-[15px] font-medium">{t.k}</p>
              <p className={`mt-1 text-[13px] ${muted}`}>{t.c}</p>
              <ArrowRight size={14} className={`mt-4 transition-all duration-500 ${k === i ? 'translate-x-1 text-black dark:text-white' : 'text-black/30 dark:text-white/30'}`} />
            </a>
          ))}
        </motion.div>
      </section>

      <section id="shops" className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Head label="Shops and pharmacies" title="Sell on Arohon." rest="Orders arrive in real time." />
            <motion.ul {...fade(0.1)} className="mt-8 space-y-3 text-[15px]">
              {['Accept or reject each order in one tap', 'Mark it preparing, then ready for pickup', 'An Arohon rider collects and delivers it', 'Works on a phone or a counter screen'].map((x) => (
                <li key={x} className="flex items-start gap-3"><Check size={18} weight="bold" className="mt-0.5 shrink-0 text-brand-green" />{x}</li>
              ))}
            </motion.ul>
            <motion.div {...fade(0.15)}><Link href="/contact" className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">List your shop <ArrowRight size={13} /></Link></motion.div>
          </div>
          <ShopBoard />
        </div>
      </section>

      <section id="captains" className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Head label="Arohon Captains" title="Bring drivers on board." rest="Earn ৳60 for each one." />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>Captains are our field team. You meet drivers in your zone, help them sign up in the Arohon Captain app, and earn ৳60 for every driver our team verifies.</motion.p>
            <motion.ol {...fade(0.15)} className="mt-8 grid max-w-md grid-cols-5 gap-2 text-center">
              {['Profile', 'NID', 'Licence', 'Vehicle', 'Papers'].map((s, k) => (
                <li key={s}>
                  <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full font-mono text-[12px] ${panel}`}>{k + 1}</span>
                  <span className={`mt-2 block text-[11px] ${muted}`}>{s}</span>
                </li>
              ))}
            </motion.ol>
            <motion.div {...fade(0.2)}><Link href="/contact" className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">Become a captain <ArrowRight size={13} /></Link></motion.div>
          </div>
          <CaptainHome />
        </div>
      </section>

      <section id="owners" className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Head label="Vehicle owners" title="Own a car?" rest="Find a driver you can trust." />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>Post a driving job and checked Arohon drivers apply. See their rating and experience, pick the one you like, and get in touch directly.</motion.p>
            <motion.div {...fade(0.15)}><Link href="/contact" className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">Post a driving job <ArrowRight size={13} /></Link></motion.div>
          </div>
          <JobPost />
        </div>
      </section>

      <section className={wrap}>
        <Head label="More ways" title="Already moving?" rest="There’s a place for you." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 md:grid-cols-2 dark:border-white/10 dark:bg-white/10">
          {[
            { k: 'Drive with Arohon', c: 'Just 2% commission. Bring your bike, CNG or car and drive on your own hours.', href: '/drive' },
            { k: 'Arohon for Business', c: 'Monthly office rides, team transport and deliveries for your shop.', href: '/services/business' },
          ].map((x, k) => (
            <motion.div key={x.k} {...fade(k * 0.06)} className="bg-[#FDFDFD] dark:bg-black">
              <Link href={x.href} className="group flex h-full flex-col p-8 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.03]">
                <p className="text-[20px] font-medium tracking-tight">{x.k}</p>
                <p className={`mt-2 max-w-sm flex-1 text-[15px] leading-relaxed ${muted}`}>{x.c}</p>
                <ArrowRight size={16} className="mt-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Close title="Let’s build it together." rest="Talk to our partner team.">
        <Link href="/contact" className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white sm:w-auto dark:bg-white dark:text-black">Get in touch <ArrowRight size={14} /></Link>
      </Close>
    </>
  );
}

/* ═════════════ FOOD (Daily Needs) ═════════════ */
const O_STEPS = ['Order placed', 'Restaurant accepted', 'Preparing your food', 'Ready for pickup', 'On the way'];
function OrderCard() {
  const { ref, i } = useLoop(O_STEPS.length + 2, 1300);
  const at = Math.min(i, O_STEPS.length - 1);
  return (
    <div ref={ref} className={`${card} overflow-hidden`}>
      <div className="p-6">
        <p className="text-[12px] text-black/45 dark:text-white/45">Your order, sample</p>
        {/* fixed-height slot, old status slides out while the new one slides in, no gap or jump */}
        <div className="relative mt-1 h-8 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.p
              key={at}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-x-0 top-0 whitespace-nowrap text-[22px] font-semibold leading-8 tracking-tight"
            >
              {O_STEPS[at]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-4 flex gap-1">
          {O_STEPS.map((s, k) => (
            <span key={s} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${k <= at ? 'bg-[#0ABF8B]' : 'bg-black/10 dark:bg-white/10'}`} />
          ))}
        </div>
      </div>
      <div className="border-t border-black/[.07] p-6 text-[14px] dark:border-white/[.07]">
        {[['Kacchi biryani, full', 1, 420], ['Borhani', 2, 120], ['Firni', 1, 90]].map(([n, q, p]) => (
          <div key={n as string} className="flex justify-between py-1">
            <span><span className="text-black/45 dark:text-white/45">{q}×</span> {n}</span>
            <span className="tabular-nums">৳{p}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-black/[.07] pt-3 font-semibold dark:border-white/[.07]">
          <span>Subtotal</span>
          <span className="tabular-nums">৳630</span>
        </div>
      </div>
    </div>
  );
}
const SHOPS = [
  { name: 'Biryani house', kind: 'Restaurant', icon: ForkKnife },
  { name: 'Corner pharmacy', kind: 'Pharmacy', icon: Pill },
  { name: 'Burger joint', kind: 'Restaurant', icon: ForkKnife },
  { name: 'Family pharmacy', kind: 'Pharmacy', icon: Pill },
];

const ORDER_ITEMS = ['Kacchi biryani, 2', 'Napa, Seclo', 'Beef tehari', 'Chicken burger, 3', 'Orsaline, Napa Extra', 'Morog polao', 'Fuchka plate', 'Saline, Ace'];
const COLS = ['New', 'Preparing', 'Ready'] as const;
/**
 * Shop console with drag and drop. Order i arrives at tick i, so its column is (tick - i):
 * 0 New, 1 Preparing, 2 Ready, 3 cleared. Each card keeps its key and slides between columns with a
 * CSS transform transition while an inner "lift" keyframe (tilt, shadow, cursor) sells the drag.
 * Moves are staggered like a person working the board: clear Ready, drag Preparing to Ready,
 * drag New to Preparing, then the next order pops into New.
 */
const STAGGER = { clear: 0, toReady: 0.15, toPrep: 0.85, arrive: 1.55 };
function ShopBoard() {
  const [tick, setTick] = useState(2);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 3200);
    return () => clearInterval(t);
  }, []);
  const ids = [tick - 3, tick - 2, tick - 1, tick].filter((i) => i >= 0);
  return (
    <div className={`${panel} p-2`}>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2 text-[13px] font-medium"><Storefront size={16} /> Shop console</span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#079A70] dark:text-[#0ABF8B]"><span className="h-1.5 w-1.5 rounded-full bg-current" />Open</span>
      </div>
      <div className="relative p-2">
        {/* column lanes */}
        <div className="grid grid-cols-3 gap-2">
          {COLS.map((c) => (
            <div key={c} className="h-[150px] rounded-xl bg-black/[.03] p-2 dark:bg-white/[.03]">
              <p className={`px-1 text-[12px] ${muted}`}>{c}</p>
            </div>
          ))}
        </div>
        {/* cards ride on top of the lanes; one card per lane, translated by column */}
        <div className="pointer-events-none absolute inset-x-2 top-[38px]">
          {ids.map((i) => {
            const col = tick - i;
            const shown = Math.min(col, 2);
            const delay = col === 3 ? STAGGER.clear : col === 2 ? STAGGER.toReady : col === 1 ? STAGGER.toPrep : STAGGER.arrive;
            return (
              <div
                key={i}
                className="absolute left-0 top-0 px-2"
                style={{
                  width: 'calc((100% - 16px) / 3)',
                  transform: `translateX(calc(${shown} * (100% + 8px)))`,
                  transition: `transform .95s cubic-bezier(.65,0,.35,1) ${delay}s`,
                }}
              >
                {/* inner element remounts per column so the lift / pop / clear keyframes replay */}
                <div
                  key={col}
                  className={`relative rounded-lg bg-white p-3 text-[12px] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:ring-white/10 ${col === 0 ? 'card-pop' : col === 3 ? 'card-clear' : 'drag-lift'}`}
                  style={{ animationDelay: `${delay}s` }}
                >
                  <p className="font-semibold">Order {2041 + i}</p>
                  <p className={`mt-0.5 truncate ${muted}`}>{ORDER_ITEMS[i % ORDER_ITEMS.length]}</p>
                  {shown === 0 && <p className="mt-2 rounded-md bg-black py-1 text-center text-[11px] font-semibold text-white dark:bg-white dark:text-black">Accept</p>}
                  {shown === 1 && <p className="mt-2 rounded-md py-1 text-center text-[11px] font-semibold ring-1 ring-black/15 dark:ring-white/20">Mark ready</p>}
                  {shown === 2 && <p className="mt-2 flex items-center justify-center gap-1 py-1 text-[11px] text-[#079A70] dark:text-[#0ABF8B]"><Check size={11} weight="bold" /> Waiting for rider</p>}
                  {(col === 1 || col === 2) && (
                    <svg viewBox="0 0 24 24" className="drag-cursor absolute -bottom-2 right-3 h-5 w-5 drop-shadow" style={{ animationDelay: `${delay}s` }} aria-hidden>
                      <path d="M5 3l14 7-6 2-2 6z" className="fill-black stroke-white dark:fill-white dark:stroke-black" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function FoodPage() {
  return (
    <>
      <Hero label="Food delivery" title="Food and medicine," rest="to your door." copy="Order from restaurants and pharmacies near you in the Arohon app. Follow your order from the kitchen to your door and pay by cash, bKash or card.">
        <OrderCard />
      </Hero>
      <section className={wrap}>
        <Head label="Daily needs" title="Hungry or unwell," rest="we bring it." copy="Two kinds of places in one tab: restaurants for meals and pharmacies for medicine." />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SHOPS.map((s, i) => (
            <motion.div key={s.name} {...fade(i * 0.06)} className={`${panel} group p-6`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[.05] transition-transform duration-500 group-hover:-translate-y-1 dark:bg-white/[.07]"><s.icon size={22} /></span>
              <p className="mt-8 text-[16px] font-medium">{s.name}</p>
              <p className={`text-[13px] ${muted}`}>{s.kind}, sample</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={wrap}>
        <Head label="How it works" title="Pick, pay," rest="and follow it live." />
        <Grid
          items={[
            { icon: ForkKnife, title: 'Browse nearby', copy: 'Restaurants and pharmacies near you, with their menus and prices.' },
            { icon: Check, title: 'Live order status', copy: 'See when the shop accepts, starts preparing and hands it over.' },
            { icon: Phone, title: 'Pay your way', copy: 'Cash on delivery, bKash, Nagad or card, chosen at checkout.' },
          ]}
        />
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Head label="For restaurants and pharmacies" title="Sell on Arohon." rest="Orders arrive in real time." />
            <div className="mt-10"><ShopBoard /></div>
          </div>
          <motion.div {...fade(0.1)} className={`${panel} p-6 sm:p-8`}>
            <ul className="space-y-4 text-[15px]">
              {['Accept or reject each order in one tap', 'Mark it preparing, then ready for pickup', 'Manage your menu, categories and branches', 'Open or close your shop whenever you like'].map((x) => (
                <li key={x} className="flex items-start gap-3"><Check size={18} weight="bold" className="mt-0.5 shrink-0 text-brand-green" />{x}</li>
              ))}
            </ul>
            <Link href="/contact" className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">List your shop <ArrowRight size={13} /></Link>
          </motion.div>
        </div>
      </section>
      <PayYourWay />
      <Close title="What’s for dinner?" rest="Order in the app." />
    </>
  );
}

