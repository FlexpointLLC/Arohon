import type { Metadata } from 'next';
import { PageSection } from '@/components/PageSection';
import { USER_APP_URL } from '@/lib/app-links';

export const metadata: Metadata = {
  title: 'Book a Ride | City, Intercity & Airport Rides in Bangladesh',
  description: 'Book a ride in Bangladesh. Plan your journey or trip. City rides, intercity travel, airport transfers, hourly rental. Verified drivers, live tracking.',
};

export default function RidePage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Ride"
        accent="with Arohon"
        subtitle="One tap to book. Live tracking. Verified drivers. Whether you need a quick city hop or a long-distance journey, we have the right ride for you."
      >
        <div
          className="grid gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          {[
            {
              title: 'City Rides',
              desc: 'Bikes, cars, and CNG for trips within the city. Quick, safe, and affordably priced.',
            },
            {
              title: 'Intercity',
              desc: 'Travel between cities in comfort. Car Plus for premium rides, Hiace for group trips.',
            },
            {
              title: 'Airport Transfers',
              desc: 'Hassle-free airport pickups and drop-offs. On-time service with flight tracking.',
            },
            {
              title: 'Rentals',
              desc: 'Hourly or daily rentals. Drive yourself or hire a driver—flexibility on your schedule.',
            },
            {
              title: 'Pickup & Truck',
              desc: 'Moving house or hauling items? Our pickup and truck services make it easy.',
            },
            {
              title: 'Ambulance',
              desc: '24/7 emergency medical transport when every second counts.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 w-full sm:text-center">
          <a
            href={USER_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 sm:w-auto sm:px-6 sm:py-3.5 sm:text-base"
            style={{ backgroundColor: '#016b42' }}
          >
            Download the app to book
          </a>
        </div>
      </PageSection>
    </main>
  );
}
