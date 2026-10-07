'use client';

import { useEffect, useRef, useState } from 'react';
import DHAKA from '@/lib/dhakaDots.json';
import { useT } from '@/lib/i18n';

// Dotted Dhaka, one block per thana (geoBoundaries ADM3, rasterised with a one-dot gutter).
// The chosen vehicle drives from the rider to the destination, drawing a white trail behind it.
const MAP = DHAKA as unknown as { w: number; h: number; thanas: Record<string, [number, number][]>; centers: Record<string, [number, number]> };
const D = Object.fromEntries(Object.entries(MAP.thanas).map(([k, pts]) => [k, pts.map(([x, y]) => `M${x} ${y}h0`).join('')]));
const FROM = 'Tejgaon';
const LABELS = ['Uttara', 'Mirpur', 'Gulshan', 'Dhanmondi', 'Motijheel', 'Mohammadpur', 'Badda', 'Biman Bandar'];
const BN: Record<string, string> = { Tejgaon: 'তেজগাঁও', Uttara: 'উত্তরা', Mirpur: 'মিরপুর', Gulshan: 'গুলশান', Dhanmondi: 'ধানমন্ডি', Motijheel: 'মতিঝিল', Mohammadpur: 'মোহাম্মদপুর', Badda: 'বাড্ডা', Kalabagan: 'কলাবাগান', 'Biman Bandar': 'বিমানবন্দর' };
const DEMO = ['Gulshan', 'Biman Bandar', 'Dhanmondi', 'Motijheel', 'Uttara', 'Mirpur'];

function arc(a: [number, number], b: [number, number]) {
  const [mx, my] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy) || 1;
  let [px, py] = [dy / len, -dx / len];
  if (py > 0) [px, py] = [-px, -py];
  const lift = len * 0.18;
  return `M${a[0]} ${a[1]} Q${mx + px * lift} ${my + py * lift} ${b[0]} ${b[1]}`;
}

export function DhakaMap({ to, vehicle }: { to: string | null; vehicle: string }) {
  const { t } = useT();
  const name = (k: string) => t(k === 'Biman Bandar' ? 'Airport' : k, BN[k] ?? k);
  const trail = useRef<SVGPathElement>(null);
  const car = useRef<SVGImageElement>(null);
  const [dest, setDest] = useState(to ?? DEMO[0]);
  const [arrived, setArrived] = useState(false);
  const demoIdx = useRef(0);

  useEffect(() => {
    if (to) setDest(to);
  }, [to]);

  useEffect(() => {
    // one cycle: drive (trail draws behind the vehicle), arrive, hold, fade; then next demo stop or replay
    let raf = 0;
    let hold: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const path = trail.current!;
    path.setAttribute('d', arc(MAP.centers[FROM], MAP.centers[dest]));
    const L = path.getTotalLength();
    const DUR = 1800 + L * 6;
    const drive = () => {
      setArrived(false);
      path.style.opacity = '1';
      const t0 = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - t0) / DUR);
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const head = e * L;
        path.style.strokeDasharray = `${head} ${L}`;
        const pt = path.getPointAtLength(head);
        car.current?.setAttribute('x', String(pt.x - 16));
        car.current?.setAttribute('y', String(pt.y - 16));
        if (t < 1) return void (raf = requestAnimationFrame(tick));
        setArrived(true);
        hold = setTimeout(() => {
          path.style.opacity = '0';
          hold = setTimeout(() => {
            if (to) drive();
            else {
              demoIdx.current = (demoIdx.current + 1) % DEMO.length;
              setDest(DEMO[demoIdx.current]);
            }
          }, 500);
        }, 1800);
      };
      raf = requestAnimationFrame(tick);
    };
    drive();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(hold);
    };
  }, [dest, to]);

  const [fx, fy] = MAP.centers[FROM];
  const [tx, ty] = MAP.centers[dest];
  return (
    <svg viewBox={`-30 -20 ${MAP.w + 60} ${MAP.h + 40}`} className="w-full overflow-visible" role="img" aria-label={t(`Route from Tejgaon to ${dest}, Dhaka`, `তেজগাঁও থেকে ${BN[dest] ?? dest}, ঢাকা যাওয়ার পথ`)}>
      {Object.entries(D).map(([k, d]) => (
        <path
          key={k}
          d={d}
          strokeWidth="4.2"
          strokeLinecap="round"
          className={`transition-[stroke] duration-700 ${k === dest && arrived ? 'stroke-[#0ABF8B]' : k === FROM ? 'stroke-black/40 dark:stroke-white/40' : 'stroke-black/15 dark:stroke-white/15'}`}
        />
      ))}
      {LABELS.filter((l) => l !== dest).map((l) => (
        <text key={l} x={MAP.centers[l][0]} y={MAP.centers[l][1]} textAnchor="middle" fontSize="11" className="fill-black/35 dark:fill-white/30">
          {name(l)}
        </text>
      ))}

      <path ref={trail} fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-black dark:stroke-white" />

      {/* pickup: black square with white centre, as in the app */}
      <rect x={fx - 7} y={fy - 7} width="14" height="14" rx="2.5" className="fill-black dark:fill-white" />
      <rect x={fx - 2.5} y={fy - 2.5} width="5" height="5" rx="1" className="fill-white dark:fill-black" />
      <circle cx={fx} cy={fy} r="7" fill="none" className="stroke-black dark:stroke-white" strokeWidth="1.5">
        <animate attributeName="r" values="7;18" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".6;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x={fx - 10} y={fy + 4} textAnchor="end" fontSize="12" fontWeight="600" className="fill-black dark:fill-white">{t('You', 'আপনি')}</text>

      <g className="transition-opacity duration-500" style={{ opacity: arrived ? 1 : 0.35 }}>
        {/* destination: red circle with white centre, as in the app */}
        <circle cx={tx} cy={ty} r="7" fill="#FF3B30" />
        <circle cx={tx} cy={ty} r="2.5" fill="#fff" />
        <text x={tx + 24} y={ty + 4} fontSize="13" fontWeight="600" className="fill-black dark:fill-white">
          {name(dest)}
        </text>
      </g>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <image ref={car} href={`/icons/${vehicle}.webp`} width="32" height="32" x={fx - 16} y={fy - 16} />
    </svg>
  );
}
