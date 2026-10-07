'use client';

import { usePathname } from 'next/navigation';

// Bangla lives under /bn on the same site. Copy stays next to its English in each component: t('Where to?', 'কোথায় যাবেন?').
export type Lang = 'en' | 'bn';
/** pages that have a Bangla version; links from Bangla pages to anything else stay English */
export { BN_PATHS } from './langPaths';
import { BN_PATHS } from './langPaths';
const BN_DIGITS = '০১২৩৪৫৬৭৮৯';

export const langOf = (path: string): Lang => (path === '/bn' || path.startsWith('/bn/') ? 'bn' : 'en');
/** the same page without the /bn prefix */
export const stripBn = (path: string) => (langOf(path) === 'bn' ? path.slice(3) || '/' : path);
/** the Bangla address of an English path, when one exists */
export const toBn = (path: string) => {
  const [p, hash = ''] = path.split('#');
  if (!BN_PATHS.includes(p)) return path;
  return (p === '/' ? '/bn' : `/bn${p}`) + (hash ? `#${hash}` : '');
};
export const bnDigits = (v: string | number) => String(v).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);

export function useT() {
  const lang = langOf(usePathname() || '/');
  const bn = lang === 'bn';
  return {
    lang,
    bn,
    /** pick the copy for the current language */
    t: <T,>(en: T, bnText: T) => (bn ? bnText : en),
    /** numbers in Bangla digits on Bangla pages */
    n: (v: string | number) => (bn ? bnDigits(v) : String(v)),
    /** internal links stay in the visitor's language when that page exists in Bangla */
    href: (path: string) => (bn && path.startsWith('/') ? toBn(path) : path),
  };
}
