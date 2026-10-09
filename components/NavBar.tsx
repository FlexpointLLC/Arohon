'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CaretDown, List, Moon, Sun, X } from '@phosphor-icons/react';
import { useTheme } from '@/lib/theme';
import { USER_APP_URL } from '@/lib/app-links';
import { SITE_URL } from '@/lib/seo';
import { PlayIcon } from './StoreButtons';
import { langOf, stripBn, toBn } from '@/lib/i18n';

const SERVICES = [
  { label: 'City rides', bn: 'শহরে রাইড', desc: 'Bike, CNG, car, micro', descBn: 'বাইক, সিএনজি, কার, মাইক্রো', href: '/ride', img: '/icons/car.webp' },
  { label: 'Intercity & airport', bn: 'আন্তঃজেলা ও এয়ারপোর্ট', desc: 'All 64 districts, 8 airports', descBn: '৬৪ জেলা, ৮টি এয়ারপোর্ট', href: '/services/airport', img: '/icons/micro.webp' },
  { label: 'Ambulance', bn: 'অ্যাম্বুলেন্স', desc: '24/7 emergency transport', descBn: '২৪ ঘণ্টা জরুরি সেবা', href: '/services/ambulance', img: '/icons/ambulance.webp' },
  { label: 'Payments', bn: 'পেমেন্ট', desc: 'Cash for rides, more for food', descBn: 'রাইডে নগদ, খাবারে আরও উপায়', href: '/services/payment', img: '/icons/bike.webp' },
];

const MEGA = [
  { label: 'Business', bn: 'বিজনেস', desc: 'Monthly office rides, team transport and deliveries for your shop', descBn: 'মাসিক অফিস রাইড, টিমের যাতায়াত আর দোকানের ডেলিভারি', href: '/services/business' },
  { label: 'Parcel', bn: 'পার্সেল', desc: 'Across Dhaka within an hour, or to any district in 1 to 3 days', descBn: 'ঢাকায় এক ঘণ্টায়, যেকোনো জেলায় ১ থেকে ৩ দিনে', href: '/services/parcel' },
  { label: 'Rental', bn: 'রেন্টাল', desc: 'A car and a driver by the hour, week or month, drivers bid for you', descBn: 'ঘণ্টা, সপ্তাহ বা মাস হিসেবে গাড়ি আর চালক, চালকেরা অফার দেন', href: '/services/rental' },
  { label: 'Food delivery', bn: 'খাবার ডেলিভারি', desc: 'Food and medicine from restaurants and pharmacies near you', descBn: 'কাছের রেস্টুরেন্ট আর ফার্মেসি থেকে খাবার ও ওষুধ', href: '/services/food' },
];
const MEGA_LINKS: [string, string, string][] = [
  ['All services', '/services', 'সব সেবা'],
  ['Book a ride', '/ride', 'রাইড বুক করুন'],
  ['Airport rides', '/services/airport', 'এয়ারপোর্ট রাইড'],
  ['Ambulance', '/services/ambulance', 'অ্যাম্বুলেন্স'],
  ['Payments', '/services/payment', 'পেমেন্ট'],
  ['Promotions', '/promotion', 'প্রোমোশন'],
];

const LINKS = [
  { label: 'Ride', bn: 'রাইড', href: '/ride' },
  { label: 'Driver', bn: 'চালক', href: '/driver' },
  { label: 'Services', bn: 'সেবা', href: '/services', menu: true },
  { label: 'Safety', bn: 'নিরাপত্তা', href: '/safety' },
  { label: 'Cities', bn: 'শহর', href: '/cities' },
  { label: 'About', bn: 'আমাদের কথা', href: '/about' },
  { label: 'Blog', bn: 'ব্লগ', href: '/blog' },
];

