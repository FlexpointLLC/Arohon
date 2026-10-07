'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, FileText, X } from '@phosphor-icons/react';
import { ease, fade, up } from '../motion';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';
const CAREERS = 'career@arohon.co';

/* ── Ship log: things the team has actually built, scrolling in like a changelog ── */
const SHIPPED = [
  { t: 'Ambulance booking with nearby offers', team: 'Rider app' },
  { t: 'Food and medicine delivery', team: 'Daily Needs' },
  { t: 'Shop app for restaurants and pharmacies', team: 'Merchant' },
  { t: 'Captain app for driver signups', team: 'Field' },
  { t: 'Airport rides for 8 airports', team: 'Rider app' },
  { t: 'Flat 2% driver commission', team: 'Driver app' },
  { t: 'Rental with driver bidding', team: 'Rider app' },
  { t: '16 tier rewards ladder', team: 'Loyalty' },
];
function ShipLog() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { margin: '-60px' });
  const [n, setN] = useState(3);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setN((x) => x + 1), 1800);
    return () => clearInterval(t);
  }, [on]);
  // newest on top, four visible; the list wraps forever
  const rows = [0, 1, 2, 3].map((k) => ({ id: n - k, ...SHIPPED[(((n - k) % SHIPPED.length) + SHIPPED.length) % SHIPPED.length] }));
  return (
    <div ref={ref} className="rounded-[24px] bg-white p-6 text-left text-black shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:text-white dark:ring-white/10">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium">Shipped</p>
        <span className="flex items-center gap-1.5 text-[12px] text-black/45 dark:text-white/45">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#079A70]" /> Arohon team
        </span>
      </div>
      <ul className="relative mt-4 h-[248px] overflow-hidden">
        <AnimatePresence initial={false}>
          {rows.map((r, k) => (
            <motion.li
              key={r.id}
              layout
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1 - k * 0.2, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="flex items-center gap-3 border-b border-black/[.06] py-3.5 last:border-0 dark:border-white/[.06]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden><path d="M2 5.2l2 2L8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="flex-1 text-[14px] font-medium">{r.t}</span>
              <span className="shrink-0 rounded-full bg-black/[.05] px-2 py-0.5 text-[11px] text-black/55 dark:bg-white/[.08] dark:text-white/55">{r.team}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

const PRINCIPLES = [
  ['Ship for the street', 'If it doesn’t work on a cheap Android in Jatrabari traffic, it doesn’t work.'],
  ['Fair by default', 'Every decision is checked against one question: is this fair to the driver and the rider?'],
  ['Small team, big scope', 'Everyone owns something real. Titles matter less than what you ship.'],
  ['Ride it yourself', 'We book our own rides, order our own food and call our own support. Often.'],
  ['Say it plainly', 'Clear words, clear prices, clear feedback. No jargon, no politics.'],
  ['Sweat the details', 'The 2px gap, the Bangla font, the fare rounding. Small things are the product.'],
];

const JOBS: { dept: string; roles: { t: string; c: string; type?: string }[] }[] = [
  {
    dept: 'Marketing',
    roles: [
      { t: 'Marketing Manager', c: 'Own the plan for brand, campaigns and growth across every district.' },
      { t: 'Digital Marketing Executive', c: 'Run paid campaigns on Facebook, Google and TikTok, and make every taka count.' },
      { t: 'Social Media and Content Creator', c: 'Reels, posts and stories that people in Dhaka actually stop for.' },
      { t: 'Brand and Activation Executive', c: 'Events, campus drives and on-ground campaigns that put Arohon on the street.' },
      { t: 'Marketing Intern', c: 'Learn the whole funnel, from idea to post to results.', type: 'Internship' },
    ],
  },
  {
    dept: 'Sales',
    roles: [
      { t: 'Corporate Sales Manager', c: 'Win office rides and team transport deals with companies.' },
      { t: 'B2B Sales Executive', c: 'Find businesses that need deliveries and rides, and sign them up.' },
      { t: 'Merchant Acquisition Executive', c: 'Bring restaurants and pharmacies onto Arohon food and medicine delivery.' },
      { t: 'Field Sales Executive', c: 'Meet shops, offices and drivers in your zone, every day.' },
    ],
  },
  {
    dept: 'Open applications',
    roles: [
      { t: 'Engineering', c: 'Mobile apps, maps, payments and the backend that runs every trip.' },
      { t: 'Design', c: 'Product design for riders, drivers, shops and captains.' },
      { t: 'Operations', c: 'Driver onboarding, verification, support and city launches.' },
      { t: 'Field team', c: 'Arohon Captains who bring drivers on board, zone by zone.' },
    ],
  },
];

const field = 'w-full rounded-xl bg-black/[.04] px-4 py-3 text-[15px] outline-none ring-black/20 transition placeholder:text-black/35 focus:ring-2 dark:bg-white/[.06] dark:ring-white/30 dark:placeholder:text-white/30';

/** Application sheet: posts to /api/apply, which emails the team with the CV attached. */
function ApplySheet({ position, onClose }: { position: string; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (file && file.size > 5 * 1024 * 1024) return setErr('Your CV must be 5MB or smaller.');
    setBusy(true);
    setErr('');
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('position', position);
      const res = await fetch('/api/apply', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setSent(true);
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${position}`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-[24px] bg-white p-6 text-black shadow-2xl sm:rounded-[24px] sm:p-8 dark:bg-[#1C1C1E] dark:text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-[13px] ${muted}`}>Apply for</p>
            <p className="mt-1 text-[22px] font-medium tracking-tight">{position}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-black/[.05] dark:hover:bg-white/10"><X size={18} /></button>
        </div>
        {sent ? (
          <div className="py-12 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#079A70] text-white"><Check size={26} weight="bold" /></motion.span>
            <p className="mt-6 text-[20px] font-medium tracking-tight">Application sent.</p>
            <p className={`mx-auto mt-2 max-w-xs text-[15px] leading-relaxed ${muted}`}>Thank you. Our team reads every application and will get back to you by email.</p>
            <button type="button" onClick={onClose} className="mt-8 text-[14px] font-medium">Done</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input required name="name" aria-label="Full name" placeholder="Full name" className={field} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input required type="email" name="email" aria-label="Email" placeholder="Email" className={field} />
              <input type="tel" name="phone" aria-label="Phone" placeholder="Phone" className={field} />
            </div>
            <input type="url" name="link" aria-label="LinkedIn or portfolio" placeholder="LinkedIn or portfolio link" className={field} />
            <label className={`${field} flex cursor-pointer items-center gap-3`}>
              <FileText size={18} className="shrink-0 text-black/40 dark:text-white/40" />
              <span className={`flex-1 truncate ${file ? '' : 'text-black/35 dark:text-white/30'}`}>{file ? file.name : 'Upload your CV, PDF or Word, max 5MB'}</span>
              <input required type="file" name="cv" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <textarea name="note" rows={4} aria-label="Note" placeholder="Anything you’d like us to know? Something you’re proud of?" className={`${field} resize-none`} />
            <input tabIndex={-1} autoComplete="off" aria-hidden name="website" className="hidden" />
            {err && <p role="alert" className="text-[14px] text-[#FF3B30]">{err}</p>}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black">
              {busy ? 'Sending…' : <>Send application <ArrowRight size={15} /></>}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export function CareersPage() {
  const [position, setPosition] = useState<string | null>(null);
  return (
    <>
      <section className="relative overflow-hidden bg-[#FDFDFD] pb-24 pt-28 dark:bg-black sm:pt-32">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div>
            <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>Careers</motion.p>
            <motion.h1 {...up(0.1)} className="mt-4 u-h1">
              Build how
              <br />
              <span className="text-black/45 dark:text-[#8A8F98]">Bangladesh moves.</span>
            </motion.h1>
            <motion.p {...up(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>We are a small team in Dhaka shipping rides, deliveries and help for a whole country. If you care about the details and the people they serve, come build with us.</motion.p>
            <motion.div {...up(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#teams" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white dark:bg-white dark:text-black">Open positions <ArrowRight size={14} /></a>
              <a href={`mailto:${CAREERS}`} className="inline-flex items-center justify-center rounded-full bg-black/[.05] px-6 py-3.5 text-[15px] font-semibold dark:bg-white/10">{CAREERS}</a>
            </motion.div>
          </div>
          <motion.div {...up(0.4)}>
            <ShipLog />
          </motion.div>
        </div>
      </section>

      <section className={wrap}>
        <div className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <motion.div {...fade()}>
            <p className={`text-[13px] ${muted}`}>How we work</p>
            <h2 className={`mt-3 ${h2}`}>
              Principles,
              <br />
              <span className={muted}>not playbooks.</span>
            </h2>
          </motion.div>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {PRINCIPLES.map(([t, c], i) => (
              <motion.div key={t} {...fade(i * 0.05)}>
                <p className={`font-mono text-[11px] ${muted}`}>0{i + 1}.</p>
                <p className="mt-2 text-[17px] font-medium tracking-tight">{t}</p>
                <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{c}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="teams" className={wrap}>
        <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
          <div>
            <p className={`text-[13px] ${muted}`}>Open positions</p>
            <h2 className={`mt-3 ${h2}`}>
              Find your place.
              <br />
              <span className={muted}>Apply in two minutes.</span>
            </h2>
          </div>
          <p className={`self-end text-[16px] leading-relaxed ${muted}`}>Every role is full time in Dhaka unless it says otherwise. Don’t see your role? Send an open application to the team you want to join.</p>
        </motion.div>
        <div className="mt-14 space-y-14">
          {JOBS.map((g) => (
            <div key={g.dept}>
              <motion.p {...fade()} className="flex items-baseline gap-3 text-[15px] font-medium">
                {g.dept} <span className={`text-[13px] font-normal ${muted}`}>{g.roles.length}</span>
              </motion.p>
              <ul className="mt-4 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
                {g.roles.map((r, i) => {
                  const title = g.dept === 'Open applications' ? `Open application, ${r.t}` : r.t;
                  return (
                    <motion.li key={r.t} {...fade(i * 0.03)}>
                      <button type="button" onClick={() => setPosition(title)} className="group flex w-full items-center gap-6 py-5 text-left">
                        <span className="flex-1 sm:flex sm:items-baseline sm:gap-8">
                          <span className="block text-[18px] font-medium tracking-tight sm:w-80">{r.t}</span>
                          <span className={`mt-1 block text-[14px] sm:mt-0 ${muted}`}>{r.c}</span>
                        </span>
                        <span className={`hidden shrink-0 text-[13px] lg:block ${muted}`}>{g.dept === 'Open applications' ? 'Any level' : `${r.type ?? 'Full time'}, Dhaka`}</span>
                        <span className="hidden shrink-0 text-[14px] font-medium opacity-0 transition-opacity group-hover:opacity-100 sm:block">Apply</span>
                        <ArrowUpRight size={16} className="shrink-0 text-black/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black dark:text-white/30 dark:group-hover:text-white" />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <AnimatePresence>{position && <ApplySheet key={position} position={position} onClose={() => setPosition(null)} />}</AnimatePresence>
      </section>

      <section className={wrap}>
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>Hiring</p>
          <h2 className={`mt-3 ${h2}`}>
            Three steps.
            <br />
            <span className={muted}>No riddles.</span>
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {[
            ['Apply', 'Send your CV and a link to something you’ve done, a portfolio, a campaign, a GitHub.'],
            ['Talk with the team', 'A conversation with the people you would work with, about real problems we have.'],
            ['Build something small', 'A short paid task close to the real work, then a decision.'],
          ].map(([t, c], i) => (
            <motion.div key={t} {...fade(i * 0.08)} className={`${panel} p-7`}>
              <p className={`font-mono text-[11px] ${muted}`}>0{i + 1}</p>
              <p className="mt-8 text-[20px] font-medium tracking-tight">{t}</p>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{c}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
        <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
          Your next ride
          <br />
          <span className={muted}>could be one you built.</span>
        </motion.h2>
        <motion.div {...fade(0.15)} className="mt-10 flex justify-center">
          <a href="#teams" className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white sm:w-auto dark:bg-white dark:text-black">See open positions <ArrowRight size={14} /></a>
        </motion.div>
      </section>
    </>
  );
}
