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
import { useT } from '@/lib/i18n';

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
  const { t } = useT();
  const [open, setOpen] = useState(0);
  return (
    <section className={`${wrap} grid gap-12 md:grid-cols-[1fr_1.6fr]`}>
      <motion.div {...fade()}>
        <p className={`text-[13px] ${muted}`}>{t('FAQ', 'প্রশ্নোত্তর')}</p>
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
const WEEK_BN = ['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র'];
const WORKDAYS = 5;
function CommuteLog() {
  // ten trips a week (morning + evening, Sat to Wed) fill in one at a time; the next one is the only green
  const { t, n } = useT();
  const { ref, i } = useLoop(WORKDAYS * 2 + 3, 650);
  const done = Math.min(i, WORKDAYS * 2);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-black/45 dark:text-white/45">{t('Office ride, sample', 'অফিস রাইড, নমুনা')}</p>
        <span className="rounded-full border border-black/10 px-2.5 py-0.5 text-[11px] text-black/60 dark:border-white/15 dark:text-white/60">{t('Monthly plan', 'মাসিক প্ল্যান')}</span>
      </div>

      {/* route, with the app's pickup square and destination circle */}
      <div className="mt-4 flex gap-3">
        <RouteMarkers pad="py-[3px]" />
        <div className="flex-1 space-y-3">
          <p className="flex items-baseline justify-between text-[15px] font-medium">{t('Home, Uttara', 'বাসা, উত্তরা')} <span className="text-[12px] font-normal tabular-nums text-black/45 dark:text-white/45">{t('8:30 AM', 'সকাল ৮:৩০')}</span></p>
          <p className="flex items-baseline justify-between text-[15px] font-medium">{t('Office, Gulshan 1', 'অফিস, গুলশান ১')} <span className="text-[12px] font-normal tabular-nums text-black/45 dark:text-white/45">{t('6:00 PM back', 'ফেরা সন্ধ্যা ৬:০০')}</span></p>
        </div>
      </div>

      {/* week strip: two quiet dots per workday */}
      <div className="mt-6 grid grid-cols-7 border-y border-black/[.07] py-4 dark:border-white/[.07]">
        {WEEK.map((d, k) => {
          const work = k < WORKDAYS;
          return (
            <div key={d} className="flex flex-col items-center gap-2">
              <span className={`text-[11px] ${work ? 'text-black/55 dark:text-white/55' : 'text-black/20 dark:text-white/20'}`}>{t(d, WEEK_BN[k])}</span>
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
          <span className="font-semibold">{t('Rakib', 'রাকিব')}</span>
          <span className="text-black/50 dark:text-white/50">{t(' · Toyota Axio · ★ 4.9', ` · টয়োটা এক্সিও · ★ ${n('4.9')}`)}</span>
        </p>
        <span className="text-[12px] tabular-nums text-black/50 dark:text-white/50">{t(<>{done}/10 trips</>, <>{n(done)}/{n(10)} ট্রিপ</>)}</span>
      </div>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-black/[.07] dark:bg-white/10">
        <motion.div className="h-full rounded-full bg-black dark:bg-white" animate={{ width: `${(done / 10) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>
    </div>
  );
}
const MERCHANT = [
  { id: 'Order 1042', to: 'Dhanmondi 9/A', st: 'Out for delivery', bn: { id: 'অর্ডার ১০৪২', to: 'ধানমন্ডি ৯/এ', st: 'ডেলিভারির পথে' } },
  { id: 'Order 1041', to: 'Mirpur 2', st: 'In transit', bn: { id: 'অর্ডার ১০৪১', to: 'মিরপুর ২', st: 'পথে আছে' } },
  { id: 'Order 1040', to: 'Bashundhara R/A', st: 'Picked up', bn: { id: 'অর্ডার ১০৪০', to: 'বসুন্ধরা আ/এ', st: 'পিকআপ হয়েছে' } },
  { id: 'Order 1039', to: 'Mohammadpur', st: 'Delivered', bn: { id: 'অর্ডার ১০৩৯', to: 'মোহাম্মদপুর', st: 'ডেলিভারি হয়েছে' } },
];
function MerchantConsole() {
  const { t } = useT();
  const { ref, i } = useLoop(MERCHANT.length, 2200);
  const rows = MERCHANT.map((_, k) => MERCHANT[(k + i) % MERCHANT.length]);
  return (
    <div ref={ref} className={`${panel} p-2`}>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2 text-[13px] font-medium"><Storefront size={16} /> {t('Your shop deliveries', 'আপনার দোকানের ডেলিভারি')}</span>
        <span className={`text-[12px] ${muted}`}>{t('Sample', 'নমুনা')}</span>
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        {rows.map((r) => (
          <motion.div key={r.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease }} className="flex items-center gap-4 border-t border-black/[.06] px-4 py-3.5 text-[14px] dark:border-white/[.06]">
            <span className="w-24 font-medium">{t(r.id, r.bn.id)}</span>
            <span className={`flex-1 ${muted}`}>{t(r.to, r.bn.to)}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${r.st === 'Delivered' ? 'bg-[#0ABF8B]/15 text-[#079A70] dark:text-[#0ABF8B]' : 'border border-black/10 dark:border-white/10'}`}>{t(r.st, r.bn.st)}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const AUDIENCE = [
  { v: 'car', title: 'Offices', copy: 'A monthly ride for staff who need to be at their desk on time, with the same driver every day.', titleBn: 'অফিস', copyBn: 'সময়মতো ডেস্কে পৌঁছাতে হয় এমন স্টাফদের জন্য মাসিক রাইড, প্রতিদিন একই ড্রাইভার।' },
  { v: 'hiace', title: 'Event days', copy: 'Off-sites, trainings and dinners: a micro, Hiace or bus moves the whole team together.', titleBn: 'ইভেন্টের দিন', copyBn: 'অফসাইট, ট্রেনিং বা ডিনার, মাইক্রো, হায়েস বা বাসে পুরো টিম যায় একসাথে।' },
  { v: 'bike', title: 'Online shops', copy: 'Book pickups and send orders across town or to any district from your shop console.', titleBn: 'অনলাইন শপ', copyBn: 'শপ কনসোল থেকেই পিকআপ বুক করুন, অর্ডার পাঠান শহরজুড়ে বা যেকোনো জেলায়।' },
  { v: 'car_plus', title: 'Guests and clients', copy: 'A Car Plus with a top-rated driver to meet visitors at the airport or the office.', titleBn: 'অতিথি ও ক্লায়েন্ট', copyBn: 'এয়ারপোর্ট বা অফিসে অতিথিদের রিসিভ করতে টপ রেটেড ড্রাইভারসহ কার প্লাস।' },
];
function WhoFor() {
  const { t } = useT();
  return (
    <section className={wrap}>
      <Head label={t('Who it’s for', 'কাদের জন্য')} title={t('Built for teams', 'ছোট বড়')} rest={t('of every size.', 'সব টিমের জন্য।')} />
      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE.map((a, i) => (
          <motion.div key={a.title} {...fade(i * 0.06)} className={`${panel} group p-6`}>
            <RentalArt v={a.v} />
            <p className="mt-4 text-[16px] font-medium">{t(a.title, a.titleBn)}</p>
            <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{t(a.copy, a.copyBn)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function BusinessPage() {
  const { t, n, href } = useT();
  return (
    <>
      <Hero
        label={t('Arohon for Business', 'আরোহন বিজনেস')}
        title={t('Move your team.', 'আপনার টিমকে পৌঁছে দিন।')}
        rest={t('Every working day.', 'প্রতিটি কর্মদিবসে।')}
        copy={t('Monthly office rides with the same driver, transport for the whole team on event days, and same-day deliveries for your shop.', 'একই ড্রাইভারের সাথে মাসিক অফিস রাইড, ইভেন্টের দিনে পুরো টিমের যাতায়াত, আর আপনার দোকানের জন্য সেম ডে ডেলিভারি।')}
        cta={<Link href={href('/contact')} className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-[15px] font-semibold text-white max-sm:w-full max-sm:justify-center dark:bg-white dark:text-black">{t('Talk to our team', 'আমাদের টিমের সাথে কথা বলুন')} <ArrowRight size={15} /></Link>}
      >
        <CommuteLog />
      </Hero>
      <section className={wrap}>
        <Head label={t('Office commute', 'অফিস যাতায়াত')} title={t('One driver.', 'একজন ড্রাইভার।')} rest={t('One monthly price.', 'মাসে একটাই দাম।')} copy={t('Book a daily office ride by the month or the week. The same trusted driver picks you up in the morning and takes you home in the evening, with every trip logged.', 'মাসিক বা সাপ্তাহিক ভিত্তিতে প্রতিদিনের অফিস রাইড বুক করুন। একই বিশ্বস্ত ড্রাইভার সকালে নিয়ে যাবেন, সন্ধ্যায় বাসায় পৌঁছে দেবেন, আর প্রতিটি ট্রিপের হিসাব থাকবে।')} />
        <Grid
          items={[
            { icon: User, title: t('Same driver, every day', 'প্রতিদিন একই ড্রাইভার'), copy: t('No new faces at the gate each morning. You ride with one driver you know.', 'রোজ সকালে গেটে নতুন মুখ নয়। চলবেন চেনা একজন ড্রাইভারের সাথে।') },
            { icon: Clock, title: t('Fixed monthly fare', 'নির্দিষ্ট মাসিক ভাড়া'), copy: t('One price for the month, with no daily surprises. Weekly plans are there too.', 'পুরো মাসের জন্য একটাই দাম, রোজকার কোনো চমক নেই। সাপ্তাহিক প্ল্যানও আছে।') },
            { icon: Check, title: t('Every trip logged', 'প্রতিটি ট্রিপের হিসাব'), copy: t('Each workday’s pickup and drop is recorded, Saturday to Friday.', 'শনি থেকে শুক্র, প্রতিটি কর্মদিবসের পিকআপ আর ড্রপ রেকর্ড থাকে।') },
          ]}
        />
      </section>
      <section className={wrap}>
        <Head label={t('Team transport', 'টিম ট্রান্সপোর্ট')} title={t('The whole office,', 'পুরো অফিস,')} rest={t('in one booking.', 'এক বুকিংয়ে।')} copy={t('Off-sites, training days and events: book a micro, a Hiace or a bus for the group, with a driver, by the hour, the day or across districts.', 'অফসাইট, ট্রেনিং বা ইভেন্ট, পুরো দলের জন্য ড্রাইভারসহ মাইক্রো, হায়েস বা বাস বুক করুন, ঘণ্টা বা দিন হিসেবে, এমনকি এক জেলা থেকে আরেক জেলায়।')} />
        <motion.div {...fade(0.1)} className="mt-14 grid grid-cols-3 gap-3">
          {[['micro', t('Micro', 'মাইক্রো'), t('7 seats', `${n(7)} সিট`)], ['hiace', t('Hiace', 'হায়েস'), t('12 seats', `${n(12)} সিট`)], ['car_plus', t('Car Plus', 'কার প্লাস'), t('For guests', 'অতিথিদের জন্য')]].map(([v, nm, m]) => (
            <div key={v} className={`${panel} group p-5`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/icons/${v}.webp`} alt="" className="mx-auto h-24 w-full object-contain transition-transform duration-500 group-hover:-translate-y-1" />
              <p className="mt-3 text-[15px] font-medium">{nm}</p>
              <p className={`text-[13px] ${muted}`}>{m}</p>
            </div>
          ))}
        </motion.div>
      </section>
      <section className={wrap}>
        <Head label={t('Business deliveries', 'বিজনেস ডেলিভারি')} title={t('Sell online?', 'অনলাইনে বিক্রি করেন?')} rest={t('We deliver it.', 'ডেলিভারি আমাদের।')} inline copy={t('Shops get their own delivery console: book pickups, follow every parcel from pickup to doorstep and see what has been delivered or returned.', 'দোকানের জন্য আলাদা ডেলিভারি কনসোল, পিকআপ বুক করুন, পিকআপ থেকে দরজা পর্যন্ত প্রতিটি পার্সেল দেখুন, আর জানুন কোনটা ডেলিভারি হলো বা ফেরত এলো।')} />
        <div className="mt-14">
          <MerchantConsole />
        </div>
      </section>
      <WhoFor />
      <FareExplorer
        label={t('Team trips', 'টিম ট্রিপ')}
        title={t('Planning an off-site?', 'অফসাইটের প্ল্যান?')}
        rest={t('Price it in seconds.', 'কয়েক সেকেন্ডে খরচ জানুন।')}
        copy={t('Pick a destination and see what a micro or Hiace costs for the whole team, and what that comes to per person.', 'গন্তব্য বেছে নিন, দেখুন পুরো টিমের জন্য মাইক্রো বা হায়েসে কত খরচ, আর জনপ্রতি কত পড়ে।')}
        vehicles={['micro', 'hiace']}
        seats={{ micro: 7, hiace: 12 }}
      />
      <Close title={t('Let’s move', 'চলুন এগিয়ে নিই')} rest={t('your business.', 'আপনার ব্যবসা।')}>
        <Link href={href('/contact')} className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-[15px] font-semibold text-white dark:bg-white dark:text-black">{t('Talk to our team', 'আমাদের টিমের সাথে কথা বলুন')} <ArrowRight size={15} /></Link>
      </Close>
    </>
  );
}

/* ═════════════ PARCEL ═════════════ */
const P_STEPS = ['Confirmed', 'Picked up', 'In transit', 'Out for delivery', 'Delivered'];
const P_STEPS_BN = ['কনফার্ম হয়েছে', 'পিকআপ হয়েছে', 'পথে আছে', 'ডেলিভারির পথে', 'ডেলিভারি হয়েছে'];
function ParcelTracker() {
  const { t } = useT();
  const { ref, i } = useLoop(P_STEPS.length + 2, 1200);
  const at = Math.min(i, P_STEPS.length - 1);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] text-black/45 dark:text-white/45">{t('Same Day Delivery, sample', 'সেম ডে ডেলিভারি, নমুনা')}</p>
          <p className="mt-0.5 text-[17px] font-semibold">{t('Banani to Dhanmondi', 'বনানী থেকে ধানমন্ডি')}</p>
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
            <span className={`text-[14px] transition-colors ${k === at ? 'font-semibold' : k < at ? '' : 'text-black/35 dark:text-white/30'}`}>{t(s, P_STEPS_BN[k])}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
const SPEEDS = [
  { name: 'Quick Delivery', promise: 'Within 1 hour', note: 'Short hops across the city', bn: { name: 'কুইক ডেলিভারি', promise: '১ ঘণ্টার মধ্যে', note: 'শহরের ভেতরে কাছাকাছি' } },
  { name: '4-Hour Delivery', promise: 'Within 4 hours', note: 'Across Dhaka, the same afternoon', bn: { name: '৪ ঘণ্টার ডেলিভারি', promise: '৪ ঘণ্টার মধ্যে', note: 'ঢাকাজুড়ে, সেদিন বিকেলেই' } },
  { name: 'Same Day Delivery', promise: 'Today', note: 'Longer city runs, delivered by tonight', bn: { name: 'সেম ডে ডেলিভারি', promise: 'আজই', note: 'শহরের দূরের ঠিকানায়, আজ রাতের মধ্যে' } },
  { name: 'Nationwide', promise: '1 to 3 days', note: 'To any district in Bangladesh', bn: { name: 'সারা দেশে', promise: '১ থেকে ৩ দিন', note: 'বাংলাদেশের যেকোনো জেলায়' } },
];
const TYPES = ['Documents', 'Food', 'Homemade food', 'Clothes', 'Gifts', 'Cosmetics', 'Medicine', 'Accessories', 'Electronics', 'Other items'];
const WEIGHTS = ['0 to 2 kg', '2 to 4 kg', '4 to 6 kg', '6 to 8 kg'];
const TYPES_BN = ['ডকুমেন্ট', 'খাবার', 'ঘরে রান্না খাবার', 'জামাকাপড়', 'উপহার', 'কসমেটিকস', 'ওষুধ', 'এক্সেসরিজ', 'ইলেকট্রনিকস', 'অন্যান্য জিনিস'];
const WEIGHTS_BN = ['০ থেকে ২ কেজি', '২ থেকে ৪ কেজি', '৪ থেকে ৬ কেজি', '৬ থেকে ৮ কেজি'];
function WhatCanISend() {
  const { t: tr } = useT();
  const [t, setT] = useState(0);
  const [w, setW] = useState(0);
  return (
    <div className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{tr('What are you sending?', 'কী পাঠাচ্ছেন?')}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {TYPES.map((x, k) => (
          <button key={x} type="button" onClick={() => setT(k)} className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${k === t ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] hover:bg-black/[.08] dark:bg-white/[.07]'}`}>{tr(x, TYPES_BN[k])}</button>
        ))}
      </div>
      <p className={`mt-6 text-[13px] ${muted}`}>{tr('How heavy?', 'ওজন কত?')}</p>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {WEIGHTS.map((x, k) => (
          <button key={x} type="button" onClick={() => setW(k)} className={`rounded-xl py-2.5 text-[13px] transition-colors ${k === w ? 'bg-black font-semibold text-white dark:bg-white dark:text-black' : 'bg-black/[.04] hover:bg-black/[.08] dark:bg-white/[.06]'}`}>{tr(x, WEIGHTS_BN[k])}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={t + '-' + w} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 flex items-center gap-2 border-t border-black/10 pt-5 text-[15px] dark:border-white/10">
          <Check size={18} weight="bold" className="text-brand-green" /> {tr(<>{TYPES[t]}, {WEIGHTS[w]}: good to go.</>, <>{TYPES_BN[t]}, {WEIGHTS_BN[w]}, পাঠাতে পারবেন।</>)}
        </motion.p>
      </AnimatePresence>
      <p className={`mt-2 text-[12px] ${muted}`}>{tr('Up to 8 kg per parcel. Documents exclude passports and bank cheques.', 'প্রতি পার্সেলে সর্বোচ্চ ৮ কেজি। ডকুমেন্টের মধ্যে পাসপোর্ট আর ব্যাংক চেক পাঠানো যাবে না।')}</p>
    </div>
  );
}

const NOPE = [
  ['Passports', 'Send them through an official courier instead.'],
  ['Bank cheques', 'Hand these over in person or through your bank.'],
  ['Over 8 kg', 'Split it into smaller parcels, or book a pickup or truck.'],
];
const NOPE_BN = [
  ['পাসপোর্ট', 'এর বদলে অফিসিয়াল কুরিয়ারে পাঠান।'],
  ['ব্যাংক চেক', 'নিজে হাতে দিন, বা ব্যাংকের মাধ্যমে পাঠান।'],
  ['৮ কেজির বেশি', 'ছোট ছোট পার্সেলে ভাগ করুন, বা পিকআপ কিংবা ট্রাক বুক করুন।'],
];
function ParcelNationwide() {
  const { t } = useT();
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Nationwide', 'সারা দেশে')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Any district,', 'যেকোনো জেলায়,')}
            <br />
            <span className={muted}>{t('in 1 to 3 days.', '১ থেকে ৩ দিনে।')}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>{t('From Panchagarh to Teknaf, parcels leave Dhaka for all 64 districts every day, and you follow every step in the app.', 'পঞ্চগড় থেকে টেকনাফ, প্রতিদিন ঢাকা থেকে পার্সেল যায় ৬৪ জেলাতেই, আর প্রতিটি ধাপ দেখবেন অ্যাপে।')}</p>
        </motion.div>
        <motion.div {...fade(0.1)} className="mx-auto w-full max-w-[440px]">
          <BDMap label={t('Parcels travelling between districts across Bangladesh', 'বাংলাদেশজুড়ে এক জেলা থেকে আরেক জেলায় যাচ্ছে পার্সেল')} />
        </motion.div>
      </div>
    </section>
  );
}
function ParcelRules() {
  const { t: tr, bn, href } = useT();
  return (
    <section className={wrap}>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <motion.div {...fade()} className={`${panel} p-6 sm:p-8`}>
          <p className={`text-[13px] ${muted}`}>{tr('Please don’t send', 'এগুলো পাঠাবেন না')}</p>
          <ul className="mt-5 space-y-4">
            {(bn ? NOPE_BN : NOPE).map(([t, c]) => (
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
          <p className={`text-[13px] ${muted}`}>{tr('For online sellers', 'অনলাইন বিক্রেতাদের জন্য')}</p>
          <p className="mt-5 text-[22px] font-medium tracking-tight">{tr('Sending every day?', 'প্রতিদিন পাঠান?')}</p>
          <p className={`mt-2 max-w-sm text-[15px] leading-relaxed ${muted}`}>{tr('Shops get their own delivery console to book pickups and follow every order to the customer’s door.', 'দোকানের জন্য আলাদা ডেলিভারি কনসোল, পিকআপ বুক করুন আর প্রতিটি অর্ডার কাস্টমারের দরজা পর্যন্ত দেখুন।')}</p>
          <Link href={href('/services/business')} className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-medium">{tr('See Arohon for Business', 'আরোহন বিজনেস দেখুন')} <ArrowRight size={13} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

export function ParcelPage() {
  const { t, n } = useT();
  return (
    <>
      <Hero label={t('Parcel', 'পার্সেল')} title={t('Send it across town.', 'শহরের এ মাথা থেকে ও মাথা।')} rest={t('Or across the country.', 'কিংবা দেশের যেকোনো প্রান্তে।')} copy={t('From a document across Dhaka in an hour to a gift to Sylhet in a few days. Book in the app and follow it to the door.', 'ঢাকার ভেতরে এক ঘণ্টায় ডকুমেন্ট, কিংবা কয়েক দিনে সিলেটে উপহার। অ্যাপে বুক করুন, দরজা পর্যন্ত চোখ রাখুন।')}>
        <ParcelTracker />
      </Hero>
      <section className={wrap}>
        <Head label={t('Delivery speeds', 'ডেলিভারির গতি')} title={t('As fast', 'যত দ্রুত')} rest={t('as you need it.', 'আপনার দরকার।')} />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPEEDS.map((s, i) => (
            <motion.div key={s.name} {...fade(i * 0.06)} className={`${panel} p-6`}>
              <p className={`font-mono text-[11px] ${muted}`}>{n(0)}{n(i + 1)}</p>
              <p className="mt-6 text-[28px] font-semibold tracking-tight">{t(s.promise, s.bn.promise)}</p>
              <p className="mt-4 text-[15px] font-medium">{t(s.name, s.bn.name)}</p>
              <p className={`mt-1 text-[13px] ${muted}`}>{t(s.note, s.bn.note)}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Head label={t('What you can send', 'কী পাঠাতে পারবেন')} title={t('Almost anything', 'প্রায় সবকিছু,')} rest={t('up to 8 kg.', '৮ কেজি পর্যন্ত।')} />
          <WhatCanISend />
        </div>
      </section>
      <section className={wrap}>
        <Head label={t('Two ways to send', 'পাঠানোর দুই উপায়')} title={t('We pick it up,', 'আমরা নিয়ে যাই,')} rest={t('or you drop it off.', 'নয়তো আপনি দিয়ে যান।')} />
        <Grid
          items={[
            { icon: Package, title: t('Instant delivery', 'ইনস্ট্যান্ট ডেলিভারি'), copy: t('A rider collects from your door and takes it straight to the receiver, within the city.', 'শহরের ভেতরে রাইডার আপনার দরজা থেকে নিয়ে সোজা প্রাপকের কাছে পৌঁছে দেন।') },
            { icon: Storefront, title: t('Pickup from home', 'বাসা থেকে পিকআপ'), copy: t('Our representative collects your parcel and sends it on, including to other districts.', 'আমাদের প্রতিনিধি পার্সেল নিয়ে যান আর পাঠিয়ে দেন, অন্য জেলাতেও।') },
            { icon: Check, title: t('Track every step', 'প্রতিটি ধাপ ট্র্যাক করুন'), copy: t('Confirmed, picked up, in transit, out for delivery and delivered, all in the app.', 'কনফার্ম, পিকআপ, পথে, ডেলিভারির পথে আর ডেলিভারি হয়েছে, সব অ্যাপেই।') },
          ]}
        />
      </section>
      <ParcelNationwide />
      <ParcelRules />
      <Close title={t('Ready to send?', 'পাঠাতে তৈরি?')} rest={t('It takes a minute.', 'লাগবে মাত্র এক মিনিট।')} />
    </>
  );
}

/* ═════════════ RENTAL ═════════════ */
const BIDS = [
  { name: 'Sohel', rating: '4.9', price: 2400, car: 'Toyota Axio', bn: { name: 'সোহেল', car: 'টয়োটা এক্সিও' } },
  { name: 'Kamal', rating: '4.8', price: 2200, car: 'Toyota Premio', bn: { name: 'কামাল', car: 'টয়োটা প্রিমিও' } },
  { name: 'Faruk', rating: '5.0', price: 2600, car: 'Toyota Allion', bn: { name: 'ফারুক', car: 'টয়োটা অ্যালিয়ন' } },
];
function BidBoard() {
  const { t, n } = useT();
  const { ref, i } = useLoop(6, 1300);
  const shown = Math.min(i, BIDS.length);
  const [pick, setPick] = useState<number | null>(null);
  useEffect(() => {
    if (i === 0) setPick(null);
  }, [i]);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <p className="text-[12px] text-black/45 dark:text-white/45">{t('Your request, sample', 'আপনার রিকোয়েস্ট, নমুনা')}</p>
      <p className="mt-0.5 text-[17px] font-semibold">{t('Car with driver, 6 hours', 'ড্রাইভারসহ কার, ৬ ঘণ্টা')}</p>
      <p className="text-[13px] text-black/50 dark:text-white/50">{t('Gulshan, Saturday from 10:00 AM', 'গুলশান, শনিবার সকাল ১০:০০ থেকে')}</p>
      <p className="mt-5 text-[12px] text-black/45 dark:text-white/45">{shown ? t(`${shown} drivers bid`, `${n(shown)} জন ড্রাইভার দর দিয়েছেন`) : t('Waiting for bids…', 'দরের অপেক্ষায়…')}</p>
      <ul className="mt-2 min-h-[198px] space-y-2">
        <AnimatePresence>
          {BIDS.slice(0, shown).map((b, k) => (
            <motion.li key={b.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
              <button type="button" onClick={() => setPick(k)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${pick === k ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.05] dark:bg-white/[.04]'}`}>
                <img src={avatar(b.name)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{t(b.name, b.bn.name)}</span>
                  <span className="flex items-center gap-1 text-[12px] text-black/50 dark:text-white/50"><Star size={10} weight="fill" className="text-[#FF9500]" />{n(b.rating)}, {t(b.car, b.bn.car)}</span>
                </span>
                <span className="text-[16px] font-semibold tabular-nums">৳{n(b.price.toLocaleString('en-US'))}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-2 text-center text-[12px] text-black/45 dark:text-white/40">{pick === null ? t('Tap a bid to choose your driver', 'ড্রাইভার বেছে নিতে একটি দরে ট্যাপ করুন') : t(`${BIDS[pick].name} confirmed for Saturday`, `শনিবারের জন্য ${BIDS[pick].bn.name} কনফার্ম`)}</p>
    </div>
  );
}
const RENTALS = [
  { v: 'car', name: 'Hourly', copy: 'A car and driver by the hour, for errands or a day out.', bn: { name: 'ঘণ্টা হিসেবে', copy: 'কাজের দৌড়ঝাঁপ বা একদিনের ঘোরাঘুরি, ঘণ্টা হিসেবে ড্রাইভারসহ কার।' } },
  { v: 'car', name: 'Weekly or monthly', copy: 'Hire a car and driver for the week or the month, for your commute.', bn: { name: 'সাপ্তাহিক বা মাসিক', copy: 'রোজকার যাতায়াতে সপ্তাহ বা মাসের জন্য ড্রাইভারসহ কার।' } },
  { v: 'car_plus', name: 'Premium with chauffeur', copy: 'Premium cars and experienced chauffeurs for important days.', bn: { name: 'শোফারসহ প্রিমিয়াম', copy: 'বিশেষ দিনের জন্য প্রিমিয়াম কার আর অভিজ্ঞ শোফার।' } },
  { v: 'hiace', name: 'Bus, micro and Hiace', copy: 'Group transport for tours, trips and team days.', bn: { name: 'বাস, মাইক্রো ও হায়েস', copy: 'ট্যুর, ভ্রমণ আর টিম ডের জন্য দলবেঁধে যাতায়াত।' } },
  { v: 'car_plus', name: 'Wedding car', copy: 'A car for the big day, booked ahead with a driver who is on time.', bn: { name: 'বিয়ের গাড়ি', copy: 'বড় দিনের গাড়ি, আগেই বুক করা, সময়মতো হাজির ড্রাইভারসহ।' } },
  { v: 'micro', name: 'Outstation', copy: 'Multi-day trips outside Dhaka, to Cox’s Bazar, Sylhet and beyond.', bn: { name: 'ঢাকার বাইরে', copy: 'কয়েক দিনের ট্রিপে কক্সবাজার, সিলেট বা আরও দূরে।' } },
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
  { v: 'car', label: 'Car', bn: 'কার' },
  { v: 'car_plus', label: 'Car Plus', bn: 'কার প্লাস' },
  { v: 'micro', label: 'Micro', bn: 'মাইক্রো' },
  { v: 'hiace', label: 'Hiace', bn: 'হায়েস' },
];
const PLANS = [
  { k: 'Hourly', opts: ['4 hours', '6 hours', '8 hours', '12 hours'], kBn: 'ঘণ্টা হিসেবে', optsBn: ['৪ ঘণ্টা', '৬ ঘণ্টা', '৮ ঘণ্টা', '১২ ঘণ্টা'] },
  { k: 'Weekly', opts: ['1 week', '2 weeks'], kBn: 'সাপ্তাহিক', optsBn: ['১ সপ্তাহ', '২ সপ্তাহ'] },
  { k: 'Monthly', opts: ['1 month', '3 months'], kBn: 'মাসিক', optsBn: ['১ মাস', '৩ মাস'] },
];
function RentalPlanner() {
  const { t, n, bn } = useT();
  const loc = bn ? 'bn-BD' : 'en-US';
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
          <p className={`text-[13px] ${muted}`}>{t('Plan a rental', 'রেন্টালের প্ল্যান করুন')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Build your request.', 'রিকোয়েস্ট সাজান।')}
            <br />
            <span className={muted}>{t('Drivers do the rest.', 'বাকিটা ড্রাইভারদের।')}</span>
          </h2>
          <div className="mt-10 space-y-6">
            <div>
              <p className={`text-[13px] ${muted}`}>{t('Vehicle', 'গাড়ি')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{R_VEH.map((x, k) => <button key={x.v} type="button" onClick={() => setV(k)} className={chip(k === v)}>{t(x.label, x.bn)}</button>)}</div>
            </div>
            <div>
              <p className={`text-[13px] ${muted}`}>{t('Plan', 'প্ল্যান')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{PLANS.map((x, k) => <button key={x.k} type="button" onClick={() => { setPlan(k); setOpt(0); }} className={chip(k === plan)}>{t(x.k, x.kBn)}</button>)}</div>
            </div>
            <div>
              <p className={`text-[13px] ${muted}`}>{t('How long', 'কত দিন')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{P.opts.map((x, k) => <button key={x} type="button" onClick={() => setOpt(k)} className={chip(k === o)}>{t(x, P.optsBn[k])}</button>)}</div>
            </div>
            <div>
              <p className={`text-[13px] ${muted}`}>{t('Starting', 'শুরু')}</p>
              <div className="mt-2 grid max-w-md grid-cols-7 gap-1">
                {days.map((d, k) => (
                  <button key={k} type="button" onClick={() => setDay(k)} className={`flex flex-col items-center rounded-xl py-2 transition-colors ${k === day ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-black/[.05] dark:hover:bg-white/[.07]'}`}>
                    <span className="text-[10px] opacity-60">{k === 0 ? t('Today', 'আজ') : d.toLocaleDateString(loc, { weekday: 'short' })}</span>
                    <span className="text-[15px] font-semibold tabular-nums">{n(d.getDate())}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* the request card the planner builds */}
        <motion.div {...fade(0.1)} className="lg:pt-20">
          <div className={`${card} p-6`}>
            <p className="text-[12px] text-black/45 dark:text-white/45">{t('Your rental request', 'আপনার রেন্টাল রিকোয়েস্ট')}</p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div key={`${v}-${plan}-${o}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease }} className="mt-2 flex items-center justify-between gap-4">
                <p className="text-[22px] font-semibold leading-tight tracking-tight">
                  {t(<>{R_VEH[v].label} with driver</>, <>ড্রাইভারসহ {R_VEH[v].bn}</>)}
                  <br />
                  <span className="text-black/50 dark:text-white/50">{t(P.opts[o], P.optsBn[o])}</span>
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/icons/${R_VEH[v].v}.webp`} alt="" className="h-16 w-24 object-contain" />
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 grid grid-cols-2 gap-2 text-[13px]">
              <div className="rounded-xl bg-black/[.04] px-3 py-2.5 dark:bg-white/[.06]">
                <p className="text-black/45 dark:text-white/45">{t('Plan', 'প্ল্যান')}</p>
                <p className="mt-0.5 font-medium">{t(P.k, P.kBn)}</p>
              </div>
              <div className="rounded-xl bg-black/[.04] px-3 py-2.5 dark:bg-white/[.06]">
                <p className="text-black/45 dark:text-white/45">{t('Starts', 'শুরু')}</p>
                <p className="mt-0.5 font-medium">{days[day] ? days[day].toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' }) : ' '}</p>
              </div>
            </div>
            <p className="mt-5 border-t border-black/[.07] pt-4 text-[13px] text-black/55 dark:border-white/[.07] dark:text-white/55">{t('Post this in the app and verified drivers send you their price. You choose who drives.', 'অ্যাপে পোস্ট করুন, যাচাই করা ড্রাইভাররা তাদের দাম পাঠাবেন। কে চালাবেন, ঠিক করবেন আপনি।')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
function MonthlyHire() {
  const { t } = useT();
  return (
    <section className={wrap}>
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_400px] lg:gap-20">
        <motion.div {...fade()}>
          <p className={`text-[13px] ${muted}`}>{t('Weekly and monthly', 'সাপ্তাহিক ও মাসিক')}</p>
          <h2 className={`mt-3 ${h2}`}>
            {t('Hire a driver', 'ড্রাইভার নিন')}
            <br />
            <span className={muted}>{t('for the whole month.', 'পুরো মাসের জন্য।')}</span>
          </h2>
          <p className={`mt-6 max-w-md text-[17px] leading-relaxed ${muted}`}>{t('For the daily commute or the school and office run: the same car and driver every day, with every trip logged so you always know it happened.', 'রোজকার অফিস বা স্কুলে আসা যাওয়ায় প্রতিদিন একই গাড়ি, একই ড্রাইভার। প্রতিটি ট্রিপের হিসাব থাকে, তাই সবসময় জানবেন কোনটা হলো।')}</p>
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
const RENTAL_FAQ_BN: [string, string][] = [
  ['ড্রাইভার কি সাথে থাকবে?', 'হ্যাঁ। কয়েক ঘণ্টা হোক বা পুরো মাস, আরোহনের প্রতিটি রেন্টালে থাকেন একজন যাচাই করা ড্রাইভার।'],
  ['দাম ঠিক হয় কীভাবে?', 'আপনি যা দরকার পোস্ট করেন, ড্রাইভাররা তাদের দাম পাঠান। দাম নির্ভর করে গাড়ি, কতক্ষণ লাগবে আর কতদূর যাবেন তার ওপর, আর পছন্দের দরটা বেছে নেন আপনি।'],
  ['এক দিনের বেশি ভাড়া নেওয়া যাবে?', 'হ্যাঁ। নিয়মিত যাতায়াতে সাপ্তাহিক বা মাসিক ভাড়া নিন, কিংবা কক্সবাজার বা সিলেটের মতো জায়গায় কয়েক দিনের ট্রিপ বুক করুন।'],
  ['কোন কোন গাড়ি ভাড়া নেওয়া যায়?', 'কার, শোফারসহ প্রিমিয়াম কার, দলের জন্য মাইক্রো, হায়েস আর বাস, সাথে বিয়ের গাড়িও।'],
];

export function RentalPage() {
  const { t, n, bn } = useT();
  return (
    <>
      <Hero label={t('Rental', 'রেন্টাল')} title={t('A car and a driver.', 'গাড়ি আর ড্রাইভার।')} rest={t('For as long as you need.', 'যতদিন দরকার।')} copy={t('By the hour, the week or the month. Post what you need, drivers send you their price, and you choose who drives.', 'ঘণ্টা, সপ্তাহ বা মাস হিসেবে। কী দরকার পোস্ট করুন, ড্রাইভাররা দাম পাঠাবেন, আর কে চালাবেন ঠিক করবেন আপনি।')}>
        <BidBoard />
      </Hero>
      <section className={wrap}>
        <Head label={t('Ways to rent', 'ভাড়ার ধরন')} title={t('Every kind of rental,', 'সব ধরনের রেন্টাল,')} rest={t('always with a driver.', 'সবসময় ড্রাইভারসহ।')} />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RENTALS.map((r, i) => (
            <motion.div key={r.name} {...fade(i * 0.05)} className={`${panel} group p-6`}>
              <RentalArt v={r.v} />
              <p className="mt-4 text-[16px] font-medium">{t(r.name, r.bn.name)}</p>
              <p className={`mt-1.5 text-[14px] leading-relaxed ${muted}`}>{t(r.copy, r.bn.copy)}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={wrap}>
        <Head label={t('How it works', 'যেভাবে কাজ করে')} title={t('You set the plan.', 'প্ল্যান আপনার।')} rest={t('Drivers bid.', 'দর দেবেন ড্রাইভাররা।')} />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {(bn ? [
            ['রিকোয়েস্ট পোস্ট করুন', 'গাড়ি, তারিখ আর কতক্ষণ লাগবে বেছে নিন।'],
            ['ড্রাইভারদের দর পান', 'যাচাই করা ড্রাইভাররা আপনার ট্রিপের দাম পাঠাবেন।'],
            ['বেছে নিন, রওনা দিন', 'পছন্দের দরটা বেছে নিলেই রেন্টাল কনফার্ম।'],
          ] : [
            ['Post your request', 'Choose the vehicle, the date and how long you need it.'],
            ['Get driver bids', 'Verified drivers send their price for your trip.'],
            ['Pick and go', 'Choose the bid you like and your rental is confirmed.'],
          ]).map(([t, c], i) => (
            <motion.div key={t} {...fade(i * 0.1)}>
              <p className={`font-mono text-[11px] ${muted}`}>{n(0)}{n(i + 1)}</p>
              <p className="mt-2 text-[20px] font-medium tracking-tight">{t}</p>
              <p className={`mt-2 max-w-[300px] text-[15px] leading-relaxed ${muted}`}>{c}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <MonthlyHire />
      <RentalPlanner />
      <Faq title={t('Rental questions,', 'রেন্টাল নিয়ে প্রশ্ন,')} rest={t('answered.', 'উত্তর এখানে।')} items={bn ? RENTAL_FAQ_BN : RENTAL_FAQ} />
      <Close title={t('Need a car', 'গাড়ি লাগবে,')} rest={t('and a driver?', 'সাথে ড্রাইভার?')} />
    </>
  );
}


/* ═════════════ shared: request card with bids arriving (rental, ambulance and airport all work by bidding) ═════════════ */
type Bid = { name: string; rating: string; price: number; note: string; bn: { name: string; note: string } };
function RequestBids({ eyebrow, from, to, chips, bids, waiting, done }: { eyebrow: string; from: string; to: string; chips: string[]; bids: Bid[]; waiting: string; done: (b: Bid) => string }) {
  const { t, n } = useT();
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
      <p className="mt-5 text-[12px] text-black/45 dark:text-white/45">{shown ? t(`${shown} ${shown === 1 ? 'offer' : 'offers'}`, `${n(shown)}টি অফার`) : waiting}</p>
      <ul className="mt-2 min-h-[198px] space-y-2">
        <AnimatePresence>
          {bids.slice(0, shown).map((b, k) => (
            <motion.li key={b.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
              <button type="button" onClick={() => setPick(k)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${pick === k ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.05] dark:bg-white/[.04]'}`}>
                <img src={avatar(b.name)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{t(b.name, b.bn.name)}</span>
                  <span className="flex items-center gap-1 text-[12px] text-black/50 dark:text-white/50"><Star size={10} weight="fill" className="text-[#FF9500]" />{n(b.rating)}, {t(b.note, b.bn.note)}</span>
                </span>
                <span className="text-[16px] font-semibold tabular-nums">৳{n(b.price.toLocaleString('en-US'))}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-2 text-center text-[12px] text-black/45 dark:text-white/40">{pick === null ? t('Tap an offer to choose', 'বেছে নিতে একটি অফারে ট্যাপ করুন') : done(bids[pick])}</p>
    </div>
  );
}

/* ═════════════ AMBULANCE ═════════════ */
// from Arohon-customer: hospitals tab (src/constants/hospitals.ts), needs (SearchScreen AMBULANCE_NEEDS), bidding, now or scheduled, 999 line
const HOSPITALS = ['Dhaka Medical College Hospital', 'United Hospital', 'Labaid Specialized', 'Ibn Sina Hospital', 'Shaheed Suhrawardy', 'Bangladesh Specialized', 'Uttara Adhunik', 'Evercare Hospital', 'Square Hospital', 'Popular Medical College', 'Kurmitola General', 'National Heart Foundation'];
const HOSPITALS_BN = ['ঢাকা মেডিকেল কলেজ হাসপাতাল', 'ইউনাইটেড হাসপাতাল', 'ল্যাবএইড স্পেশালাইজড', 'ইবনে সিনা হাসপাতাল', 'শহীদ সোহরাওয়ার্দী', 'বাংলাদেশ স্পেশালাইজড', 'উত্তরা আধুনিক', 'এভারকেয়ার হাসপাতাল', 'স্কয়ার হাসপাতাল', 'পপুলার মেডিকেল কলেজ', 'কুর্মিটোলা জেনারেল', 'ন্যাশনাল হার্ট ফাউন্ডেশন'];
const NEEDS = [
  { k: 'Stretcher', copy: 'For a patient who can’t sit or walk.', bn: { k: 'স্ট্রেচার', copy: 'যে রোগী বসতে বা হাঁটতে পারছেন না।' } },
  { k: 'Oxygen', copy: 'Oxygen support on the way to the hospital.', bn: { k: 'অক্সিজেন', copy: 'হাসপাতালে যাওয়ার পথে অক্সিজেন সাপোর্ট।' } },
  { k: 'Wheelchair', copy: 'Help getting from the door to the ambulance.', bn: { k: 'হুইলচেয়ার', copy: 'দরজা থেকে অ্যাম্বুলেন্স পর্যন্ত সাহায্য।' } },
  { k: 'Companion', copy: 'A family member rides along with the patient.', bn: { k: 'সঙ্গী', copy: 'রোগীর সাথে পরিবারের একজন যাবেন।' } },
];
function NeedsPicker() {
  const { t } = useT();
  const [on, setOn] = useState<string[]>(['Stretcher']);
  const toggle = (k: string) => setOn((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]));
  return (
    <div className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{t('Anything the crew should know?', 'ক্রুদের কিছু জানানো দরকার?')}</p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {NEEDS.map((n) => {
          const sel = on.includes(n.k);
          return (
            <button key={n.k} type="button" onClick={() => toggle(n.k)} className={`rounded-xl p-4 text-left transition-all ${sel ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] hover:bg-black/[.05] dark:bg-white/[.04]'}`}>
              <span className="flex items-center justify-between text-[15px] font-medium">{t(n.k, n.bn.k)}{sel && <Check size={15} weight="bold" className="text-brand-green" />}</span>
              <span className={`mt-1 block text-[12px] leading-relaxed ${muted}`}>{t(n.copy, n.bn.copy)}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={on.join()} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 border-t border-black/10 pt-4 text-[14px] dark:border-white/10">
          {on.length ? t(<>Sent with your request: <span className="font-medium">{on.join(', ')}</span></>, <>রিকোয়েস্টের সাথে যাবে: <span className="font-medium">{on.map((k) => NEEDS.find((x) => x.k === k)!.bn.k).join(', ')}</span></>) : <span className={muted}>{t('Nothing extra, that’s fine too.', 'বাড়তি কিছু নেই, তাও ঠিক আছে।')}</span>}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
function HospitalList() {
  const { t } = useT();
  const { ref, i } = useLoop(HOSPITALS.length, 1100);
  return (
    <div ref={ref} className="mt-14 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {HOSPITALS.map((h, k) => (
        <div key={h} className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-[14px] transition-colors duration-500 ${k === i ? 'bg-black/[.05] dark:bg-white/[.07]' : ''}`}>
          <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-500 ${k === i ? 'bg-[#FF3B30] text-white' : 'bg-black/[.05] text-black/40 dark:bg-white/[.07] dark:text-white/40'}`}>+</span>
          {t(h, HOSPITALS_BN[k])}
        </div>
      ))}
    </div>
  );
}
export function AmbulancePage() {
  const { t } = useT();
  return (
    <>
      <Hero label={t('Ambulance', 'অ্যাম্বুলেন্স')} title={t('When someone is sick,', 'কেউ অসুস্থ হলে,')} rest={t('help is on the way.', 'সাহায্য আসছে।')} copy={t('Book an ambulance from the same app you ride with, any hour. Pick the hospital, tell the crew what the patient needs, and nearby ambulances send you offers.', 'যে অ্যাপে রাইড নেন, সেখান থেকেই যেকোনো সময় অ্যাম্বুলেন্স বুক করুন। হাসপাতাল বেছে নিন, রোগীর কী লাগবে ক্রুকে জানান, আর কাছের অ্যাম্বুলেন্সগুলো অফার পাঠাবে।')}>
        <RequestBids
          eyebrow={t('Ambulance request, sample', 'অ্যাম্বুলেন্স রিকোয়েস্ট, নমুনা')}
          from={t('Your location, Dhanmondi', 'আপনার লোকেশন, ধানমন্ডি')}
          to={t('Square Hospital, Panthapath', 'স্কয়ার হাসপাতাল, পান্থপথ')}
          chips={t(['Pickup now', 'Stretcher', 'Oxygen'], ['এখনই পিকআপ', 'স্ট্রেচার', 'অক্সিজেন'])}
          waiting={t('Ambulances near you can see your request…', 'কাছের অ্যাম্বুলেন্সগুলো আপনার রিকোয়েস্ট দেখছে…')}
          bids={[
            { name: 'Mizan', rating: '4.9', price: 1200, note: '6 min away', bn: { name: 'মিজান', note: '৬ মিনিট দূরে' } },
            { name: 'Habib', rating: '4.8', price: 1100, note: '9 min away', bn: { name: 'হাবিব', note: '৯ মিনিট দূরে' } },
            { name: 'Rafiq', rating: '5.0', price: 1350, note: '4 min away', bn: { name: 'রফিক', note: '৪ মিনিট দূরে' } },
          ]}
          done={(b) => t(`${b.name} is on the way`, `${b.bn.name} রওনা হয়েছেন`)}
        />
      </Hero>
      <section className="mx-auto max-w-[1280px] px-6 md:px-16">
        <motion.div {...fade()} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FF3B30]/30 bg-[#FF3B30]/[.06] px-6 py-5">
          <p className="text-[15px]"><span className="font-semibold text-[#FF3B30]">{t('Life threatening?', 'জীবন ঝুঁকিতে?')}</span> {t('Call 999 now, then book your ambulance here.', 'এখনই ৯৯৯ এ কল করুন, তারপর এখানে অ্যাম্বুলেন্স বুক করুন।')}</p>
          <a href="tel:999" className="rounded-full bg-[#FF3B30] px-5 py-2.5 text-[14px] font-semibold text-white max-sm:w-full max-sm:text-center">{t('Call 999', '৯৯৯ এ কল করুন')}</a>
        </motion.div>
      </section>
      <section className={wrap}>
        <Head label={t('How it works', 'যেভাবে কাজ করে')} title={t('Three taps', 'তিন ট্যাপেই')} rest={t('to an ambulance.', 'অ্যাম্বুলেন্স।')} />
        <Grid
          items={[
            { icon: Package, title: t('Pick the hospital', 'হাসপাতাল বেছে নিন'), copy: t('Choose from the hospitals list, sorted nearest first, or search any place.', 'কাছের হাসপাতাল আগে, এমন তালিকা থেকে বেছে নিন, বা যেকোনো জায়গা খুঁজুন।') },
            { icon: Check, title: t('Tell the crew', 'ক্রুকে জানান'), copy: t('Add a stretcher, oxygen, a wheelchair or a companion so they arrive prepared.', 'স্ট্রেচার, অক্সিজেন, হুইলচেয়ার বা সঙ্গী যোগ করুন, যাতে তারা তৈরি হয়ে আসে।') },
            { icon: Clock, title: t('Now or scheduled', 'এখনই বা পরে'), copy: t('Book for right now, or schedule a pickup for a hospital visit later.', 'এখনই বুক করুন, বা পরের হাসপাতাল ভিজিটের জন্য পিকআপ শিডিউল করুন।') },
            { icon: Star, title: t('Choose an offer', 'অফার বেছে নিন'), copy: t('Nearby ambulances send their price. Pick the one that suits you.', 'কাছের অ্যাম্বুলেন্সগুলো দাম পাঠায়। যেটা সুবিধা, সেটা নিন।') },
            { icon: Phone, title: t('Pay in cash', 'ক্যাশে পেমেন্ট'), copy: t('Pay the agreed price in cash to the crew at the end of the trip.', 'ট্রিপ শেষে ঠিক করা দাম ক্যাশে ক্রুকে দিন।') },
            { icon: User, title: t('Someone can ride along', 'সাথে কেউ যেতে পারবেন'), copy: t('A family member can travel with the patient.', 'রোগীর সাথে পরিবারের একজন যেতে পারবেন।') },
          ]}
        />
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Head label={t('Prepared crew', 'তৈরি ক্রু')} title={t('They’ll know', 'পৌঁছানোর আগেই')} rest={t('before they arrive.', 'সব জেনে যাবে।')} />
          <NeedsPicker />
        </div>
      </section>
      <section className={wrap}>
        <Head label={t('Hospitals', 'হাসপাতাল')} title={t('Dhaka’s hospitals,', 'ঢাকার হাসপাতাল,')} rest={t('one tap away.', 'এক ট্যাপেই।')} copy={t('The app suggests hospitals nearest to you first. These are some of the hospitals in the list.', 'অ্যাপ আগে আপনার কাছের হাসপাতালগুলো দেখায়। তালিকার কয়েকটি হাসপাতাল এখানে।')} />
        <HospitalList />
      </section>
      <Close title={t('Hope you never need it.', 'আশা করি কখনো লাগবে না।')} rest={t('It’s here if you do.', 'লাগলে আছে পাশেই।')} />
    </>
  );
}

/* ═════════════ AIRPORT ═════════════ */
// from Arohon-customer: src/constants/airports.ts (8 airports), rental "airport" request form + driver bids, 24 to 48h advice
const AIRPORTS = [
  { code: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka', bn: { name: 'হযরত শাহজালাল আন্তর্জাতিক', city: 'ঢাকা' } },
  { code: 'CGP', name: 'Shah Amanat International', city: 'Chattogram', bn: { name: 'শাহ আমানত আন্তর্জাতিক', city: 'চট্টগ্রাম' } },
  { code: 'ZYL', name: 'Osmani International', city: 'Sylhet', bn: { name: 'ওসমানী আন্তর্জাতিক', city: 'সিলেট' } },
  { code: 'CXB', name: 'Cox’s Bazar Airport', city: 'Cox’s Bazar', bn: { name: 'কক্সবাজার বিমানবন্দর', city: 'কক্সবাজার' } },
  { code: 'JSR', name: 'Jashore Airport', city: 'Jashore', bn: { name: 'যশোর বিমানবন্দর', city: 'যশোর' } },
  { code: 'RJH', name: 'Shah Makhdum Airport', city: 'Rajshahi', bn: { name: 'শাহ মখদুম বিমানবন্দর', city: 'রাজশাহী' } },
  { code: 'SPD', name: 'Saidpur Airport', city: 'Saidpur', bn: { name: 'সৈয়দপুর বিমানবন্দর', city: 'সৈয়দপুর' } },
  { code: 'BZL', name: 'Barishal Airport', city: 'Barishal', bn: { name: 'বরিশাল বিমানবন্দর', city: 'বরিশাল' } },
];
function AirportGrid() {
  const { t } = useT();
  const { ref, i } = useLoop(AIRPORTS.length, 1400);
  return (
    <div ref={ref} className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {AIRPORTS.map((a, k) => (
        <motion.div key={a.code} {...fade(k * 0.04)} className={`${panel} p-5 transition-colors duration-500 ${k === i ? '!border-black/30 dark:!border-white/30' : ''}`}>
          <p className="font-mono text-[28px] font-semibold tracking-[0.12em]">{a.code}</p>
          <p className="mt-3 text-[14px] font-medium">{t(a.city, a.bn.city)}</p>
          <p className={`text-[12px] ${muted}`}>{t(a.name, a.bn.name)}</p>
        </motion.div>
      ))}
    </div>
  );
}
export function AirportPage() {
  const { t, n, bn } = useT();
  return (
    <>
      <Hero label={t('Airport rides', 'এয়ারপোর্ট রাইড')} title={t('Never miss a flight.', 'ফ্লাইট আর মিস নয়।')} rest={t('Never wait at arrivals.', 'অ্যারাইভালে অপেক্ষাও নয়।')} copy={t('Book your airport ride ahead. Tell us when and where, drivers send their offers, and your ride is confirmed before you set off.', 'এয়ারপোর্ট রাইড আগেই বুক করুন। কখন আর কোথায় জানান, ড্রাইভাররা অফার পাঠাবেন, আর বের হওয়ার আগেই রাইড কনফার্ম।')}>
        <RequestBids
          eyebrow={t('Airport ride request, sample', 'এয়ারপোর্ট রাইড রিকোয়েস্ট, নমুনা')}
          from={t('Gulshan 2, Dhaka', 'গুলশান ২, ঢাকা')}
          to={t('DAC, Hazrat Shahjalal', 'DAC, হযরত শাহজালাল')}
          chips={t(['Sat, 5:30 AM', '3 passengers', 'Car Plus'], ['শনি, ভোর ৫:৩০', '৩ জন যাত্রী', 'কার প্লাস'])}
          waiting={t('Drivers can see your request…', 'ড্রাইভাররা আপনার রিকোয়েস্ট দেখছেন…')}
          bids={[
            { name: 'Sohel', rating: '4.9', price: 950, note: 'Toyota Premio', bn: { name: 'সোহেল', note: 'টয়োটা প্রিমিও' } },
            { name: 'Kamal', rating: '4.8', price: 880, note: 'Toyota Axio', bn: { name: 'কামাল', note: 'টয়োটা এক্সিও' } },
            { name: 'Faruk', rating: '5.0', price: 1000, note: 'Toyota Allion', bn: { name: 'ফারুক', note: 'টয়োটা অ্যালিয়ন' } },
          ]}
          done={(b) => t(`${b.name} confirmed for Saturday 5:30 AM`, `শনিবার ভোর ৫:৩০ এর জন্য ${b.bn.name} কনফার্ম`)}
        />
      </Hero>
      <section className={wrap}>
        <Head label={t('Airports', 'এয়ারপোর্ট')} title={t('Eight airports,', 'আটটি এয়ারপোর্ট,')} rest={t('one app.', 'একটাই অ্যাপ।')} copy={t('Rides to and from every major airport in Bangladesh, for the flight out and the flight home.', 'বাংলাদেশের সব বড় এয়ারপোর্টে আসা যাওয়ার রাইড, যাওয়ার ফ্লাইটে আর ফেরার ফ্লাইটেও।')} />
        <AirportGrid />
      </section>
      <section className={wrap}>
        <Head label={t('How it works', 'যেভাবে কাজ করে')} title={t('Book ahead.', 'আগেই বুক করুন।')} rest={t('Relax on the day.', 'সেদিন নিশ্চিন্ত থাকুন।')} />
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {(bn ? [
            ['রিকোয়েস্ট পাঠান', 'পিকআপ, ড্রপ, তারিখ আর সময়, কতজন আর কোন গাড়ি। চাইলে বাজেটও দিন।'],
            ['অফার পান', 'ড্রাইভাররা আপনার ট্রিপের দাম পাঠাবেন, পছন্দেরটা বেছে নিন।'],
            ['রাইড কনফার্ম', 'দিনের আগেই ড্রাইভার ঠিক। ফ্লাইটের জন্য ২৪ থেকে ৪৮ ঘণ্টা আগে বুক করার পরামর্শ দিই।'],
          ] : [
            ['Send your request', 'Pickup, drop, date and time, how many people and which vehicle. Add a budget if you like.'],
            ['Get offers', 'Drivers send their price for your trip, and you choose the one you like.'],
            ['Your ride is confirmed', 'Your driver is set before the day. For flights we suggest booking 24 to 48 hours ahead.'],
          ]).map(([t, c], i) => (
            <motion.div key={t} {...fade(i * 0.1)}>
              <p className={`font-mono text-[11px] ${muted}`}>{n(0)}{n(i + 1)}</p>
              <p className="mt-2 text-[20px] font-medium tracking-tight">{t}</p>
              <p className={`mt-2 max-w-[300px] text-[15px] leading-relaxed ${muted}`}>{c}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <Close title={t('Next flight booked?', 'পরের ফ্লাইট বুক করেছেন?')} rest={t('Book the ride too.', 'রাইডটাও বুক করে ফেলুন।')} />
    </>
  );
}

/* ═════════════ PAYMENTS ═════════════ */
// matches the app: rides are cash only; coupons and promo codes apply automatically; food orders also take bKash, Nagad and card
const LINE_BN: Record<string, string> = { 'Ride fare': 'রাইড ভাড়া', 'Reward coupon, 20% off': 'রিওয়ার্ড কুপন, ২০% ছাড়' };
function CashReceipt() {
  const { t, n } = useT();
  const { ref, i } = useLoop(6, 900);
  const lines: [string, number, boolean?][] = [['Ride fare', 300], ['Reward coupon, 20% off', -60, true]];
  const shown = Math.min(i + 1, lines.length); // fare is always there, the coupon lands next
  const total = lines.slice(0, shown).reduce((a, l) => a + l[1], 0);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <p className="text-[12px] text-black/45 dark:text-white/45">{t('Trip complete, sample', 'ট্রিপ শেষ, নমুনা')}</p>
      <p className="mt-1 text-[17px] font-semibold">{t('Banani to Dhanmondi 27', 'বনানী থেকে ধানমন্ডি ২৭')}</p>
      <ul className="mt-5 min-h-[56px] space-y-2 text-[14px]">
        {lines.slice(0, shown).map(([k, v, g]) => (
          <motion.li key={k} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`flex justify-between ${g ? 'text-[#079A70] dark:text-[#0ABF8B]' : ''}`}>
            <span className={g ? '' : 'text-black/55 dark:text-white/55'}>{t(k, LINE_BN[k])}</span>
            <span className="tabular-nums">{n(v < 0 ? `−৳${-v}` : `৳${v}`)}</span>
          </motion.li>
        ))}
      </ul>
      <div className="mt-4 flex items-end justify-between border-t border-black/[.07] pt-4 dark:border-white/[.07]">
        <span className="text-[14px] font-semibold">{t('Pay in cash', 'ক্যাশে দিন')}</span>
        <motion.span key={total} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-[30px] font-semibold tabular-nums tracking-tight">৳{n(total)}</motion.span>
      </div>
      <p className="mt-2 text-[12px] text-black/45 dark:text-white/45">{t('Hand it to your driver when you arrive.', 'পৌঁছে ড্রাইভারের হাতে দিন।')}</p>
    </div>
  );
}
function PromoTry() {
  const { t } = useT();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<null | { ok: boolean; t: string }>(null);
  const apply = () => {
    const c = code.trim().toUpperCase();
    // demo only: shows the app's real messages, nothing is redeemed here
    setMsg(!c ? null : c === 'AROHON20' ? { ok: true, t: t('Applied. The discount comes off your matching rides automatically.', 'যোগ হয়েছে। মিলে যাওয়া রাইডে ছাড় নিজে থেকেই কেটে যাবে।') } : c === 'EXPIRED' ? { ok: false, t: t('This promo code has expired', 'এই প্রোমো কোডের মেয়াদ শেষ') } : { ok: false, t: t('Invalid promo code', 'প্রোমো কোডটি সঠিক নয়') });
  };
  return (
    <div className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{t('Try it, sample code AROHON20', 'চেষ্টা করুন, নমুনা কোড AROHON20')}</p>
      <div className="mt-4 flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && apply()} placeholder={t('Promo code', 'প্রোমো কোড')} aria-label={t('Promo code', 'প্রোমো কোড')} className="min-w-0 flex-1 rounded-xl bg-black/[.05] px-4 py-3 font-mono text-[14px] uppercase tracking-wider outline-none ring-black/20 focus:ring-2 dark:bg-white/[.07] dark:ring-white/30" />
        <button type="button" onClick={apply} className="rounded-xl bg-black px-5 text-[14px] font-semibold text-white dark:bg-white dark:text-black">{t('Apply', 'যোগ করুন')}</button>
      </div>
      <AnimatePresence mode="wait">
        {msg && (
          <motion.p key={msg.t} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mt-4 flex items-center gap-2 text-[14px] ${msg.ok ? 'text-[#079A70] dark:text-[#0ABF8B]' : 'text-[#FF3B30]'}`}>
            {msg.ok ? <Check size={16} weight="bold" /> : <span className="font-bold">×</span>} {msg.t}
          </motion.p>
        )}
      </AnimatePresence>
      <p className={`mt-4 text-[12px] ${muted}`}>{t('In the app, a code is used up once the ride it applies to is completed.', 'অ্যাপে, যে রাইডে কোড লাগে সেটি শেষ হলেই কোডটি ব্যবহার হয়ে যায়।')}</p>
    </div>
  );
}
export function PaymentsPage() {
  const { t, href } = useT();
  return (
    <>
      <Hero label={t('Payments', 'পেমেন্ট')} title={t('Pay in cash.', 'ক্যাশে পেমেন্ট।')} rest={t('Save with points.', 'পয়েন্টে সাশ্রয়।')} copy={t('Every ride is paid in cash to your driver at the end of the trip, at the fare you saw when you booked. Coupons and promo codes come off automatically.', 'প্রতিটি রাইডের ভাড়া ট্রিপ শেষে ক্যাশে ড্রাইভারকে দেন, বুকিংয়ের সময় যে ভাড়া দেখেছেন ঠিক সেটাই। কুপন আর প্রোমো কোডের ছাড় নিজে থেকেই কাটে।')}>
        <CashReceipt />
      </Hero>
      <PayYourWay />
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <Head label={t('Promo codes', 'প্রোমো কোড')} title={t('Got a code?', 'কোড আছে?')} rest={t('It applies itself.', 'নিজে থেকেই লেগে যাবে।')} />
          <PromoTry />
        </div>
      </section>
      <section className={wrap}>
        <Head label={t('Rewards', 'রিওয়ার্ড')} title={t('Every trip', 'প্রতিটি ট্রিপে')} rest={t('earns you points.', 'পয়েন্ট জমে।')} copy={t('Each completed ride and delivered parcel earns a point. Turn points into coupons of up to 50% off, applied to your next eligible ride.', 'প্রতিটি শেষ হওয়া রাইড আর ডেলিভারি হওয়া পার্সেলে এক পয়েন্ট। পয়েন্ট দিয়ে নিন ৫০% পর্যন্ত ছাড়ের কুপন, যা লাগবে আপনার পরের যোগ্য রাইডে।')} />
        <motion.div {...fade(0.1)} className="mt-10">
          <Link href={href('/#rewards')} className="inline-flex items-center gap-1.5 text-[14px] font-medium">{t('See how rewards work', 'রিওয়ার্ড কীভাবে কাজ করে দেখুন')} <ArrowRight size={13} /></Link>
        </motion.div>
      </section>
      <Close title={t('Simple fares,', 'সহজ ভাড়া,')} rest={t('simple payment.', 'সহজ পেমেন্ট।')} />
    </>
  );
}


/* ═════════════ SAFETY ═════════════ */
// what a family member sees on a shared trip: the car moves along the route, then "arrived safely"
function SharedTrip() {
  const { t, n } = useT();
  const { ref, i } = useLoop(9, 1100);
  const pct = Math.min(i, 7) / 7;
  const arrived = i >= 7;
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center gap-3">
        <img src={avatar('Nadia')} alt="" className="h-10 w-10 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
        <div className="flex-1">
          <p className="text-[12px] text-black/45 dark:text-white/45">{t('Nadia shared her trip with you', 'নাদিয়া আপনার সাথে ট্রিপ শেয়ার করেছেন')}</p>
          <div className="relative h-[22px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={arrived ? 'a' : 'm'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }} className="absolute inset-0 text-[16px] font-semibold">
                {arrived ? t('Arrived safely', 'নিরাপদে পৌঁছেছেন') : t(`${Math.max(1, 14 - Math.round(pct * 14))} min to Uttara`, `উত্তরা আর ${n(Math.max(1, 14 - Math.round(pct * 14)))} মিনিট`)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${arrived ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black/[.05] dark:bg-white/[.08]'}`}>{arrived ? t('Done', 'শেষ') : t('Live', 'লাইভ')}</span>
      </div>
      <div className="mt-6 flex gap-3">
        <RouteMarkers pad="py-[3px]" />
        <div className="flex-1 space-y-3 text-[14px]">
          <p className="leading-[22px]">{t('Dhanmondi 27', 'ধানমন্ডি ২৭')}</p>
          <p className="leading-[22px]">{t('Sector 7, Uttara', 'সেক্টর ৭, উত্তরা')}</p>
        </div>
      </div>
      <div className="relative mt-6 h-1.5 rounded-full bg-black/[.06] dark:bg-white/10">
        <div className="h-full rounded-full bg-black transition-[width] duration-1000 ease-out dark:bg-white" style={{ width: `${pct * 100}%` }} />
        <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow transition-[left] duration-1000 ease-out dark:border-[#1C1C1E] dark:bg-white" style={{ left: `${pct * 100}%` }} />
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-black/[.07] pt-4 text-[13px] dark:border-white/[.07]">
        <img src={avatar('Karim')} alt="" className="h-8 w-8 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
        <span className="flex-1"><span className="font-semibold">{t('Karim', 'করিম')}</span> <span className="text-black/50 dark:text-white/50">{t('Toyota Axio, DHAKA METRO GA 31 4417', 'টয়োটা এক্সিও, ঢাকা মেট্রো গ ৩১ ৪৪১৭')}</span></span>
        <span className="flex items-center gap-1 text-black/60 dark:text-white/60"><Star size={11} weight="fill" className="text-[#FF9500]" />{n('4.9')}</span>
      </div>
    </div>
  );
}

const DOCS = ['National ID', 'Driving licence', 'Vehicle registration', 'Fitness certificate', 'Tax token', 'Profile selfie'];
const DOCS_BN = ['জাতীয় পরিচয়পত্র', 'ড্রাইভিং লাইসেন্স', 'গাড়ির রেজিস্ট্রেশন', 'ফিটনেস সার্টিফিকেট', 'ট্যাক্স টোকেন', 'প্রোফাইল সেলফি'];
function DriverCheck() {
  const { t } = useT();
  const { ref, i } = useLoop(DOCS.length + 3, 700);
  const done = Math.min(i, DOCS.length);
  const ok = i > DOCS.length;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <div className="flex items-center justify-between">
        <p className={`text-[13px] ${muted}`}>{t('Driver application, sample', 'ড্রাইভারের আবেদন, নমুনা')}</p>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${ok ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black/[.05] text-black/60 dark:bg-white/[.08] dark:text-white/60'}`}>{ok ? t('Approved to drive', 'চালানোর অনুমতি পেয়েছেন') : t('In review', 'যাচাই চলছে')}</span>
      </div>
      <ul className="mt-5 divide-y divide-black/[.06] dark:divide-white/[.06]">
        {DOCS.map((d, k) => (
          <li key={d} className="flex items-center justify-between py-3 text-[15px]">
            {t(d, DOCS_BN[k])}
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
const SOS_TO_BN = ['আপনার জরুরি কন্টাক্টকে জানানো হচ্ছে', 'আরোহন সেফটি টিমকে জানানো হচ্ছে', 'আপনার লাইভ লোকেশন শেয়ার হচ্ছে'];
function SosDemo() {
  const { t: tr } = useT();
  const { ref, i } = useLoop(10, 600);
  const [held, setHeld] = useState(false);
  const auto = i >= 2 && i < 5 ? 'hold' : i >= 5 ? 'sent' : 'idle';
  const state = held ? 'hold' : auto;
  return (
    <div ref={ref} className={`${panel} flex flex-col items-center p-8 text-center`}>
      <button
        type="button"
        aria-label={tr('Hold for SOS', 'SOS এর জন্য চেপে ধরুন')}
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
      <p className={`mt-6 text-[13px] ${muted}`}>{state === 'sent' ? tr('Help is on the way', 'সাহায্য আসছে') : state === 'hold' ? tr('Keep holding…', 'চেপে ধরে রাখুন…') : tr('Press and hold for SOS', 'SOS পাঠাতে চেপে ধরুন')}</p>
      <ul className="mt-5 w-full max-w-[280px] space-y-2 text-left">
        {SOS_TO.map((t, k) => (
          <li key={t} className={`flex items-center gap-3 rounded-xl bg-black/[.03] px-4 py-3 text-[14px] transition-all duration-500 dark:bg-white/[.04] ${state === 'sent' ? 'opacity-100' : 'opacity-40'}`} style={{ transitionDelay: state === 'sent' ? `${k * 0.15}s` : '0s' }}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-500 ${state === 'sent' ? 'bg-[#FF3B30] text-white' : 'bg-black/[.06] dark:bg-white/10'}`} style={{ transitionDelay: state === 'sent' ? `${k * 0.15}s` : '0s' }}>
              {state === 'sent' && <Check size={11} weight="bold" />}
            </span>
            {tr(t, SOS_TO_BN[k])}
          </li>
        ))}
      </ul>
    </div>
  );
}

const REPORT = ['Driver behaviour', 'Vehicle', 'Payment', 'Safety concern', 'Route', 'Other'];
const REPORT_BN = ['ড্রাইভারের আচরণ', 'গাড়ি', 'পেমেন্ট', 'নিরাপত্তা', 'রুট', 'অন্যান্য'];
function AfterRide() {
  const { t } = useT();
  const { ref, i } = useLoop(10, 650);
  const stars = Math.min(i, 5);
  const pick = i >= 6 ? 3 : -1;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <p className={`text-[13px] ${muted}`}>{t('How was your ride with Karim?', 'করিমের সাথে রাইড কেমন ছিল?')}</p>
      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((k) => (
          <Star key={k} size={30} weight="fill" className={`transition-all duration-300 ${k < stars ? 'scale-100 text-[#FF9500]' : 'scale-90 text-black/10 dark:text-white/10'}`} />
        ))}
      </div>
      <p className="mt-7 border-t border-black/10 pt-6 text-[14px] font-medium dark:border-white/10">{t('Something not right? Report it.', 'কিছু ঠিক মনে হয়নি? জানান আমাদের।')}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {REPORT.map((r, k) => (
          <span key={r} className={`rounded-full px-3 py-1.5 text-[13px] transition-all duration-300 ${k === pick ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/[.05] dark:bg-white/[.07]'}`}>{t(r, REPORT_BN[k])}</span>
        ))}
      </div>
      <p className={`mt-4 h-5 text-[13px] transition-opacity duration-500 ${pick >= 0 ? 'opacity-100' : 'opacity-0'} ${muted}`}>{t('Sent to our support team, we’ll get back to you.', 'সাপোর্ট টিমের কাছে পাঠানো হয়েছে, আমরা শিগগির যোগাযোগ করব।')}</p>
    </div>
  );
}

export function SafetyPage() {
  const { t, n, href } = useT();
  return (
    <>
      <Hero label={t('Safety', 'নিরাপত্তা')} title={t('Safe from pickup', 'পিকআপ থেকে')} rest={t('to drop off.', 'ড্রপ অফ পর্যন্ত নিরাপদ।')} copy={t('Checked drivers, trips your family can follow, and help one tap away. Safety is built into every Arohon ride, for riders and for drivers.', 'যাচাই করা ড্রাইভার, পরিবার লাইভ দেখতে পারে আপনার ট্রিপ, আর সাহায্য মাত্র এক ট্যাপে। আরোহনের প্রতিটি রাইডে নিরাপত্তা আছে, যাত্রী আর ড্রাইভার দুজনের জন্যই।')}>
        <SharedTrip />
      </Hero>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <Head label={t('Before you ride', 'রাইডের আগে')} title={t('Every driver,', 'প্রতিটি ড্রাইভার')} rest={t('checked by people.', 'মানুষের হাতে যাচাই করা।')} />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>{t('Nobody drives with Arohon until our team has reviewed their ID, licence, vehicle papers and photo. Your app shows the driver’s name, photo, car and plate before they arrive.', 'আমাদের টিম আইডি, লাইসেন্স, গাড়ির কাগজ আর ছবি যাচাই না করা পর্যন্ত কেউ আরোহনে গাড়ি চালাতে পারেন না। ড্রাইভার পৌঁছানোর আগেই অ্যাপে দেখবেন তার নাম, ছবি, গাড়ি আর নম্বর প্লেট।')}</motion.p>
          </div>
          <DriverCheck />
        </div>
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Head label={t('During the ride', 'রাইডের সময়')} title={t('Help is', 'সাহায্য')} rest={t('one tap away.', 'মাত্র এক ট্যাপে।')} />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>{t('If something feels wrong, press and hold SOS. Your emergency contact and our safety team are alerted with your live location. Add your emergency contact in Profile, Trip safety.', 'কিছু ঠিক না লাগলে SOS চেপে ধরুন। আপনার জরুরি কন্টাক্ট আর আমাদের সেফটি টিম সাথে সাথে আপনার লাইভ লোকেশনসহ খবর পাবে। জরুরি কন্টাক্ট যোগ করুন প্রোফাইল, ট্রিপ সেফটি থেকে।')}</motion.p>
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
            <Head label={t('After the ride', 'রাইডের পরে')} title={t('Your rating', 'আপনার রেটিং')} rest={t('keeps everyone honest.', 'সবাইকে সৎ রাখে।')} />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>{t('Rate every trip. If something went wrong, report it from the app and our support team reviews every report.', 'প্রতিটি ট্রিপে রেটিং দিন। কোনো সমস্যা হলে অ্যাপ থেকেই জানান, আমাদের সাপোর্ট টিম প্রতিটি রিপোর্ট দেখে।')}</motion.p>
          </div>
          <AfterRide />
        </div>
      </section>
      <section className={wrap}>
        <Head label={t('For drivers', 'ড্রাইভারদের জন্য')} title={t('Drivers are', 'ড্রাইভাররাও')} rest={t('protected too.', 'সুরক্ষিত।')} copy={t('Safety works both ways. Drivers get the same tools to stay safe on every trip.', 'নিরাপত্তা দুই দিকেই। প্রতিটি ট্রিপে নিরাপদ থাকতে ড্রাইভাররাও পান একই সব টুল।')} />
        <Grid
          items={[
            { icon: Phone, title: t('Emergency contact', 'জরুরি কন্টাক্ট'), copy: t('Drivers add a number that is called when they press the emergency button on a trip.', 'ড্রাইভাররা একটি নম্বর যোগ করেন, ট্রিপে ইমার্জেন্সি বাটন চাপলেই সেখানে কল যায়।') },
            { icon: Check, title: t('Report a rider', 'যাত্রীর বিরুদ্ধে রিপোর্ট'), copy: t('Rider behaviour, payment or safety issues can be reported straight from the app.', 'যাত্রীর আচরণ, পেমেন্ট বা নিরাপত্তার সমস্যা সরাসরি অ্যাপ থেকেই জানানো যায়।') },
            { icon: Star, title: t('৳3 safety charge', `৳${n(3)} সেফটি চার্জ`), copy: t('A small charge on each city trip goes toward keeping rides safe.', 'শহরের প্রতিটি ট্রিপে ছোট্ট একটি চার্জ, যা রাইড নিরাপদ রাখার কাজে লাগে।') },
          ]}
        />
        <motion.div {...fade(0.1)} className="mt-10">
          <Link href={href('/driver')} className="inline-flex items-center gap-1.5 text-[14px] font-medium">{t('Drive with Arohon', 'আরোহনে গাড়ি চালান')} <ArrowRight size={13} /></Link>
        </motion.div>
      </section>
      <section className="mx-auto max-w-[1280px] px-6 pb-8 md:px-16">
        <motion.div {...fade()} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FF3B30]/30 bg-[#FF3B30]/[.06] px-6 py-5">
          <p className="text-[15px]"><span className="font-semibold text-[#FF3B30]">{t('In immediate danger?', 'এখনই বিপদে আছেন?')}</span> {t('Call 999 first, then let us know.', 'আগে ৯৯৯ এ কল করুন, তারপর আমাদের জানান।')}</p>
          <a href="tel:999" className="rounded-full bg-[#FF3B30] px-5 py-2.5 text-[14px] font-semibold text-white max-sm:w-full max-sm:text-center">{t('Call 999', '৯৯৯ এ কল করুন')}</a>
        </motion.div>
      </section>
      <Close title={t('Ride with peace of mind.', 'নিশ্চিন্তে চলুন।')} rest={t('Every time.', 'প্রতিবার।')} />
    </>
  );
}


/* ═════════════ CITIES ═════════════ */
// districts where drivers have registered so far (Oct 2026), largest first; counts stay private, the map just lights up
const DIVISIONS: { name: string; bn: string; districts: string[] }[] = [
  { name: 'Dhaka', bn: 'ঢাকা', districts: ['dhaka', 'narayanganj', 'gazipur', 'narsingdi', 'madaripur', 'kishoreganj', 'munshiganj', 'manikganj', 'tangail', 'faridpur', 'rajbari', 'shariatpur'] },
  { name: 'Chattogram', bn: 'চট্টগ্রাম', districts: ['chattogram', 'noakhali', 'comilla', 'feni', 'brahmanbaria', 'rangamati', 'khagrachhari', 'chandpur', 'coxsbazar', 'lakshmipur'] },
  { name: 'Mymensingh', bn: 'ময়মনসিংহ', districts: ['mymensingh', 'jamalpur', 'sherpur', 'netrokona'] },
  { name: 'Barishal', bn: 'বরিশাল', districts: ['barisal', 'barguna', 'jhalakathi', 'patuakhali', 'pirojpur'] },
  { name: 'Sylhet', bn: 'সিলেট', districts: ['sylhet'] },
  { name: 'Rangpur', bn: 'রংপুর', districts: ['rangpur', 'gaibandha', 'nilphamari', 'thakurgaon', 'dinajpur'] },
  { name: 'Khulna', bn: 'খুলনা', districts: ['kushtia', 'chuadanga', 'satkhira', 'khulna', 'narail'] },
  { name: 'Rajshahi', bn: 'রাজশাহী', districts: ['bogura', 'pabna', 'chapainawabganj', 'sirajganj', 'naogaon', 'natore'] },
];
const LIVE = DIVISIONS.flatMap((d) => d.districts);
const dName = (k: string) => (k === 'coxsbazar' ? 'Cox’s Bazar' : k === 'chapainawabganj' ? 'Chapai Nawabganj' : k === 'barisal' ? 'Barishal' : k === 'comilla' ? 'Cumilla' : k[0].toUpperCase() + k.slice(1));
const D_BN: Record<string, string> = {
  dhaka: 'ঢাকা', narayanganj: 'নারায়ণগঞ্জ', gazipur: 'গাজীপুর', narsingdi: 'নরসিংদী', madaripur: 'মাদারীপুর', kishoreganj: 'কিশোরগঞ্জ', munshiganj: 'মুন্সিগঞ্জ', manikganj: 'মানিকগঞ্জ', tangail: 'টাঙ্গাইল', faridpur: 'ফরিদপুর', rajbari: 'রাজবাড়ী', shariatpur: 'শরীয়তপুর', gopalganj: 'গোপালগঞ্জ',
  chattogram: 'চট্টগ্রাম', noakhali: 'নোয়াখালী', comilla: 'কুমিল্লা', feni: 'ফেনী', brahmanbaria: 'ব্রাহ্মণবাড়িয়া', rangamati: 'রাঙ্গামাটি', khagrachhari: 'খাগড়াছড়ি', chandpur: 'চাঁদপুর', coxsbazar: 'কক্সবাজার', lakshmipur: 'লক্ষ্মীপুর', bandarban: 'বান্দরবান',
  mymensingh: 'ময়মনসিংহ', jamalpur: 'জামালপুর', sherpur: 'শেরপুর', netrokona: 'নেত্রকোনা',
  barisal: 'বরিশাল', barguna: 'বরগুনা', jhalakathi: 'ঝালকাঠি', patuakhali: 'পটুয়াখালী', pirojpur: 'পিরোজপুর', bhola: 'ভোলা',
  sylhet: 'সিলেট', moulvibazar: 'মৌলভীবাজার', habiganj: 'হবিগঞ্জ', sunamganj: 'সুনামগঞ্জ',
  rangpur: 'রংপুর', gaibandha: 'গাইবান্ধা', nilphamari: 'নীলফামারী', thakurgaon: 'ঠাকুরগাঁও', dinajpur: 'দিনাজপুর', kurigram: 'কুড়িগ্রাম', lalmonirhat: 'লালমনিরহাট', panchagarh: 'পঞ্চগড়',
  kushtia: 'কুষ্টিয়া', chuadanga: 'চুয়াডাঙ্গা', satkhira: 'সাতক্ষীরা', khulna: 'খুলনা', narail: 'নড়াইল', jashore: 'যশোর', jessore: 'যশোর', jhenaidah: 'ঝিনাইদহ', magura: 'মাগুরা', meherpur: 'মেহেরপুর', bagerhat: 'বাগেরহাট',
  bogura: 'বগুড়া', pabna: 'পাবনা', chapainawabganj: 'চাঁপাইনবাবগঞ্জ', sirajganj: 'সিরাজগঞ্জ', naogaon: 'নওগাঁ', natore: 'নাটোর', rajshahi: 'রাজশাহী', joypurhat: 'জয়পুরহাট',
};

/** Districts light up in the order drivers joined, then a ping keeps landing somewhere new, "still counting". */
function CitiesMap({ focus }: { focus: string | null }) {
  const { t: tr } = useT();
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
      <svg viewBox={`-20 -20 ${MAP.w + 40} ${MAP.h + 40}`} className="w-full overflow-visible" role="img" aria-label={tr('Districts where Arohon drivers have joined', 'যেসব জেলা থেকে আরোহনে ড্রাইভার যোগ দিয়েছেন')}>
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
        <span className="relative inline-block h-5 w-[220px] overflow-hidden text-left">
          <AnimatePresence initial={false}>
            <motion.span key={pk} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.35, ease }} className="absolute inset-0">
              {tr(<>New driver in {dName(pk)}</>, <>নতুন ড্রাইভার, {D_BN[pk] ?? dName(pk)}</>)}
            </motion.span>
          </AnimatePresence>
        </span>
      </p>
    </div>
  );
}

function Divisions() {
  const { t } = useT();
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
              <span className="text-[20px] font-medium tracking-tight">{t(d.name, d.bn)}</span>
              <span className={`mt-2 block text-[14px] leading-relaxed ${muted}`}>{t(d.districts.map(dName), d.districts.map((k) => D_BN[k] ?? dName(k))).join(', ')}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export function CitiesPage() {
  const { t, href } = useT();
  return (
    <>
      <section className="bg-[#FDFDFD] px-6 pb-8 pt-28 text-center dark:bg-black sm:pt-36">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{t('Cities', 'শহর')}</motion.p>
        <motion.h1 {...up(0.1)} className="mx-auto mt-4 max-w-3xl u-h1">
          {t('Already across Bangladesh.', 'এরই মধ্যে সারা বাংলাদেশে।')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('Still counting.', 'আর বাড়ছেই।')}</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mx-auto mt-6 max-w-xl text-[17px] leading-relaxed ${muted}`}>{t('Drivers have joined Arohon from every division in the country, and new districts light up every week. Here is where we are so far.', 'দেশের প্রতিটি বিভাগ থেকে ড্রাইভাররা আরোহনে যোগ দিয়েছেন, আর প্রতি সপ্তাহে নতুন জেলা যোগ হচ্ছে। এখন পর্যন্ত আমরা যেখানে আছি।')}</motion.p>
      </section>
      <section className="mx-auto max-w-[1280px] px-6 pb-24 md:px-16">
        <Divisions />
      </section>
      <section className={wrap}>
        <Head label={t('Intercity', 'আন্তঃজেলা')} title={t('Any two districts,', 'যেকোনো দুই জেলা,')} rest={t('one booking.', 'এক বুকিংয়ে।')} copy={t('Even where city rides are still growing, you can book a car, micro or Hiace between any of Bangladesh’s 64 districts.', 'যেখানে সিটি রাইড এখনো বাড়ছে, সেখানেও বাংলাদেশের ৬৪ জেলার যেকোনো দুটির মধ্যে কার, মাইক্রো বা হায়েস বুক করতে পারবেন।')} />
        <motion.div {...fade(0.1)} className="mt-10">
          <Link href={href('/ride')} className="inline-flex items-center gap-1.5 text-[14px] font-medium">{t('Book a ride', 'রাইড বুক করুন')} <ArrowRight size={13} /></Link>
        </motion.div>
      </section>
      <Close title={t('Not on the map yet?', 'ম্যাপে এখনো নেই?')} rest={t('Be the first in your district.', 'আপনার জেলায় প্রথম হোন।')}>
        <Link href={href('/driver')} className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white sm:w-auto dark:bg-white dark:text-black">{t('Drive with Arohon', 'আরোহনে গাড়ি চালান')} <ArrowRight size={14} /></Link>
      </Close>
    </>
  );
}


/* ═════════════ PARTNERS ═════════════ */
// facts from Arohon-captain (৳60 per verified signup, 5 step onboarding), Arohon-shop / agent (merchant order flow), Driver app job posts
const SIGNUPS = [
  { n: 'Rahim Uddin', v: 'CNG', bn: { n: 'রহিম উদ্দিন', v: 'সিএনজি' } },
  { n: 'Jahid Hasan', v: 'Bike', bn: { n: 'জাহিদ হাসান', v: 'বাইক' } },
  { n: 'Kamrul Islam', v: 'Car', bn: { n: 'কামরুল ইসলাম', v: 'কার' } },
  { n: 'Sumon Mia', v: 'Bike', bn: { n: 'সুমন মিয়া', v: 'বাইক' } },
];
function CaptainHome() {
  const { t, n } = useT();
  const { ref, i } = useLoop(SIGNUPS.length * 2 + 3, 900);
  // each signup lands as pending, then flips to verified and pays ৳60
  const status = (k: number) => (i >= k * 2 + 2 ? 'Verified' : i >= k * 2 + 1 ? 'Pending' : null);
  const verified = SIGNUPS.filter((_, k) => status(k) === 'Verified').length;
  const target = 6;
  return (
    <div ref={ref} className={`${card} p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] text-black/45 dark:text-white/45">{t('Today’s target, Mirpur zone', 'আজকের টার্গেট, মিরপুর জোন')}</p>
          <p className="mt-1 text-[22px] font-semibold tabular-nums tracking-tight">{t(<>{verified} / {target} drivers</>, <>{n(verified)} / {n(target)} ড্রাইভার</>)}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-black/45 dark:text-white/45">{t('Earned today', 'আজকের আয়')}</p>
          <motion.p key={verified} initial={{ opacity: 0.3, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-[22px] font-semibold tabular-nums tracking-tight text-[#079A70] dark:text-[#0ABF8B]">৳{n(verified * 60)}</motion.p>
        </div>
      </div>
      <div className="mt-4 h-1.5 rounded-full bg-black/[.06] dark:bg-white/10">
        <div className="h-full rounded-full bg-black transition-[width] duration-700 ease-out dark:bg-white" style={{ width: `${(verified / target) * 100}%` }} />
      </div>
      <p className="mt-6 text-[12px] text-black/45 dark:text-white/45">{t('My signups', 'আমার সাইনআপ')}</p>
      <ul className="mt-2 min-h-[216px] space-y-2">
        <AnimatePresence>
          {SIGNUPS.map((d, k) => {
            const st = status(k);
            if (!st) return null;
            return (
              <motion.li key={d.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }} className="flex items-center gap-3 rounded-xl bg-black/[.03] p-3 dark:bg-white/[.04]">
                <img src={avatar(d.n)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold">{t(d.n, d.bn.n)}</span>
                  <span className="text-[12px] text-black/50 dark:text-white/50">{t(<>{d.v} driver</>, <>{d.bn.v} ড্রাইভার</>)}</span>
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${st === 'Verified' ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-[#FF9500]/10 text-[#C77700] dark:text-[#FF9F0A]'}`}>
                  {st === 'Verified' ? t('+৳60', `+৳${n(60)}`) : t('Pending', 'যাচাই চলছে')}
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
  { n: 'Habib', r: '4.9', t: '3 years, Toyota Axio', bn: { n: 'হাবিব', t: '৩ বছর, টয়োটা এক্সিও' } },
  { n: 'Shakil', r: '4.8', t: '5 years, any sedan', bn: { n: 'শাকিল', t: '৫ বছর, যেকোনো সেডান' } },
  { n: 'Arif', r: '5.0', t: '2 years, Premio and Allion', bn: { n: 'আরিফ', t: '২ বছর, প্রিমিও ও অ্যালিয়ন' } },
];
function JobPost() {
  const { t, n } = useT();
  const { ref, i } = useLoop(APPLICANTS.length + 4, 1000);
  const shown = Math.min(i, APPLICANTS.length);
  const hired = i >= APPLICANTS.length + 1;
  return (
    <div ref={ref} className={`${panel} p-6 sm:p-8`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[13px] ${muted}`}>{t('Job post, sample', 'জব পোস্ট, নমুনা')}</p>
          <p className="mt-1 text-[18px] font-medium tracking-tight">{t('Driver for a Toyota Axio', 'টয়োটা এক্সিওর জন্য ড্রাইভার')}</p>
          <p className={`mt-1 text-[14px] ${muted}`}>{t('Uttara, full time, starts Sunday', 'উত্তরা, ফুল টাইম, শুরু রবিবার')}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${hired ? 'bg-[#079A70]/10 text-[#079A70] dark:text-[#0ABF8B]' : 'bg-black/[.05] dark:bg-white/[.08]'}`}>{hired ? t('Hired', 'নিয়োগ হয়েছে') : t('Open', 'খোলা')}</span>
      </div>
      <ul className="mt-6 min-h-[200px] space-y-2">
        {APPLICANTS.slice(0, shown).map((a, k) => (
          <motion.li key={a.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: hired && k !== 2 ? 0.4 : 1, y: 0 }} transition={{ duration: 0.3, ease }} className={`flex items-center gap-3 rounded-xl p-3 transition-shadow ${hired && k === 2 ? 'bg-black/[.05] ring-2 ring-black dark:bg-white/[.07] dark:ring-white' : 'bg-black/[.03] dark:bg-white/[.04]'}`}>
            <img src={avatar(a.n)} alt="" className="h-9 w-9 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
            <span className="flex-1">
              <span className="block text-[14px] font-semibold">{t(a.n, a.bn.n)}</span>
              <span className="flex items-center gap-1 text-[12px] text-black/50 dark:text-white/50"><Star size={10} weight="fill" className="text-[#FF9500]" />{n(a.r)}, {t(a.t, a.bn.t)}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const PARTNER_TYPES = [
  { k: 'Shops and pharmacies', c: 'Sell food and medicine', href: '#shops', bn: { k: 'দোকান ও ফার্মেসি', c: 'খাবার আর ওষুধ বিক্রি করুন' } },
  { k: 'Captains', c: 'Sign up drivers, earn per driver', href: '#captains', bn: { k: 'ক্যাপ্টেন', c: 'ড্রাইভার যুক্ত করুন, প্রতিজনে আয়' } },
  { k: 'Vehicle owners', c: 'Find a checked driver', href: '#owners', bn: { k: 'গাড়ির মালিক', c: 'যাচাই করা ড্রাইভার খুঁজুন' } },
  { k: 'Businesses', c: 'Rides and deliveries for your team', href: '/services/business', bn: { k: 'বিজনেস', c: 'আপনার টিমের রাইড আর ডেলিভারি' } },
];

export function PartnersPage() {
  const { t, n, href } = useT();
  const { ref, i } = useLoop(PARTNER_TYPES.length, 1600);
  return (
    <>
      <section className="bg-[#FDFDFD] px-6 pb-20 pt-28 text-center dark:bg-black sm:pt-36">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>{t('Partners', 'পার্টনার')}</motion.p>
        <motion.h1 {...up(0.1)} className="mx-auto mt-4 max-w-3xl u-h1">
          {t('Grow with Arohon.', 'আরোহনের সাথে বড় হোন।')}
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">{t('Every way to partner.', 'পার্টনার হওয়ার সব পথ।')}</span>
        </motion.h1>
        <motion.p {...up(0.2)} className={`mx-auto mt-6 max-w-xl text-[17px] leading-relaxed ${muted}`}>{t('Shops reach new customers, captains earn by bringing drivers on board, and vehicle owners find drivers they can trust.', 'দোকান পায় নতুন কাস্টমার, ক্যাপ্টেনরা ড্রাইভার যুক্ত করে আয় করেন, আর গাড়ির মালিকরা পান ভরসার ড্রাইভার।')}</motion.p>
        <motion.div {...up(0.3)} ref={ref} className="mx-auto mt-12 grid max-w-4xl gap-2 text-left sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_TYPES.map((p, k) => (
            <a key={p.k} href={href(p.href)} className={`${panel} group block p-5 transition-colors duration-500 ${k === i ? '!border-black/30 dark:!border-white/30' : ''}`}>
              <p className="text-[15px] font-medium">{t(p.k, p.bn.k)}</p>
              <p className={`mt-1 text-[13px] ${muted}`}>{t(p.c, p.bn.c)}</p>
              <ArrowRight size={14} className={`mt-4 transition-all duration-500 ${k === i ? 'translate-x-1 text-black dark:text-white' : 'text-black/30 dark:text-white/30'}`} />
            </a>
          ))}
        </motion.div>
      </section>

      <section id="shops" className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Head label={t('Shops and pharmacies', 'দোকান ও ফার্মেসি')} title={t('Sell on Arohon.', 'আরোহনে বিক্রি করুন।')} rest={t('Orders arrive in real time.', 'অর্ডার আসে রিয়েল টাইমে।')} />
            <motion.ul {...fade(0.1)} className="mt-8 space-y-3 text-[15px]">
              {t(['Accept or reject each order in one tap', 'Mark it preparing, then ready for pickup', 'An Arohon rider collects and delivers it', 'Works on a phone or a counter screen'], ['এক ট্যাপে প্রতিটি অর্ডার নিন বা বাতিল করুন', 'প্রস্তুত হচ্ছে, তারপর পিকআপের জন্য রেডি মার্ক করুন', 'আরোহন রাইডার নিয়ে গিয়ে ডেলিভারি দেন', 'চলে ফোনে বা কাউন্টারের স্ক্রিনে']).map((x) => (
                <li key={x} className="flex items-start gap-3"><Check size={18} weight="bold" className="mt-0.5 shrink-0 text-brand-green" />{x}</li>
              ))}
            </motion.ul>
            <motion.div {...fade(0.15)}><Link href={href('/contact')} className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">{t('List your shop', 'আপনার দোকান যুক্ত করুন')} <ArrowRight size={13} /></Link></motion.div>
          </div>
          <ShopBoard />
        </div>
      </section>

      <section id="captains" className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Head label={t('Arohon Captains', 'আরোহন ক্যাপ্টেন')} title={t('Bring drivers on board.', 'ড্রাইভার যুক্ত করুন।')} rest={t('Earn ৳60 for each one.', `প্রতিজনে ৳${n(60)} আয়।`)} />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>{t('Captains are our field team. You meet drivers in your zone, help them sign up in the Arohon Captain app, and earn ৳60 for every driver our team verifies.', 'ক্যাপ্টেনরা আমাদের মাঠের টিম। নিজের জোনের ড্রাইভারদের সাথে দেখা করুন, আরোহন ক্যাপ্টেন অ্যাপে সাইনআপে সাহায্য করুন, আর আমাদের টিম যাচাই করা প্রতিটি ড্রাইভারে পান ৳৬০।')}</motion.p>
            <motion.ol {...fade(0.15)} className="mt-8 grid max-w-md grid-cols-5 gap-2 text-center">
              {t(['Profile', 'NID', 'Licence', 'Vehicle', 'Papers'], ['প্রোফাইল', 'এনআইডি', 'লাইসেন্স', 'গাড়ি', 'কাগজপত্র']).map((s, k) => (
                <li key={s}>
                  <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full font-mono text-[12px] ${panel}`}>{n(k + 1)}</span>
                  <span className={`mt-2 block text-[11px] ${muted}`}>{s}</span>
                </li>
              ))}
            </motion.ol>
            <motion.div {...fade(0.2)}><Link href={href('/contact')} className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">{t('Become a captain', 'ক্যাপ্টেন হোন')} <ArrowRight size={13} /></Link></motion.div>
          </div>
          <CaptainHome />
        </div>
      </section>

      <section id="owners" className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <Head label={t('Vehicle owners', 'গাড়ির মালিক')} title={t('Own a car?', 'গাড়ি আছে?')} rest={t('Find a driver you can trust.', 'ভরসার ড্রাইভার খুঁজে নিন।')} />
            <motion.p {...fade(0.1)} className={`mt-6 max-w-md text-[16px] leading-relaxed ${muted}`}>{t('Post a driving job and checked Arohon drivers apply. See their rating and experience, pick the one you like, and get in touch directly.', 'ড্রাইভিং জব পোস্ট করুন, যাচাই করা আরোহন ড্রাইভাররা আবেদন করবেন। রেটিং আর অভিজ্ঞতা দেখুন, পছন্দের জনকে বেছে নিন, আর সরাসরি যোগাযোগ করুন।')}</motion.p>
            <motion.div {...fade(0.15)}><Link href={href('/contact')} className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">{t('Post a driving job', 'ড্রাইভিং জব পোস্ট করুন')} <ArrowRight size={13} /></Link></motion.div>
          </div>
          <JobPost />
        </div>
      </section>

      <section className={wrap}>
        <Head label={t('More ways', 'আরও উপায়')} title={t('Already moving?', 'আগে থেকেই চলছেন?')} rest={t('There’s a place for you.', 'আপনার জন্যও জায়গা আছে।')} />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 md:grid-cols-2 dark:border-white/10 dark:bg-white/10">
          {[
            { k: t('Drive with Arohon', 'আরোহনে গাড়ি চালান'), c: t('Just 2% commission. Bring your bike, CNG or car and drive on your own hours.', 'কমিশন মাত্র ২%। নিজের বাইক, সিএনজি বা কার নিয়ে চালান নিজের সময়মতো।'), href: '/driver' },
            { k: t('Arohon for Business', 'আরোহন বিজনেস'), c: t('Monthly office rides, team transport and deliveries for your shop.', 'মাসিক অফিস রাইড, টিম ট্রান্সপোর্ট আর আপনার দোকানের ডেলিভারি।'), href: '/services/business' },
          ].map((x, k) => (
            <motion.div key={x.k} {...fade(k * 0.06)} className="bg-[#FDFDFD] dark:bg-black">
              <Link href={href(x.href)} className="group flex h-full flex-col p-8 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.03]">
                <p className="text-[20px] font-medium tracking-tight">{x.k}</p>
                <p className={`mt-2 max-w-sm flex-1 text-[15px] leading-relaxed ${muted}`}>{x.c}</p>
                <ArrowRight size={16} className="mt-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <Close title={t('Let’s build it together.', 'চলুন একসাথে গড়ি।')} rest={t('Talk to our partner team.', 'কথা বলুন আমাদের পার্টনার টিমের সাথে।')}>
        <Link href={href('/contact')} className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-black px-6 py-3.5 text-[15px] font-semibold text-white sm:w-auto dark:bg-white dark:text-black">{t('Get in touch', 'যোগাযোগ করুন')} <ArrowRight size={14} /></Link>
      </Close>
    </>
  );
}

/* ═════════════ FOOD (Daily Needs) ═════════════ */
const O_STEPS = ['Order placed', 'Restaurant accepted', 'Preparing your food', 'Ready for pickup', 'On the way'];
const O_STEPS_BN = ['অর্ডার হয়েছে', 'রেস্টুরেন্ট নিয়েছে', 'খাবার তৈরি হচ্ছে', 'পিকআপের জন্য রেডি', 'পথে আছে'];
const O_ITEMS: [string, number, number, string][] = [['Kacchi biryani, full', 1, 420, 'কাচ্চি বিরিয়ানি, ফুল'], ['Borhani', 2, 120, 'বোরহানি'], ['Firni', 1, 90, 'ফিরনি']];
function OrderCard() {
  const { t, n } = useT();
  const { ref, i } = useLoop(O_STEPS.length + 2, 1300);
  const at = Math.min(i, O_STEPS.length - 1);
  return (
    <div ref={ref} className={`${card} overflow-hidden`}>
      <div className="p-6">
        <p className="text-[12px] text-black/45 dark:text-white/45">{t('Your order, sample', 'আপনার অর্ডার, নমুনা')}</p>
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
              {t(O_STEPS[at], O_STEPS_BN[at])}
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
        {O_ITEMS.map(([nm, q, p, nmBn]) => (
          <div key={nm} className="flex justify-between py-1">
            <span><span className="text-black/45 dark:text-white/45">{n(q)}×</span> {t(nm, nmBn)}</span>
            <span className="tabular-nums">৳{n(p)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-black/[.07] pt-3 font-semibold dark:border-white/[.07]">
          <span>{t('Subtotal', 'সাবটোটাল')}</span>
          <span className="tabular-nums">{t('৳630', `৳${n(630)}`)}</span>
        </div>
      </div>
    </div>
  );
}
const SHOPS = [
  { name: 'Biryani house', kind: 'Restaurant', icon: ForkKnife, bn: { name: 'বিরিয়ানি ঘর', kind: 'রেস্টুরেন্ট' } },
  { name: 'Corner pharmacy', kind: 'Pharmacy', icon: Pill, bn: { name: 'মোড়ের ফার্মেসি', kind: 'ফার্মেসি' } },
  { name: 'Burger joint', kind: 'Restaurant', icon: ForkKnife, bn: { name: 'বার্গার কর্নার', kind: 'রেস্টুরেন্ট' } },
  { name: 'Family pharmacy', kind: 'Pharmacy', icon: Pill, bn: { name: 'ফ্যামিলি ফার্মেসি', kind: 'ফার্মেসি' } },
];

const ORDER_ITEMS = ['Kacchi biryani, 2', 'Napa, Seclo', 'Beef tehari', 'Chicken burger, 3', 'Orsaline, Napa Extra', 'Morog polao', 'Fuchka plate', 'Saline, Ace'];
const ORDER_ITEMS_BN = ['কাচ্চি বিরিয়ানি, ২', 'নাপা, সেকলো', 'বিফ তেহারি', 'চিকেন বার্গার, ৩', 'ওরস্যালাইন, নাপা এক্সট্রা', 'মোরগ পোলাও', 'ফুচকা প্লেট', 'স্যালাইন, এইস'];
const COLS = ['New', 'Preparing', 'Ready'] as const;
const COLS_BN = ['নতুন', 'তৈরি হচ্ছে', 'রেডি'];
/**
 * Shop console with drag and drop. Order i arrives at tick i, so its column is (tick - i):
 * 0 New, 1 Preparing, 2 Ready, 3 cleared. Each card keeps its key and slides between columns with a
 * CSS transform transition while an inner "lift" keyframe (tilt, shadow, cursor) sells the drag.
 * Moves are staggered like a person working the board: clear Ready, drag Preparing to Ready,
 * drag New to Preparing, then the next order pops into New.
 */
const STAGGER = { clear: 0, toReady: 0.15, toPrep: 0.85, arrive: 1.55 };
function ShopBoard() {
  const { t: tr, n } = useT();
  const [tick, setTick] = useState(2);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 3200);
    return () => clearInterval(t);
  }, []);
  const ids = [tick - 3, tick - 2, tick - 1, tick].filter((i) => i >= 0);
  return (
    <div className={`${panel} p-2`}>
      <div className="flex items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2 text-[13px] font-medium"><Storefront size={16} /> {tr('Shop console', 'শপ কনসোল')}</span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#079A70] dark:text-[#0ABF8B]"><span className="h-1.5 w-1.5 rounded-full bg-current" />{tr('Open', 'খোলা')}</span>
      </div>
      <div className="relative p-2">
        {/* column lanes */}
        <div className="grid grid-cols-3 gap-2">
          {COLS.map((c, k) => (
            <div key={c} className="h-[150px] rounded-xl bg-black/[.03] p-2 dark:bg-white/[.03]">
              <p className={`px-1 text-[12px] ${muted}`}>{tr(c, COLS_BN[k])}</p>
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
                  <p className="font-semibold">{tr(<>Order {2041 + i}</>, <>অর্ডার {n(2041 + i)}</>)}</p>
                  <p className={`mt-0.5 truncate ${muted}`}>{tr(ORDER_ITEMS[i % ORDER_ITEMS.length], ORDER_ITEMS_BN[i % ORDER_ITEMS.length])}</p>
                  {shown === 0 && <p className="mt-2 rounded-md bg-black py-1 text-center text-[11px] font-semibold text-white dark:bg-white dark:text-black">{tr('Accept', 'নিন')}</p>}
                  {shown === 1 && <p className="mt-2 rounded-md py-1 text-center text-[11px] font-semibold ring-1 ring-black/15 dark:ring-white/20">{tr('Mark ready', 'রেডি করুন')}</p>}
                  {shown === 2 && <p className="mt-2 flex items-center justify-center gap-1 py-1 text-[11px] text-[#079A70] dark:text-[#0ABF8B]"><Check size={11} weight="bold" /> {tr('Waiting for rider', 'রাইডারের অপেক্ষায়')}</p>}
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
  const { t, href } = useT();
  return (
    <>
      <Hero label={t('Food delivery', 'ফুড ডেলিভারি')} title={t('Food and medicine,', 'খাবার আর ওষুধ,')} rest={t('to your door.', 'আপনার দরজায়।')} copy={t('Order from restaurants and pharmacies near you in the Arohon app. Follow your order from the kitchen to your door and pay by cash, bKash or card.', 'আরোহন অ্যাপে কাছের রেস্টুরেন্ট আর ফার্মেসি থেকে অর্ডার করুন। কিচেন থেকে দরজা পর্যন্ত অর্ডার দেখুন, আর পেমেন্ট করুন ক্যাশ, বিকাশ বা কার্ডে।')}>
        <OrderCard />
      </Hero>
      <section className={wrap}>
        <Head label={t('Daily needs', 'প্রতিদিনের দরকার')} title={t('Hungry or unwell,', 'খিদে পেলে বা অসুস্থ হলে,')} rest={t('we bring it.', 'আমরা নিয়ে আসি।')} copy={t('Two kinds of places in one tab: restaurants for meals and pharmacies for medicine.', 'এক ট্যাবেই দুই ধরনের জায়গা, খাবারের জন্য রেস্টুরেন্ট আর ওষুধের জন্য ফার্মেসি।')} />
        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SHOPS.map((s, i) => (
            <motion.div key={s.name} {...fade(i * 0.06)} className={`${panel} group p-6`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[.05] transition-transform duration-500 group-hover:-translate-y-1 dark:bg-white/[.07]"><s.icon size={22} /></span>
              <p className="mt-8 text-[16px] font-medium">{t(s.name, s.bn.name)}</p>
              <p className={`text-[13px] ${muted}`}>{t(<>{s.kind}, sample</>, <>{s.bn.kind}, নমুনা</>)}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section className={wrap}>
        <Head label={t('How it works', 'যেভাবে কাজ করে')} title={t('Pick, pay,', 'বেছে নিন, পেমেন্ট করুন,')} rest={t('and follow it live.', 'আর লাইভ দেখুন।')} />
        <Grid
          items={[
            { icon: ForkKnife, title: t('Browse nearby', 'কাছাকাছি খুঁজুন'), copy: t('Restaurants and pharmacies near you, with their menus and prices.', 'আপনার কাছের রেস্টুরেন্ট আর ফার্মেসি, মেনু আর দামসহ।') },
            { icon: Check, title: t('Live order status', 'লাইভ অর্ডার স্ট্যাটাস'), copy: t('See when the shop accepts, starts preparing and hands it over.', 'দেখুন কখন দোকান অর্ডার নিল, তৈরি শুরু করল আর হাতে তুলে দিল।') },
            { icon: Phone, title: t('Pay your way', 'যেভাবে খুশি পেমেন্ট'), copy: t('Cash on delivery, bKash, Nagad or card, chosen at checkout.', 'ক্যাশ অন ডেলিভারি, বিকাশ, নগদ বা কার্ড, চেকআউটে বেছে নিন।') },
          ]}
        />
      </section>
      <section className={wrap}>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Head label={t('For restaurants and pharmacies', 'রেস্টুরেন্ট ও ফার্মেসির জন্য')} title={t('Sell on Arohon.', 'আরোহনে বিক্রি করুন।')} rest={t('Orders arrive in real time.', 'অর্ডার আসে রিয়েল টাইমে।')} />
            <div className="mt-10"><ShopBoard /></div>
          </div>
          <motion.div {...fade(0.1)} className={`${panel} p-6 sm:p-8`}>
            <ul className="space-y-4 text-[15px]">
              {t(['Accept or reject each order in one tap', 'Mark it preparing, then ready for pickup', 'Manage your menu, categories and branches', 'Open or close your shop whenever you like'], ['এক ট্যাপে প্রতিটি অর্ডার নিন বা বাতিল করুন', 'প্রস্তুত হচ্ছে, তারপর পিকআপের জন্য রেডি মার্ক করুন', 'মেনু, ক্যাটাগরি আর ব্রাঞ্চ সামলান', 'যখন খুশি দোকান খুলুন বা বন্ধ রাখুন']).map((x) => (
                <li key={x} className="flex items-start gap-3"><Check size={18} weight="bold" className="mt-0.5 shrink-0 text-brand-green" />{x}</li>
              ))}
            </ul>
            <Link href={href('/contact')} className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium">{t('List your shop', 'আপনার দোকান যুক্ত করুন')} <ArrowRight size={13} /></Link>
          </motion.div>
        </div>
      </section>
      <PayYourWay />
      <Close title={t('What’s for dinner?', 'রাতে কী খাবেন?')} rest={t('Order in the app.', 'অ্যাপে অর্ডার করুন।')} />
    </>
  );
}

