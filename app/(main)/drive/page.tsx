import type { Metadata } from 'next';
import { PageSection } from '@/components/PageSection';

export const metadata: Metadata = {
  title: 'Drive with Arohon - Arohon',
  description: 'Become an Arohon driver. Earn on your schedule with flexible ride-sharing opportunities.',
};

export default function DrivePage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Drive"
        accent="with us"
        subtitle="Join thousands of partner drivers across Bangladesh. Earn on your own schedule with transparent pay, verified riders, and a platform built for growth."
      >
        <div
          className="space-y-10"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {[
              { title: 'Flexible Earnings', desc: 'Drive when you want. No fixed shifts. Earn per trip with clear, upfront rates.' },
              { title: 'Verified Riders', desc: 'Connect with real riders through our app. Safe, traceable, and paid.' },
              { title: 'Multiple Service Types', desc: 'City rides, intercity, rentals—offer what suits your vehicle and schedule.' },
              { title: 'Support & Training', desc: 'We support our drivers with training, help centre access, and fair policies.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border-2 border-[#016b42]/20 bg-[#016b42]/5 p-6 text-center sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900">Ready to start driving?</h3>
            <p className="mt-2 text-gray-600">Download the Arohon driver app and begin earning today.</p>
            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-xl px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-95"
              style={{ backgroundColor: '#016b42' }}
            >
              Become a driver
            </a>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
