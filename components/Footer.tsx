'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_URL } from '@/lib/seo';
import { BN_PATHS, langOf, stripBn, toBn } from '@/lib/i18n';

export const SOCIAL: string[][] = [
  ['Facebook', 'https://www.facebook.com/arohonrides/'],
  ['Instagram', 'https://www.instagram.com/arohonride/'],
  ['LinkedIn', 'https://www.linkedin.com/company/arohon'],
  ['X (Twitter)', 'https://x.com/Arohonride'],
];

// Linear footer pattern: page-coloured, one hairline, small logo, quiet link columns, tiny legal row
const GROUPS = [
  { title: 'Ride', bn: 'রাইড', links: [['City rides', '/ride', 'শহরে রাইড'], ['Airport rides', '/services/airport', 'এয়ারপোর্ট রাইড'], ['Ambulance', '/services/ambulance', 'অ্যাম্বুলেন্স'], ['Payments', '/services/payment', 'পেমেন্ট'], ['All services', '/services', 'সব সেবা']] },
  { title: 'Earn', bn: 'আয় করুন', links: [['Become a driver', '/driver', 'চালক হোন'], ['Partners & fleets', '/partners', 'পার্টনার'], ['Join our team', '/join-our-team', 'আমাদের টিমে যোগ দিন']] },
  { title: 'Company', bn: 'কোম্পানি', links: [['About', '/about', 'আমাদের কথা'], ["What's new", '/whats-new', 'নতুন কী'], ['Blog', '/blog', 'ব্লগ'], ['Contact', '/contact', 'যোগাযোগ']] },
  { title: 'Help', bn: 'সাহায্য', links: [['Safety', '/safety', 'নিরাপত্তা'], ['Refund policy', '/terms-return-refund', 'রিফান্ড নীতি'], ['Promo terms', '/terms-promo-code', 'প্রোমো শর্তাবলি'], ['Community guidelines', '/community-guidelines', 'কমিউনিটি নির্দেশিকা'], ['Delete account', '/delete-account', 'অ্যাকাউন্ট মুছুন']] },
  { title: 'Connect', bn: 'যুক্ত থাকুন', links: SOCIAL },
];

export function Footer({ isBlogSite = false }: { isBlogSite?: boolean }) {
  const base = isBlogSite ? SITE_URL : '';
  const pathname = usePathname() || '/';
  const bn = langOf(pathname) === 'bn';
  const t = (en: string, b?: string) => (bn && b ? b : en);
  const href = (h: string) => (h.startsWith('http') ? h : base + (bn ? toBn(h) : h));
  // the same page in the other language; pages without a Bangla twin go to the Bangla home
  const enPath = stripBn(pathname);
  const bnPath = BN_PATHS.includes(enPath) ? toBn(enPath) : '/bn';
  return (
    <footer className="border-t border-black/10 bg-[#FDFDFD] dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-[1280px] px-6 pb-10 pt-16 md:px-16">
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
          <Link href={href('/')} aria-label={t('Arohon home', 'আরোহন হোম')} className="self-start">
            {/* same mark as the header */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${base}/logo.png`} alt="Arohon" width={1510} height={365} className="h-7 w-auto dark:[filter:brightness(0)_invert(1)]" />
          </Link>
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="text-[13px] font-medium">{t(g.title, g.bn)}</p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map(([label, h, labelBn]) => (
                  <li key={label}>
                    <Link href={href(h)} {...(h.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-[13px] text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
                      {t(label, labelBn)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-black/40 dark:text-white/35">
          <span>© {new Date().getFullYear()} {t('Arohon Limited', 'আরোহন লিমিটেড')}</span>
          <Link href={base + '/privacy'} className="hover:text-black dark:hover:text-white">{t('Privacy', 'প্রাইভেসি')}</Link>
          <Link href={base + '/terms'} className="hover:text-black dark:hover:text-white">{t('Terms', 'শর্তাবলি')}</Link>
          <Link href={base + '/terms-customers'} className="hover:text-black dark:hover:text-white">{t('Rider terms', 'যাত্রীর শর্তাবলি')}</Link>
          {/* region and language: switches to the same page in the other language */}
          <span className="flex items-center gap-3 sm:ml-auto">
            <span className="rounded-full border border-black/10 px-3 py-1.5 dark:border-white/10">{t('Bangladesh', 'বাংলাদেশ')}</span>
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-full border border-black/10 px-3 py-1.5 hover:text-black dark:border-white/10 dark:hover:text-white [&::-webkit-details-marker]:hidden">{bn ? 'বাংলা' : 'English'} ▾</summary>
              <div className="absolute bottom-full right-0 mb-2 w-40 rounded-xl border border-black/10 bg-[#FDFDFD] p-1 text-[13px] shadow-lg dark:border-white/10 dark:bg-[#111]">
                {[
                  ['English', base + enPath, !bn],
                  ['বাংলা', base + bnPath, bn],
                ].map(([label, to, on]) => (
                  <a key={String(label)} href={String(to)} lang={label === 'বাংলা' ? 'bn' : 'en'} className={`flex items-center justify-between rounded-lg px-3 py-2 ${on ? 'bg-black/[.05] text-black dark:bg-white/[.08] dark:text-white' : 'hover:bg-black/[.04] hover:text-black dark:hover:bg-white/[.06] dark:hover:text-white'}`}>
                    {label} {on && <span aria-hidden>✓</span>}
                  </a>
                ))}
              </div>
            </details>
          </span>
        </div>
      </div>
    </footer>
  );
}
