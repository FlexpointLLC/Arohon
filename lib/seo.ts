export const SITE_URL = 'https://arohon.co';

export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Arohon',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Arohon is Bangladesh\'s trusted ride-sharing platform. Book rides, plan your journey, and travel safely across Dhaka, Sylhet, and 64 districts. One tap to ride.',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@arohon.co',
    contactType: 'customer service',
    availableCountry: 'BD',
  },
};

export const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Arohon - Ride Sharing in Bangladesh',
  url: SITE_URL,
  description:
    'Book a ride in Bangladesh. Plan your trip, journey, or commute with Arohon. Safe, affordable rides across Dhaka, Sylhet, and nationwide. Ride sharing made simple.',
};

export const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: 'Arohon',
  image: `${SITE_URL}/hero.png`,
  url: SITE_URL,
  description:
    'Ride-sharing and ride-booking in Bangladesh. Plan your journey, book a ride, or arrange a trip. City rides, intercity travel, hourly rental. Verified drivers, live tracking.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Navana HR Tower-1, Plot No. 205, 1 Bir Uttam Mir Shawkat Ali Sarak (Gulshan Link Road)',
    addressLocality: 'Dhaka',
    addressRegion: 'Dhaka',
    postalCode: '1208',
    addressCountry: 'BD',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Bangladesh',
  },
};
