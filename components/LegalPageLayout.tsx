'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BRAND_GREEN = '#016b42';

export function LegalPageLayout({
  children,
  title,
  lastUpdated,
  heroTitle = 'Terms and Policies',
  heroSubtitle = 'Please read these terms carefully.',
}: {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      {/* Hero - content left, image right */}
      <div className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="min-w-0 flex-1 lg:order-first">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {heroTitle}
              </h1>
              <p className="mt-2 text-base text-gray-600">{heroSubtitle}</p>
            </div>
            <div className="shrink-0 lg:order-last" aria-hidden>
              <svg width="160" height="100" viewBox="0 0 120 80" fill="none" className="text-gray-300">
                <rect x="10" y="20" width="40" height="50" rx="4" stroke="currentColor" strokeWidth="1.5" fill="white" />
                <rect x="18" y="30" width="24" height="3" rx="1" fill="currentColor" opacity="0.3" />
                <rect x="18" y="38" width="20" height="3" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="18" y="46" width="22" height="3" rx="1" fill="currentColor" opacity="0.2" />
                <circle cx="55" cy="35" r="12" fill="currentColor" opacity="0.15" />
                <circle cx="55" cy="35" r="6" fill="currentColor" opacity="0.3" />
                <rect x="70" y="25" width="40" height="45" rx="4" stroke="currentColor" strokeWidth="1.5" fill="white" />
                <rect x="78" y="35" width="24" height="3" rx="1" fill="currentColor" opacity="0.3" />
                <rect x="78" y="43" width="20" height="3" rx="1" fill="currentColor" opacity="0.2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
            <aside className="lg:w-64 lg:shrink-0">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Terms and Policies
              </h2>
            <nav className="space-y-1">
              <div>
                <div className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700">
                  <span>Terms of Service</span>
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ul className="relative space-y-0.5 border-l border-gray-200 pl-4">
                  <li>
                    <Link
                      href="/terms"
                      className={`block py-2 text-sm transition-colors ${
                        pathname === '/terms' ? 'font-semibold' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      style={pathname === '/terms' ? { color: BRAND_GREEN } : {}}
                    >
                      Arohon Rides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-customers"
                      className={`block py-2 text-sm transition-colors ${
                        pathname === '/terms-customers' ? 'font-semibold' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      style={pathname === '/terms-customers' ? { color: BRAND_GREEN } : {}}
                    >
                      Customers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-promo-code"
                      className={`block py-2 text-sm transition-colors ${
                        pathname === '/terms-promo-code' ? 'font-semibold' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      style={pathname === '/terms-promo-code' ? { color: BRAND_GREEN } : {}}
                    >
                      Promo Code
                    </Link>
                  </li>
                </ul>
              </div>
              <Link
                href="/terms-return-refund"
                className={`block py-2 text-sm transition-colors ${
                  pathname === '/terms-return-refund' ? 'font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={pathname === '/terms-return-refund' ? { color: BRAND_GREEN } : {}}
              >
                Return and Refund Policy
              </Link>
              <Link
                href="/privacy"
                className={`block py-2 text-sm transition-colors ${
                  pathname === '/privacy' ? 'font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
                style={pathname === '/privacy' ? { color: BRAND_GREEN } : {}}
              >
                Privacy Policy
              </Link>
            </nav>
          </aside>

          {/* Right content */}
          <article className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
            {lastUpdated && <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>}
            <div className="mt-10 space-y-10">{children}</div>
          </article>
        </div>
      </div>
    </div>
    </main>
  );
}
