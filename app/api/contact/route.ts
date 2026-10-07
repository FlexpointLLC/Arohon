import { NextResponse } from 'next/server';
import { clean, isEmail, sendMail, table } from '@/lib/mail';

const TOPICS = ['Ride help', 'Driver support', 'Business', 'Partnership', 'Press', 'Something else'];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  // honeypot: real people never fill the hidden "website" field
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const topic = TOPICS.includes(body.topic) ? body.topic : 'Something else';
  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const mobile = clean(body.mobile, 40);
  const message = clean(body.message, 5000);
  if (!name || !isEmail(email) || message.length < 5) return NextResponse.json({ error: 'Please fill in your name, a valid email and a message.' }, { status: 400 });

  try {
    await sendMail({
      to: process.env.CONTACT_TO || 'support@arohon.co',
      subject: `[${topic}] ${name}`,
      html: table(`New message: ${topic}`, [['Name', name], ['Email', email], ['Mobile', mobile], ['Topic', topic], ['Message', message]]),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('contact mail failed', e);
    return NextResponse.json({ error: 'We couldn’t send your message right now. Please email support@arohon.co.' }, { status: 502 });
  }
}
