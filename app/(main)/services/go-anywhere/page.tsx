import type { Metadata } from 'next';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';
import { Bicycle, Car, Bus, GasPump } from '@phosphor-icons/react';

const BRAND_GREEN = '#016b42';

export const metadata: Metadata = {
  title: 'Go Anywhere - City Rides | Arohon',
  description: 'Book bikes, cars, micro buses, and CNG for city rides. Quick, safe, and affordably priced across Bangladesh.',
};

const SERVICES = [
  { label: 'Bike', icon: Bicycle, desc: 'Quick and affordable rides for short trips around the city.' },
  { label: 'Car', icon: Car, desc: 'Comfortable AC or non-AC cars for city travel.' },
  { label: 'Micro Bus', icon: Bus, desc: 'Spacious rides for groups or when you need extra space.' },
  { label: 'CNG', icon: GasPump, desc: 'Eco-friendly and cost-effective city transport.' },
];

export default function GoAnywherePage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Go"
        accent="anywhere"
        subtitle="Bikes, cars, micro buses, and CNG for trips within the city. Quick, safe, and fairly priced."
      >
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          {SERVICES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${BRAND_GREEN}15` }}
                >
                  <Icon size={24} style={{ color: BRAND_GREEN }} weight="fill" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{item.label}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/ride"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            Book a ride
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            View all services
          </Link>
        </div>
      </PageSection>
    </main>
  );
}
