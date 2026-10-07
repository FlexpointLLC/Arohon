// Sends mail through the Hostinger Mail API (no SDK needed): POST /api/v1/mailboxes/{id}/send, sent from that mailbox.
// Env: HOSTINGER_MAIL_API_KEY, HOSTINGER_MAILBOX_ID (from GET https://api.mail.hostinger.com/api/v1/me), CONTACT_TO, CAREERS_TO.
type Attachment = { filename: string; content: string; contentType?: string }; // content is base64

export async function sendMail(opts: { to: string; subject: string; html: string; text?: string; attachments?: Attachment[] }) {
  const key = process.env.HOSTINGER_MAIL_API_KEY;
  const box = process.env.HOSTINGER_MAILBOX_ID;
  if (!key || !box) throw new Error('HOSTINGER_MAIL_API_KEY or HOSTINGER_MAILBOX_ID is not set');
  const res = await fetch(`https://api.mail.hostinger.com/api/v1/mailboxes/${encodeURIComponent(box)}/send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ to: [opts.to], displayName: 'Arohon Website', subject: opts.subject, html: opts.html, text: opts.text, attachments: opts.attachments }),
  });
  if (!res.ok) throw new Error(`Hostinger mail ${res.status}: ${await res.text()}`);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Simple two-column table email, values escaped. */
export function table(title: string, rows: [string, string][]) {
  const tr = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:8px 16px 8px 0;color:#888;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('');
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#111"><h2 style="font-size:18px">${esc(title)}</h2><table>${tr}</table></div>`;
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 200;
/** Trim and cap a form field. */
export const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
