'use client';

import Image from 'next/image';

const BRAND_GREEN = '#016b42';

export function HeroSection() {
  return (
    <section
        className="relative -mt-[88px] min-h-screen overflow-hidden rounded-[16px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero.png)', backgroundColor: '#ffffff' }}
      >
        {/* Decorative elements - stars/plus signs */}
      <div className="pointer-events-none absolute left-4 top-24 z-10 text-gray-200">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.5-6.3 4.5 2.3-7-6-4.6h7.6z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute left-8 top-[45%] z-10 text-gray-200">
        <span className="text-2xl font-light">+</span>
      </div>
      <div className="pointer-events-none absolute left-12 bottom-32 z-10 text-gray-200">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.5-6.3 4.5 2.3-7-6-4.6h7.6z" />
        </svg>
      </div>

        {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-140px)] max-w-5xl items-center pl-4 pr-2 pt-28 pb-12">
        <div className="flex flex-1 flex-col justify-center">
          <div
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-600"
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              borderColor: `${BRAND_GREEN}40`,
              backgroundColor: `${BRAND_GREEN}08`,
              animation: 'badge-border-pulse 2s ease-in-out infinite',
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor: BRAND_GREEN,
                animation: 'badge-dot-pulse 1.5s ease-in-out infinite',
              }}
            />
            Rides available 24/7
          </div>
          <h1
            className="max-w-2xl font-semibold leading-tight tracking-tight text-gray-900"
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            Ride safe, anywhere
            <br />
            in <span style={{ color: BRAND_GREEN, fontWeight: 700, fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', letterSpacing: '1px' }}>Bangladesh</span>
          </h1>
          <p
            className="mt-2 max-w-lg text-base text-gray-600"
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              lineHeight: 1.65,
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            One tap to book. Live tracking. Verified drivers. Ride with confidence from Dhaka to Sylhet and beyond.
          </p>
          <a
            href="#"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl px-6 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-95"
            style={{
              backgroundColor: BRAND_GREEN,
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            Download the app
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </a>
          {/* Statistics */}
          <div className="mt-16" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
            <h2 className="text-xl font-semibold text-gray-900">Our reach in Bangladesh</h2>
            <p className="mt-1 max-w-md text-sm text-gray-600">
              We connect riders and drivers across the country with safe, reliable, and affordable rides.
            </p>
            <div className="mt-6 flex gap-12">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Districts
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">64</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Partner drivers
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">500+</div>
              </div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Trips
                </div>
                <div className="mt-1 text-2xl font-bold text-gray-900">10K+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
