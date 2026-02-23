import type { Metadata } from 'next';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';

export const metadata: Metadata = {
  title: 'Partners - Arohon',
  description: 'Corporate packages, fleet solutions, and partnership opportunities with Arohon.',
};

export default function PartnersPage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Partner"
        accent="with us"
        subtitle="Whether you need corporate travel solutions, fleet management, or want to join as a driver—Arohon has options for businesses and individuals."
      >
        <div
          className="grid gap-6 sm:gap-8 md:grid-cols-3"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900">Corporate packages</h3>
            <p className="mt-4 text-gray-600">
              Streamline business travel for your team. Managed accounts, invoicing, and dedicated support
              for companies of all sizes.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900">Fleet solutions</h3>
            <p className="mt-4 text-gray-600">
              Integrate Arohon into your fleet operations. Scale your transport needs with our platform
              and network of verified drivers.
            </p>
          </div>
          <div className="rounded-2xl border-2 border-[#016b42]/20 bg-[#016b42]/5 p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900">Become a driver</h3>
            <p className="mt-4 text-gray-600">
              Join our network of partner drivers. Earn on your schedule with transparent pay and verified
              riders.
            </p>
            <Link
              href="/drive"
              className="mt-6 inline-block rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              style={{ backgroundColor: '#016b42' }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
