// Imports content/blog/*.md into Sanity as DRAFT posts (review and publish them in /studio).
// Usage: SANITY_WRITE_TOKEN=xxx node scripts/import-blog.mjs   (add --dry to only print what would be sent)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createClient } from '@sanity/client';

const dry = process.argv.includes('--dry');
const dir = path.join(process.cwd(), 'content/blog');
const key = () => crypto.randomBytes(6).toString('hex');

/** inline **bold**, *em* and [text](url) to portable text spans + markDefs */
function inline(text) {
  const children = [];
  const markDefs = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|\*(.+?)\*/g;
  let last = 0, m;
  const push = (t, marks = []) => t && children.push({ _type: 'span', _key: key(), text: t, marks });
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[1]) push(m[1], ['strong']);
    else if (m[2]) { const k = key(); markDefs.push({ _type: 'link', _key: k, href: m[3] }); push(m[2], [k]); }
    else if (m[4]) push(m[4], ['em']);
    last = re.lastIndex;
  }
  push(text.slice(last));
  if (!children.length) push(' ');
  return { children, markDefs };
}
const block = (text, style = 'normal', list) => ({ _type: 'block', _key: key(), style, ...(list ? { listItem: list, level: 1 } : {}), ...inline(text) });

function toBlocks(md) {
  const out = [];
  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trimEnd();
    if (!l.trim()) continue;
    if (l.startsWith('### ')) out.push(block(l.slice(4), 'h3'));
    else if (l.startsWith('## ')) out.push(block(l.slice(3), 'h2'));
    else if (/^- /.test(l)) out.push(block(l.slice(2), 'normal', 'bullet'));
    else if (/^\d+\. /.test(l)) out.push(block(l.replace(/^\d+\. /, ''), 'normal', 'number'));
    else if (l.startsWith('|')) {
      // tables are not in the schema: header row + rows become bullets like "Cell1: header2 cell2, header3 cell3"
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      i--;
      const cells = (r) => r.split('|').slice(1, -1).map((c) => c.trim());
      const [head, , ...body] = rows;
      const h = cells(head);
      for (const r of body) {
        const c = cells(r);
        const rest = c.slice(1).map((v, j) => (h[j + 1] ? `${h[j + 1]} ${v}` : v)).join(', ');
        out.push(block(`**${c[0].replace(/\*\*/g, '')}**${rest ? `: ${rest.replace(/\*\*/g, '')}` : ''}`, 'normal', 'bullet'));
      }
    } else out.push(block(l));
  }
  return out;
}

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const [, fm, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = Object.fromEntries(fm.split('\n').map((l) => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; }));
  return { meta, body };
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
const docs = files.map((f, n) => {
  const { meta, body } = parse(path.join(dir, f));
  return {
    _id: `drafts.post-${meta.slug}`,
    _type: 'post',
    title: meta.title,
    slug: { _type: 'slug', current: meta.slug },
    excerpt: meta.excerpt,
    readTime: Number(meta.readTime),
    // spread publish dates a day apart, newest first, so the journal shows a steady cadence
    publishedAt: new Date(Date.now() - n * 86400000).toISOString(),
    body: toBlocks(body),
  };
});

if (dry) {
  for (const d of docs) console.log(`${d.slug.current}: ${d.body.length} blocks, ${d.readTime} min`);
  process.exit(0);
}
const token = process.env.SANITY_WRITE_TOKEN;
if (!token) throw new Error('Set SANITY_WRITE_TOKEN (Sanity manage, API, Tokens, Editor)');
const client = createClient({ projectId: 'pfm6u125', dataset: 'production', apiVersion: '2024-01-01', token, useCdn: false });
const tx = client.transaction();
docs.forEach((d) => tx.createOrReplace(d));
await tx.commit();
console.log(`Imported ${docs.length} drafts. Review and publish them in /studio.`);
