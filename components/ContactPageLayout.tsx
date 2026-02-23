'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BRAND_GREEN = '#016b42';

export function ContactPageLayout({
  children,
  title,
  heroTitle = 'Contact Us',
  heroSubtitle = 'We want your input. Questions, bug reports, complaints, praise, feature requests. Every little bit helps.',
}: {
  children: React.ReactNode;
  title: string;
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
                Support
              </h2>
              <nav className="space-y-1">
                <Link
                  href="/contact"
                  className={`block py-2 text-sm transition-colors ${
                    pathname === '/contact' ? 'font-semibold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={pathname === '/contact' ? { color: BRAND_GREEN } : {}}
                >
                  Contacts
                </Link>
                <Link
                  href="/whats-new"
                  className={`block py-2 text-sm transition-colors ${
                    pathname === '/whats-new' ? 'font-semibold' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={pathname === '/whats-new' ? { color: BRAND_GREEN } : {}}
                >
                  Whats New
                </Link>
              </nav>
            </aside>

            {/* Right content */}
            <article className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{title}</h2>
              <div className="mt-10 space-y-10">{children}</div>
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}
