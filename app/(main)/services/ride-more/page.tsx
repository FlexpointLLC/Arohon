import type { Metadata } from 'next';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';

const BRAND_GREEN = '#016b42';

export const metadata: Metadata = {
  title: 'Ride More - Intercity & Premium | Arohon',
  description: 'Car Plus, Hiace, airport transfers, and hourly rentals. Comfortable intercity travel with transparent pricing.',
};

const SERVICES = [
  { label: 'Car Plus', desc: 'Premium rides for intercity travel. Comfort and reliability.' },
  { label: 'Hiace', desc: 'Spacious vehicles for group trips between cities.' },
  { label: 'Airport', desc: 'Hassle-free airport pickups and drop-offs with flight tracking.' },
  { label: 'Hourly Rental', desc: 'Rent by the hour for errands, events, or flexible travel.' },
];

export default function RideMorePage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Ride"
        accent="more"
        subtitle="Car Plus, Hiace, airport transfers, and hourly rentals. Comfortable intercity travel with transparent pricing."
      >
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          {SERVICES.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
                  style={{ backgroundColor: `${BRAND_GREEN}15`, color: BRAND_GREEN }}
                >
                  {item.label.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/ride"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 sm:w-auto"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            Book a ride
          </Link>
          <Link
            href="/services"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
          >
            View all services
          </Link>
        </div>
      </PageSection>
    </main>
  );
}
