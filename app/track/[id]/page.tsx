'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Copy } from '@phosphor-icons/react';
import { RouteMarkers } from '@/components/RouteMarkers';
import { StoreBadges } from '@/components/StoreButtons';
import { up } from '@/components/motion';

const muted = 'text-black/50 dark:text-[#8A8F98]';

/** Shared ride link: tries to open the ride in the Arohon app, and explains what to do if it isn't installed. */
export default function TrackPage() {
  const params = useParams();
  const rideId = ((params?.id as string) || '').trim();
  const appScheme = rideId ? `arohon-customer://track/${rideId}` : '';
  const [copied, setCopied] = useState(false);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!appScheme) return;
    window.location.replace(appScheme);
    // if we are still here after a moment, the app most likely isn't installed
    const t = setTimeout(() => setTried(true), 1800);
    return () => clearTimeout(t);
  }, [appScheme]);

  if (!rideId) return null;

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#FDFDFD] px-6 py-10 text-black dark:bg-black dark:text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <a href="/" aria-label="Arohon home"><img src="/logo.png" alt="Arohon" className="h-7 w-auto dark:[filter:brightness(0)_invert(1)]" /></a>

      <div className="flex w-full max-w-[420px] flex-1 flex-col justify-center py-12">
        <motion.p {...up(0.05)} className={`text-[13px] ${muted}`}>Shared ride</motion.p>
        <motion.h1 {...up(0.1)} className="mt-3 text-[34px] font-medium leading-[1.08] tracking-[-0.022em]">
          Someone shared
          <br />
          <span className="text-black/45 dark:text-[#8A8F98]">their ride with you.</span>
        </motion.h1>

        {/* the trip, drawn live: a car travels between the route markers while the app opens */}
        <motion.div {...up(0.2)} className="mt-8 rounded-[24px] bg-white p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,.3)] ring-1 ring-black/5 dark:bg-[#1C1C1E] dark:ring-white/10">
          <div className="flex items-center gap-2 text-[13px]">
            <span className={`h-2 w-2 rounded-full ${tried ? 'bg-[#FF9500]' : 'animate-pulse bg-[#079A70]'}`} />
            <span className="font-medium">{tried ? 'Open it in the Arohon app' : 'Opening in the Arohon app…'}</span>
          </div>
          <div className="mt-5 flex gap-3">
            <RouteMarkers pad="py-[3px]" />
            <div className="relative flex-1 space-y-3 text-[15px]">
              <p className="leading-[22px]">Pickup</p>
              <p className="leading-[22px]">Destination</p>
              <span aria-hidden className="track-car absolute -left-[26px] top-0 h-5 w-5 rounded-full border-[3px] border-white bg-black shadow dark:border-[#1C1C1E] dark:bg-white" />
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/[.07] pt-4 dark:border-white/[.07]">
            <span className="min-w-0">
              <span className={`block text-[12px] ${muted}`}>Ride ID</span>
              <span className="block truncate font-mono text-[14px] font-medium">{rideId}</span>
            </span>
            <button
              type="button"
              onClick={() => { navigator.clipboard?.writeText(rideId).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/[.05] px-3 py-1.5 text-[12px] font-medium dark:bg-white/[.08]"
            >
              {copied ? <><Check size={13} weight="bold" className="text-[#079A70]" /> Copied</> : <><Copy size={13} /> Copy</>}
            </button>
          </div>
        </motion.div>

        <motion.a {...up(0.3)} href={appScheme} className="mt-6 flex w-full items-center justify-center rounded-full bg-black py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black">
          Open ride in the app
        </motion.a>

        <motion.div {...up(0.4)} className="mt-10 border-t border-black/10 pt-8 dark:border-white/10">
          <p className="text-[15px] font-medium">Don’t have Arohon yet?</p>
          <ol className={`mt-3 space-y-1.5 text-[14px] ${muted}`}>
            <li>1. Download the app and sign in.</li>
            <li>2. Open the Track tab.</li>
            <li>3. Paste the ride ID above to follow the ride live.</li>
          </ol>
          <div className="mt-6"><StoreBadges /></div>
        </motion.div>
      </div>
    </main>
  );
}
