'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Briefcase, Car, Check, Copy, SteeringWheel } from '@phosphor-icons/react';
import DHAKA from '@/lib/dhakaDots.json';
import { ease, fade, up } from '../motion';
import { useT } from '@/lib/i18n';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';
const field = 'w-full rounded-xl bg-black/[.04] px-4 py-3 text-[15px] outline-none ring-black/20 transition placeholder:text-black/35 focus:ring-2 dark:bg-white/[.06] dark:ring-white/30 dark:placeholder:text-white/30';

const EMAIL = 'support@arohon.co';
const WA = 'https://wa.me/14233509005';
const WA_LABEL = '+1 (423) 350-9005';

function CopyEmail() {
  const [done, setDone] = useState(false);
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(EMAIL).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      className="group inline-flex items-center gap-2 text-[14px] font-medium"
    >
      {EMAIL}
      <span className="relative h-4 w-4 text-black/40 dark:text-white/40">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={done ? 'y' : 'n'} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.15 }} className="absolute inset-0">
            {done ? <Check size={16} weight="bold" className="text-[#079A70]" /> : <Copy size={16} />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className={`text-[12px] transition-opacity ${done ? 'opacity-100' : 'opacity-0'} text-[#079A70]`}>{t('Copied', 'কপি হয়েছে')}</span>
    </button>
  );
}

/* ── Who are you? three doors, Linear contact pattern ── */
const DOORS = [
  { icon: Car, k: 'Riders', kBn: 'রাইডার', copy: 'A ride, a parcel or a food order went wrong? Report it from the app on the trip, or message us.', copyBn: 'রাইড, পার্সেল বা খাবারের অর্ডারে সমস্যা? অ্যাপে ওই ট্রিপ থেকেই জানান, অথবা আমাদের মেসেজ দিন।', cta: 'Chat on WhatsApp', ctaBn: 'হোয়াটসঅ্যাপে কথা বলুন', href: WA },
  { icon: SteeringWheel, k: 'Drivers', kBn: 'ড্রাইভার', copy: 'Questions about signing up, documents, payouts or your account. We’ll walk you through it.', copyBn: 'সাইন আপ, কাগজপত্র, পেমেন্ট বা অ্যাকাউন্ট নিয়ে প্রশ্ন? আমরা ধাপে ধাপে সাহায্য করব।', cta: 'Chat on WhatsApp', ctaBn: 'হোয়াটসঅ্যাপে কথা বলুন', href: WA },
  { icon: Briefcase, k: 'Business', kBn: 'বিজনেস', copy: 'Office rides, team transport or deliveries for your shop. Tell us what you need.', copyBn: 'অফিসের রাইড, টিমের যাতায়াত বা দোকানের ডেলিভারি। কী দরকার, বলুন।', cta: 'Send a message', ctaBn: 'মেসেজ পাঠান', href: '#message' },
];

