'use client';

import { useCallback, useEffect, useState } from 'react';

// Dark mode is homepage-only until the inner pages are redesigned.
export const THEMED_PATHS = ['/', '/ride', '/driver', '/services', '/services/business', '/services/parcel', '/services/rental', '/services/food', '/services/ambulance', '/services/airport', '/services/payment', '/safety', '/cities', '/about', '/contact', '/partners', '/join-our-team', '/whats-new', '/blog', '/terms', '/terms-customers', '/terms-promo-code', '/terms-return-refund', '/privacy', '/delete-account', '/terms-parcel', '/terms-food', '/terms-rental', '/terms-rewards', '/terms-merchants', '/community-guidelines'];

const prefersDark = () => {
  try {
    const t = localStorage.getItem('theme');
    return t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export function useTheme(pathname: string) {
  // blog posts live at /blog/slug locally and at /slug on blogs.arohon.co
  const supported = THEMED_PATHS.includes(pathname) || pathname.startsWith('/blog/') || pathname.startsWith('/track/') || (typeof location !== 'undefined' && location.hostname.startsWith('blogs.'));
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const d = supported && prefersDark();
    document.documentElement.classList.toggle('dark', d);
    setDark(d);
  }, [supported]);

  const toggle = useCallback(() => {
    const d = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', d);
    try {
      localStorage.setItem('theme', d ? 'dark' : 'light');
    } catch {}
    setDark(d);
  }, []);

  return { dark, toggle, supported };
}
