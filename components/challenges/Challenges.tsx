'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Copy, ShareNetwork } from '@phosphor-icons/react';
import { ease, up } from '../motion';
import { CHALLENGES, isOpen, type Challenge } from '@/lib/challenges';

const wrap = 'mx-auto max-w-[1280px] px-6 md:px-16';
const muted = 'text-black/50 dark:text-[#8A8F98]';
const mono = 'font-mono text-[12px] tracking-wide';
const line = 'border-black/10 dark:border-white/10';
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka' });

/** ticks once a second; null until mounted so server and client HTML match */
export function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function left(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
}

/** a digit pair that rolls when it changes */
export function Roll({ v }: { v: number }) {
  const txt = String(v).padStart(2, '0');
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={txt} initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.35, ease }}>
          {txt}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Countdown({ c }: { c: Challenge }) {
  const now = useNow();
  const t = left(now === null ? +new Date(c.closes) - +new Date(c.opens) : +new Date(c.closes) - now);
  const cells: [number, string][] = [[t.d, 'days'], [t.h, 'hrs'], [t.m, 'min'], [t.s, 'sec']];
  return (
    <div className={`grid grid-cols-4 border-y ${line}`} aria-label={`Closes ${fmtDate(c.closes)}`}>
      {cells.map(([v, k], i) => (
        <div key={k} className={`py-5 ${i ? `border-l pl-4 sm:pl-6 ${line}` : ''}`}>
          <p className="text-[36px] font-light leading-none tracking-[-0.03em] sm:text-[56px]">{now === null ? '--' : <Roll v={v} />}</p>
          <p className={`mt-2 ${mono} ${muted}`}>{k}</p>
        </div>
      ))}
    </div>
  );
}

/* ── link sniffing: tell people what we think they pasted ── */
export function kind(url: string) {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, '');
    if (u.pathname.toLowerCase().endsWith('.apk')) return 'APK';
    if (h.endsWith('vercel.app')) return 'Vercel';
    if (h.endsWith('netlify.app')) return 'Netlify';
    if (h === 'play.google.com') return 'Play Store';
    if (h === 'testflight.apple.com') return 'TestFlight';
    if (h === 'apps.apple.com') return 'App Store';
    if (h.endsWith('figma.com')) return 'Figma';
    if (h === 'youtube.com' || h === 'youtu.be' || h === 'loom.com') return 'Video';
    if (h === 'drive.google.com') return 'Drive';
    if (h === 'github.com') return 'GitHub';
    return h;
  } catch {
    return '';
  }
}
export function repoOf(url: string) {
  try {
    const u = new URL(url);
    const [o, r] = u.pathname.split('/').filter(Boolean);
    return /^(www\.)?github\.com$/i.test(u.hostname) && o && r ? `${o}/${r.replace(/\.git$/, '')}` : '';
  } catch {
    return '';
  }
}

const field = 'w-full rounded-xl border border-black/10 bg-transparent px-4 py-3.5 text-[15px] outline-none transition-colors placeholder:text-black/30 focus:border-black/40 dark:border-white/10 dark:placeholder:text-white/25 dark:focus:border-white/40';

