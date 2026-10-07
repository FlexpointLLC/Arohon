'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';

const ease = [0.76, 0, 0.24, 1] as const;

// Splash shown once per session: a light 0 to 100 counter with a hairline bar, then the page lifts in.
// It climbs to 90 on its own and only finishes once the page has actually loaded.
export function Intro() {
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem('intro') === '1';
      sessionStorage.setItem('intro', '1');
    } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShow(true);

    let done = false;
    const first = animate(0, 90, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    const finish = () => {
      if (done) return;
      done = true;
      first.stop();
      animate(Math.min(90, n), 100, { duration: 0.45, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)), onComplete: () => setTimeout(() => setShow(false), 180) });
    };
    // wait for both the first climb and the real page load
    const minTime = new Promise((r) => setTimeout(r, 1100));
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true }));
    Promise.all([minTime, loaded]).then(finish);
    const safety = setTimeout(finish, 4000); // never hold the page hostage
    return () => {
      first.stop();
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
          <p className="absolute left-6 top-6 text-[13px] tracking-wide text-black/40 md:left-16 md:top-10 dark:text-white/40">Arohon</p>
          <p className="absolute right-6 top-6 text-[13px] text-black/40 md:right-16 md:top-10 dark:text-white/40">Loading</p>
          <div className="absolute inset-x-6 bottom-8 md:inset-x-16 md:bottom-14">
            <p className="text-[96px] font-extralight leading-none tracking-[-0.04em] tabular-nums sm:text-[160px] lg:text-[200px]">
              {n}
              <span className="text-black/30 dark:text-white/30">%</span>
            </p>
            <div className="mt-6 h-px bg-black/10 dark:bg-white/15">
              <div className="h-px bg-black dark:bg-white" style={{ width: `${n}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
