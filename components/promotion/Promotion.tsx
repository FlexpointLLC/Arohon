'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { ArrowRight, Check, Coins, Plus } from '@phosphor-icons/react';
import { CAMPAIGNS, PROMO_CODES, codeLive, daysLeft, isLive, type Campaign, type L, type PromoCode } from '@/lib/campaigns';
import { useT } from '@/lib/i18n';
import { StoreBadges } from '../StoreButtons';
import { fade, up } from '../motion';

const wrap = 'mx-auto max-w-[1280px] border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10';
const h2 = 'text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const panel = 'rounded-2xl border border-black/10 bg-gradient-to-b from-black/[.02] to-transparent dark:border-white/10 dark:from-white/[.03]';

function useCopy() {
  const { t, n, href, bn } = useT();
  const l = (x: L) => t(x[0], x[1]);
  const date = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return bn ? n(d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const period = (c: Campaign) => `${date(c.start)}, ${c.end ? date(c.end) : t('ongoing', 'চলমান')}`;
  return { t, n, href, l, period, date };
}

function Status({ c }: { c: Campaign }) {
  const { t } = useT();
  // plain Linear-style label, no dot and no coloured badge
  return <span className="text-[13px] text-black/50 dark:text-[#8A8F98]">{isLive(c) ? t('Live now', 'চলছে এখন') : t('Ended', 'শেষ হয়েছে')}</span>;
}

/* ═════════════ /promotion: a bento of live campaigns and promo codes ═════════════ */
function CodeCopy({ code }: { code: string }) {
  const { t } = useT();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(code).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="group/c inline-flex items-center gap-2 rounded-full border border-dashed border-black/25 px-3.5 py-1.5 font-mono text-[14px] font-semibold tracking-wider transition-colors hover:border-black/50 dark:border-white/25 dark:hover:border-white/50"
      aria-label={t(`Copy code ${code}`, `${code} কোড কপি করুন`)}
    >
      {code}
      <span className="font-sans text-[12px] font-medium tracking-normal text-black/45 transition-colors group-hover/c:text-black dark:text-white/45 dark:group-hover/c:text-white">
        {done ? t('Copied', 'কপি হয়েছে') : t('Copy', 'কপি')}
      </span>
    </button>
  );
}

function CodeTile({ p, big, past }: { p: PromoCode; big?: boolean; past?: boolean }) {
  const { t, n, l, date } = useCopy();
  const left = daysLeft(p);
  return (
    <div className={`${panel} flex h-full flex-col justify-between p-7 ${past ? 'opacity-60' : ''}`}>
      <div>
        <p className={`text-[13px] ${muted}`}>{l(p.scope)}</p>
        <p className={`mt-3 font-medium leading-none tracking-[-0.04em] tabular-nums ${big ? 'text-[88px] sm:text-[112px]' : 'text-[64px]'}`}>
          {n(p.pct)}%<span className={`ml-2 text-[18px] font-normal tracking-normal ${muted}`}>{t('off', 'ছাড়')}</span>
        </p>
        <p className={`mt-4 text-[15px] ${muted}`}>{l(p.vehicles)}</p>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {past ? <span className="font-mono text-[14px] font-semibold tracking-wider line-through decoration-black/30 dark:decoration-white/30">{p.code}</span> : <CodeCopy code={p.code} />}
        <span className={`text-[13px] ${muted}`}>
          {past ? t(`Ended ${date(p.until)}`, `${date(p.until)} শেষ হয়েছে`) : left <= 7 ? t(`${left} days left`, `আর ${n(left)} দিন`) : t(`Until ${date(p.until)}`, `${date(p.until)} পর্যন্ত`)}
        </span>
      </div>
    </div>
  );
}

