'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { bnDigits, useT } from '@/lib/i18n';

const ease = [0.76, 0, 0.24, 1] as const;

// Splash shown once per session: a light 0 to 100 counter with a hairline bar, then the page lifts in.
// It climbs to 90 on its own and only finishes once the page has actually loaded.
export function Intro() {
  const [show, setShow] = useState(false);
  // one motion value drives both the number and the bar, so it never re-renders or jumps
  const { t, bn } = useT();
  const n = useMotionValue(0);
  const label = useTransform(n, (v) => (bn ? bnDigits(Math.round(v)) : String(Math.round(v))));
  const width = useTransform(n, (v) => `${v}%`);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem('intro') === '1';
      sessionStorage.setItem('intro', '1');
    } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShow(true);

    let done = false;
    // climbs smoothly towards 90 while the page loads
    let ctrl = animate(n, 90, { duration: 1.6, ease: [0.25, 0.8, 0.3, 1] });
    const finish = () => {
      if (done) return;
      done = true;
      ctrl.stop();
      // continue from wherever the counter is, never back to 0
      ctrl = animate(n, 100, { duration: 0.6, ease: [0.4, 0, 0.2, 1], onComplete: () => setTimeout(() => setShow(false), 200) });
    };
    // wait for both the first climb and the real page load
    const minTime = new Promise((r) => setTimeout(r, 1200));
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }));
    Promise.all([minTime, loaded]).then(finish);
    const safety = setTimeout(finish, 4000); // never hold the page hostage
    return () => {
      ctrl.stop();
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#FDFDFD] text-black dark:bg-black dark:text-white"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease }}
          aria-hidden
        >
          <p className="absolute left-6 top-6 text-[13px] tracking-wide text-black/40 md:left-16 md:top-10 dark:text-white/40">{t('Arohon', 'আরোহন')}</p>
          <p className="absolute right-6 top-6 text-[13px] text-black/40 md:right-16 md:top-10 dark:text-white/40">{t('Loading', 'লোড হচ্ছে')}</p>
          <div className="absolute inset-x-6 bottom-8 md:inset-x-16 md:bottom-14">
            <p className="text-[96px] font-extralight leading-none tracking-[-0.04em] tabular-nums sm:text-[160px] lg:text-[200px]">
              <motion.span>{label}</motion.span>
              <span className="text-black/30 dark:text-white/30">%</span>
            </p>
            <div className="mt-6 h-px bg-black/10 dark:bg-white/15">
              <motion.div className="h-px bg-black dark:bg-white" style={{ width }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
