import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { dbReady, toggleVote } from '@/lib/challengeDb';

// ponytail: one vote per browser (cookie) plus a cap per network in the database. Add GitHub sign in if the board gets gamed.
export async function POST(req: Request) {
  if (!dbReady) return NextResponse.json({ error: 'Voting is not open yet.' }, { status: 503 });
  const { entry } = await req.json().catch(() => ({}));
  if (typeof entry !== 'string' || !/^[0-9a-f-]{36}$/.test(entry)) return NextResponse.json({ error: 'Invalid entry' }, { status: 400 });

  const jar = await cookies();
  let voter = jar.get('ch_voter')?.value;
  const fresh = !voter || !/^[0-9a-f-]{36}$/.test(voter);
  if (fresh) voter = crypto.randomUUID();
  const h = await headers();
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';

  try {
    const r = await toggleVote(entry, voter!, ip);
    if (r.error === 'limit') return NextResponse.json({ error: 'You already voted for this project.' }, { status: 429 });
    if (r.error) return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    const res = NextResponse.json(r);
    if (fresh) res.cookies.set('ch_voter', voter!, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 60 * 60 * 24 * 365 });
    return res;
  } catch (e) {
    console.error('vote failed', e);
    return NextResponse.json({ error: 'Couldn’t save your vote. Try again.' }, { status: 502 });
  }
}
