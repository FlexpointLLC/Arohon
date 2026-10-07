'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1] as const;

/** Headline that rises in word by word from behind a mask. */
export function SplitWords({ text, className = '', delay = 0, stagger = 0.06 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : undefined}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** The one appear animation (the home hero's blurred rise). `up` plays on mount, `fade` when scrolled into view. */
const HIDDEN = { opacity: 0, y: 24, filter: 'blur(8px)' };
const SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)' };
export const up = (delay = 0) => ({ initial: HIDDEN, animate: SHOWN, transition: { duration: 0.9, delay, ease } });
export const fade = (delay = 0) => ({ initial: HIDDEN, whileInView: SHOWN, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.9, delay, ease } });

/** Fade-up on scroll into view. */
export function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} {...fade(delay)}>
      {children}
    </motion.div>
  );
}

/** Number that counts up when it enters the viewport. */
export function CountUp({ to, suffix = '', duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

/** Element that leans toward the cursor. */
export function Magnetic({ children, strength = 0.3, className = '' }: { children: React.ReactNode; strength?: number; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Card that tilts in 3D following the pointer. */
export function Tilt({ children, className = '', max = 10 }: { children: React.ReactNode; className?: string; max?: number }) {
  const rx = useSpring(0, { stiffness: 150, damping: 15 });
  const ry = useSpring(0, { stiffness: 150, damping: 15 });
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
