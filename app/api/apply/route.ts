import { NextResponse } from 'next/server';
import { clean, isEmail, sendMail, table } from '@/lib/mail';

const MAX = 5 * 1024 * 1024;
const TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  if (clean(form.get('website'), 200)) return NextResponse.json({ ok: true }); // honeypot

  const position = clean(form.get('position'), 120);
  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 200);
  const phone = clean(form.get('phone'), 40);
  const link = clean(form.get('link'), 300);
  const note = clean(form.get('note'), 3000);
  const cv = form.get('cv');
  if (!position || !name || !isEmail(email)) return NextResponse.json({ error: 'Please fill in your name and a valid email.' }, { status: 400 });
  if (!(cv instanceof File) || !cv.size) return NextResponse.json({ error: 'Please attach your CV.' }, { status: 400 });
  if (cv.size > MAX) return NextResponse.json({ error: 'Your CV must be 5MB or smaller.' }, { status: 400 });
  if (!TYPES.includes(cv.type)) return NextResponse.json({ error: 'Please upload a PDF or Word file.' }, { status: 400 });

  try {
    await sendMail({
      to: process.env.CAREERS_TO || 'career@arohon.co',
      subject: `Application: ${position}, ${name}`,
      html: table(`New application: ${position}`, [['Position', position], ['Name', name], ['Email', email], ['Phone', phone], ['Link', link], ['Note', note]]),
      attachments: [{ filename: cv.name.replace(/[^\w.\- ]/g, '_').slice(0, 100) || 'cv.pdf', content: Buffer.from(await cv.arrayBuffer()).toString('base64'), contentType: cv.type }],
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('apply mail failed', e);
    return NextResponse.json({ error: 'We couldn’t send your application right now. Please email career@arohon.co.' }, { status: 502 });
  }
}
