import Link from 'next/link';
import { SITE_URL } from '@/lib/seo';

export const SOCIAL = [
  ['Facebook', 'https://www.facebook.com/arohonrides/'],
  ['Instagram', 'https://www.instagram.com/arohonride/'],
  ['LinkedIn', 'https://www.linkedin.com/company/arohon'],
  ['X (Twitter)', 'https://x.com/Arohonride'],
];

// Linear footer pattern: page-coloured, one hairline, small logo, quiet link columns, tiny legal row
const GROUPS = [
  { title: 'Ride', links: [['City rides', '/ride'], ['Airport rides', '/services/airport'], ['Ambulance', '/services/ambulance'], ['Payments', '/services/payment'], ['All services', '/services']] },
  { title: 'Earn', links: [['Become a driver', '/drive'], ['Partners & fleets', '/partners'], ['Join our team', '/join-our-team']] },
  { title: 'Company', links: [['About', '/about'], ["What's new", '/whats-new'], ['Blog', '/blog'], ['Contact', '/contact']] },
  { title: 'Help', links: [['Safety', '/safety'], ['Refund policy', '/terms-return-refund'], ['Promo terms', '/terms-promo-code'], ['Community guidelines', '/community-guidelines'], ['Delete account', '/delete-account']] },
  { title: 'Connect', links: SOCIAL },
];

export function Footer({ isBlogSite = false }: { isBlogSite?: boolean }) {
  const base = isBlogSite ? SITE_URL : '';
  const href = (h: string) => (h.startsWith('http') ? h : base + h);
  return (
    <footer className="border-t border-black/10 bg-[#FDFDFD] dark:border-white/10 dark:bg-black">
      <div className="mx-auto max-w-[1280px] px-6 pb-10 pt-16 md:px-16">
        <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-[1.2fr_repeat(5,1fr)]">
          <Link href={base + '/'} aria-label="Arohon home" className="self-start">
            {/* same mark as the header */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${base}/logo.png`} alt="Arohon" width={1510} height={365} className="h-7 w-auto dark:[filter:brightness(0)_invert(1)]" />
          </Link>
          {GROUPS.map((g) => (
            <div key={g.title}>
              <p className="text-[13px] font-medium">{g.title}</p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map(([label, h]) => (
                  <li key={label}>
                    <Link href={href(h)} {...(h.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="text-[13px] text-black/50 transition-colors hover:text-black dark:text-[#8A8F98] dark:hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-black/40 dark:text-white/35">
          <span>© {new Date().getFullYear()} Arohon Limited</span>
          <Link href={base + '/privacy'} className="hover:text-black dark:hover:text-white">Privacy</Link>
          <Link href={base + '/terms'} className="hover:text-black dark:hover:text-white">Terms</Link>
          <Link href={base + '/terms-customers'} className="hover:text-black dark:hover:text-white">Rider terms</Link>
        </div>
      </div>
    </footer>
  );
}