function Field({ label, hint, children }: { label: string; hint?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium">{label}</span>
        {hint && <span className={`${mono} text-[11px] ${muted}`}>{hint}</span>}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function SubmitForm({ c }: { c: Challenge }) {
  const [live, setLive] = useState('');
  const [repo, setRepo] = useState('');
  const [pitch, setPitch] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [err, setErr] = useState('');
  const [done, setDone] = useState<{ id: string; project: string } | null>(null);
  const [copied, setCopied] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const now = useNow();
  const open = now === null || isOpen(c, now);
  const lk = kind(live);
  const rp = repoOf(repo);

  async function submit(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (!form.current || state === 'sending') return;
    if (!form.current.reportValidity()) return;
    setState('sending');
    setErr('');
    const fd = new FormData(form.current);
    try {
      const res = await fetch('/api/challenge', { method: 'POST', body: fd });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || 'Something went wrong.');
      setDone({ id: j.id, project: String(fd.get('project')) });
      setState('idle');
    } catch (x) {
      setErr(x instanceof Error ? x.message : 'Something went wrong.');
      setState('error');
    }
  }

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(''), 1600);
    } catch {}
  };
  const share = async () => {
    const url = location.href.split('#')[0];
    const text = `I just shipped my entry to Arohon ${c.name}. Top two win GTA 6.`;
    if (navigator.share) navigator.share({ title: c.name, text, url }).catch(() => {});
    else copy(`${text} ${url}`, 'share');
  };

  if (done)
    return (
      <motion.div initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.7, ease }} className={`rounded-2xl border p-6 sm:p-8 ${line}`}>
        <p className={`${mono} ${muted}`}>entry received</p>
        <p className="mt-4 text-[28px] font-medium leading-tight tracking-[-0.02em]">{done.project} is in.</p>
        <div className={`mt-6 flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${line}`}>
          <span className={`${mono} text-[13px]`}>
            <span className={muted}>receipt </span>
            {done.id}
          </span>
          <button type="button" onClick={() => copy(done.id, 'id')} className={`inline-flex items-center gap-1.5 ${mono} ${muted} hover:text-black dark:hover:text-white`}>
            {copied === 'id' ? <Check size={14} /> : <Copy size={14} />} {copied === 'id' ? 'copied' : 'copy'}
          </button>
        </div>
        <p className={`mt-5 text-[15px] leading-relaxed ${muted}`}>Keep this receipt. Want to update your entry? Submit again with the same email before {fmtDate(c.closes)}. Results on {fmtDate(c.results)}.</p>
        <div className="mt-6 grid gap-3 sm:flex">
          <button type="button" onClick={share} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3.5 text-[15px] font-medium text-white transition-transform active:scale-[.98] sm:w-auto dark:bg-white dark:text-black">
            <ShareNetwork size={16} /> {copied === 'share' ? 'Link copied' : 'Tell your friends'}
          </button>
          <Link href={`/challenges/${c.slug}`} className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-[15px] font-medium sm:w-auto ${line}`}>
            See the leaderboard <ArrowUpRight size={15} />
          </Link>
        </div>
      </motion.div>
    );

  return (
    <form
      ref={form}
      onSubmit={submit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
      }}
    >
      <input type="hidden" name="challenge" value={c.slug} />
      <input tabIndex={-1} autoComplete="off" aria-hidden name="website" className="hidden" />
      <fieldset disabled={!open || state === 'sending'} className="space-y-5 disabled:opacity-60">
        <Field label="Project link" hint={lk ? <motion.span key={lk} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>detected: {lk}</motion.span> : 'apk, vercel, figma, video'}>
          <input name="live" type="url" required inputMode="url" placeholder="https://your-project.vercel.app" value={live} onChange={(e) => setLive(e.target.value.trim())} className={field} />
        </Field>
        <Field label="GitHub repo" hint={rp ? <motion.span key={rp} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1"><Check size={12} /> {rp}</motion.span> : repo ? 'needs github.com/owner/repo' : 'must be public'}>
          <input name="repo" type="url" required inputMode="url" pattern="https?://(www\.)?github\.com/[^/\s]+/[^/\s]+.*" title="A github.com/owner/repo link" placeholder="https://github.com/you/project" value={repo} onChange={(e) => setRepo(e.target.value.trim())} className={field} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Project name">
            <input name="project" required maxLength={120} placeholder="Jam Radar" className={field} />
          </Field>
          <Field label="Team" hint="optional">
            <input name="team" maxLength={200} placeholder="Solo, or names" className={field} />
          </Field>
        </div>
        <Field label="One line pitch" hint={`${pitch.length}/140`}>
          <input name="pitch" required maxLength={140} placeholder="Live waterlogging map built from rider reports" value={pitch} onChange={(e) => setPitch(e.target.value)} className={field} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name">
            <input name="name" required autoComplete="name" maxLength={120} className={field} />
          </Field>
          <Field label="Email">
            <input name="email" type="email" required autoComplete="email" maxLength={200} placeholder="you@email.com" className={field} />
          </Field>
        </div>
      </fieldset>

      <AnimatePresence>
        {err && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-5 text-[14px] text-red-600 dark:text-red-400" role="alert">
            {err}
          </motion.p>
        )}
      </AnimatePresence>

      <button type="submit" disabled={!open || state === 'sending'} className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-[15px] font-medium text-white transition-transform active:scale-[.98] disabled:opacity-50 dark:bg-white dark:text-black">
        {state === 'sending' ? 'Shipping' : open ? 'Ship it' : 'Submissions closed'}
        {open && state !== 'sending' && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
        <span className={`ml-2 hidden rounded border border-white/25 px-1.5 py-0.5 ${mono} text-[10px] opacity-70 sm:inline dark:border-black/25`}>⌘ ↵</span>
      </button>
      <p className={`mt-4 text-center text-[12px] ${muted}`}>You keep full ownership of what you build.</p>
    </form>
  );
}

export function ChallengeDetail({ slug }: { slug: string }) {
  const c = CHALLENGES.find((x) => x.slug === slug)!;
  return (
    <div className="mx-auto max-w-[640px] px-6 pb-32 pt-28 sm:pt-36">
      <motion.div {...up(0.05)} className={`flex items-center gap-3 ${mono} ${muted}`}>
        <Link href={`/challenges/${c.slug}`} className="hover:text-black dark:hover:text-white">challenges / {c.no} / submit</Link>
        <Link href={`/challenges/${c.slug}`} className="ml-auto inline-flex items-center gap-1 hover:text-black dark:hover:text-white">leaderboard <ArrowUpRight size={12} /></Link>
      </motion.div>
      <motion.h1 {...up(0.1)} className="mt-8 text-[44px] font-medium leading-[0.95] tracking-[-0.04em] sm:text-[64px]">{c.name}.</motion.h1>
      <motion.p {...up(0.16)} className={`mt-4 text-[18px] leading-relaxed ${muted}`}>{c.tagline}</motion.p>

      <motion.section {...up(0.22)} className="mt-12">
        <p className={`mb-3 ${mono} ${muted}`}>closes in</p>
        <Countdown c={c} />
      </motion.section>

      <motion.section {...up(0.28)} id="submit" className="mt-14 scroll-mt-28">
        <SubmitForm c={c} />
      </motion.section>

      <section className="mt-20">
        <p className={`${mono} ${muted}`}>faq</p>
        <div className={`mt-4 divide-y border-y ${line} divide-black/10 dark:divide-white/10`}>
          {c.faq.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[16px] font-medium">
                {q}
                <span className="text-[20px] font-light transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className={`mt-3 text-[15px] leading-relaxed ${muted}`}>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ChallengeHub() {
  const now = useNow();
  return (
    <div className={`${wrap} pb-32 pt-28 sm:pt-36`}>
      <motion.p {...up(0.05)} className={`${mono} ${muted}`}>arohon / challenges</motion.p>
      <motion.h1 {...up(0.1)} className="mt-8 text-[48px] font-medium leading-[0.95] tracking-[-0.04em] sm:text-[88px]">Build. Ship. Win.</motion.h1>
      <motion.p {...up(0.18)} className={`mt-6 max-w-xl text-[18px] leading-relaxed ${muted}`}>Open challenges for developers and designers in Bangladesh. Real problems, real prizes, judged on what you ship.</motion.p>

      <motion.div {...up(0.26)} className={`mt-16 border-t ${line}`}>
        {CHALLENGES.map((c) => {
          const open = now === null || isOpen(c, now);
          const days = now === null ? null : Math.max(0, Math.floor((+new Date(c.closes) - now) / 86400000));
          return (
            <Link key={c.slug} href={`/challenges/${c.slug}`} className={`group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 border-b py-8 sm:grid-cols-[64px_1fr_auto_auto] sm:gap-x-8 ${line}`}>
              <span className={`${mono} ${muted}`}>{c.no}</span>
              <span>
                <span className="block text-[24px] font-medium tracking-[-0.02em] sm:text-[32px]">{c.name}</span>
                <span className={`mt-1 block text-[15px] ${muted}`}>{c.tagline}</span>
              </span>
              <span className={`col-start-2 ${mono} ${muted} sm:col-start-auto`}>{open ? (days === null ? 'open' : `${days} days left`) : 'closed'}</span>
              <ArrowUpRight size={20} className="row-start-1 col-start-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:col-start-auto sm:row-start-auto" />
            </Link>
          );
        })}
        <div className={`grid grid-cols-[auto_1fr] items-center gap-x-5 border-b py-8 sm:grid-cols-[64px_1fr] sm:gap-x-8 ${line}`}>
          <span className={`${mono} ${muted}`}>{String(CHALLENGES.length + 1).padStart(2, '0')}</span>
          <span className={`text-[24px] font-medium tracking-[-0.02em] sm:text-[32px] text-black/25 dark:text-white/25`}>Next challenge, soon.</span>
        </div>
      </motion.div>
    </div>
  );
}
