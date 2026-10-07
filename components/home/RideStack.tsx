'use client';

import { useState } from 'react';
import { motion, MotionValue, useMotionValueEvent, useTransform } from 'framer-motion';

export type Ride = { v: string; label: string; dest: string; min: number; driver: string; rating: string; plate: string; fare: number; km: number; seats: number; model: string; trips: number };

// Active rides shown in the hero. The front card drives the vehicle + destination on the map.
export const RIDES: Ride[] = [
  { v: 'car', label: 'Car', dest: 'Dhanmondi', min: 18, driver: 'Rakib Hasan', rating: '4.9', plate: 'DHA-GA 14-2081', fare: 320, km: 7.4, seats: 4, model: 'Toyota Axio', trips: 1240 },
  { v: 'cng', label: 'CNG', dest: 'Banani', min: 14, driver: 'Jamal Uddin', rating: '4.8', plate: 'DHA-THA 11-5472', fare: 180, km: 5.2, seats: 3, model: 'Bajaj RE CNG', trips: 860 },
  { v: 'micro', label: 'Micro', dest: 'Uttara', min: 26, driver: 'Sohel Rana', rating: '4.9', plate: 'DHA-CHA 15-3390', fare: 650, km: 14.8, seats: 7, model: 'Toyota Noah', trips: 412 },
  { v: 'car_plus', label: 'Car Plus', dest: 'Bashundhara', min: 21, driver: 'Tanvir Ahmed', rating: '5.0', plate: 'DHA-GHA 19-0716', fare: 480, km: 9.6, seats: 4, model: 'Toyota Premio', trips: 2105 },
];

const PEEK = 18; // how much of each side card shows beyond the front card
const SCALE = 0.92; // side cards sit slightly smaller, behind
const SHIFT = PEEK + (300 * (1 - SCALE)) / 2; // offset so a scaled card still peeks PEEK px

/** Frame 30 (three-quarter view) of a vehicle's 8×6 sprite sheet, at the given cell size. */
function Sprite({ v, size }: { v: string; size: number }) {
  return (
    <div
      aria-hidden
      className="shrink-0 bg-no-repeat"
      style={{ width: size, height: size, backgroundImage: `url(/v/${v}.webp)`, backgroundSize: `${size * 8}px ${size * 6}px`, backgroundPosition: `${-6 * size}px ${-3 * size}px` }}
    />
  );
}

export function RideStack({ active, progress, onSelect }: { active: number; progress: MotionValue<number>; onSelect: (i: number) => void }) {
  const bar = useTransform(progress, (v) => `${v * 100}%`);
  const n = RIDES.length;

  return (
    <div className="relative h-full" style={{ width: 300 + 2 * PEEK }}>
      {RIDES.map((r, i) => {
        const depth = (i - active + n) % n; // 0 = front
        // the next ride peeks out on the right, the previous one on the left, the rest wait hidden behind the front card
        const side = depth === 0 ? 0 : depth === 1 ? 1 : depth === n - 1 ? -1 : 0;
        const shown = depth === 0 || side !== 0;
        return (
          <motion.button
            key={r.v}
            type="button"
            onClick={() => depth && onSelect(i)}
            aria-label={depth ? `Show ${r.label} ride` : `${r.label} ride, active`}
            animate={{ x: PEEK + side * SHIFT, scale: depth ? SCALE : 1, opacity: shown ? (depth ? 0.45 : 1) : 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            style={{ zIndex: depth ? (shown ? 1 : 0) : 2, pointerEvents: shown ? undefined : 'none' }}
            className={`absolute inset-y-0 left-0 w-[300px] origin-center overflow-hidden rounded-[24px] bg-white text-left shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] dark:bg-[#1C1C1E] ${depth ? 'cursor-pointer hover:brightness-105' : 'cursor-default'}`}
          >
            {depth === 0 ? <ActiveCard r={r} progress={progress} bar={bar} /> : <PeekCard r={r} />}
          </motion.button>
        );
      })}
    </div>
  );
}

// Cards behind only peek out as an edge; they show who is next when they come forward.
function PeekCard({ r }: { r: Ride }) {
  return <div className="h-full" aria-hidden data-ride={r.v} />;
}

// Uber-level in-trip sheet: one big status, plate + car with driver avatar tucked in, one driver line, one fare line
function ActiveCard({ r, progress }: { r: Ride; progress: MotionValue<number>; bar: MotionValue<string> }) {
  const [p, setP] = useState(progress.get());
  useMotionValueEvent(progress, 'change', setP);
  const arriving = p < 0.15;
  const mins = arriving ? Math.max(1, Math.ceil((0.15 - p) * 14)) : Math.max(1, Math.round((1 - p) * r.min));
  return (
    <div className="flex h-full flex-col bg-white px-5 text-black dark:bg-[#1C1C1E] dark:text-white">
      <div className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-black/10 dark:bg-white/15" />

      <div className="mt-5">
        <p className="text-[22px] font-bold leading-tight tracking-tight">{arriving ? `Arriving in ${mins} min` : `${mins} min to ${r.dest}`}</p>
        <p className="mt-1 text-[13px] text-black/50 dark:text-white/50">{arriving ? 'Meet your driver at the pickup point' : `${(r.km * (1 - p)).toFixed(1)} km left`}</p>
      </div>

      {/* the car is the hero of the card */}
      <div className="flex flex-1 items-center justify-center">
        <Sprite v={r.v} size={150} />
      </div>

      {/* driver first, the way riders scan it: who is coming, how good, which car; the plate sits like a number plate */}
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/avatars/${r.v}.webp`} alt="" className="h-10 w-10 shrink-0 rounded-full bg-[#EDEDED] object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold">{r.driver.split(' ')[0]}</p>
          <p className="text-[12px] text-black/50 dark:text-white/50">★ {r.rating}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="inline-block whitespace-nowrap rounded-md bg-black/[.06] px-1.5 py-0.5 text-[12px] font-bold tracking-wide dark:bg-white/10">{r.plate}</span>
          <p className="mt-0.5 text-[12px] text-black/50 dark:text-white/50">{r.model}</p>
        </div>
      </div>

      <div className="mb-5 mt-4 flex items-center justify-between border-t border-black/[.08] pt-4 dark:border-white/10">
        <span className="text-[14px] text-black/60 dark:text-white/60">Fare</span>
        <span className="flex items-center gap-2">
          <span className="rounded-full bg-[#0ABF8B]/15 px-2 py-0.5 text-[11px] font-semibold text-[#079A70] dark:text-[#0ABF8B]">50% off</span>
          <span className="text-[13px] text-black/35 line-through dark:text-white/35">৳{r.fare}</span>
          <span className="text-[18px] font-bold">৳{r.fare / 2}</span>
        </span>
      </div>
    </div>
  );
}
