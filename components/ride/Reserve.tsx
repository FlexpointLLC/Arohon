'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';
import { USER_APP_URL } from '@/lib/app-links';
import { ease, fade } from '../motion';

const TIMES = ['6:30 AM', '7:30 AM', '9:00 AM', '12:00 PM', '5:30 PM', '8:00 PM'];
const USES = [
  { title: 'Airport runs', copy: 'Book the night before an early flight and wake up to a confirmed ride.' },
  { title: 'Intercity trips', copy: 'Plan Sylhet or Cox’s Bazar ahead with a car, micro or Hiace.' },
  { title: 'Rentals', copy: 'Hold a car and driver by the hour or the day, from a time you pick.' },
];

/** Uber "Plan for later" pattern as a working picker: pick a day and a time, see it confirm */
export function Reserve() {
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState(1);
  const [time, setTime] = useState<string | null>(null);

  // dates are built on the client so server HTML never disagrees with the visitor's today
  useEffect(() => {
    const now = new Date();
    setDays(Array.from({ length: 7 }, (_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)));
  }, []);

  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o);

  return (
    <section id="reserve" className="mx-auto max-w-[1280px] scroll-mt-32 border-t border-black/10 px-6 py-24 sm:py-32 md:px-16 dark:border-white/10">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <motion.div {...fade()}>
          <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">Plan for later</p>
          <h2 className="mt-3 text-[32px] font-medium leading-[1.05] tracking-[-0.022em] sm:text-[48px]">
            Reserve a ride.
            <br />
            <span className="text-black/45 dark:text-[#8A8F98]">Ready when you are.</span>
          </h2>
          <ul className="mt-10 space-y-6">
            {USES.map((u) => (
              <li key={u.title}>
                <p className="text-[15px] font-medium">{u.title}</p>
                <p className="mt-1 max-w-sm text-[14px] leading-relaxed text-black/50 dark:text-[#8A8F98]">{u.copy}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade(0.1)} className="rounded-2xl border border-black/10 p-6 sm:p-8 dark:border-white/10">
          <p className="text-[13px] text-black/45 dark:text-[#8A8F98]">Choose a day</p>
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {days.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setDay(i)}
                className={`flex flex-col items-center rounded-xl py-2.5 transition-colors ${day === i ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-black/[.05] dark:hover:bg-white/[.07]'}`}
              >
                <span className={`text-[11px] ${day === i ? 'opacity-70' : 'text-black/45 dark:text-white/45'}`}>{i === 0 ? 'Today' : fmt(d, { weekday: 'short' })}</span>
                <span className="mt-0.5 text-[17px] font-semibold tabular-nums">{d.getDate()}</span>
              </button>
            ))}
          </div>

          <p className="mt-7 text-[13px] text-black/45 dark:text-[#8A8F98]">Pickup time</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {TIMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTime(t)}
                className={`rounded-xl py-3 text-[14px] transition-colors ${time === t ? 'bg-black font-semibold text-white dark:bg-white dark:text-black' : 'bg-black/[.04] hover:bg-black/[.08] dark:bg-white/[.06] dark:hover:bg-white/10'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-7 min-h-[64px] border-t border-black/10 pt-5 dark:border-white/10">
            <AnimatePresence mode="wait">
              {time && days[day] ? (
                <motion.div key={day + time} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="flex flex-wrap items-center justify-between gap-4">
                  <p className="flex items-center gap-2 text-[15px] font-medium">
                    <CheckCircle size={20} weight="fill" className="text-brand-green" />
                    {fmt(days[day], { weekday: 'long', month: 'short', day: 'numeric' })}, {time}
                  </p>
                  <a href={USER_APP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white max-sm:w-full max-sm:justify-center dark:bg-white dark:text-black">
                    Reserve in the app <ArrowRight size={14} />
                  </a>
                </motion.div>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[14px] text-black/45 dark:text-[#8A8F98]">
                  Pick a time to see your reservation.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
