'use client';

import Link from 'next/link';
import { PageSection } from '@/components/PageSection';
import {
  Bicycle,
  Car,
  Bus,
  GasPump,
  Ambulance,
  Truck,
  Key,
  AirplaneTakeoff,
  Clock,
} from '@phosphor-icons/react';

const BRAND_GREEN = '#016b42';

const SERVICE_GROUPS = [
  {
    title: 'Go anywhere',
    items: [
      { label: 'Bike', icon: Bicycle, href: '/ride' },
      { label: 'Car', icon: Car, href: '/ride' },
      { label: 'Micro Bus', icon: Bus, href: '/ride' },
      { label: 'CNG', icon: GasPump, href: '/ride' },
    ],
  },
  {
    title: 'Ride more',
    items: [
      { label: 'Car Plus', icon: Car, href: '/ride' },
      { label: 'Hiace', icon: Bus, href: '/ride' },
      { label: 'Airport', icon: AirplaneTakeoff, href: '/ride' },
      { label: 'Hourly Rental', icon: Clock, href: '/ride' },
    ],
  },
  {
    title: 'Daily services',
    items: [
      { label: 'Ambulance', icon: Ambulance, href: '/ride' },
      { label: 'Pickup', icon: Truck, href: '/ride' },
      { label: 'Truck', icon: Truck, href: '/ride' },
      { label: 'Rental', icon: Key, href: '/ride' },
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="How we"
        accent="serve"
        subtitle="you. From quick city rides to long-distance trips and daily services—book bikes, cars, buses, and more. Use your way with cash, card, or mobile wallet."
      >
        <div
          className="space-y-12"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          {SERVICE_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-6 text-2xl font-semibold text-gray-900">{group.title}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 hover:shadow-md"
                    >
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${BRAND_GREEN}15` }}
                      >
                        <Icon size={24} style={{ color: BRAND_GREEN }} weight="fill" />
                      </div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </main>
  );
}
