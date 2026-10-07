'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import paths from './logoPaths.json';

// Splash shown once per session: rider mark rolls in, wordmark rises, curtain lifts.
export function Intro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem('intro') === '1';
      sessionStorage.setItem('intro', '1');
    } catch {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg viewBox="0 0 182 38" className="h-12 sm:h-16" aria-label="Arohon">
            <motion.g
              fill="#0ABF8B"
              initial={{ x: -120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {paths.mark.map((d) => (
                <path key={d.slice(0, 12)} d={d} />
              ))}
            </motion.g>
            <g transform="translate(47 0)" fill="#fff" fillRule="evenodd">
              {paths.word.map((d, i) => (
                <motion.path
                  key={d.slice(0, 16)}
                  d={d}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </g>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
