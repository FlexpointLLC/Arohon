'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Check } from '@phosphor-icons/react';
import { Hero, Head, Close, Faq } from '../services/ServicePages';
import { fade } from '../motion';
import { COMPARES, HUB_FAQS, arohonKeeps, type Compare } from '@/lib/compare';
import { COMPARES_BN, HUB_FAQS_BN } from '@/lib/compareBn';
import { useT } from '@/lib/i18n';

/** the entry in the page language */
function useLocal() {
  const { bn } = useT();
  return (c: Compare): Compare => (bn && COMPARES_BN[c.slug] ? { ...c, ...COMPARES_BN[c.slug] } : c);
}

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const card = 'rounded-[24px] bg-white text-black shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:text-white dark:ring-white/10';
const FARES = [100, 250, 500];

function Bar({ label, keep, fare, tone }: { label: string; keep: number; fare: number; tone: 'brand' | 'grey' }) {
  const { n } = useT();
  return (
    <div>
      <div className="flex items-baseline justify-between text-[13px]">
        <span className={muted}>{label}</span>
        <motion.span key={keep} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} className="font-semibold tabular-nums">৳{n(keep.toLocaleString('en-US'))}</motion.span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-black/[.06] dark:bg-white/[.08]">
        <motion.div animate={{ width: `${(keep / fare) * 100}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className={`h-full rounded-full ${tone === 'brand' ? 'bg-[#079A70] dark:bg-[#0ABF8B]' : 'bg-black/25 dark:bg-white/25'}`} />
      </div>
    </div>
  );
}

/** hero card: the same fare, what the driver keeps on each app, cycling through fares */
function KeepCard({ c }: { c?: Compare }) {
  const { t, n } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setI((x) => (x + 1) % FARES.length), 2600);
    return () => clearTimeout(t);
  }, [i, on]);
  const fare = FARES[i];
  const rate = c?.rate ?? 20;
  return (
    <div ref={ref} className={`${card} p-6`}>
      <p className="text-[12px] text-black/45 dark:text-white/45">{t('Same trip, what the driver keeps', 'একই ট্রিপে চালক কত পান')}</p>
      <p className="mt-1 text-[17px] font-semibold">
        {t('Fare', 'ভাড়া')} <motion.span key={fare} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="inline-block tabular-nums">৳{n(fare)}</motion.span>
      </p>
      <div className="mt-6 space-y-5">
        <Bar label={t('Arohon, 2% plus ৳3 and booking fee', 'আরোহন, ২% সাথে ৳৩ ও বুকিং ফি')} keep={arohonKeeps(fare)} fare={fare} tone="brand" />
        {!c?.noCalc && <Bar label={c?.rate ? t(`${c.name}, ${rate}% as reported`, `${c.name}, প্রতিবেদন অনুযায়ী ${n(rate)}%`) : t(`A ${rate}% commission app`, `${n(rate)}% কমিশনের অ্যাপ`)} keep={Math.round(fare * (1 - rate / 100))} fare={fare} tone="grey" />}
      </div>
      <p className="mt-5 text-[12px] leading-relaxed text-black/45 dark:text-white/45">{c?.noCalc ? t('Drivers pay only on trips they complete. No subscription.', 'চালক শুধু শেষ করা ট্রিপে দেন। কোনো সাবস্ক্রিপশন নেই।') : c?.rate ? c.rateNote : t('Most ride apps take 15% to 25%. 20% shown for comparison.', 'বেশিরভাগ রাইড অ্যাপ ১৫% থেকে ২৫% নেয়। তুলনার জন্য ২০% দেখানো হলো।')}</p>
    </div>
  );
}

function Table({ c }: { c: Compare }) {
  const { t } = useT();
  return (
    <section className={wrap}>
      <Head label={t('Side by side', 'পাশাপাশি')} title={t(`Arohon or ${c.name}?`, `আরোহন নাকি ${c.name}?`)} rest={t('The quick answer.', 'এক নজরে উত্তর।')} />
      <motion.div {...fade(0.1)} className="mt-14 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
        <div className="grid grid-cols-[1fr_1fr] border-b border-black/10 bg-black/[.02] text-[13px] font-medium sm:grid-cols-[200px_1fr_1fr] dark:border-white/10 dark:bg-white/[.03]">
          <span className="hidden px-5 py-4 sm:block" />
          <span className="px-5 py-4">{t('Arohon', 'আরোহন')}</span>
          <span className={`px-5 py-4 ${muted}`}>{c.name}</span>
        </div>
        {c.rows.map(([f, a, b]) => (
          <div key={f} className="grid grid-cols-[1fr_1fr] border-b border-black/[.07] last:border-0 sm:grid-cols-[200px_1fr_1fr] dark:border-white/[.07]">
            <span className="col-span-2 px-5 pt-4 text-[13px] font-medium sm:col-span-1 sm:py-4">{f}</span>
            <span className="flex gap-2 px-5 py-3 text-[14px] leading-relaxed sm:py-4"><Check size={15} weight="bold" className="mt-1 shrink-0 text-[#079A70] dark:text-[#0ABF8B]" />{a}</span>
            <span className={`px-5 py-3 text-[14px] leading-relaxed sm:py-4 ${muted}`}>{b}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

/** drag the fare and see the gap grow */
function Calculator({ c }: { c?: Compare }) {
  const [fare, setFare] = useState(300);
  const [trips, setTrips] = useState(10);
  const { t, n } = useT();
  const rate = c?.rate ?? 20;
  const a = arohonKeeps(fare) * trips * 26;
  const b = Math.round(fare * (1 - rate / 100)) * trips * 26;
  return (
    <section className={wrap}>
      <Head label={t('For drivers', 'চালকদের জন্য')} title={t('Keep more of every fare.', 'প্রতিটি ভাড়ার বেশিটাই আপনার।')} rest={t('Try your own numbers.', 'নিজের হিসাব করে দেখুন।')} copy={c?.rate ? c.rateNote : t('Compared with a 20% commission, the middle of the 15% to 25% most ride apps take.', '২০% কমিশনের সাথে তুলনা, যা বেশিরভাগ অ্যাপের ১৫% থেকে ২৫% এর মাঝামাঝি।')} />
      <motion.div {...fade(0.1)} className="mt-14 grid gap-10 md:grid-cols-2">
        <div className="space-y-8">
          {([[t('Average fare', 'গড় ভাড়া'), fare, setFare, 60, 1500, 10, (v: number) => `৳${n(v)}`], [t('Trips a day', 'দিনে ট্রিপ'), trips, setTrips, 1, 30, 1, (v: number) => n(v)]] as const).map(([k, v, set, min, max, step, fmt]) => (
            <label key={k} className="block">
              <span className="flex justify-between text-[14px]"><span className={muted}>{k}</span><span className="font-semibold tabular-nums">{fmt(v)}</span></span>
              <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="mt-3 w-full accent-[#079A70]" />
            </label>
          ))}
          <p className={`text-[13px] ${muted}`}>{t('Monthly figures assume 26 working days.', 'মাসের হিসাব ২৬ কর্মদিবস ধরে।')}</p>
        </div>
        <div className={`${card} p-6`}>
          <p className="text-[12px] text-black/45 dark:text-white/45">{t('You keep in a month', 'মাসে আপনি পান')}</p>
          <div className="mt-5 space-y-5">
            <Bar label={t('On Arohon', 'আরোহনে')} keep={a} fare={Math.max(a, b)} tone="brand" />
            <Bar label={c?.rate ? t(`At ${c.name}'s reported ${rate}%`, `${c.name} এর প্রতিবেদিত ${n(rate)}% হারে`) : t(`At ${rate}% commission`, `${n(rate)}% কমিশনে`)} keep={b} fare={Math.max(a, b)} tone="grey" />
          </div>
          <p className="mt-6 border-t border-black/[.07] pt-4 text-[15px] dark:border-white/[.07]">
            <span className="font-semibold tabular-nums text-[#079A70] dark:text-[#0ABF8B]">৳{n((a - b).toLocaleString('en-US'))}</span> {t('more every month on Arohon', 'আরোহনে প্রতি মাসে বেশি')}
          </p>
        </div>
      </motion.div>
    </section>
  );
}

function Verdict({ c }: { c: Compare }) {
  const { t, href } = useT();
  return (
    <section className={wrap}>
      <Head label={t('The honest verdict', 'সৎ মূল্যায়ন')} title={t('Pick the app', 'আপনার ট্রিপের সাথে')} rest={t('that fits your trip.', 'মেলে এমন অ্যাপ বেছে নিন।')} />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <motion.div {...fade(0.05)} className="rounded-2xl border border-black/10 p-7 dark:border-white/10">
          <p className="text-[15px] font-medium">{t('Choose Arohon', 'আরোহন বেছে নিন')}</p>
          <p className={`mt-2 text-[15px] leading-relaxed ${muted}`}>{c.verdict.arohon}</p>
          <Link href={href('/ride')} className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium">{t('Book a ride', 'রাইড বুক করুন')} <ArrowRight size={14} /></Link>
        </motion.div>
        <motion.div {...fade(0.1)} className="rounded-2xl border border-black/10 p-7 dark:border-white/10">
          <p className="text-[15px] font-medium">{t(`Where ${c.name} does well`, `${c.name} যেখানে ভালো`)}</p>
          <ul className={`mt-2 space-y-1.5 text-[15px] leading-relaxed ${muted}`}>
            {c.theirStrengths.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <p className={`mt-4 text-[15px] leading-relaxed ${muted}`}>{c.verdict.them}</p>
        </motion.div>
      </div>
    </section>
  );
}

/** one comparison card, shared by the hub and every page */
function CompareCard({ c: raw, i }: { c: Compare; i: number }) {
  const { t, href } = useT();
  const c = useLocal()(raw);
  return (
    <motion.div {...fade(i * 0.04)}>
      <Link href={href(`/compare/${c.slug}`)} className="group flex h-full flex-col rounded-2xl border border-black/10 p-6 transition hover:border-black/25 dark:border-white/10 dark:hover:border-white/25">
        <p className="text-[15px] font-medium">{c.name}</p>
        <p className={`mt-1 text-[13px] ${muted}`}>{c.local === false ? t('Not available in Bangladesh', 'বাংলাদেশে নেই') : c.rest}</p>
        <p className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-medium">{c.local === false ? t('See the alternative', 'বিকল্প দেখুন') : t('See the comparison', 'তুলনা দেখুন')} <ArrowRight size={13} className="transition group-hover:translate-x-0.5" /></p>
      </Link>
    </motion.div>
  );
}

function Others({ not, only }: { not?: string; only?: 'local' }) {
  const { t } = useT();
  const list = COMPARES.filter((x) => x.slug !== not && (only ? x.local !== false : true));
  return (
    <section className={wrap}>
      <Head label={t('More comparisons', 'আরও তুলনা')} title={t('See how Arohon compares', 'প্রতিটি অ্যাপের সাথে')} rest={t('with every app.', 'আরোহনের তুলনা দেখুন।')} />
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((x, i) => <CompareCard key={x.slug} c={x} i={i} />)}
      </div>
    </section>
  );
}

function Sources({ c }: { c: Compare }) {
  const { t } = useT();
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-8 md:px-16">
      <p className={`text-[12px] leading-relaxed ${muted}`}>
        {t('Competitor details are as reported by the sources below and may have changed. Check each app for current rates. Arohon details are current as of 2026.', 'অন্য অ্যাপের তথ্য নিচের সূত্রের প্রতিবেদন অনুযায়ী, যা বদলে যেতে পারে। বর্তমান হার জানতে প্রতিটি অ্যাপ দেখুন। আরোহনের তথ্য ২০২৬ সাল পর্যন্ত হালনাগাদ।')}{' '}
        {c.sources.map((s, i) => (
          <span key={s.url}>{i ? ', ' : ''}<a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-2">{s.label}</a></span>
        ))}
      </p>
    </section>
  );
}

