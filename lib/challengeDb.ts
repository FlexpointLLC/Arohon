import 'server-only';
import { createHash } from 'node:crypto';

// Talks to Supabase (Arohon Main) over PostgREST with the service role. Server only: never import from a client file.
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. Tables: challenge_entries, challenge_votes (RLS on, no public policies).
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const dbReady = Boolean(url && key);

async function sb<T>(path: string, init: RequestInit & { prefer?: string } = {}): Promise<T> {
  if (!dbReady) throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: 'no-store',
    headers: { apikey: key!, ...(key!.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json', ...(init.prefer ? { Prefer: init.prefer } : {}) },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  // inserts and updates answer 201/204 with an empty body
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** what the public board may see: no email, phone or note */
export type PublicEntry = { id: string; project: string; pitch: string; live_url: string; repo_url: string; name: string; team: string | null; votes: number; created_at: string };
const PUBLIC = 'id,project,pitch,live_url,repo_url,name,team,votes,created_at';

export const listEntries = (challenge: string) =>
  sb<PublicEntry[]>(`challenge_entries?select=${PUBLIC}&challenge=eq.${encodeURIComponent(challenge)}&hidden=is.false&order=votes.desc,created_at.asc&limit=500`);

export const votedBy = async (voter: string) =>
  (await sb<{ entry_id: string }[]>(`challenge_votes?select=entry_id&voter=eq.${encodeURIComponent(voter)}`)).map((v) => v.entry_id);

type EntryIn = { challenge: string; receipt: string; project: string; pitch: string; live_url: string; repo_url: string; name: string; email: string; phone: string; team: string; note: string };

/** one entry per email per challenge. No edits from the form: anyone can type someone else's email, so a repeat is refused */
export async function saveEntry(e: EntryIn) {
  const email = e.email.toLowerCase();
  const [old] = await sb<{ id: string }[]>(`challenge_entries?select=id&challenge=eq.${encodeURIComponent(e.challenge)}&email=eq.${encodeURIComponent(email)}`);
  if (old) return { receipt: '', exists: true };
  await sb('challenge_entries', { method: 'POST', body: JSON.stringify({ ...e, email }) });
  return { receipt: e.receipt, exists: false };
}

export const toggleVote = (entry: string, voter: string, ip: string) =>
  sb<{ voted?: boolean; votes?: number; error?: string }>('rpc/challenge_toggle_vote', {
    method: 'POST',
    body: JSON.stringify({ p_entry: entry, p_voter: voter, p_ip: createHash('sha256').update(`${ip}|${key}`).digest('hex').slice(0, 32) }),
  });