export function NavBar({ isBlogSite = false }: { isBlogSite?: boolean }) {
  const pathname = usePathname();
  const theme = useTheme(pathname);
  const base = isBlogSite ? SITE_URL : '';
  // Bangla pages keep the visitor in Bangla wherever a Bangla twin exists
  const bn = langOf(pathname) === 'bn';
  const t = <T,>(en: T, b: T) => (bn ? b : en);
  const go = (h: string) => base + (bn ? toBn(h) : h);
  useEffect(() => {
    document.documentElement.lang = bn ? 'bn' : 'en';
  }, [bn]);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const here = stripBn(pathname);
  const isActive = (href: string) => !href.includes('#') && (here === href || here.startsWith(`${href}/`));

  return (
    <>
      {/* Uber-style bar: full width, 64px, logo + links on the left, actions on the right */}
      <header
        onMouseLeave={() => setMenu(false)}
        className={`fixed inset-x-0 top-0 z-50 h-16 bg-white/95 backdrop-blur-xl transition-shadow duration-300 dark:bg-black/90 ${
          scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,.06),0_8px_24px_-12px_rgba(0,0,0,.15)]' : ''
        }`}
      >
        <nav className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-6 md:px-16">
          <div className="flex items-center gap-6">
          <Link href={go('/')} className="shrink-0 py-1" aria-label={t('Arohon home', 'আরোহন হোম')}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${base}/logo.png`} alt="Arohon" width={1510} height={365} className="h-7 w-auto dark:[filter:brightness(0)_invert(1)]" />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.label} className="relative" onMouseEnter={() => setMenu(!!l.menu)}>
                <Link
                  href={go(l.href)}
                  className={`flex h-9 items-center gap-1 rounded-full px-3 text-[14px] font-medium leading-4 transition-colors ${
                    isActive(l.href) ? 'bg-black/[.06] text-black dark:bg-white/10 dark:text-white' : 'text-black hover:bg-black/[.06] dark:text-white dark:hover:bg-white/10'
                  }`}
                >
                  {t(l.label, l.bn)}
                  {l.menu && <CaretDown size={12} weight="bold" className={`transition-transform ${menu ? 'rotate-180' : ''}`} />}
                </Link>
              </li>
            ))}
          </ul>
          </div>

          <div className="flex items-center gap-1">
            <Link href={go('/driver')} className="hidden h-9 items-center whitespace-nowrap rounded-full px-3 text-[14px] font-medium text-black transition-colors hover:bg-black/[.06] dark:text-white dark:hover:bg-white/10 md:flex">
              {t('Become a driver', 'চালক হোন')}
            </Link>
            {theme.supported && (
              <button
                type="button"
                onClick={theme.toggle}
                aria-label={theme.dark ? t('Switch to light mode', 'লাইট মোডে যান') : t('Switch to dark mode', 'ডার্ক মোডে যান')}
                className="flex h-9 w-9 items-center justify-center rounded-full text-black transition-colors hover:bg-black/[.06] dark:text-white dark:hover:bg-white/10"
              >
                {theme.dark ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
              </button>
            )}
            <a
              href={USER_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 flex h-9 items-center gap-2 whitespace-nowrap rounded-full bg-black px-3 text-[14px] font-medium text-white transition-colors hover:bg-[#333] dark:bg-white dark:text-black dark:hover:bg-[#E2E2E2]"
            >
              <PlayIcon className="h-4 w-4" />
              <span className="hidden sm:inline">{t('Get the app', 'অ্যাপ নিন')}</span>
              <span className="sm:hidden">{t('App', 'অ্যাপ')}</span>
            </a>
            <button
              type="button"
              aria-label={open ? t('Close menu', 'মেনু বন্ধ করুন') : t('Open menu', 'মেনু খুলুন')}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black hover:bg-black/[.06] dark:text-white dark:hover:bg-white/10 lg:hidden"
            >
              {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </nav>

        {/* Linear-style mega menu: full content width, featured columns, plain links, news bar */}
        <AnimatePresence>
          {menu && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-x-0 top-full hidden px-6 pt-2 md:px-16 lg:block"
            >
              <div className="mx-auto max-w-[1280px] rounded-2xl border border-black/10 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,.25)] dark:border-white/10 dark:bg-[#0F0F10]">
                <div className="grid grid-cols-3 rounded-xl border border-black/[.07] bg-black/[.015] dark:border-white/[.07] dark:bg-white/[.025]">
                  {[MEGA.slice(0, 2), MEGA.slice(2, 4)].map((col, ci) => (
                    <div key={ci} className="flex flex-col gap-1 border-r border-black/[.07] p-1 dark:border-white/[.07]">
                      {col.map((m) => (
                        <Link key={m.label} href={go(m.href)} className="group block flex-1 rounded-lg px-7 py-6 transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.06]">
                          <span className="block text-[15px] font-medium text-black dark:text-white">{t(m.label, m.bn)}</span>
                          <span className="mt-1.5 block max-w-[260px] text-[14px] leading-relaxed text-black/50 transition-colors group-hover:text-black/70 dark:text-[#8A8F98] dark:group-hover:text-[#D0D6E0]">{t(m.desc, m.descBn)}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                  <ul className="flex flex-col gap-1 p-1">
                    {MEGA_LINKS.map(([label, href, labelBn]) => (
                      <li key={label}>
                        <Link href={go(href)} className="block rounded-lg px-7 py-[11px] text-[15px] text-black/80 transition-colors hover:bg-black/[.04] hover:text-black dark:text-[#D0D6E0] dark:hover:bg-white/[.06] dark:hover:text-white">{t(label, labelBn)}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={go('/driver')} className="group mt-1 flex items-center justify-between rounded-xl px-8 py-4 text-[14px] transition-colors hover:bg-black/[.03] dark:hover:bg-white/[.04]">
                  <span>
                    <span className="font-medium text-black dark:text-white">{t('New', 'নতুন')}</span>
                    <span className="ml-2 text-black/50 dark:text-[#8A8F98]">{t('Just 2% commission for drivers', 'চালকদের জন্য মাত্র ২% কমিশন')}</span>
                  </span>
                  <span className="flex items-center gap-1 text-black/50 transition-colors group-hover:text-black dark:text-[#8A8F98] dark:group-hover:text-white">
                    {t('Learn more', 'আরও জানুন')} <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-white px-6 dark:bg-black pb-10 pt-28 lg:hidden"
          >
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <motion.li key={l.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link href={go(l.href)} onClick={() => setOpen(false)} className="block border-b border-black/10 py-4 dark:border-white/10 dark:text-white text-3xl font-semibold tracking-tight text-black">
                    {t(l.label, l.bn)}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-2">
              {SERVICES.map((s) => (
                <Link key={s.label} href={go(s.href)} onClick={() => setOpen(false)} className="rounded-2xl bg-black/[.04] p-4 dark:bg-[#292929]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt="" className="mb-2 h-12 w-12 object-contain" />
                  <span className="block text-sm font-semibold text-black dark:text-white">{t(s.label, s.bn)}</span>
                  <span className="block text-xs text-black/50 dark:text-[#AFAFAF]">{t(s.desc, s.descBn)}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

