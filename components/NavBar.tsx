'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { List, X } from '@phosphor-icons/react';
import { USER_APP_URL, DRIVER_APP_URL } from '@/lib/app-links';

const BRAND_GREEN = '#016b42';
const SCROLL_THRESHOLD = 80;

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
    </svg>
  );
}

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Ride', href: '/ride' },
    { label: 'Drive', href: '/drive' },
  ];

  return (
    <nav className="sticky top-2 z-30 mx-3 mt-3 sm:mx-4 sm:mt-4 md:mx-6 md:mt-6">
      <div
        className="relative mx-auto flex items-center justify-between rounded-2xl bg-white pl-3 pr-2 py-2 sm:pl-4 md:transition-[max-width] md:duration-500 md:ease-out"
        style={{
          boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
          maxWidth: isScrolled ? '992px' : '736px',
        }}
      >
        <Link href="/" className="relative flex h-8 w-24 flex-shrink-0 sm:h-9 sm:w-[110px]">
          <Image src="/logo.png" alt="Arohon" fill className="object-contain object-left" priority sizes="110px" />
        </Link>
        {/* Desktop nav - hidden on mobile */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-gray-100/90 py-1 pl-1 pr-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  isActive ? '' : 'text-gray-700 hover:text-gray-900'
                }`}
                style={
                  isActive ? { backgroundColor: `${BRAND_GREEN}20`, color: BRAND_GREEN } : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={USER_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download User App"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-95 md:flex"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            <GooglePlayIcon className="h-5 w-5" />
          </a>
          <a
            href={DRIVER_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download Driver App"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-95 md:flex"
            style={{ backgroundColor: 'rgba(15, 20, 28, 1)' }}
          >
            <GooglePlayIcon className="h-5 w-5" />
          </a>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 md:hidden"
          >
            {mobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 top-0 z-20 bg-black/20 backdrop-blur-sm transition-opacity md:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden
      />
      <div
        className={`fixed top-0 right-0 z-20 h-full w-full max-w-[280px] bg-white shadow-xl transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-1 p-6 pt-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                  isActive ? 'bg-green-50 text-[#016b42]' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={USER_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            <GooglePlayIcon className="h-5 w-5 shrink-0" />
            User App
          </a>
          <a
            href={DRIVER_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: 'rgba(15, 20, 28, 1)' }}
          >
            <GooglePlayIcon className="h-5 w-5 shrink-0" />
            Driver App
          </a>
        </div>
      </div>
    </nav>
  );
}
