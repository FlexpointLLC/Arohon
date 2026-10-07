'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, FileText, X } from '@phosphor-icons/react';
import { ease, fade, up } from '../motion';
import { useT } from '@/lib/i18n';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';
const CAREERS = 'career@arohon.co';

/* ── Ship log: things the team has actually built, scrolling in like a changelog ── */
const SHIPPED = [
  { t: 'Ambulance booking with nearby offers', tBn: 'কাছের অফারসহ অ্যাম্বুলেন্স বুকিং', team: 'Rider app', teamBn: 'রাইডার অ্যাপ' },
  { t: 'Food and medicine delivery', tBn: 'খাবার আর ওষুধ ডেলিভারি', team: 'Daily Needs', teamBn: 'ডেইলি নিডস' },
  { t: 'Shop app for restaurants and pharmacies', tBn: 'রেস্টুরেন্ট আর ফার্মেসির জন্য শপ অ্যাপ', team: 'Merchant', teamBn: 'মার্চেন্ট' },
  { t: 'Captain app for driver signups', tBn: 'ড্রাইভার সাইনআপের জন্য ক্যাপ্টেন অ্যাপ', team: 'Field', teamBn: 'ফিল্ড' },
  { t: 'Airport rides for 8 airports', tBn: '৮টি এয়ারপোর্টে এয়ারপোর্ট রাইড', team: 'Rider app', teamBn: 'রাইডার অ্যাপ' },
  { t: 'Flat 2% driver commission', tBn: 'ড্রাইভারদের জন্য ফ্ল্যাট ২% কমিশন', team: 'Driver app', teamBn: 'ড্রাইভার অ্যাপ' },
  { t: 'Rental with driver bidding', tBn: 'ড্রাইভারদের বিডসহ রেন্টাল', team: 'Rider app', teamBn: 'রাইডার অ্যাপ' },
  { t: '16 tier rewards ladder', tBn: '১৬ ধাপের রিওয়ার্ড সিঁড়ি', team: 'Loyalty', teamBn: 'লয়্যালটি' },
];
function ShipLog() {
  const L = useT();
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
        <p className="text-[13px] font-medium">{L.t('Shipped', 'শিপ হয়েছে')}</p>
        <span className="flex items-center gap-1.5 text-[12px] text-black/45 dark:text-white/45">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#079A70]" /> {L.t('Arohon team', 'আরোহন টিম')}
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
              <span className="flex-1 text-[14px] font-medium">{L.t(r.t, r.tBn)}</span>
              <span className="shrink-0 rounded-full bg-black/[.05] px-2 py-0.5 text-[11px] text-black/55 dark:bg-white/[.08] dark:text-white/55">{L.t(r.team, r.teamBn)}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

const PRINCIPLES = [
  ['Ship for the street', 'If it doesn’t work on a cheap Android in Jatrabari traffic, it doesn’t work.', 'রাস্তার জন্য বানাও', 'যাত্রাবাড়ীর জ্যামে একটা সস্তা অ্যান্ড্রয়েডে না চললে, ওটা চলে না।'],
  ['Fair by default', 'Every decision is checked against one question: is this fair to the driver and the rider?', 'ন্যায্যতা আগে', 'প্রতিটা সিদ্ধান্তে একটাই প্রশ্ন: ড্রাইভার আর রাইডার দুজনের জন্যই কি এটা ন্যায্য?'],
  ['Small team, big scope', 'Everyone owns something real. Titles matter less than what you ship.', 'ছোট টিম, বড় কাজ', 'সবার হাতে সত্যিকারের দায়িত্ব। পদবির চেয়ে আপনি কী বানালেন সেটাই আসল।'],
  ['Ride it yourself', 'We book our own rides, order our own food and call our own support. Often.', 'নিজেই চড়ে দেখো', 'আমরা নিজেরাই রাইড নিই, খাবার অর্ডার করি, সাপোর্টে কল দিই। প্রায়ই।'],
  ['Say it plainly', 'Clear words, clear prices, clear feedback. No jargon, no politics.', 'সোজা কথা বলো', 'পরিষ্কার কথা, পরিষ্কার দাম, পরিষ্কার ফিডব্যাক। কোনো জারগন নেই, কোনো পলিটিক্স নেই।'],
  ['Sweat the details', 'The 2px gap, the Bangla font, the fare rounding. Small things are the product.', 'খুঁটিনাটিতে যত্ন', '২px ফাঁক, বাংলা ফন্ট, ভাড়ার রাউন্ডিং। ছোট ছোট জিনিসই আসল প্রোডাক্ট।'],
];

const JOBS: { dept: string; deptBn: string; roles: { t: string; c: string; tBn: string; cBn: string; type?: string; typeBn?: string }[] }[] = [
  {
    dept: 'Marketing',
    deptBn: 'মার্কেটিং',
    roles: [
      { t: 'Marketing Manager', c: 'Own the plan for brand, campaigns and growth across every district.', tBn: 'মার্কেটিং ম্যানেজার', cBn: 'প্রতিটা জেলায় ব্র্যান্ড, ক্যাম্পেইন আর গ্রোথের পুরো প্ল্যান আপনার হাতে।' },
      { t: 'Digital Marketing Executive', c: 'Run paid campaigns on Facebook, Google and TikTok, and make every taka count.', tBn: 'ডিজিটাল মার্কেটিং এক্সিকিউটিভ', cBn: 'ফেসবুক, গুগল আর টিকটকে পেইড ক্যাম্পেইন চালাবেন, প্রতিটা টাকার হিসাব মিলিয়ে।' },
      { t: 'Social Media and Content Creator', c: 'Reels, posts and stories that people in Dhaka actually stop for.', tBn: 'সোশ্যাল মিডিয়া ও কনটেন্ট ক্রিয়েটর', cBn: 'এমন রিলস, পোস্ট আর স্টোরি, যা দেখে ঢাকার মানুষ সত্যিই থামে।' },
      { t: 'Brand and Activation Executive', c: 'Events, campus drives and on-ground campaigns that put Arohon on the street.', tBn: 'ব্র্যান্ড ও অ্যাক্টিভেশন এক্সিকিউটিভ', cBn: 'ইভেন্ট, ক্যাম্পাস ড্রাইভ আর মাঠের ক্যাম্পেইন, যা আরোহনকে রাস্তায় নিয়ে আসে।' },
      { t: 'Marketing Intern', c: 'Learn the whole funnel, from idea to post to results.', type: 'Internship', tBn: 'মার্কেটিং ইন্টার্ন', cBn: 'আইডিয়া থেকে পোস্ট, পোস্ট থেকে রেজাল্ট, পুরো ফানেলটা শিখবেন।', typeBn: 'ইন্টার্নশিপ' },
    ],
  },
  {
    dept: 'Sales',
    deptBn: 'সেলস',
    roles: [
      { t: 'Corporate Sales Manager', c: 'Win office rides and team transport deals with companies.', tBn: 'কর্পোরেট সেলস ম্যানেজার', cBn: 'কোম্পানিগুলোর সাথে অফিস রাইড আর টিম ট্রান্সপোর্টের ডিল জিতবেন।' },
      { t: 'B2B Sales Executive', c: 'Find businesses that need deliveries and rides, and sign them up.', tBn: 'B2B সেলস এক্সিকিউটিভ', cBn: 'যেসব ব্যবসার ডেলিভারি আর রাইড দরকার, তাদের খুঁজে বের করে যুক্ত করবেন।' },
      { t: 'Merchant Acquisition Executive', c: 'Bring restaurants and pharmacies onto Arohon food and medicine delivery.', tBn: 'মার্চেন্ট অ্যাকুইজিশন এক্সিকিউটিভ', cBn: 'রেস্টুরেন্ট আর ফার্মেসিকে আরোহনের খাবার ও ওষুধ ডেলিভারিতে আনবেন।' },
      { t: 'Field Sales Executive', c: 'Meet shops, offices and drivers in your zone, every day.', tBn: 'ফিল্ড সেলস এক্সিকিউটিভ', cBn: 'নিজের জোনে দোকান, অফিস আর ড্রাইভারদের সাথে প্রতিদিন দেখা করবেন।' },
    ],
  },
  {
    dept: 'Open applications',
    deptBn: 'ওপেন অ্যাপ্লিকেশন',
    roles: [
      { t: 'Engineering', c: 'Mobile apps, maps, payments and the backend that runs every trip.', tBn: 'ইঞ্জিনিয়ারিং', cBn: 'মোবাইল অ্যাপ, ম্যাপ, পেমেন্ট আর সেই ব্যাকএন্ড, যা প্রতিটা ট্রিপ চালায়।' },
      { t: 'Design', c: 'Product design for riders, drivers, shops and captains.', tBn: 'ডিজাইন', cBn: 'রাইডার, ড্রাইভার, শপ আর ক্যাপ্টেনদের জন্য প্রোডাক্ট ডিজাইন।' },
      { t: 'Operations', c: 'Driver onboarding, verification, support and city launches.', tBn: 'অপারেশনস', cBn: 'ড্রাইভার অনবোর্ডিং, ভেরিফিকেশন, সাপোর্ট আর নতুন শহরে লঞ্চ।' },
      { t: 'Field team', c: 'Arohon Captains who bring drivers on board, zone by zone.', tBn: 'ফিল্ড টিম', cBn: 'আরোহন ক্যাপ্টেন হয়ে জোনে জোনে ড্রাইভারদের যুক্ত করবেন।' },
    ],
  },
];

const field = 'w-full rounded-xl bg-black/[.04] px-4 py-3 text-[15px] outline-none ring-black/20 transition placeholder:text-black/35 focus:ring-2 dark:bg-white/[.06] dark:ring-white/30 dark:placeholder:text-white/30';

/** Application sheet: posts to /api/apply, which emails the team with the CV attached. */
function ApplySheet({ position, label, onClose }: { position: string; label: string; onClose: () => void }) {
  const { t } = useT();
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
    if (file && file.size > 5 * 1024 * 1024) return setErr(t('Your CV must be 5MB or smaller.', 'সিভি ৫MB বা তার কম হতে হবে।'));
    setBusy(true);
    setErr('');
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('position', position);
      const res = await fetch('/api/apply', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(t(data.error || 'Something went wrong. Please try again.', 'কিছু একটা গড়বড় হয়েছে। আবার চেষ্টা করুন।'));
      setSent(true);
    } catch (x) {
      setErr(x instanceof Error ? x.message : t('Something went wrong. Please try again.', 'কিছু একটা গড়বড় হয়েছে। আবার চেষ্টা করুন।'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t(`Apply for ${position}`, `${label} পদে আবেদন`)}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-[520px] overflow-y-auto rounded-t-[24px] bg-white p-6 text-black shadow-2xl sm:rounded-[24px] sm:p-8 dark:bg-[#1C1C1E] dark:text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={`text-[13px] ${muted}`}>{t('Apply for', 'যে পদে আবেদন')}</p>
            <p className="mt-1 text-[22px] font-medium tracking-tight">{label}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t('Close', 'বন্ধ করুন')} className="rounded-full p-2 hover:bg-black/[.05] dark:hover:bg-white/10"><X size={18} /></button>
        </div>
        {sent ? (
          <div className="py-12 text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#079A70] text-white"><Check size={26} weight="bold" /></motion.span>
            <p className="mt-6 text-[20px] font-medium tracking-tight">{t('Application sent.', 'আবেদন পাঠানো হয়েছে।')}</p>
            <p className={`mx-auto mt-2 max-w-xs text-[15px] leading-relaxed ${muted}`}>{t('Thank you. Our team reads every application and will get back to you by email.', 'ধন্যবাদ। আমাদের টিম প্রতিটা আবেদন পড়ে, ইমেইলে আপনাকে জানাবে।')}</p>
            <button type="button" onClick={onClose} className="mt-8 text-[14px] font-medium">{t('Done', 'ঠিক আছে')}</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input required name="name" aria-label={t('Full name', 'পুরো নাম')} placeholder={t('Full name', 'পুরো নাম')} className={field} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input required type="email" name="email" aria-label={t('Email', 'ইমেইল')} placeholder={t('Email', 'ইমেইল')} className={field} />
              <input type="tel" name="phone" aria-label={t('Phone', 'ফোন')} placeholder={t('Phone', 'ফোন')} className={field} />
            </div>
            <input type="url" name="link" aria-label={t('LinkedIn or portfolio', 'লিংকডইন বা পোর্টফোলিও')} placeholder={t('LinkedIn or portfolio link', 'লিংকডইন বা পোর্টফোলিওর লিংক')} className={field} />
            <label className={`${field} flex cursor-pointer items-center gap-3`}>
              <FileText size={18} className="shrink-0 text-black/40 dark:text-white/40" />
              <span className={`flex-1 truncate ${file ? '' : 'text-black/35 dark:text-white/30'}`}>{file ? file.name : t('Upload your CV, PDF or Word, max 5MB', 'সিভি আপলোড করুন, PDF বা Word, সর্বোচ্চ ৫MB')}</span>
              <input required type="file" name="cv" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <textarea name="note" rows={4} aria-label={t('Note', 'নোট')} placeholder={t('Anything you’d like us to know? Something you’re proud of?', 'আর কিছু জানাতে চান? এমন কোনো কাজ, যা নিয়ে আপনি গর্বিত?')} className={`${field} resize-none`} />
            <input tabIndex={-1} autoComplete="off" aria-hidden name="website" className="hidden" />
            {err && <p role="alert" className="text-[14px] text-[#FF3B30]">{err}</p>}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black">
              {busy ? t('Sending…', 'পাঠানো হচ্ছে…') : <>{t('Send application', 'আবেদন পাঠান')} <ArrowRight size={15} /></>}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

export function CareersPage() {
  const { t, n } = useT();
  const [position, setPosition] = useState<string | null>(null);
  const [label, setLabel] = useState('');
  return (
    <>
      <section className="relative overflow-hidden bg-[#FDFDFD] pb-24 pt-28 dark:bg-black sm:pt-32">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-6 md:px-16 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div>
            <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{t('Careers', 'ক্যারিয়ার')}</motion.p>
            <motion.h1 {...up(0.1)} className="mt-4 u-h1">
              {t('Build how', 'বাংলাদেশের চলাচল')}
              <br />
              <span className="text-black/45 dark:text-[#8A8F98]">{t('Bangladesh moves.', 'গড়ুন আমাদের সাথে।')}</span>
            </motion.h1>
            <motion.p {...up(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>{t('We are a small team in Dhaka shipping rides, deliveries and help for a whole country. If you care about the details and the people they serve, come build with us.', 'আমরা ঢাকার একটা ছোট টিম, পুরো দেশের জন্য রাইড, ডেলিভারি আর সহায়তা বানাচ্ছি। খুঁটিনাটি আর সেগুলো যাদের জন্য, তাদের নিয়ে যদি ভাবেন, চলে আসুন, একসাথে বানাই।')}</motion.p>
            <motion.div {...up(0.3)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#teams" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white dark:bg-white dark:text-black">{t('Open positions', 'খালি পদগুলো')} <ArrowRight size={14} /></a>
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
            <p className={`text-[13px] ${muted}`}>{t('How we work', 'আমরা যেভাবে কাজ করি')}</p>
            <h2 className={`mt-3 ${h2}`}>
              {t('Principles,', 'নীতি,')}
              <br />
              <span className={muted}>{t('not playbooks.', 'নিয়মের বই নয়।')}</span>
            </h2>
          </motion.div>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {PRINCIPLES.map(([pt, c, ptBn, cBn], i) => (
              <motion.div key={pt} {...fade(i * 0.05)}>
                <p className={`font-mono text-[11px] ${muted}`}>{n(`0${i + 1}`)}.</p>
                <p className="mt-2 text-[17px] font-medium tracking-tight">{t(pt, ptBn)}</p>
                <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{t(c, cBn)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="teams" className={wrap}>
        <motion.div {...fade()} className="grid gap-6 md:grid-cols-2">
          <div>
            <p className={`text-[13px] ${muted}`}>{t('Open positions', 'খালি পদ')}</p>
            <h2 className={`mt-3 ${h2}`}>
              {t('Find your place.', 'আপনার জায়গা খুঁজে নিন।')}
              <br />
              <span className={muted}>{t('Apply in two minutes.', 'আবেদন মাত্র দুই মিনিটে।')}</span>
            </h2>
          </div>
          <p className={`self-end text-[16px] leading-relaxed ${muted}`}>{t('Every role is full time in Dhaka unless it says otherwise. Don’t see your role? Send an open application to the team you want to join.', 'আলাদা করে লেখা না থাকলে সব পদই ঢাকায়, ফুল টাইম। আপনার পদটা নেই? যে টিমে যোগ দিতে চান, সেখানে ওপেন অ্যাপ্লিকেশন পাঠান।')}</p>
        </motion.div>
        <div className="mt-14 space-y-14">
          {JOBS.map((g) => (
            <div key={g.dept}>
              <motion.p {...fade()} className="flex items-baseline gap-3 text-[15px] font-medium">
                {t(g.dept, g.deptBn)} <span className={`text-[13px] font-normal ${muted}`}>{n(g.roles.length)}</span>
              </motion.p>
              <ul className="mt-4 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
                {g.roles.map((r, i) => {
                  const title = g.dept === 'Open applications' ? `Open application, ${r.t}` : r.t;
                  const shown = t(title, g.dept === 'Open applications' ? `ওপেন অ্যাপ্লিকেশন, ${r.tBn}` : r.tBn);
                  return (
                    <motion.li key={r.t} {...fade(i * 0.03)}>
                      <button type="button" onClick={() => { setLabel(shown); setPosition(title); }} className="group flex w-full items-center gap-6 py-5 text-left">
                        <span className="flex-1 sm:flex sm:items-baseline sm:gap-8">
                          <span className="block text-[18px] font-medium tracking-tight sm:w-80">{t(r.t, r.tBn)}</span>
                          <span className={`mt-1 block text-[14px] sm:mt-0 ${muted}`}>{t(r.c, r.cBn)}</span>
                        </span>
                        <span className={`hidden shrink-0 text-[13px] lg:block ${muted}`}>{g.dept === 'Open applications' ? t('Any level', 'যেকোনো লেভেল') : t(`${r.type ?? 'Full time'}, Dhaka`, `${r.typeBn ?? 'ফুল টাইম'}, ঢাকা`)}</span>
                        <span className="hidden shrink-0 text-[14px] font-medium opacity-0 transition-opacity group-hover:opacity-100 sm:block">{t('Apply', 'আবেদন')}</span>
                        <ArrowUpRight size={16} className="shrink-0 text-black/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black dark:text-white/30 dark:group-hover:text-white" />
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <AnimatePresence>{position && <ApplySheet key={position} position={position} label={label} onClose={() => setPosition(null)} />}</AnimatePresence>
      </section>

      <section className={wrap}>
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Hiring', 'নিয়োগ')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Three steps.', 'তিনটা ধাপ।')}
            <br />
            <span className={muted}>{t('No riddles.', 'কোনো ধাঁধা নেই।')}</span>
          </h2>
        </motion.div>
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {[
            ['Apply', 'Send your CV and a link to something you’ve done, a portfolio, a campaign, a GitHub.', 'আবেদন', 'সিভি আর আপনার করা কোনো কাজের লিংক পাঠান, পোর্টফোলিও, ক্যাম্পেইন বা GitHub।'],
            ['Talk with the team', 'A conversation with the people you would work with, about real problems we have.', 'টিমের সাথে কথা', 'যাদের সাথে কাজ করবেন তাদের সাথে আড্ডা, আমাদের সত্যিকারের সমস্যা নিয়ে।'],
            ['Build something small', 'A short paid task close to the real work, then a decision.', 'ছোট কিছু বানান', 'আসল কাজের মতো একটা ছোট পেইড টাস্ক, তারপর সিদ্ধান্ত।'],
          ].map(([st, c, stBn, cBn], i) => (
            <motion.div key={st} {...fade(i * 0.08)} className={`${panel} p-7`}>
              <p className={`font-mono text-[11px] ${muted}`}>{n(`0${i + 1}`)}</p>
              <p className="mt-8 text-[20px] font-medium tracking-tight">{t(st, stBn)}</p>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{t(c, cBn)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
        <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
          {t('Your next ride', 'আপনার পরের রাইডটা')}
          <br />
          <span className={muted}>{t('could be one you built.', 'হতে পারে আপনারই বানানো।')}</span>
        </motion.h2>
        <motion.div {...fade(0.15)} className="mt-10 flex justify-center">
          <a href="#teams" className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white sm:w-auto dark:bg-white dark:text-black">{t('See open positions', 'খালি পদগুলো দেখুন')} <ArrowRight size={14} /></a>
        </motion.div>
      </section>
    </>
  );
}