export function PromotionList() {
  const { t, href, l, period } = useCopy();
  const campaigns = CAMPAIGNS.filter((c) => isLive(c));
  const codes = PROMO_CODES.filter((p) => codeLive(p)).sort((a, b) => b.pct - a.pct);
  const past = PROMO_CODES.filter((p) => !codeLive(p));
  const [lead, ...rest] = codes;
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pb-14 pt-28 sm:pt-36 md:px-16">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{t('Promotions', 'প্রোমোশন')}</motion.p>
        <motion.h1 {...up(0.1)} className="mt-4 u-h1">
          {t('Offers that', 'যে অফার')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('pay you back.', 'আপনাকে ফিরিয়ে দেয়।')}</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mt-6 max-w-lg text-[17px] leading-relaxed ${muted}`}>{t('Live campaigns and promo codes across Arohon. Copy a code and apply it in the app before your ride.', 'আরোহনের চলমান ক্যাম্পেইন আর প্রোমো কোড এক জায়গায়। কোড কপি করে রাইডের আগে অ্যাপে অ্যাপ্লাই করুন।')}</motion.p>
      </section>

      {/* bento: the live campaign takes the big tile, the best code sits beside it, the rest fill in below */}
      <section className="mx-auto grid max-w-[1280px] auto-rows-[minmax(0,auto)] gap-3 border-t border-black/10 px-6 pt-12 md:px-16 lg:grid-cols-4 dark:border-white/10">
        {campaigns.map((c, i) => (
          <motion.div key={c.slug} {...fade(0.05)} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : 'lg:col-span-2'}>
            <Link href={href(`/promotion/${c.slug}`)} className={`${panel} group flex h-full flex-col overflow-hidden transition-colors hover:border-black/20 dark:hover:border-white/20`}>
              <div className="relative aspect-[16/9] overflow-hidden bg-[#EDEDED] dark:bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${c.imgDark ? 'dark:hidden' : ''}`} />
                {c.imgDark && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imgDark} alt="" className="hidden h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] dark:block" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className={`text-[13px] ${muted}`}><Status c={c} />, {period(c)}</p>
                <h2 className="mt-2 text-[24px] font-medium leading-snug tracking-tight">{l(c.headline)}</h2>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-medium">
                  {t('See how it works', 'কীভাবে কাজ করে দেখুন')} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
        {lead && (
          <motion.div {...fade(0.1)} className="lg:col-span-2">
            <CodeTile p={lead} big />
          </motion.div>
        )}
        {rest.map((p, i) => (
          <motion.div key={p.code} {...fade(0.15 + i * 0.05)}>
            <CodeTile p={p} />
          </motion.div>
        ))}
        <motion.div {...fade(0.2)} className={rest.length % 2 ? '' : 'lg:col-span-2'}>
          <div className={`${panel} flex h-full flex-col justify-between p-7`}>
            <div>
              <p className={`text-[13px] ${muted}`}>{t('How codes work', 'কোড যেভাবে কাজ করে')}</p>
              <ol className="mt-4 space-y-2.5 text-[15px]">
                {[
                  ['Copy a code from this page', 'এই পেজ থেকে কোড কপি করুন'],
                  ['Apply it in the Arohon app before you book', 'বুক করার আগে আরোহন অ্যাপে অ্যাপ্লাই করুন'],
                  ['The discount comes off your fare', 'ভাড়া থেকে ছাড় কেটে যাবে'],
                ].map(([en, bn], k) => (
                  <li key={en} className="flex gap-3"><span className={`font-mono text-[12px] ${muted}`}>{k + 1}</span>{t(en, bn)}</li>
                ))}
              </ol>
            </div>
            <Link href="/terms-promo-code" className={`mt-6 text-[13px] underline underline-offset-4 ${muted}`}>{t('Promo code terms', 'প্রোমো কোডের শর্তাবলি')}</Link>
          </div>
        </motion.div>
      </section>

      {past.length > 0 && (
        <section className="mx-auto max-w-[1280px] px-6 pb-32 pt-20 md:px-16">
          <motion.p {...fade()} className={`text-[13px] ${muted}`}>{t('Past offers', 'আগের অফার')}</motion.p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {past.map((p) => (
              <motion.div key={p.code} {...fade()}>
                <CodeTile p={p} past />
              </motion.div>
            ))}
          </div>
        </section>
      )}
      {past.length === 0 && <div className="pb-32" />}
    </>
  );
}

