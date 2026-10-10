'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { frameFor, TAIL_LIGHTS } from '@/lib/spriteHeadings';
import { animate, motion, MotionValue, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';

/*
 * Isometric city built from real DOM/SVG on a 1600×1000 plane tilted with CSS 3D.
 * Everything is vector (crisp at any size); vehicles are the customer app's 48-frame 3D sprites.
 */
const W = 1600;
const H = 1000;
const ROAD = 64;
const HX = [180, 470, 770]; // horizontal road centres (y), core grid the trip uses
const VX = [250, 640, 1020, 1390]; // vertical road centres (x)
// Outer city so the map fills wide screens: the grid continues to the right (and below, under the fade).
// Top and left keep the original edge (-200), so nothing new appears where the bike enters.
const EXT = 1500;
const HX_ALL = [...HX, 1070, 1370];
const VX_ALL = [...VX, 1780, 2170, 2560];
const CORE_PARKS = ['640,180', '1020,470', '640,770', '1390,180'];
// tiny deterministic hash → [0,1) so the outer city looks random but never changes between renders
const rnd = (a: number, b: number, k = 0) => {
  const x = Math.sin(a * 12.9898 + b * 78.233 + k * 37.719) * 43758.5453;
  return x - Math.floor(x);
};
type Block = { x: number; y: number; w: number; h: number; park: boolean; outer: boolean };
const BLOCKS: Block[] = (() => {
  const xs = [-200, ...VX_ALL, W + EXT];
  const ys = [-200, ...HX_ALL, H + EXT];
  const out: Block[] = [];
  for (let r = 0; r < ys.length - 1; r++)
    for (let c = 0; c < xs.length - 1; c++) {
      const x0 = xs[c], x1 = xs[c + 1], y0 = ys[r], y1 = ys[r + 1];
      const left = c === 0 ? x0 : x0 + ROAD / 2 + 10;
      const top = r === 0 ? y0 : y0 + ROAD / 2 + 10;
      const right = c === xs.length - 2 ? x1 : x1 - ROAD / 2 - 10;
      const bottom = r === ys.length - 2 ? y1 : y1 - ROAD / 2 - 10;
      const outer = !(x0 >= 250 && x1 <= 1390 && y0 >= 180 && y1 <= 770) && !(x0 >= -200 && x1 <= W + 200 && y0 >= -200 && y1 <= H + 200 && (x0 === 1390 || x1 === 250 || y0 === 770 || y1 === 180));
      const park = CORE_PARKS.includes(`${x0},${y0}`) || (outer && rnd(x0, y0) < 0.22);
      out.push({ x: left, y: top, w: right - left, h: bottom - top, park, outer });
    }
  return out;
})();

// Rider's trip, follows the road grid with rounded corners.
export const ROUTE =
  'M250 300 L250 430 Q250 470 290 470 L600 470 Q640 470 640 510 L640 730 Q640 770 680 770 L980 770 Q1020 770 1020 730 L1020 510 Q1020 470 1060 470 L1350 470 Q1390 470 1390 430 L1390 260';

// Ambient traffic loops (lane-offset from road centre). Vehicles use the app's 48-frame 3D sprites.
const TRAFFIC = [
  { d: 'M-80 162 L1700 162', v: 'car_plus', dur: 16, delay: 0 },
  { d: 'M1700 198 L-80 198', v: 'cng', dur: 22, delay: 6 },
  { d: 'M622 -80 L622 1080', v: 'bike', dur: 11, delay: 2 },
  { d: 'M1408 1080 L1408 -80', v: 'micro', dur: 15, delay: 5 },
  { d: 'M1700 788 L-80 788', v: 'car', dur: 18, delay: 9 },
];

const SPRITE = 84; // vehicle size in plane units, about one lane wide
const UP = 0; // stage extension above the map area (0 = map sits below the hero copy)
const BASE_H = 'clamp(520px, 78vw, 980px)';
// Wedge fade: a diagonal boundary rising ~11° from the bottom-left (under the hero buttons) to the
// top-right corner, so the city reveals itself along a slanted edge. Along a 169° gradient, the stage's
// top-right corner sits at w·sin(11°) ≈ 19vw, so the boundary starts just above that point.
const FADE_ANGLE = 169;
const FADE_ISO = `linear-gradient(${FADE_ANGLE}deg, transparent calc(19vw - 110px), #000 calc(19vw - 20px))`;
const FADE_EDGE = 'linear-gradient(to bottom, transparent, #000 6%, #000 84%, transparent)';
const PERSPECTIVE = 3600; // flatter perspective keeps the billboard lift from drifting sprites sideways

/*
 * Vehicles live inside the tilted 3D plane so buildings correctly hide them.
 * Each is a camera-facing billboard pivoting on its ground point, nudged toward the camera just enough
 * that its lower half never sinks below the road. Frame choice uses the vehicle's projected on-screen
 * direction matched against the measured heading of each sprite frame (lib/spriteHeadings).
 */
type Mover = { d: string; v: string; dur?: number; delay?: number; rider?: boolean };
const MOVERS: Mover[] = [...TRAFFIC, { d: ROUTE, v: 'car', rider: true }];
// Per-vehicle size relative to SPRITE.
const SCALE: Record<string, number> = { cng: 0.72 };
// Distance from a vehicle's ground point to its front bumper (plane units): where its headlight beam starts.
const FRONT: Record<string, number> = { car: 16, car_plus: 14, micro: 22, cng: 9, bike: 9 };
// Extra on-screen nudge for a vehicle's headlight, in screen px (negative y = up).
const LIGHT_NUDGE: Record<string, [number, number]> = { cng: [-14, 0], car_plus: [0, -4], bike: [4, 0] };
// Convert a screen-space nudge to plane units for the resting view (map spin −32°, tilt ≈ 44°).
const toPlane = ([sx, sy]: [number, number]): [number, number] => {
  const s = (-32 * Math.PI) / 180;
  const t = (44 * Math.PI) / 180;
  const yy = sy / Math.cos(t);
  return [sx * Math.cos(s) + yy * Math.sin(s), -sx * Math.sin(s) + yy * Math.cos(s)];
};
// Half the car's length on the ground plus a 2px gap, so the green line starts just ahead of the bonnet.
const BONNET_GAP = 46;
// Main car sits 8px right of the route centre, except in these stretches (route length ranges) where it
// drives in the centre: the start through the first turn, and the two straights heading up to the airport.
const RIDER_LANE = 8;
const CENTRED: [number, number][] = [
  [-Infinity, 130], // Gulshan 2 → start of first turn
  [1220, 1440], // straight up past the tall building
  [1860, Infinity], // final straight into the airport pin
];
const LANE_EASE = 65; // = one corner's length, so the lane change happens through the turn (each centred range is bounded by corners)
// Sprites are anchored at their tyre line (GROUND of the cell height), so only the strip below it needs
// lifting clear of the road: LIFT·cos(tilt) ≥ (1-GROUND)·SPRITE·sin(tilt) for tilt ≤ 48°.
const GROUND = 0.68;
const LIFT = 20; // vehicles bottom out at ~0.82 of the cell → ~12 units below the anchor

// Junctions where traffic crosses the main car's route. Each has a light that turns red for cross traffic
// while the main car is near, so traffic stops at the line and our car always has priority.
const JUNCTIONS: [number, number][] = [
  [640, 470],
  [640, 770],
  [1020, 770],
  [1390, 470],
];
const RED_RADIUS = 200; // light is red while the main car is within this distance of the junction
const STOP_BACK = 72; // stop line distance before the junction centre (half road + half car + margin)
const BRAKE = 130; // distance over which traffic slows to a stop

function Vehicles({ stageRef, planeRef, progress, spin, tilt, riderV }: {
  stageRef: React.RefObject<HTMLDivElement | null>;
  planeRef: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  spin: MotionValue<number>;
  tilt: MotionValue<number>;
  riderV: string; // vehicle type of the active ride (from the hero card stack)
}) {
  const vOf = (mv: Mover): string => (mv.rider ? riderV : mv.v);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const posEls = useRef<(HTMLDivElement | null)[]>([]);
  const pivotEls = useRef<(HTMLDivElement | null)[]>([]);
  const spriteEls = useRef<(HTMLDivElement | null)[]>([]);
  const lightEls = useRef<(HTMLDivElement | null)[]>([]);
  const tailEls = useRef<(HTMLSpanElement | null)[][]>([]);

  const lightPos = useRef<(HTMLDivElement | null)[]>([]);
  const lightPivot = useRef<(HTMLDivElement | null)[]>([]);
  const lightRed = useRef<(HTMLSpanElement | null)[]>([]);
  const lightGreen = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Per-traffic state: distance along its path, current speed, and the stop lines it meets.
    const state = MOVERS.map((mv, i) => {
      const path = paths.current[i];
      const len = path?.getTotalLength() ?? 1;
      const v0 = len / (mv.dur ?? 1);
      const stops: { j: number; at: number }[] = [];
      if (path && !mv.rider) {
        const p0 = path.getPointAtLength(0);
        const p1 = path.getPointAtLength(len);
        const ux = (p1.x - p0.x) / len;
        const uy = (p1.y - p0.y) / len;
        JUNCTIONS.forEach(([jx, jy], j) => {
          const along = (jx - p0.x) * ux + (jy - p0.y) * uy;
          const off = Math.abs((jx - p0.x) * uy - (jy - p0.y) * ux);
          if (off < 40 && along > 0 && along < len) stops.push({ j, at: along - STOP_BACK });
        });
      }
      return { len, v0, dist: ((mv.delay ?? 0) / (mv.dur ?? 1)) * len, v: v0, stops };
    });
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const stage = stageRef.current;
      const plane = planeRef.current;
      if (stage && plane) {
        const m = new DOMMatrix(getComputedStyle(plane).transform);
        const sw = stage.clientWidth;
        const sh = stage.clientHeight;
        // plane centre sits at (50%, 64%) of the stage; perspective origin is the stage centre
        const project = (x: number, y: number) => {
          const q = m.transformPoint(new DOMPoint(x - W / 2, y - H / 2, 0));
          const f = PERSPECTIVE / (PERSPECTIVE - q.z);
          // perspective origin = centre of the original map area; plane centre read from the DOM (it can be shifted right)
          const base = sh - UP;
          const poY = UP + base / 2;
          const cx = plane.offsetLeft + W / 2;
          const cy = plane.offsetTop + H / 2;
          return { x: sw / 2 + (cx - sw / 2 + q.x) * f, y: poY + (cy - poY + q.y) * f };
        };
        const billboard = `rotateZ(${-spin.get()}deg) rotateX(${-tilt.get()}deg)`;

        // Main car position decides which lights are red.
        const ri = MOVERS.length - 1;
        const rp = paths.current[ri];
        const riderPt = rp ? rp.getPointAtLength(progress.get() * state[ri].len) : { x: -9999, y: -9999 };
        const red = JUNCTIONS.map(([jx, jy]) => Math.hypot(riderPt.x - jx, riderPt.y - jy) < RED_RADIUS);

        JUNCTIONS.forEach((_, j) => {
          const pv = lightPivot.current[j];
          if (pv) pv.style.transform = billboard;
          const r = lightRed.current[j];
          const g = lightGreen.current[j];
          if (r) r.style.opacity = red[j] ? '1' : '.18';
          if (g) g.style.opacity = red[j] ? '.18' : '1';
        });

        MOVERS.forEach((mv, i) => {
          const path = paths.current[i];
          const pos = posEls.current[i];
          const pivot = pivotEls.current[i];
          const sprite = spriteEls.current[i];
          if (!path || !pos || !pivot || !sprite) return;
          const st = state[i];
          const len = st.len;
          let at: number;
          if (mv.rider) {
            at = progress.get() * len;
          } else {
            if (!reduced) {
              // brake for the nearest red stop line ahead, otherwise accelerate back to cruising speed
              let target = st.v0;
              for (const stop of st.stops) {
                const gap = stop.at - st.dist;
                if (!red[stop.j] || gap < -4 || gap > BRAKE) continue;
                target = Math.min(target, gap <= 0 ? 0 : st.v0 * Math.sqrt(gap / BRAKE));
              }
              const accel = st.v0 * 1.2;
              st.v = target < st.v ? target : Math.min(target, st.v + accel * dt);
              st.dist += st.v * dt;
              if (st.dist > len) st.dist -= len;
            }
            at = st.dist;
          }
          const a = path.getPointAtLength(at);
          const b = path.getPointAtLength(Math.min(len, at + 4));
          const c = path.getPointAtLength(Math.max(0, at - 4));
          const pb = project(b.x, b.y);
          const pc = project(c.x, c.y);
          const deg = ((Math.atan2(pb.x - pc.x, -(pb.y - pc.y)) * 180) / Math.PI + 360) % 360;
          const frame = frameFor(vOf(mv), deg);
          let x = a.x;
          let y = a.y;
          if (mv.rider) {
            const tx = b.x - c.x;
            const ty = b.y - c.y;
            const tl = Math.hypot(tx, ty) || 1;
            // 0 inside a centred stretch, easing to 1 within LANE_EASE of it
            const k = Math.min(...CENTRED.map(([s0, s1]) => Math.min(1, Math.max(0, Math.max(s0 - at, at - s1) / LANE_EASE))));
            const lane = RIDER_LANE * k * k * (3 - 2 * k); // smoothstep
            x += (-ty / tl) * lane;
            y += (tx / tl) * lane;
          }
          pos.style.transform = `translate(${x}px, ${y}px)`;
          // headlight beam + tail glow lie flat on the road, turned to the direction of travel (dark mode only)
          const lights = lightEls.current[i];
          if (lights) {
            let [nx, ny] = LIGHT_NUDGE[vOf(mv)] ? toPlane(LIGHT_NUDGE[vOf(mv)]) : [0, 0];
            // active CNG only: its sideways nudge is tuned for left/right travel, so fade it out as the CNG turns
            // to face up or down the screen, otherwise the beam slides off to one side on those stretches
            // facing up or down the screen it needs 12px to the right instead
            if (mv.rider && vOf(mv) === 'cng') {
              const r = (deg * Math.PI) / 180;
              const side = Math.abs(Math.sin(r));
              const vert = Math.abs(Math.cos(r));
              // the start of the trip, through the first turn, sits 4px further left
              const first = at <= CENTRED[0][1] + LANE_EASE ? -4 : 0;
              [nx, ny] = toPlane([LIGHT_NUDGE.cng[0] * side + 12 * vert + first, LIGHT_NUDGE.cng[1] * side]);
            }
            lights.style.transform = `translate(${x + nx}px, ${y + ny}px) rotate(${(Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI}deg)`;
            const beam = lights.firstElementChild as HTMLElement | null;
            // the active ride (green route) keeps the car's tuned start; traffic starts at its own front bumper
            if (beam) beam.style.left = `${mv.rider ? 16 : FRONT[vOf(mv)] ?? 16}px`;
            lights.style.opacity = mv.rider ? '1' : String(Math.min(1, (at / len) * 12, (1 - at / len) * 12));
          }
          pivot.style.transform = billboard;
          const sz = SPRITE * (SCALE[vOf(mv)] ?? 1);
          sprite.style.backgroundPosition = `${-(frame % 8) * sz}px ${-Math.floor(frame / 8) * sz}px`;
          // tail lights: placed on the lamps painted in this exact sprite frame; hidden when the rear faces away
          const tails = tailEls.current[i];
          if (tails) {
            const spots = TAIL_LIGHTS[vOf(mv)]?.[frame] ?? [];
            tails.forEach((t, k) => {
              if (!t) return;
              const spot = spots[k];
              t.style.visibility = spot ? 'visible' : 'hidden';
              if (spot) t.style.transform = `translate(${spot[0] * sz - 1.5}px, ${spot[1] * sz - 1.5}px)`;
            });
          }
          // Fade traffic in/out at the map edges. Opacity goes on the sprite (a leaf): opacity on a
          // preserve-3d wrapper would flatten the billboard onto the ground.
          const prog = at / len;
          sprite.style.opacity = mv.rider ? '1' : String(Math.min(1, prog * 12, (1 - prog) * 12));
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stageRef, planeRef, progress, spin, tilt, riderV]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        {MOVERS.map((mv, i) => <path key={i} ref={(n) => { paths.current[i] = n; }} d={mv.d} fill="none" />)}
      </svg>
      {/* Vehicle lights (dark mode): flat on the road, under the sprites */}
      {MOVERS.map((mv, i) => (
        <div key={'vl' + i} ref={(n) => { lightEls.current[i] = n; }} className="lights pointer-events-none absolute left-0 top-0 hidden dark:block" aria-hidden>
          {/* headlight beam fanning out ahead */}
          <div
            className="absolute"
            style={{
              left: 16,
              top: -22,
              width: 120,
              height: 44,
              clipPath: 'polygon(0 38%, 100% 0, 100% 100%, 0 62%)',
              background: 'linear-gradient(to right, rgba(255,244,210,.42), rgba(255,244,210,.12) 55%, transparent)',
              filter: 'blur(3px)',
            }}
          />
        </div>
      ))}
      {MOVERS.map((mv, i) => (
        <div key={i} ref={(n) => { posEls.current[i] = n; }} className="pointer-events-none absolute left-0 top-0 [transform-style:preserve-3d]">
          <div ref={(n) => { pivotEls.current[i] = n; }} className="absolute left-0 top-0 origin-top-left [transform-style:preserve-3d]">
            <div
              ref={(n) => { spriteEls.current[i] = n; }}
              className="absolute bg-no-repeat"
              style={{
                left: (-SPRITE * (SCALE[vOf(mv)] ?? 1)) / 2,
                top: -SPRITE * (SCALE[vOf(mv)] ?? 1) * GROUND,
                width: SPRITE * (SCALE[vOf(mv)] ?? 1),
                height: SPRITE * (SCALE[vOf(mv)] ?? 1),
                transform: `translateZ(${LIFT}px)`,
                backgroundImage: `url(/v/${vOf(mv)}.webp)`,
                backgroundSize: `${8 * SPRITE * (SCALE[vOf(mv)] ?? 1)}px ${6 * SPRITE * (SCALE[vOf(mv)] ?? 1)}px`,
                filter: mv.rider ? 'drop-shadow(0 0 10px rgba(10,191,139,.6))' : undefined,
              }}
            >
              <span ref={(n) => { (tailEls.current[i] ??= [])[0] = n; }} className="tail hidden dark:block" />
            </div>
          </div>
        </div>
      ))}
      {JUNCTIONS.map(([jx, jy], j) => (
        <div key={'l' + j} ref={(n) => { lightPos.current[j] = n; }} className="pointer-events-none absolute left-0 top-0 [transform-style:preserve-3d]" style={{ transform: `translate(${jx + 46}px, ${jy - 46}px)` }}>
          <div ref={(n) => { lightPivot.current[j] = n; }} className="absolute left-0 top-0 origin-top-left [transform-style:preserve-3d]">
            <div className="absolute flex flex-col items-center" style={{ left: -8, top: -64, transform: 'translateZ(6px)' }}>
              <div className="flex flex-col gap-[3px] rounded-[6px] bg-[#1b1f1d] p-[3px] shadow-md">
                <span ref={(n) => { lightRed.current[j] = n; }} className="h-[10px] w-[10px] rounded-full bg-[#FF4D3D] shadow-[0_0_8px_#FF4D3D] transition-opacity duration-300" />
                <span className="h-[10px] w-[10px] rounded-full bg-[#FFC53D] opacity-20" />
                <span ref={(n) => { lightGreen.current[j] = n; }} className="h-[10px] w-[10px] rounded-full bg-[#3DDB8A] shadow-[0_0_8px_#3DDB8A] transition-opacity duration-300" />
              </div>
              <div className="h-[22px] w-[3px] bg-[#4a504d]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

type Box = { x: number; y: number; w: number; d: number; h: number };
const BUILDINGS: Box[] = [
  { x: 330, y: 40, w: 70, d: 70, h: 72 },
  { x: 430, y: 60, w: 110, d: 60, h: 36 },
  { x: 720, y: 240, w: 80, d: 80, h: 102 },
  { x: 830, y: 260, w: 60, d: 60, h: 54 },
  { x: 1100, y: 40, w: 90, d: 80, h: 84 },
  { x: 1230, y: 70, w: 60, d: 50, h: 42 },
  { x: 60, y: 540, w: 90, d: 70, h: 48 },
  { x: 1100, y: 560, w: 70, d: 70, h: 120 },
  { x: 1200, y: 600, w: 60, d: 90, h: 66 },
  { x: 330, y: 560, w: 60, d: 110, h: 84 },
  { x: 740, y: 560, w: 100, d: 60, h: 30 },
  { x: 1480, y: 560, w: 80, d: 80, h: 78 },
];
// Outer blocks (only those reasonably near the camera, far ones are faded out anyway) get a building or trees.
// Decorate only outer blocks that are on screen at the sides: the rows above/below the core grid sit in the
// faded mask zone (decor there floats on blank ground), and every Building/Tree is several composited 3D layers.
const NEAR = (bk: Block) => bk.outer && bk.w > 120 && bk.h > 120 && bk.x > -700 && bk.x < W + 600 && bk.y > 100 && bk.y < H - 100;
const OUTER_BUILDINGS: Box[] = BLOCKS.filter((bk) => NEAR(bk) && !bk.park && rnd(bk.x, bk.y, 1) < 0.75).map((bk) => {
  const w = 60 + Math.round(rnd(bk.x, bk.y, 2) * 50);
  const d = 60 + Math.round(rnd(bk.x, bk.y, 3) * 40);
  return { x: bk.x + 30 + Math.round(rnd(bk.x, bk.y, 4) * Math.max(0, bk.w - w - 60)), y: bk.y + 30 + Math.round(rnd(bk.x, bk.y, 5) * Math.max(0, bk.h - d - 60)), w, d, h: 30 + Math.round(rnd(bk.x, bk.y, 6) * 90) };
});
const OUTER_TREES: [number, number][] = BLOCKS.filter((bk) => NEAR(bk) && bk.park).flatMap((bk) => {
  const cx = Math.round(bk.x + bk.w * (0.25 + rnd(bk.x, bk.y, 8) * 0.5));
  const cy = Math.round(bk.y + bk.h * (0.25 + rnd(bk.x, bk.y, 9) * 0.5));
  return [[cx, cy], [cx + 50, cy + 30], [cx + 10, cy + 70]] as [number, number][];
});

// Street lamps (posts in both modes, lit only in dark mode): roughly one per block length along the core roads, alternating curbs,
// clear of junctions. Each records whether its arm must flip so it always reaches over its street on screen.
const LAMP_SPACING = 640;
const LAMPS: [number, number, boolean][] = (() => {
  const out: [number, number, boolean][] = [];
  const curb = ROAD / 2 + 8;
  const s = (-32 * Math.PI) / 180; // resting map spin
  // screen-x direction of a plane vector after the map's Z spin; negative = points left on screen
  const screenX = (dx: number, dy: number) => dx * Math.cos(s) - dy * Math.sin(s);
  const nearJunction = (v: number, list: number[]) => list.some((c) => Math.abs(v - c) < 90);
  HX.forEach((y, r) => {
    for (let x = 120 + r * 120, k = r; x < W + 200; x += LAMP_SPACING, k++) {
      if (nearJunction(x, VX)) continue;
      const side = k % 2 ? 1 : -1;
      out.push([x, y + side * curb, screenX(0, -side * curb) < 0]);
    }
  });
  VX.forEach((x, c) => {
    for (let y = 60 + c * 90, k = c; y < H + 40; y += LAMP_SPACING, k++) {
      if (nearJunction(y, HX)) continue;
      const side = k % 2 ? 1 : -1;
      out.push([x + side * curb, y, screenX(-side * curb, 0) < 0]);
    }
  });
  // drop lamps that clash with scenery: behind the tall building at (720, 240), and the next one to its right, behind the building near the park
  const REMOVED: [number, number][] = [[760, 220], [1520, 510]];
  return out.filter(([x, y]) => !REMOVED.some(([rx, ry]) => Math.abs(x - rx) < 2 && Math.abs(y - ry) < 2));
})();

/** Curved-arm street lamp with a cone of light falling to the ground (dark mode). Pole base = ground point. */
function StreetLamp({ flip }: { flip?: boolean }) {
  return (
    <svg width="46" height="62" viewBox="0 0 46 62" className="block overflow-visible" style={{ transform: `translateX(${flip ? -15 : 15}px) scaleX(${flip ? -1 : 1})` }} aria-hidden>
      <defs>
        <linearGradient id="lampBeam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF2B8" stopOpacity=".28" />
          <stop offset="1" stopColor="#FFE08A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* light cone */}
      <path d="M27 11 L35 11 L46 62 L18 62 Z" fill="url(#lampBeam)" className="hidden dark:inline" style={{ filter: 'blur(3px)' }} />
      {/* soft halo around the head */}
      <circle cx="31" cy="9" r="9" fill="#FFE7A6" opacity=".22" className="hidden dark:inline" style={{ filter: 'blur(4px)' }} />
      {/* pole + curved arm */}
      <path d="M8 62 L8 9 Q8 4 14 4 L27 6" className="stroke-[#8E979F] dark:stroke-[#2F3A44]" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <rect x="6" y="58" width="4" height="4" rx="1" className="fill-[#8E979F] dark:fill-[#2F3A44]" />
      {/* lamp head + glowing lens */}
      <path d="M24 6 Q31 2 38 6 L37 9 L25 9 Z" className="fill-[#8E979F] dark:fill-[#2F3A44]" />
      <ellipse cx="31" cy="9.6" rx="5.5" ry="1.6" className="fill-[#D6DADE] dark:fill-[#FFF6CF] dark:[filter:drop-shadow(0_0_6px_rgba(255,220,140,.7))]" />
    </svg>
  );
}

const TREES = [
  [470, 300], [520, 330], [480, 370], [880, 590], [920, 640], [860, 660], [1180, 280], [1240, 320], [1290, 270],
  [90, 300], [140, 350], [700, 880], [760, 900], [1460, 300], [1500, 360], [1160, 880], [420, 870],
];

function Building({ x, y, w, d, h }: Box) {
  const face = 'absolute backface-visible';
  return (
    <div className="absolute [transform-style:preserve-3d]" style={{ left: x, top: y, width: w, height: d }}>
      <div className="absolute inset-0 rounded-[3px] bg-black/10 blur-[6px]" style={{ transform: 'translate(14px,14px)' }} />
      {/* south */}
      <div className={`${face} bg-[var(--bld-s)]`} style={{ left: 0, top: d, width: w, height: h, transformOrigin: 'top', transform: 'rotateX(90deg)' }}>
        <Windows fw={w} fh={h} seed={x * 7 + y} />
      </div>
      {/* north */}
      <div className={`${face} bg-[var(--bld-n)]`} style={{ left: 0, top: 0, width: w, height: h, transformOrigin: 'top', transform: 'rotateX(90deg)' }} />
      {/* east */}
      <div className={`${face} bg-[var(--bld-e)]`} style={{ left: w, top: 0, width: h, height: d, transformOrigin: 'left', transform: 'rotateY(-90deg)' }}>
        <Windows fw={h} fh={d} seed={x * 13 + y * 3} />
      </div>
      {/* west */}
      <div className={`${face} bg-[var(--bld-w)]`} style={{ left: 0, top: 0, width: h, height: d, transformOrigin: 'left', transform: 'rotateY(-90deg)' }} />
      {/* roof */}
      <div className="absolute inset-0 bg-[var(--bld-roof)]" style={{ transform: `translateZ(${h}px)` }}>
        <div className="absolute inset-[18%] rounded-sm bg-[var(--bld-roof-in)]" />
      </div>
    </div>
  );
}
// Light mode: subtle window stripes. Dark mode: a lit window grid (deterministic per building, a few flicker).
function Windows({ fw, fh, seed }: { fw: number; fh: number; seed: number }) {
  const CELL = 10;
  const GAP = 7;
  const cols = Math.max(1, Math.floor((fw - 14) / (CELL + GAP)));
  const rows = Math.max(1, Math.floor((fh - 14) / (CELL + GAP)));
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const r = rnd(seed, i, 11);
    return r < 0.42 ? 'win' : r < 0.47 ? 'win on flicker' : 'win on';
  });
  return (
    <>
      <div className="absolute inset-x-[12%] inset-y-[10%] bg-[repeating-linear-gradient(to_bottom,transparent_0_10px,rgba(120,130,140,.18)_10px_13px)] dark:hidden" />
      <div
        className="absolute inset-[7px] hidden place-content-center dark:grid"
        style={{ gridTemplateColumns: `repeat(${cols}, ${CELL}px)`, gridAutoRows: `${CELL}px`, gap: GAP }}
      >
        {cells.map((c, i) => <span key={i} className={c} style={c.includes('flicker') ? { animationDelay: `${(i * 1.7) % 7}s` } : undefined} />)}
      </div>
    </>
  );
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <div className="absolute [transform-style:preserve-3d]" style={{ left: x - 18, top: y - 18 }}>
      <div className="absolute h-9 w-9 rounded-full bg-black/10 blur-[3px]" style={{ transform: 'translate(8px,8px)' }} />
      {/* dark mode: soft warm pool of light on the ground under the tree (flat, never above it) */}
      <div className="absolute -left-2 -top-2 hidden h-[52px] w-[52px] rounded-full bg-[radial-gradient(circle,rgba(255,210,140,.10),rgba(255,210,140,.04)_45%,transparent_70%)] dark:block" />
      <div className="absolute h-9 w-9 rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--tree-hi),var(--tree-mid)_60%,var(--tree-lo))]" style={{ transform: 'translateZ(22px)' }} />
      <div className="absolute left-[9px] top-[9px] h-[18px] w-[18px] rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--tree-top-hi),var(--tree-top-lo))]" style={{ transform: 'translateZ(34px)' }} />
    </div>
  );
}

/** Upright marker that stays facing the camera on the tilted plane. */
function Billboard({ x, y, tilt, spin, lift = 80, className = '', children }: { x: number; y: number; tilt: number; spin: number; lift?: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`absolute [transform-style:preserve-3d] ${className}`} style={{ left: x, top: y }}>
      <div className="absolute bottom-0 left-0 origin-bottom -translate-x-1/2" style={{ transform: `translateX(-50%) rotateZ(${-spin}deg) rotateX(${-tilt}deg) translateZ(${lift}px)` }}>
        {children}
      </div>
    </div>
  );
}

export function CityMap({ progress, riderV = 'car', dest = 'Dhanmondi' }: { progress: MotionValue<number>; riderV?: string; dest?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] });
  const tilt = useSpring(useTransform(scrollYProgress, [0.2, 0.8], [48, 40]), { stiffness: 80, damping: 20 });
  const px = useMotionValue(0);
  const spinBase = -32;
  const spin = useSpring(useTransform(px, (v) => spinBase + v * 4), { stiffness: 60, damping: 18 });
  const [angles, setAngles] = useState({ tilt: 48, spin: spinBase });
  useMotionValueEvent(tilt, 'change', (t) => setAngles((a) => ({ ...a, tilt: t })));
  useMotionValueEvent(spin, 'change', (s) => setAngles((a) => ({ ...a, spin: s })));

  // Green = the part of the trip still ahead of the car, starting just past its front bumper.
  const [routeLen, setRouteLen] = useState(2400);
  const ahead = useTransform(progress, (p) => Math.min(1, p + BONNET_GAP / routeLen));
  const remaining = useTransform(ahead, (a) => 1 - a);

  useEffect(() => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', ROUTE);
    setRouteLen(el.getTotalLength());
  }, []);

  useEffect(() => {
    const fit = () => setScale(Math.min(1.15, Math.max(0.55, window.innerWidth / 1500)));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div className="relative">
    <div
      ref={stageRef}
      onPointerMove={(e) => px.set(e.clientX / window.innerWidth - 0.5)}
      className="relative w-full overflow-hidden"
      style={
        {
          // The stage extends UP px above the original map area so the city fills the space beside the hero text.
          height: `calc(${UP}px + ${BASE_H})`,
          perspective: PERSPECTIVE,
          perspectiveOrigin: `50% calc(${UP}px + 0.5 * ${BASE_H})`,
          maskImage: `${FADE_ISO}, ${FADE_EDGE}`,
          maskComposite: 'intersect',
          WebkitMaskImage: `${FADE_ISO}, ${FADE_EDGE}`,
          WebkitMaskComposite: 'source-in',
        } as React.CSSProperties
      }
      aria-hidden
    >
      <motion.div
        ref={planeRef}
        className="absolute left-1/2 [transform-style:preserve-3d]"
        style={{
          top: `calc(${UP}px + 0.58 * ${BASE_H})`,
          width: W,
          height: H,
          marginLeft: -W / 2,
          marginTop: -H / 2,
          scale,
          rotateX: tilt,
          rotateZ: spin,
        }}
      >
        {/* Ground, water, parks, roads */}
        <svg width={W} height={H} className="absolute inset-0 overflow-visible">
          <defs>
            <pattern id="dash" width="28" height="4" patternUnits="userSpaceOnUse">
              <rect width="14" height="4" fill="#fff" />
            </pattern>
          </defs>
          <rect x={-400} y={-400} width={W + 400 + EXT} height={H + 400 + EXT} style={{ fill: 'var(--map-ground)' }} />
          <path d="M-400 850 Q 120 820 200 1000 L200 1400 L-400 1400 Z" style={{ fill: 'var(--map-water)' }} />
          <path d="M1450 640 Q 1530 600 1700 620 L2000 620 L2000 1400 L1500 1400 Q 1440 900 1450 640 Z" style={{ fill: 'var(--map-water)' }} />
          {/* blocks */}
          {BLOCKS.map((bk, i) => (
            <rect key={i} x={bk.x} y={bk.y} width={Math.max(0, bk.w)} height={Math.max(0, bk.h)} rx="14" style={{ fill: bk.park ? 'var(--map-park)' : 'var(--map-block)' }} />
          ))}
          {/* roads */}
          {HX_ALL.map((y) => <rect key={'h' + y} x={-400} y={y - ROAD / 2} width={W + 400 + EXT} height={ROAD} style={{ fill: 'var(--map-road)' }} />)}
          {VX_ALL.map((x) => <rect key={'v' + x} x={x - ROAD / 2} y={-400} width={ROAD} height={H + 400 + EXT} style={{ fill: 'var(--map-road)' }} />)}
          {/* route */}
          <path d={ROUTE} style={{ stroke: 'var(--map-route)' }} strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <motion.path d={ROUTE} stroke="#0ABF8B" strokeWidth="26" fill="none" strokeLinecap="butt" strokeLinejoin="round" style={{ pathLength: remaining, pathOffset: ahead }} />
          <path d={ROUTE} style={{ stroke: 'var(--map-dash)' }} strokeWidth="3" strokeDasharray="12 12" fill="none" />
          {/* pickup ring */}
          <circle cx="250" cy="300" r="22" strokeWidth="8" style={{ fill: 'var(--pin-dot)', stroke: 'var(--map-route)' }} />
          <circle cx="250" cy="300" r="22" fill="none" stroke="#0ABF8B" strokeWidth="3">
            <animate attributeName="r" values="22;60" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".9;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="1390" cy="260" r="20" style={{ fill: 'var(--map-route)' }} />
          <circle cx="1390" cy="260" r="8" style={{ fill: 'var(--map-dash)' }} />
        </svg>

        {BUILDINGS.map((b, i) => <Building key={i} {...b} />)}
        {TREES.map(([x, y], i) => <Tree key={i} x={x} y={y} />)}
        {OUTER_BUILDINGS.map((b, i) => <Building key={'ob' + i} {...b} />)}
        {OUTER_TREES.map(([x, y], i) => <Tree key={'ot' + i} x={x} y={y} />)}

        {/* Street lamps: warm pool on the road + upright post, dark mode only */}
        {LAMPS.map(([x, y], i) => (
          <div key={'lp' + i} className="absolute hidden h-[140px] w-[140px] rounded-full bg-[radial-gradient(circle,rgba(255,205,130,.10),rgba(255,205,130,.035)_45%,transparent_70%)] blur-[2px] dark:block" style={{ left: x - 70, top: y - 70 }} />
        ))}
        {LAMPS.map(([x, y, flip], i) => (
          <Billboard key={'lb' + i} x={x} y={y} tilt={angles.tilt} spin={angles.spin} lift={4}>
            <StreetLamp flip={flip} />
          </Billboard>
        ))}


        <Vehicles stageRef={stageRef} planeRef={planeRef} progress={progress} spin={spin} tilt={tilt} riderV={riderV} />

        {/* Destination pin */}
        <Billboard x={1390} y={260} tilt={angles.tilt} spin={angles.spin}>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center">
            <div className="whitespace-nowrap rounded-full bg-black px-4 py-2 text-[22px] font-bold text-white shadow-xl dark:bg-white dark:text-black">{dest}</div>
            <svg width="54" height="70" viewBox="0 0 24 32" className="mt-3 drop-shadow-xl">
              <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20.4 12 32 12 32s12-11.6 12-20.3C24 5.2 18.6 0 12 0z" style={{ fill: 'var(--pin)' }} />
              <circle cx="12" cy="11.5" r="4.5" style={{ fill: 'var(--pin-dot)' }} />
            </svg>
          </motion.div>
        </Billboard>
        <Billboard x={250} y={300} tilt={angles.tilt} spin={angles.spin}>
          <div className="mb-10 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[22px] font-bold text-black shadow-xl ring-1 ring-black/5 dark:bg-[#292929] dark:text-white dark:ring-white/10">
            <span className="mr-2 inline-block h-3 w-3 rounded-full bg-brand-green" />Gulshan 2
          </div>
        </Billboard>
      </motion.div>
    </div>
    </div>
  );
}

/** Shared trip progress 0→1, looping, so the map and the ride card stay in sync. */
export function useTripProgress(duration = 14) {
  const p = useMotionValue(0);
  const ctrl = useRef<ReturnType<typeof animate> | null>(null);
  const start = useCallback(() => {
    ctrl.current?.stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      p.set(0.45);
      return;
    }
    p.set(0);
    ctrl.current = animate(p, [0, 1], { duration, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2 });
  }, [p, duration]);
  useEffect(() => {
    start();
    return () => ctrl.current?.stop();
  }, [start]);
  return { progress: p, restart: start };
}
