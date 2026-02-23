'use client';

import { motion } from 'framer-motion';
import { appearTransition, appearViewport, fadeUpVariants } from './AnimateIn';

import { USER_APP_URL, DRIVER_APP_URL } from '@/lib/app-links';

const BRAND_GREEN = '#016b42';

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
    </svg>
  );
}

function HeroContent() {
  return (
    <motion.div
      className="flex flex-1 flex-col justify-center"
      initial="initial"
      whileInView="animate"
      viewport={appearViewport}
      transition={appearTransition}
      variants={fadeUpVariants}
    >
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
      <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
        <a
          href={USER_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-2xl px-5 py-3 text-white transition-all hover:scale-[1.02] active:scale-[0.98] sm:gap-3 sm:px-6 sm:py-4"
          style={{ backgroundColor: BRAND_GREEN }}
        >
          <GooglePlayIcon className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] uppercase tracking-wider text-white/80">Ride</span>
            <span className="text-base font-semibold sm:text-lg">User App</span>
          </div>
        </a>
        <a
          href={DRIVER_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-2xl bg-black px-5 py-3 text-white transition-all hover:scale-[1.02] hover:bg-gray-900 active:scale-[0.98] sm:gap-3 sm:px-6 sm:py-4"
        >
          <GooglePlayIcon className="h-8 w-8 shrink-0 sm:h-10 sm:w-10" />
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] uppercase tracking-wider text-white/80">Earn</span>
            <span className="text-base font-semibold sm:text-lg">Driver App</span>
          </div>
        </a>
      </div>
      <div className="mt-10 sm:mt-16" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">Our reach in Bangladesh</h2>
        <p className="mt-1 max-w-md text-sm text-gray-600">
          We connect riders and drivers across the country with safe, reliable, and affordable rides.
        </p>
        <div className="mt-4 flex flex-wrap gap-6 sm:mt-6 sm:gap-8 md:gap-12">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Districts</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">64</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Partner drivers</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">500+</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">Trips</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">10K+</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section
      className="relative -mt-[72px] flex min-h-0 flex-col overflow-hidden rounded-xl sm:-mt-[88px] sm:min-h-screen sm:rounded-[16px]"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* Mobile: image in flow */}
      <div
        className="relative z-20 h-[38vh] min-h-[240px] w-full shrink-0 bg-cover bg-center bg-no-repeat sm:absolute sm:inset-0 sm:h-full sm:min-h-0"
        style={{ backgroundImage: 'url(/hero.png)' }}
      />
      {/* Desktop decorative elements */}
      <div className="pointer-events-none absolute left-4 top-24 z-10 hidden text-gray-200 sm:block">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.5-6.3 4.5 2.3-7-6-4.6h7.6z" />
        </svg>
      </div>
      <div className="pointer-events-none absolute left-8 top-[45%] z-10 hidden text-gray-200 sm:block">
        <span className="text-2xl font-light">+</span>
      </div>
      <div className="pointer-events-none absolute left-12 bottom-32 z-10 hidden text-gray-200 sm:block">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.5-6.3 4.5 2.3-7-6-4.6h7.6z" />
        </svg>
      </div>
      {/* Content - single instance for one H1 */}
      <div className="relative z-10 -mt-24 flex flex-1 flex-col justify-center bg-white px-4 pt-6 pb-10 sm:mx-auto sm:mt-0 sm:min-h-[calc(100vh-140px)] sm:max-w-5xl sm:items-center sm:pl-4 sm:pr-2 sm:pt-36 sm:pb-12">
        <HeroContent />
      </div>
    </section>
  );
}
