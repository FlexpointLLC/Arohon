import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans, Hind_Siliguri, Mrs_Saint_Delafield } from 'next/font/google';
import { SITE_URL, ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, LOCAL_BUSINESS_JSON_LD } from '@/lib/seo';
import './globals.css';

// Plus Jakarta Sans: free geometric grotesk closest to Uber Move's feel.
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

// signature on the About page founder letter
const signature = Mrs_Saint_Delafield({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sign',
});

const bangla = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-bangla',
});

const TITLE = 'Arohon | Book a Ride in Bangladesh, Dhaka, Sylhet, 64 Districts';
const DESCRIPTION =
  'Book a ride in Bangladesh. Plan your journey, trip, or commute with Arohon. Safe ride sharing across Dhaka, Sylhet & 64 districts. One tap to ride. Verified drivers, live tracking.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Arohon - Ride Sharing Bangladesh',
  },
  description: DESCRIPTION,
  keywords: [
    'ride',
    'book a ride',
    'ride sharing',
    'ride booking',
    'journey',
    'plan journey',
    'trip',
    'plan trip',
    'travel',
    'ride Bangladesh',
    'Dhaka ride',
    'Sylhet ride',
    'ride sharing Bangladesh',
    'cab',
    'taxi',
    'book cab',
    'intercity ride',
    'city ride',
    'commute',
  ],
  authors: [{ name: 'Arohon', url: SITE_URL }],
  creator: 'Arohon',
  openGraph: {
    type: 'website',
    locale: 'en_BD',
    url: SITE_URL,
    siteName: 'Arohon',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/hero.png', width: 1200, height: 630, alt: 'Arohon - Ride safe in Bangladesh' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Arohonride',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: './',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${bangla.variable} ${signature.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply dark mode before first paint (no flash). Only the redesigned homepage supports it for now. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var lp=location.pathname;if(lp==='/bn'||lp.indexOf('/bn/')===0){document.documentElement.lang='bn';lp=lp.slice(3)||'/'}var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d&&(['/', '/ride', '/driver', '/services', '/services/business', '/services/parcel', '/services/rental', '/services/food', '/services/ambulance', '/services/airport', '/services/payment', '/safety', '/cities', '/about', '/contact', '/partners', '/join-our-team', '/whats-new', '/blog', '/terms', '/terms-customers', '/terms-promo-code', '/terms-return-refund', '/privacy', '/delete-account', '/terms-parcel', '/terms-food', '/terms-rental', '/terms-rewards', '/terms-merchants', '/community-guidelines', '/promotion'].includes(lp)||location.pathname.indexOf('/blog/')===0||location.pathname.indexOf('/track/')===0||lp.indexOf('/promotion/')===0||location.hostname.indexOf('blogs.')===0))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
        <link rel="preload" as="image" href="/hero.png" fetchPriority="high" />
      </head>
      <body className={`antialiased ${sans.className}`}>
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <JsonLd data={WEBSITE_JSON_LD} />
        <JsonLd data={LOCAL_BUSINESS_JSON_LD} />
        {children}
        {/* Linquo chat widget, loaded once here so it shows on every page */}
        <Script id="linquo" src="https://admin.linquo.app/widget.js?id=c179a709-20ec-477c-a167-8ab243bcdac2" strategy="afterInteractive" />
      </body>
    </html>
  );
}
