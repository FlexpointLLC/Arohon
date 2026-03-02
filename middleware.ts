import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOG_HOST = 'blogs.arohon.co';
const MAIN_HOST = 'arohon.co';
const BLOG_ORIGIN = 'https://blogs.arohon.co';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;

  // Local dev: no redirects/rewrites — blog at /blog and /blog/[slug]
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  if (isLocal) {
    return NextResponse.next();
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
