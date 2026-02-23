import type { Metadata } from 'next';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';

const BRAND_GREEN = '#016b42';

export const metadata: Metadata = {
  title: 'Daily Services - Ambulance, Pickup & More | Arohon',
  description: 'Ambulance, pickup, truck, and rental services. When you need specialized transport, we are here.',
};

const SERVICES = [
  { label: 'Ambulance', desc: '24/7 emergency medical transport. When every second counts.' },
  { label: 'Pickup', desc: 'Moving house or hauling items? We make it easy.' },
  { label: 'Truck', desc: 'Heavy loads, appliances, deliveries—we handle it.' },
  { label: 'Rental', desc: 'Hourly or daily vehicle rental. Drive yourself or hire a driver.' },
];

export default function DailyPage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Daily"
        accent="services"
        subtitle="Ambulance, pickup, truck, and rental. When you need specialized transport, we are here."
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
            Book now
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