export function ComparePage({ c: raw }: { c: Compare }) {
  const { t } = useT();
  const c = useLocal()(raw);
  return (
    <>
      <Hero label={c.label} title={c.title} rest={c.rest} copy={c.intro}><KeepCard c={c} /></Hero>
      <Table c={c} />
      <Verdict c={c} />
      {!c.noCalc && <Calculator c={c} />}
      <Faq title={t(`Arohon vs ${c.name},`, `আরোহন বনাম ${c.name},`)} rest={t('your questions answered.', 'আপনার প্রশ্নের উত্তর।')} items={c.faqs} />
      <Others not={c.slug} />
      <Close title={t('Try the fair one.', 'ন্যায্যটা চেষ্টা করুন।')} rest={t('Your first ride is a tap away.', 'প্রথম রাইড এক ট্যাপ দূরে।')} />
      <Sources c={c} />
    </>
  );
}

const HUB_FEATURES: [string, string][] = [['Driver commission', 'চালকের কমিশন'], ['Upfront fare', 'আগে থেকে ভাড়া'], ['Bike', 'বাইক'], ['CNG', 'সিএনজি'], ['Parcel', 'পার্সেল'], ['Food and medicine', 'খাবার ও ওষুধ']];
const AROHON_GLANCE: [string, string][] = [['2% flat', 'ফ্ল্যাট ২%'], ['Yes', 'আছে'], ['Yes', 'আছে'], ['Yes', 'আছে'], ['Yes', 'আছে'], ['Yes', 'আছে']];

