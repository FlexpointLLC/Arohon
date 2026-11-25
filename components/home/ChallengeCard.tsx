'use client';

import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { CHALLENGES, isOpen } from '@/lib/challenges';
import { left, useNow } from '../challenges/Challenges';

/** the challenge running right now, if any. Checked at render so server and client agree on whether to show it. */
export const liveChallenge = () => CHALLENGES.find((x) => isOpen(x));

// Notice pill above the home headline for the live build challenge: moving gradient border, quiet countdown.
export function ChallengeCard() {
  const now = useNow();
  const c = liveChallenge();
  if (!c) return null;
  const t = now === null ? null : left(+new Date(c.closes) - now);
  return (
    <Link href={`/challenges/${c.slug}`} className="group relative inline-flex whitespace-nowrap rounded-full p-[1.5px]">
      <span aria-hidden className="absolute inset-0 animate-[pillflow_4s_linear_infinite] rounded-full bg-[linear-gradient(90deg,#7b3fe4,#e0457b,#ff9a4d,#e0457b,#7b3fe4)] bg-[length:200%_100%] opacity-90 blur-[0.5px]" />
      <span aria-hidden className="absolute inset-0 animate-[pillflow_4s_linear_infinite] rounded-full bg-[linear-gradient(90deg,#7b3fe4,#e0457b,#ff9a4d,#e0457b,#7b3fe4)] bg-[length:200%_100%] opacity-40 blur-md transition-opacity group-hover:opacity-70" />
      <span className="relative inline-flex items-center gap-2 rounded-full bg-[#FDFDFD] py-[4px] pl-[4px] pr-[13px] text-[13px] font-medium text-black dark:bg-black dark:text-white">
        <span className="rounded-full bg-[linear-gradient(135deg,#7b3fe4,#e0457b,#ff9a4d)] px-2 py-0.5 text-[11px] font-semibold text-white">Win GTA 6</span>
        <span className="sm:hidden">Build challenge</span>
        <span className="hidden sm:inline">{c.name}</span>
        <span className="font-mono text-[12px] font-normal tabular-nums text-black/45 dark:text-white/50">{t ? `${t.d}d ${String(t.h).padStart(2, '0')}h` : ''}</span>
        <ArrowRight size={12} className="text-black/40 transition-transform group-hover:translate-x-0.5 dark:text-white/50" />
      </span>
    </Link>
  );
}
