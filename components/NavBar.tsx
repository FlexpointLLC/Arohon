'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const BRAND_GREEN = '#016b42';
const SCROLL_THRESHOLD = 80;
const PLAY_STORE_URL = 'https://play.google.com/store/apps';

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Ride', href: '/ride' },
    { label: 'Drive', href: '/drive' },
  ];

  return (
    <nav className="sticky top-2 z-30 mx-6 mt-6">
      <div
        className="relative mx-auto flex items-center justify-between rounded-2xl bg-white pl-4 pr-2 py-2 transition-[max-width] duration-500 ease-out"
        style={{
          boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.08)',
          maxWidth: isScrolled ? '992px' : '736px',
        }}
      >
        <Link href="/">
          <Image src="/logo.png" alt="Arohon" width={110} height={35} priority />
        </Link>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gray-100/90 py-1 pl-1 pr-1">
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
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
          style={{ backgroundColor: 'rgba(15, 20, 28, 1)' }}
        >
          <Image src="/play.png" alt="Play" width={18} height={18} className="object-contain" />
          Download
        </a>
      </div>
    </nav>
  );
}
