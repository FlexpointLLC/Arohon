'use client';

import Image from 'next/image';
import { MapPin, Globe } from '@phosphor-icons/react';

const PLAY_STORE_URL = 'https://play.google.com/store/apps';

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { name: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  { name: 'X', href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { name: 'LinkedIn', href: '#', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { name: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
];

const LINK_GROUPS = [
  {
    title: 'Services',
    links: [
      { label: 'City Ride', href: '/services' },
      { label: 'Intercity', href: '/services' },
      { label: 'Rental', href: '/services' },
      { label: 'Pickup', href: '/services' },
      { label: 'Ambulance', href: '/services' },
    ],
  },
  {
    title: 'Partners',
    links: [
      { label: 'Corporate packages', href: '/partners' },
      { label: 'Become a driver', href: '/drive' },
      { label: 'Fleet solutions', href: '/partners' },
    ],
  },
  {
    title: 'Join our team',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Careers', href: '/join-our-team' },
      { label: 'Explore open roles', href: '/join-our-team' },
      { label: 'Why Arohon', href: '/about' },
    ],
  },
  {
    title: 'About us',
    links: [
      { label: 'Our social impact', href: '/about' },
      { label: 'Information security', href: '/privacy' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t border-gray-100 bg-white"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        {/* Top section: Logo + Links grid + Right column */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* Left: Logo + App download */}
          <div className="flex flex-col gap-6">
            <Image src="/logo.png" alt="Arohon" width={120} height={38} />
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-2xl bg-black px-6 py-4 text-white transition-all hover:scale-[1.02] hover:bg-gray-900 active:scale-[0.98]"
            >
              <GooglePlayIcon className="h-10 w-10 shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-wider text-white/80">Get it on</span>
                <span className="text-lg font-semibold">Google Play</span>
              </div>
            </a>
          </div>

          {/* Middle: Link columns */}
          <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 lg:max-w-2xl">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">{group.title}</h3>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right: Region, Language */}
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
              <MapPin size={18} className="text-gray-500" weight="fill" />
              <span className="text-sm text-gray-700">Bangladesh</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5">
              <Globe size={18} className="text-gray-500" weight="fill" />
              <span className="text-sm text-gray-700">English</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-gray-100 pt-6 sm:flex-row sm:mt-12 sm:gap-6 sm:pt-8">
          <p className="text-sm text-gray-500">All rights reserved. Arohon © 2026</p>
          <div className="flex items-center gap-6">
            <a href="/terms" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
              Terms of Service
            </a>
            <a href="/privacy" className="text-sm text-gray-600 transition-colors hover:text-gray-900">
              Privacy Notices
            </a>
          </div>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition-opacity hover:opacity-80"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