/* ── The form: topic chips shape the message, sent through your mail app ── */
const TOPICS = [
  { k: 'Ride help', kBn: 'রাইড সহায়তা', hint: 'Which trip was it? Tell us the date, pickup and what happened.', hintBn: 'কোন ট্রিপ? তারিখ, পিকআপ আর কী হয়েছিল, জানান।' },
  { k: 'Driver support', kBn: 'ড্রাইভার সাপোর্ট', hint: 'Your registered phone number helps us find your account quickly.', hintBn: 'রেজিস্টার করা ফোন নম্বর দিলে অ্যাকাউন্টটা দ্রুত খুঁজে পাব।' },
  { k: 'Business', kBn: 'বিজনেস', hint: 'Tell us about your team or shop, and what you need moved.', hintBn: 'আপনার টিম বা দোকান সম্পর্কে বলুন, আর কী পাঠাতে বা কাদের আনা নেওয়া করতে হবে।' },
  { k: 'Partnership', kBn: 'পার্টনারশিপ', hint: 'Who are you and what would you like to build with us?', hintBn: 'আপনি কে, আর আমাদের সাথে কী গড়তে চান?' },
  { k: 'Press', kBn: 'প্রেস', hint: 'Your outlet, your deadline and what you’re writing about.', hintBn: 'আপনার মিডিয়া, ডেডলাইন আর কী নিয়ে লিখছেন।' },
  { k: 'Something else', kBn: 'অন্য কিছু', hint: 'Questions, ideas, praise, complaints. We read everything.', hintBn: 'প্রশ্ন, আইডিয়া, প্রশংসা, অভিযোগ। আমরা সব পড়ি।' },
];
function MessageForm() {
  const [topic, setTopic] = useState(0);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const { t } = useT();
  const [f, setF] = useState({ name: '', email: '', mobile: '', message: '', website: '' });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...f, topic: TOPICS[topic].k }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || t('Something went wrong. Please try again.', 'কিছু একটা গড়বড় হয়েছে। আবার চেষ্টা করুন।'));
      setSent(true);
    } catch (x) {
      setErr(x instanceof Error ? x.message : t('Something went wrong. Please try again.', 'কিছু একটা গড়বড় হয়েছে। আবার চেষ্টা করুন।'));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={`${panel} relative min-h-[520px] p-6 sm:p-8`}>
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }} className="flex min-h-[456px] flex-col items-center justify-center text-center">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#079A70] text-white">
              <Check size={26} weight="bold" />
            </motion.span>
            <p className="mt-6 text-[20px] font-medium tracking-tight">{t('Message sent. Thank you.', 'মেসেজ পৌঁছে গেছে। ধন্যবাদ।')}</p>
            <p className={`mt-2 max-w-sm text-[15px] leading-relaxed ${muted}`}>{t(`It’s with our team now. We’ll reply to ${f.email || 'you'} as soon as we can.`, `এটা এখন আমাদের টিমের কাছে। যত দ্রুত সম্ভব ${f.email || 'আপনাকে'} উত্তর দেব।`)}</p>
            <button type="button" onClick={() => { setSent(false); setF({ name: '', email: '', mobile: '', message: '', website: '' }); }} className="mt-8 text-[14px] font-medium">{t('Write another', 'আরেকটা লিখুন')}</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <p className={`text-[13px] ${muted}`}>{t('What is it about?', 'কী বিষয়ে?')}</p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((tp, i) => (
                <button key={tp.k} type="button" onClick={() => setTopic(i)} className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${i === topic ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07] dark:hover:bg-white/[.1]'}`}>
                  {t(tp.k, tp.kBn)}
                </button>
              ))}
            </div>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <input required aria-label={t('Your name', 'আপনার নাম')} placeholder={t('Your name', 'আপনার নাম')} value={f.name} onChange={set('name')} className={field} />
              <input required type="email" aria-label={t('Email', 'ইমেইল')} placeholder={t('Email', 'ইমেইল')} value={f.email} onChange={set('email')} className={field} />
            </div>
            <input type="tel" aria-label={t('Mobile number, optional', 'মোবাইল নম্বর, ঐচ্ছিক')} placeholder={t('Mobile number, optional', 'মোবাইল নম্বর, ঐচ্ছিক')} value={f.mobile} onChange={set('mobile')} className={field} />
            <textarea required rows={6} aria-label={t('Message', 'মেসেজ')} placeholder={t(TOPICS[topic].hint, TOPICS[topic].hintBn)} value={f.message} onChange={set('message')} className={`${field} resize-none`} />
            {/* honeypot, hidden from people */}
            <input tabIndex={-1} autoComplete="off" aria-hidden value={f.website} onChange={set('website')} name="website" className="hidden" />
            {err && <p role="alert" className="text-[14px] text-[#FF3B30]">{err}</p>}
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black">
              {busy ? t('Sending…', 'পাঠানো হচ্ছে…') : <>{t('Send message', 'মেসেজ পাঠান')} <ArrowRight size={15} /></>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Office: dotted Dhaka with Gulshan lit and a pin that keeps pinging ── */
const MAP = DHAKA as unknown as { w: number; h: number; thanas: Record<string, [number, number][]>; centers: Record<string, [number, number]> };
const D = Object.fromEntries(Object.entries(MAP.thanas).map(([k, pts]) => [k, pts.map(([x, y]) => `M${x} ${y}h0`).join('')]));
function OfficeMap() {
  const [x, y] = MAP.centers.Gulshan;
  const { t } = useT();
  return (
    <svg viewBox={`-10 -10 ${MAP.w + 20} ${MAP.h + 20}`} className="w-full" role="img" aria-label={t('Arohon office in Gulshan, Dhaka', 'গুলশান, ঢাকায় আরোহনের অফিস')}>
      {Object.entries(D).map(([k, d]) => (
        <path key={k} d={d} strokeWidth="5" strokeLinecap="round" className={k === 'Gulshan' ? 'stroke-black dark:stroke-white' : 'stroke-black/15 dark:stroke-white/15'} />
      ))}
      <g transform={`translate(${x} ${y})`}>
        <circle r="9" className="office-ping fill-none stroke-[#079A70]" strokeWidth="3" />
        <circle r="9" className="fill-[#079A70] stroke-white dark:stroke-black" strokeWidth="3" />
      </g>
    </svg>
  );
}

const QUICK = [
  { k: 'Safety', kBn: 'নিরাপত্তা', c: 'How we keep rides safe', cBn: 'রাইড কীভাবে নিরাপদ রাখি', href: '/safety' },
  { k: 'Refunds', kBn: 'রিফান্ড', c: 'Cancellations and fare issues', cBn: 'ক্যানসেল আর ভাড়া সংক্রান্ত সমস্যা', href: '/terms-return-refund' },
  { k: 'Promo codes', kBn: 'প্রোমো কোড', c: 'How coupons and codes work', cBn: 'কুপন আর কোড যেভাবে কাজ করে', href: '/terms-promo-code' },
  { k: 'Delete account', kBn: 'অ্যাকাউন্ট ডিলিট', c: 'Remove your Arohon data', cBn: 'আরোহনে আপনার তথ্য মুছে ফেলুন', href: '/delete-account' },
];

export function ContactPage() {
  const { t, n, href } = useT();
  return (
    <>
      <section className="bg-[#FDFDFD] px-6 pb-16 pt-28 text-center dark:bg-black sm:pt-36">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{t('Contact', 'যোগাযোগ')}</motion.p>
        <motion.h1 {...up(0.1)} className="mt-4 u-h1">
          {t('How can we help?', 'কীভাবে সাহায্য করতে পারি?')}
        </motion.h1>
        <motion.p {...up(0.2)} className={`mx-auto mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>{t('Real people in Dhaka read every message. Pick the quickest way to reach us.', 'ঢাকায় আমাদের টিমের মানুষরাই প্রতিটি মেসেজ পড়েন। যেভাবে সবচেয়ে দ্রুত হয়, সেভাবেই যোগাযোগ করুন।')}</motion.p>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-16">
        <div className="grid gap-3 md:grid-cols-3">
          {DOORS.map((d, i) => (
            <motion.a key={d.k} href={d.href} {...(d.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...up(0.25 + i * 0.07)} className={`${panel} group flex flex-col p-7 transition-colors hover:border-black/20 dark:hover:border-white/20`}>
              <d.icon size={22} className="text-black/40 dark:text-white/40" />
              <p className="mt-8 text-[20px] font-medium tracking-tight">{t(d.k, d.kBn)}</p>
              <p className={`mt-2 flex-1 text-[14px] leading-relaxed ${muted}`}>{t(d.copy, d.copyBn)}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium">
                {t(d.cta, d.ctaBn)} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.a>
          ))}
        </div>
        <motion.div {...fade(0.1)} className={`mt-3 flex flex-wrap items-center justify-between gap-4 ${panel} px-7 py-5`}>
          <p className="text-[15px]">
            {t('Press, partnerships', 'প্রেস, পার্টনারশিপ')} <span className={muted}>{t('or anything else', 'বা অন্য যেকোনো কিছু')}</span>
          </p>
          <CopyEmail />
        </motion.div>
      </section>

      <section id="message" className={wrap}>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <motion.div {...fade()} className="lg:sticky lg:top-28">
            <p className={`text-[13px] ${muted}`}>{t('Message', 'মেসেজ')}</p>
            <h2 className={`mt-3 ${h2}`}>
              {t('Write to us.', 'আমাদের লিখুন।')}
              <br />
              <span className={muted}>{t('We read everything.', 'আমরা সব পড়ি।')}</span>
            </h2>
            <p className={`mt-6 max-w-sm text-[16px] leading-relaxed ${muted}`}>{t('Pick a topic so your message reaches the right person. It goes straight to our team.', 'একটা বিষয় বেছে নিন, যাতে মেসেজ ঠিক মানুষের কাছে পৌঁছায়। এটা সরাসরি আমাদের টিমের কাছে যায়।')}</p>
            <div className="mt-10 space-y-3 text-[15px]">
              <a href={WA} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
                <span className={muted}>{t('WhatsApp', 'হোয়াটসঅ্যাপ')}</span>
                <span className="font-medium tabular-nums">{WA_LABEL}</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
                <span className={muted}>{t('Email', 'ইমেইল')}</span>
                <span className="font-medium">{EMAIL}</span>
              </a>
            </div>
          </motion.div>
          <motion.div {...fade(0.1)}>
            <MessageForm />
          </motion.div>
        </div>
      </section>

      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <motion.div {...fade()}>
            <p className={`text-[13px] ${muted}`}>{t('Office', 'অফিস')}</p>
            <h2 className={`mt-3 ${h2}`}>
              {t('Come say hello', 'চলে আসুন,')}
              <br />
              <span className={muted}>{t('in Gulshan.', 'গুলশানে।')}</span>
            </h2>
            <p className="mt-8 text-[16px] font-medium">{t('Arohon Limited', 'আরোহন লিমিটেড')}</p>
            <p className={`mt-1 max-w-sm text-[15px] leading-relaxed ${muted}`}>{t('Navana HR Tower 1, Plot 205, 1 Bir Uttam Mir Shawkat Ali Sarak (Gulshan Link Road), Dhaka 1208', `নাভানা এইচআর টাওয়ার ${n(1)}, প্লট ${n(205)}, ${n(1)} বীর উত্তম মীর শওকত আলী সড়ক (গুলশান লিংক রোড), ঢাকা ${n(1208)}`)}</p>
            <a href="https://maps.google.com/?q=Navana+HR+Tower+Gulshan+Link+Road+Dhaka" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium">
              {t('Open in Google Maps', 'গুগল ম্যাপসে খুলুন')} <ArrowUpRight size={13} />
            </a>
          </motion.div>
          <motion.div {...fade(0.1)} className="mx-auto w-full max-w-[380px]">
            <OfficeMap />
          </motion.div>
        </div>
      </section>

      <section className={wrap}>
        <motion.p {...fade()} className={`text-[13px] ${muted}`}>{t('Quick answers', 'দ্রুত উত্তর')}</motion.p>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
          {QUICK.map((q, i) => (
            <motion.div key={q.k} {...fade(i * 0.05)} className="bg-[#FDFDFD] dark:bg-black">
              <Link href={href(q.href)} className="group flex h-full items-center justify-between gap-4 p-6 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.03]">
                <span>
                  <span className="block text-[15px] font-medium">{t(q.k, q.kBn)}</span>
                  <span className={`text-[13px] ${muted}`}>{t(q.c, q.cBn)}</span>
                </span>
                <ArrowRight size={14} className="shrink-0 text-black/30 transition-transform group-hover:translate-x-0.5 dark:text-white/30" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
