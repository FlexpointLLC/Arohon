'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/** One small comet (bright head, about 25px fading tail) that circles a pill's hairline border at a steady speed. */
export function CometBorder() {
  const ref = useRef<SVGSVGElement>(null);
  const [geo, setGeo] = useState<{ d: string; L: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const draw = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const r = h / 2 - 0.5;
      // the exact pill outline, clockwise from the middle of the top edge
      const d = `M ${w / 2} 0.5 H ${w - h / 2} A ${r} ${r} 0 0 1 ${w - h / 2} ${h - 0.5} H ${h / 2} A ${r} ${r} 0 0 1 ${h / 2} 0.5 Z`;
      const L = 2 * (w - h) + Math.PI * 2 * r;
      setGeo({ d, L });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // one comet: 12 stacked strokes that all end at the same head, each a little shorter and brighter,
  // so the 26px tail fades smoothly instead of in visible steps
  const TAIL = 26;
  const STEPS = 12;
  const layers = Array.from({ length: STEPS }, (_, i) => {
    const len = TAIL * (1 - i / STEPS) + 1.5; // longest (faintest) first
    return { len, op: 0.06 + 0.94 * Math.pow((i + 1) / STEPS, 2.2) };
  });
  return (
    <svg ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {geo && (
        <>
          <path d={geo.d} fill="none" strokeWidth="1" className="stroke-black/10 dark:stroke-white/[.12]" />
          {/* the whole comet at 30% so it stays a quiet accent */}
          <g opacity={0.3}>
          {layers.map(({ len, op }, i) => {
            // the path is normalised to 100 units, so every dash pattern repeats exactly once per lap
            const u = (px: number) => (px * 100) / geo.L;
            const head = u(TAIL + 1.5);
            return (
              <path
                key={i}
                d={geo.d}
                pathLength={100}
                fill="none"
                strokeWidth="1"
                // butt caps: the leading zero length dash in the pattern must not draw a dot
                strokeLinecap="butt"
                strokeDasharray={`0 ${head - u(len)} ${u(len)} ${100 - head}`}
                opacity={op}
                className="comet stroke-black dark:stroke-white"
              />
            );
          })}
          </g>
        </>
      )}
    </svg>
  );
}
