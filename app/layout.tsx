import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import { SITE_URL, ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, LOCAL_BUSINESS_JSON_LD } from '@/lib/seo';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
});

const TITLE = 'Arohon | Book a Ride in Bangladesh – Dhaka, Sylhet, 64 Districts';
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
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className={`antialiased ${inter.className}`}>
        <JsonLd data={ORGANIZATION_JSON_LD} />
        <JsonLd data={WEBSITE_JSON_LD} />
        <JsonLd data={LOCAL_BUSINESS_JSON_LD} />
        {children}
      </body>
    </html>
  );
}
