'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { ArrowRight, ArrowUp, ArrowUpRight, GithubLogo, MagnifyingGlass } from '@phosphor-icons/react';
import { ease, up } from '../motion';
import { challengeBySlug, isOpen } from '@/lib/challenges';
import { kind, repoOf } from './Challenges';
import type { PublicEntry } from '@/lib/challengeDb';

const wrap = 'mx-auto max-w-[1280px] px-6 md:px-16';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const mono = 'font-mono text-[12px] tracking-wide';
const line = 'border-black/10 dark:border-white/10';

function ago(iso: string) {
  const s = (Date.now() - +new Date(iso)) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

/** count that slides up or down when it changes */
function Count({ n }: { n: number }) {
  const prev = useRef(n);
  const dir = n >= prev.current ? 1 : -1;
  useEffect(() => void (prev.current = n), [n]);
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={n} initial={{ y: `${dir * 100}%` }} animate={{ y: 0 }} exit={{ y: `${-dir * 100}%` }} transition={{ duration: 0.3, ease }}>
          {n}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Leaderboard({ slug, entries, voted, demo }: { slug: string; entries: PublicEntry[]; voted: string[]; demo?: boolean }) {
  const c = challengeBySlug(slug)!;
  const router = useRouter();
  const [rows, setRows] = useState(entries);
  const [mine, setMine] = useState(() => new Set(voted));
  const [sort, setSort] = useState<'top' | 'new'>('top');
  const [q, setQ] = useState('');
  const [toast, setToast] = useState('');
  const [mounted, setMounted] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const busy = useRef(new Set<string>());

  useEffect(() => setRows(entries), [entries]);
  useEffect(() => setMounted(true), []);
  // keep the board fresh while the tab is open
  useEffect(() => {
    if (demo) return;
    const id = setInterval(() => document.visibilityState === 'visible' && router.refresh(), 30000);
    return () => clearInterval(id);
  }, [router, demo]);
  // "/" jumps to search, like every dev tool
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  // rank is always by votes, whatever the view
  const rank = useMemo(() => new Map([...rows].sort((a, b) => b.votes - a.votes || +new Date(a.created_at) - +new Date(b.created_at)).map((r, i) => [r.id, i + 1])), [rows]);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = t ? rows.filter((r) => `${r.project} ${r.pitch} ${r.name} ${r.team ?? ''} ${repoOf(r.repo_url)}`.toLowerCase().includes(t)) : rows;
    return [...list].sort((a, b) => (sort === 'top' ? rank.get(a.id)! - rank.get(b.id)! : +new Date(b.created_at) - +new Date(a.created_at)));
  }, [rows, q, sort, rank]);
  const total = rows.reduce((s, r) => s + r.votes, 0);
  const open = !mounted || isOpen(c);

  async function vote(id: string) {
    if (busy.current.has(id)) return;
    busy.current.add(id);
    const was = mine.has(id);
    // optimistic: flip now, put it back if the server says no
    const flip = (on: boolean) => {
      setMine((m) => {
        const n = new Set(m);
        if (on) n.add(id);
        else n.delete(id);
        return n;
      });
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, votes: r.votes + (on ? 1 : -1) } : r)));
    };
    flip(!was);
    if (demo) return void busy.current.delete(id);
    try {
      const res = await fetch('/api/challenge/vote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entry: id }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Couldn’t save your vote.');
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, votes: j.votes } : r)));
      setMine((m) => {
        const n = new Set(m);
        if (j.voted) n.add(id);
        else n.delete(id);
        return n;
      });
    } catch (e) {
      flip(was);
      setToast(e instanceof Error ? e.message : 'Couldn’t save your vote.');
    } finally {
      busy.current.delete(id);
    }
  }

  return (
    // always dark here so the key art behind the hero reads well
    <div className="dark bg-black pb-32 text-white">
      <section className="relative overflow-hidden">
        <motion.div aria-hidden initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease }} className="absolute inset-0">
          <Image src="/challenges/bg.jpg" alt="" fill priority sizes="100vw" className="object-cover object-[70%_20%] opacity-45" />
        </motion.div>
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,rgba(0,0,0,.75)_45%,rgba(0,0,0,.2)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,#000)]" />

        <div className={`${wrap} relative pb-4 pt-28 sm:pt-36`}>
          <motion.div {...up(0.05)} className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${mono} ${muted}`}>
            <Link href="/challenges" className="hover:text-white">challenges</Link>
            <span>/</span>
            <span>{c.no}</span>
          </motion.div>

          <div className="mt-8 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <motion.div {...up(0.08)}>
                <Image src="/challenges/gta6.png" alt={`Win ${c.prize}`} width={140} height={110} className="h-auto w-[96px] sm:w-[120px]" />
              </motion.div>
              <motion.h1 {...up(0.1)} className="mt-6 text-[48px] font-medium leading-[0.95] tracking-[-0.04em] sm:text-[88px]">Leaderboard.</motion.h1>
              <motion.p {...up(0.18)} className={`mt-6 max-w-xl text-[18px] leading-relaxed ${muted}`}>
                Every project shipped for {c.name}. Open them, try them, vote for the ones you would actually use. Top two win {c.prize}.
              </motion.p>
            </div>
            <motion.div {...up(0.24)} className="grid gap-3 sm:flex">
              <Link href={`/challenges/${c.slug}/submit`} className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-medium text-black transition-transform active:scale-[.98] sm:w-auto">
                {open ? 'Submit yours' : 'See the challenge'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          <motion.div {...up(0.3)} className={`mt-14 grid grid-cols-3 border-y ${line}`}>
            {[
              [rows.length, 'entries'],
              [total, 'votes'],
              [c.winners, `win ${c.prize}`],
            ].map(([v, k], i) => (
              <div key={String(k)} className={`py-5 ${i ? `border-l pl-4 sm:pl-6 ${line}` : ''}`}>
                <p className="text-[32px] font-light leading-none tracking-[-0.03em] sm:text-[48px]"><Count n={Number(v)} /></p>
                <p className={`mt-2 ${mono} ${muted}`}>{k}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className={wrap}>
      {/* controls */}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className={`relative inline-flex self-start rounded-full border p-1 ${line}`}>
          {(['top', 'new'] as const).map((k) => (
            <button key={k} type="button" onClick={() => setSort(k)} className={`relative z-10 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${sort === k ? 'text-white dark:text-black' : muted}`}>
              {sort === k && <motion.span layoutId="sort" className="absolute inset-0 -z-10 rounded-full bg-white" transition={{ duration: 0.35, ease }} />}
              {k === 'top' ? 'Top' : 'New'}
            </button>
          ))}
        </div>
        <label className={`flex items-center gap-2 rounded-full border px-4 py-2.5 sm:w-72 ${line}`}>
          <MagnifyingGlass size={15} className={muted} />
          <input ref={search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="w-full bg-transparent text-[14px] outline-none placeholder:text-black/35 dark:placeholder:text-white/30" />
          <kbd className={`hidden rounded border px-1.5 ${mono} text-[10px] sm:inline ${line} ${muted}`}>/</kbd>
        </label>
      </div>

      {/* board */}
      <div className={`mt-6 border-t ${line}`}>
        {rows.length === 0 ? (
          <div className="py-24 text-center">
            <p className={`${mono} ${muted}`}>0 entries</p>
            <p className="mt-4 text-[28px] font-medium tracking-[-0.02em]">The board is empty. Be first.</p>
            <p className={`mx-auto mt-3 max-w-sm text-[15px] ${muted}`}>The first project on the board gets every eye for a while. Ship something.</p>
            <Link href={`/challenges/${c.slug}/submit`} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-[15px] font-medium text-white sm:w-auto dark:bg-white dark:text-black">
              Submit your project <ArrowRight size={16} />
            </Link>
          </div>
        ) : shown.length === 0 ? (
          <p className={`py-16 text-center text-[15px] ${muted}`}>No project matches “{q}”.</p>
        ) : (
          <LayoutGroup>
            <ol>
              {shown.map((r) => {
                const n = rank.get(r.id)!;
                const prize = n <= c.winners && r.votes > 0;
                const on = mine.has(r.id);
                const rp = repoOf(r.repo_url);
                return (
                  <motion.li
                    layout="position"
                    key={r.id}
                    transition={{ duration: 0.5, ease }}
                    className={`group relative grid grid-cols-[36px_1fr_auto] items-start gap-x-4 border-b py-6 sm:grid-cols-[56px_1fr_auto] sm:gap-x-6 ${line} ${sort === 'top' && n === c.winners && shown.length > c.winners ? 'border-b-white/40' : ''}`}
                  >
                    {prize && <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-6 right-0 -z-0 bg-[radial-gradient(60%_120%_at_0%_50%,rgba(214,92,170,.10),transparent_70%)] md:-left-10" />}
                    <span className={`pt-1 ${mono} text-[13px] ${prize ? '' : muted}`}>{String(n).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <a href={r.live_url} target="_blank" rel="noopener noreferrer nofollow ugc" className={`text-[19px] font-medium tracking-[-0.015em] hover:underline hover:underline-offset-4 sm:text-[22px] ${prize ? `fire-${n}` : ''}`}>
                          {r.project}
                        </a>
                        {prize && <span className={`rounded-full border px-2 py-0.5 ${mono} text-[10px] ${line}`}>{c.prize} zone</span>}
                      </div>
                      <p className={`mt-1.5 text-[15px] leading-relaxed ${muted}`}>{r.pitch}</p>
                      <div className={`mt-3 flex flex-wrap items-center gap-2 ${mono} text-[11px] ${muted}`}>
                        <span>{r.team || r.name}</span>
                        <span aria-hidden>/</span>
                        <span suppressHydrationWarning>{mounted ? ago(r.created_at) : ''}</span>
                        <a href={r.live_url} target="_blank" rel="noopener noreferrer nofollow ugc" className={`ml-1 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 hover:text-black dark:hover:text-white ${line}`}>
                          {kind(r.live_url)} <ArrowUpRight size={11} />
                        </a>
                        {rp && (
                          <a href={r.repo_url} target="_blank" rel="noopener noreferrer nofollow ugc" className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 hover:text-black dark:hover:text-white ${line}`}>
                            <GithubLogo size={12} /> {rp}
                          </a>
                        )}
                      </div>
                    </div>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.92 }}
                      onClick={() => vote(r.id)}
                      aria-pressed={on}
                      aria-label={`${on ? 'Remove vote for' : 'Vote for'} ${r.project}, ${r.votes} votes`}
                      className={`flex min-w-[56px] flex-col items-center gap-1 rounded-xl border px-3 py-2.5 transition-colors ${on ? 'border-white bg-white text-black' : `${line} hover:border-white/40`}`}
                    >
                      <motion.span animate={on ? { y: [0, -4, 0] } : { y: 0 }} transition={{ duration: 0.35, ease }}>
                        <ArrowUp size={15} weight={on ? 'bold' : 'regular'} />
                      </motion.span>
                      <span className="text-[14px] font-medium"><Count n={r.votes} /></span>
                    </motion.button>
                  </motion.li>
                );
              })}
            </ol>
          </LayoutGroup>
        )}
      </div>

      <p className={`mt-8 text-[13px] leading-relaxed ${muted}`}>
        One vote per project per person. Votes help the judges see what people love; the Arohon team picks the winners, see the FAQ on the{' '}
        <Link href={`/challenges/${c.slug}/submit`} className="underline underline-offset-2">submit page</Link>.
      </p>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} role="status" className="fixed inset-x-6 bottom-6 z-50 mx-auto max-w-sm rounded-xl bg-black px-4 py-3 text-center text-[14px] text-white sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 dark:bg-white dark:text-black">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
