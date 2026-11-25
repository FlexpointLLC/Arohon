import { NextResponse } from 'next/server';
import { clean, isEmail, sendMail, table } from '@/lib/mail';
import { challengeBySlug, isOpen } from '@/lib/challenges';
import { dbReady, saveEntry } from '@/lib/challengeDb';

const isUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};
const isRepo = (s: string) => isUrl(s) && /^(www\.)?github\.com$/i.test(new URL(s).hostname) && new URL(s).pathname.split('/').filter(Boolean).length >= 2;

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  if (clean(form.get('website'), 200)) return NextResponse.json({ ok: true, id: 'ok' }); // honeypot

  const c = challengeBySlug(clean(form.get('challenge'), 80));
  if (!c) return NextResponse.json({ error: 'Unknown challenge' }, { status: 400 });
  if (!isOpen(c)) return NextResponse.json({ error: 'Submissions are closed for this challenge.' }, { status: 400 });

  const f = (k: string, max: number) => clean(form.get(k), max);
  const name = f('name', 120), email = f('email', 200), phone = f('phone', 40), team = f('team', 200);
  const project = f('project', 120), pitch = f('pitch', 600), live = f('live', 500), repo = f('repo', 500), note = f('note', 2000);
  if (!name || !isEmail(email)) return NextResponse.json({ error: 'Add your name and a valid email.' }, { status: 400 });
  if (!project || !pitch) return NextResponse.json({ error: 'Add a project name and a one line pitch.' }, { status: 400 });
  if (!isUrl(live)) return NextResponse.json({ error: 'The project link must be a full URL starting with https://' }, { status: 400 });
  if (repo && !isRepo(repo)) return NextResponse.json({ error: 'The repo must be a github.com/owner/repo link.' }, { status: 400 });

  // the repo is optional, but if given it has to be public: GitHub answers 404 for private or missing repos. If GitHub is down or rate limits us, let it through.
  const [owner, name_] = repo ? new URL(repo).pathname.split('/').filter(Boolean) : ['', ''];
  const gh = !repo ? null : await fetch(`https://api.github.com/repos/${owner}/${name_.replace(/\.git$/, '')}`, { headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'arohon-challenge' } }).catch(() => null);
  if (gh?.status === 404) return NextResponse.json({ error: 'We can’t see that repo. Make it public on GitHub, then submit again.' }, { status: 400 });
  if (gh?.ok && (await gh.json().catch(() => ({}))).private) return NextResponse.json({ error: 'That repo is private. Make it public, then submit again.' }, { status: 400 });

  // short receipt id the entrant sees and we see in the subject, so entries can be matched later
  const id = `${c.no}-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
  let receipt = id;
  if (dbReady) {
    try {
      const saved = await saveEntry({ challenge: c.slug, receipt: id, project, pitch, live_url: live, repo_url: repo, name, email, phone, team, note });
      if (saved.exists) return NextResponse.json({ error: 'This email already has an entry. To change it, email support@arohon.co from that address.' }, { status: 409 });
      receipt = saved.receipt;
    } catch (e) {
      console.error('challenge save failed', e);
      return NextResponse.json({ error: 'Couldn’t save your entry right now. Try again in a minute.' }, { status: 502 });
    }
  }
  // the board is the record; the email is a heads up for the team, so a mail hiccup never loses an entry
  try {
    await sendMail({
      to: process.env.CHALLENGE_TO || process.env.CONTACT_TO || 'support@arohon.co',
      subject: `Challenge ${c.no} entry ${receipt}: ${project} by ${name}`,
      html: table(`${c.name}: entry ${receipt}`, [['Project', project], ['Pitch', pitch], ['Live link', live], ['GitHub', repo || 'not given'], ['Name', name], ['Email', email], ['Phone', phone], ['Team', team], ['Note', note]]),
    });
  } catch (e) {
    console.error('challenge mail failed', e);
    if (!dbReady) return NextResponse.json({ error: 'Couldn’t send your entry right now. Try again in a minute.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true, id: receipt });
}