export function CompareHub() {
  const { t, bn, href } = useT();
  const loc = useLocal();
  const local = COMPARES.filter((c) => c.local !== false).map(loc);
  const abroad = COMPARES.filter((c) => c.local === false);
  return (
    <>
      <Hero label={t('Compare ride apps', 'রাইড অ্যাপ তুলনা')} title={t('Best ride sharing apps', 'বাংলাদেশের সেরা')} rest={t('in Bangladesh, compared.', 'রাইড শেয়ারিং অ্যাপের তুলনা।')} copy={t('Arohon, Uber, Pathao, inDrive, Obhai, Garibook, Truck Lagbe and Shohoz side by side: driver commission, fares, vehicles and services. Find the cheapest and fairest ride sharing app for you.', 'আরোহন, Uber, Pathao, inDrive, Obhai, Garibook, Truck Lagbe ও Shohoz পাশাপাশি: চালকের কমিশন, ভাড়া, গাড়ি ও সেবা। আপনার জন্য সবচেয়ে সস্তা ও ন্যায্য রাইড শেয়ারিং অ্যাপ খুঁজে নিন।')}>
        <KeepCard />
      </Hero>
      <section className={wrap}>
        <Head label={t('At a glance', 'এক নজরে')} title={t('Every app,', 'সব অ্যাপ,')} rest={t('one table.', 'এক টেবিলে।')} />
        <motion.div {...fade(0.1)} className="mt-14 overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10">
          <table className="w-full min-w-[980px] text-left text-[14px]">
            <thead className="bg-black/[.02] text-[13px] dark:bg-white/[.03]">
              <tr>
                <th className="px-5 py-4" />
                <th className="px-5 py-4 font-medium">{t('Arohon', 'আরোহন')}</th>
                {local.map((c) => <th key={c.slug} className="px-5 py-4 font-medium"><Link href={href(`/compare/${c.slug}`)} className={`${muted} underline-offset-2 hover:underline`}>{c.name}</Link></th>)}
              </tr>
            </thead>
            <tbody>
              {HUB_FEATURES.map((f, r) => [t(...f), t(...AROHON_GLANCE[r]), ...local.map((c) => c.glance[r])]).map(([f, ...v]) => (
                <tr key={f} className="border-t border-black/[.07] dark:border-white/[.07]">
                  <td className="px-5 py-4 text-[13px] font-medium">{f}</td>
                  {v.map((x, i) => <td key={i} className={`px-5 py-4 ${i ? muted : 'font-medium'}`}>{x}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
        <p className={`mt-4 text-[12px] ${muted}`}>{t('Competitor details as reported in news, with the year where known. Check each app for current rates and services.', 'অন্য অ্যাপের তথ্য সংবাদ প্রতিবেদন অনুযায়ী, যেখানে জানা গেছে সাল দেওয়া আছে। বর্তমান হার ও সেবা জানতে প্রতিটি অ্যাপ দেখুন।')}</p>
      </section>
      <section className={wrap}>
        <Head label={t('Not in Bangladesh', 'বাংলাদেশে নেই')} title={t('Searching for an app', 'বিদেশের কোনো')} rest={t('from abroad?', 'অ্যাপ খুঁজছেন?')} copy={t('These apps do not run in Bangladesh. Arohon is the local option for rides, parcels, food and more.', 'এই অ্যাপগুলো বাংলাদেশে চলে না। রাইড, পার্সেল, খাবার ও আরও অনেক কিছুর জন্য আরোহন দেশি বিকল্প।')} />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {abroad.map((c, i) => <CompareCard key={c.slug} c={c} i={i} />)}
        </div>
      </section>
      <Calculator />
      <Faq title={t('Ride sharing in Bangladesh,', 'বাংলাদেশে রাইড শেয়ারিং,')} rest={t('your questions answered.', 'আপনার প্রশ্নের উত্তর।')} items={bn ? HUB_FAQS_BN : HUB_FAQS} />
      <Others only="local" />
      <Close title={t('Try the fair one.', 'ন্যায্যটা চেষ্টা করুন।')} rest={t('Your first ride is a tap away.', 'প্রথম রাইড এক ট্যাপ দূরে।')} />
    </>
  );
}
