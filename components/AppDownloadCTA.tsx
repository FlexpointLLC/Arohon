'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { appearTransition, appearViewport, fadeUpVariants } from './AnimateIn';

import { USER_APP_URL, DRIVER_APP_URL } from '@/lib/app-links';

function GooglePlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
    </svg>
  );
}

export function AppDownloadCTA() {
  return (
    <motion.section
      className="relative mx-4 mb-12 max-w-[1110px] overflow-hidden rounded-2xl bg-[#016b42] px-0 pt-10 pb-0 text-white sm:mx-6 sm:px-6 sm:py-12 md:mx-auto md:px-12 md:py-16 lg:mb-16 lg:pl-16 lg:pr-0 lg:pt-0 lg:pb-0"
      style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      initial="initial"
      whileInView="animate"
      viewport={appearViewport}
      transition={appearTransition}
      variants={fadeUpVariants}
    >
      {/* Dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        {/* Text block */}
        <div className="flex flex-col justify-center px-4 sm:px-0 lg:max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Install our app from
            <br />
            <span
              className="font-serif italic"
              style={{
                fontFamily: 'var(--font-instrument), Georgia, serif',
                letterSpacing: '1px',
                fontWeight: 700,
              }}
            >
              Google Play
            </span>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/90 md:text-lg">
            One tap to book rides across Bangladesh. Live tracking, verified drivers, and transparent
            pricing—all in your pocket.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <a
              href={USER_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-3.5 text-gray-900 transition-all hover:scale-[1.02] hover:bg-amber-400 active:scale-[0.98] sm:w-fit sm:px-6 sm:py-4"
              style={{ backgroundColor: '#facc15' }}
            >
              <GooglePlayIcon className="h-10 w-10 shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-wider text-gray-700">Ride</span>
                <span className="text-lg font-semibold">User App</span>
              </div>
            </a>
            <a
              href={DRIVER_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-5 py-3.5 text-white transition-all hover:scale-[1.02] hover:bg-gray-900 active:scale-[0.98] sm:w-fit sm:px-6 sm:py-4"
            >
              <GooglePlayIcon className="h-10 w-10 shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-[10px] uppercase tracking-wider text-white/80">Earn</span>
                <span className="text-lg font-semibold">Driver App</span>
              </div>
            </a>
          </div>
        </div>

        {/* Image - mobile: cta-mobile.png full bleed; sm+: CTA.png original desktop styling */}
        <div className="flex w-full shrink-0 items-center justify-center sm:w-auto lg:justify-end">
          {/* Mobile: images/cta-mobile.png */}
          <Image
            src="/images/cta-mobile.png"
            alt="Download Arohon app from Google Play"
            width={560}
            height={420}
            className="h-auto w-full max-w-none object-cover object-center sm:hidden"
            sizes="100vw"
          />
          {/* Desktop: images/CTA.png */}
          <Image
            src="/images/CTA.png"
            alt="Download Arohon app from Google Play"
            width={560}
            height={420}
            className="hidden h-auto w-auto object-contain sm:block sm:max-h-[280px] lg:max-h-[400px]"
            sizes="(max-width: 1024px) 320px, 560px"
          />
        </div>
      </div>
    </motion.section>
  );
}
