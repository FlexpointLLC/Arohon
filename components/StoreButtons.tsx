import { USER_APP_URL, DRIVER_APP_URL, USER_IOS_URL } from '@/lib/app-links';

export function PlayIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
    </svg>
  );
}

export function StoreButton({
  kind = 'rider',
  variant = 'green',
}: {
  kind?: 'rider' | 'driver';
  variant?: 'green' | 'light' | 'dark' | 'ghost';
}) {
  const styles = {
    green: 'bg-brand-green text-[#03130D] hover:bg-[#2fd6a3]',
    light: 'bg-white text-black hover:bg-white/90',
    dark: 'bg-black text-white hover:bg-[#222] dark:bg-white dark:text-black dark:hover:bg-white/90',
    ghost: 'bg-white/5 text-white ring-1 ring-white/15 hover:bg-white/10',
  }[variant];
  return (
    <a
      href={kind === 'rider' ? USER_APP_URL : DRIVER_APP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 sm:w-auto transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${styles}`}
    >
      <PlayIcon className="h-6 w-6 shrink-0" />
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] opacity-70">
          {kind === 'rider' ? 'Get it on Google Play' : 'Earn with Arohon'}
        </span>
        <span className="text-[15px] font-semibold">{kind === 'rider' ? 'Arohon Ride' : 'Arohon Driver'}</span>
      </span>
    </a>
  );
}

/*
 * Official-style store badges, drawn inline (no external artwork): black badge, white wordmark,
 * Apple logo / four-colour Play logo, following each store's badge layout.
 */
function AppleLogo() {
  return (
    <svg viewBox="0 0 384 512" className="h-[26px] w-[22px]" fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

function PlayLogo() {
  return (
    <svg viewBox="0 0 512 512" className="h-[24px] w-[22px]" aria-hidden>
      <path fill="#00D7FE" d="M48 59.5v393c0 9.6 5.5 18 13.5 22.1L270 256 61.5 37.4C53.5 41.5 48 49.9 48 59.5z" />
      <path fill="#FFCE00" d="M354.5 340.4 270 256l84.5-84.4 101.6 58.7c18.5 10.7 18.5 37.4 0 48z" />
      <path fill="#FF3A44" d="M354.5 340.4 270 256 61.5 474.6c7.9 4 17.6 4.1 26-.7z" />
      <path fill="#00F076" d="M354.5 171.6 87.5 18.1c-8.4-4.8-18.1-4.7-26-.7L270 256z" />
    </svg>
  );
}

function Badge({ href, logo, small, big, label }: { href: string; logo: React.ReactNode; small: string; big: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[10px] sm:w-auto border border-[#A6A6A6] bg-black px-3.5 text-white transition-transform hover:-translate-y-0.5 dark:border-white/30"
    >
      {logo}
      <span className="flex flex-col leading-none">
        <span className="text-[10px] font-medium tracking-wide">{small}</span>
        <span className="mt-0.5 text-[19px] font-semibold tracking-[-0.01em]">{big}</span>
      </span>
    </a>
  );
}

/** App Store + Google Play badges for the rider app. */
export function StoreBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center ${className}`}>
      <Badge href={USER_IOS_URL} logo={<AppleLogo />} small="Download on the" big="App Store" label="Download Arohon on the App Store" />
      <Badge href={USER_APP_URL} logo={<PlayLogo />} small="GET IT ON" big="Google Play" label="Get Arohon on Google Play" />
    </div>
  );
}
