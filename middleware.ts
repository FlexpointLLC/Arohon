import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BN_PATHS } from './lib/langPaths';

const YEAR = 60 * 60 * 24 * 365;
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|lighthouse/i;

/** Visitors in Bangladesh land on the Bangla twin the first time. Once someone picks a language in the footer
 *  (lang cookie), we never redirect again. Crawlers are never redirected, hreflang tells Google about both versions. */
function bangladeshDefault(request: NextRequest, local: boolean) {
  const p = request.nextUrl.pathname;
  if (!(BN_PATHS.includes(p) || p.startsWith('/promotion/')) || request.cookies.has('lang')) return null;
  if (BOT.test(request.headers.get('user-agent') ?? '')) return null;
  // Vercel adds the visitor's country; locally you can test with ?country=BD
  const country = request.headers.get('x-vercel-ip-country') ?? (local ? request.nextUrl.searchParams.get('country') : null);
  if (country !== 'BD') return null;
  const url = request.nextUrl.clone();
  url.pathname = p === '/' ? '/bn' : `/bn${p}`;
  url.searchParams.delete('country');
  const res = NextResponse.redirect(url, 307);
  res.cookies.set('lang', 'bn', { path: '/', maxAge: YEAR, sameSite: 'lax' });
  return res;
}

const BLOG_HOST = 'blogs.arohon.co';
const MAIN_HOST = 'arohon.co';
const BLOG_ORIGIN = 'https://blogs.arohon.co';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;

  // Local dev: no redirects/rewrites — blog at /blog and /blog/[slug]
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  if (isLocal) {
    return bangladeshDefault(request, true) ?? NextResponse.next();
  }

  // Blog subdomain: serve blog at root and /[slug]
  if (host === BLOG_HOST || host === `www.${BLOG_HOST}`) {
    // Skip internal and static paths
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/icon') || pathname === '/robots.txt') {
      return NextResponse.next();
    }
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/blog', request.url));
    }
    if (pathname === '/sitemap.xml') {
      return NextResponse.rewrite(new URL('/blog-sitemap', request.url));
    }
    // Single segment → blog post (e.g. /my-post → /blog/my-post)
    if (/^\/[^/]+$/.test(pathname)) {
      return NextResponse.rewrite(new URL(`/blog${pathname}`, request.url));
    }
    return NextResponse.next();
  }

  // Main site: redirect /blog and /blog/[slug] to blogs.arohon.co
  if (host === MAIN_HOST || host === `www.${MAIN_HOST}`) {
    const geo = bangladeshDefault(request, false);
    if (geo) return geo;
    if (pathname === '/blog' || pathname === '/blog/') {
      return NextResponse.redirect(`${BLOG_ORIGIN}/`, 301);
    }
    const blogPostMatch = pathname.match(/^\/blog\/([^/]+)\/?$/);
    if (blogPostMatch) {
      return NextResponse.redirect(`${BLOG_ORIGIN}/${blogPostMatch[1]}`, 301);
    }
  }

  return NextResponse.next();
}