/* a wallet that keeps filling as rides and referrals land, so "earn while you ride" is visible */
const EVENTS: { k: L; v: number }[] = [
  { k: ['Ride completed', 'রাইড সম্পন্ন'], v: 10 },
  { k: ['Friend joined with your code', 'আপনার কোডে বন্ধু যুক্ত হয়েছে'], v: 50 },
  { k: ['Ride completed', 'রাইড সম্পন্ন'], v: 10 },
  { k: ['Daily mission done', 'আজকের মিশন শেষ'], v: 20 },
];
function WalletDemo() {
  const { t, n, l } = useCopy();
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { margin: '-60px' });
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setI((x) => (x + 1) % (EVENTS.length + 2)), 1300);
    return () => clearInterval(id);
  }, [on]);
  const shown = EVENTS.slice(0, Math.min(i, EVENTS.length));
  const total = shown.reduce((a, e) => a + e.v, 0);
  return (
    <div ref={ref} className="rounded-[24px] bg-white p-6 text-black shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:text-white dark:ring-white/10">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-black/50 dark:text-white/50">{t('Your rewards wallet, sample', 'আপনার রিওয়ার্ড ওয়ালেট, নমুনা')}</p>
        <Coins size={18} className="text-[#C79A2E]" />
      </div>
      <motion.p key={total} initial={{ opacity: 0.4, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[40px] font-semibold tabular-nums tracking-tight">
        {n(total)} <span className="text-[16px] font-medium text-black/45 dark:text-white/45">{t('points', 'পয়েন্ট')}</span>
      </motion.p>
      <ul className="mt-5 min-h-[184px] space-y-2">
        <AnimatePresence initial={false}>
          {shown.map((e, k) => (
            <motion.li key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="flex items-center justify-between rounded-xl bg-black/[.03] px-4 py-2.5 text-[14px] dark:bg-white/[.04]">
              <span>{l(e.k)}</span>
              <span className="flex items-center gap-1 font-semibold text-[#079A70] dark:text-[#0ABF8B]"><Plus size={11} weight="bold" />{n(e.v)}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-3 text-[12px] text-black/40 dark:text-white/35">{t('Amounts shown are an example.', 'দেখানো পরিমাণ শুধু উদাহরণ।')}</p>
    </div>
  );
}

/* ═════════════ /promotion/[slug]: one campaign ═════════════ */
export function PromotionDetail({ slug }: { slug: string }) {
  const { t, n, href, l, period } = useCopy();
  const c = CAMPAIGNS.find((x) => x.slug === slug)!;
  const [open, setOpen] = useState(0);
  const join = () => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pb-16 pt-28 sm:pt-32 md:px-16">
        <motion.div {...up(0)}>
          <Link href={href('/promotion')} className={`group inline-flex items-center gap-1.5 text-[14px] ${muted} hover:text-black dark:hover:text-white`}>
            <ArrowRight size={13} className="rotate-180 transition-transform group-hover:-translate-x-0.5" /> {t('All promotions', 'সব প্রোমোশন')}
          </Link>
        </motion.div>
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            {/* same badge as the homepage "New" pill, without the comet */}
            <motion.div {...up(0.05)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 py-1 pl-1 pr-3 text-[13px] text-black/70 dark:border-white/[.12] dark:text-[#D0D6E0]">
                <span className="rounded-full bg-black px-2 py-0.5 text-[11px] font-semibold text-white dark:bg-white dark:text-black">{isLive(c) ? t('Live now', 'চলছে এখন') : t('Ended', 'শেষ হয়েছে')}</span>
                {l(c.badge)}
              </span>
            </motion.div>
            <motion.h1 {...up(0.1)} className="mt-5 text-[36px] font-medium leading-[1.1] tracking-[-0.025em] sm:text-[52px]">{l(c.headline)}</motion.h1>
            <motion.p {...up(0.25)} className="mt-5 text-[14px]">
              <span className={muted}>{t('Campaign period', 'ক্যাম্পেইনের সময়')}: </span>
              <span className="font-medium">{period(c)}</span>
            </motion.p>
            <motion.div {...up(0.3)} className="mt-8">
              <button type="button" onClick={join} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto dark:bg-white dark:text-black">
                {l(c.cta)} <ArrowRight size={15} />
              </button>
            </motion.div>
          </div>
          <motion.div {...up(0.35)} className="overflow-hidden rounded-[24px] border border-black/10 bg-[#EDEDED] dark:border-white/10 dark:bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.img} alt="" className={`w-full ${c.imgDark ? "dark:hidden" : ""}`} />
                {c.imgDark && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.imgDark} alt="" className="hidden w-full dark:block" />
                )}
          </motion.div>
        </div>
      </section>

      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <motion.div {...fade()}>
              <p className={`text-[13px] ${muted}`}>{t('How it works', 'যেভাবে কাজ করে')}</p>
              <h2 className={`mt-3 ${h2}`}>{l(c.howTitle)}</h2>
            </motion.div>
            <ol className="mt-12 space-y-8">
              {c.steps.map((s, k) => (
                <motion.li key={k} {...fade(k * 0.08)} className="flex gap-5">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-mono text-[13px] ${panel}`}>{n(String(k + 1).padStart(2, '0'))}</span>
                  <span>
                    <span className="block text-[18px] font-medium tracking-tight">{l(s.title)}</span>
                    <span className={`mt-1.5 block max-w-md text-[15px] leading-relaxed ${muted}`}>{l(s.copy)}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>
          <motion.div {...fade(0.1)}>
            <WalletDemo />
          </motion.div>
        </div>
      </section>

      <section className={wrap}>
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Campaign details', 'ক্যাম্পেইনের বিস্তারিত')}</p>
          <h2 className={`mt-3 ${h2}`}>{t('The fine print,', 'সব শর্ত,')}<br /><span className={muted}>{t('in plain words.', 'সহজ ভাষায়।')}</span></h2>
        </motion.div>
        <dl className="mt-12 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
          {c.details.map((d, k) => (
            <motion.div key={k} {...fade(k * 0.04)} className="grid gap-2 py-5 sm:grid-cols-[240px_1fr] sm:gap-8">
              <dt className={`text-[14px] ${muted}`}>{l(d.k)}</dt>
              <dd className="flex items-start gap-2 text-[16px]"><Check size={16} weight="bold" className="mt-1 shrink-0 text-[#079A70]" />{l(d.v)}</dd>
            </motion.div>
          ))}
        </dl>
        <motion.p {...fade()} className={`mt-6 text-[13px] ${muted}`}>
          <Link href="/terms-promo-code" className="underline underline-offset-4">{t('Promo code terms', 'প্রোমো কোডের শর্তাবলি')}</Link>
          {', '}
          <Link href="/terms-rewards" className="underline underline-offset-4">{t('Rewards terms', 'রিওয়ার্ডের শর্তাবলি')}</Link>
        </motion.p>
      </section>

      <section className={`${wrap} grid gap-12 md:grid-cols-[1fr_1.6fr]`}>
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('FAQ', 'সাধারণ প্রশ্ন')}</p>
          <h2 className={`mt-3 ${h2}`}>{t('Questions,', 'প্রশ্ন,')}<br /><span className={muted}>{t('answered.', 'উত্তরসহ।')}</span></h2>
        </motion.div>
        <ul className="divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
          {c.faq.map((f, k) => (
            <li key={k}>
              <button type="button" onClick={() => setOpen(open === k ? -1 : k)} aria-expanded={open === k} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium">
                {l(f.q)}
                <Plus size={16} className={`shrink-0 transition-transform duration-300 ${open === k ? 'rotate-45' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === k && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className={`overflow-hidden pb-5 text-[15px] leading-relaxed ${muted}`}>
                    {l(f.a)}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </section>

      <section id="join" className="mx-auto max-w-[1280px] scroll-mt-32 border-t border-black/10 px-6 py-32 text-center sm:py-40 md:px-16 dark:border-white/10">
        <motion.h2 {...fade()} className="text-[40px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[64px]">
          {l(c.cta)}
          <br />
          <span className={muted}>{t('Download Arohon to start.', 'শুরু করতে আরোহন ডাউনলোড করুন।')}</span>
        </motion.h2>
        <motion.div {...fade(0.15)} className="mt-10 flex justify-center"><StoreBadges className="justify-center" /></motion.div>
      </section>
    </>
  );
}
