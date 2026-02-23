import type { Metadata } from 'next';
import { PageSection } from '@/components/PageSection';

export const metadata: Metadata = {
  title: 'About Us - Arohon',
  description: 'Learn about Arohon and our mission to transform ride-sharing in Bangladesh.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="About"
        accent="Arohon"
        subtitle="We are building the future of ride-sharing in Bangladesh—connecting riders and drivers with safe, affordable, and reliable transportation across the country."
      >
        <div
          className="space-y-8 text-gray-600"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Our Mission</h2>
            <p className="leading-relaxed">
              Arohon exists to make getting around Bangladesh easier, safer, and more accessible. Whether
              you need a quick bike ride across the city, a comfortable car for an intercity trip, or
              specialized transport—we connect you with verified drivers and transparent pricing.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Our Reach</h2>
            <p className="leading-relaxed">
              We operate across 64 districts with 500+ partner drivers and have completed 10,000+ trips.
              From Dhaka to Sylhet and everywhere in between, Arohon is growing to serve riders and
              drivers nationwide.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Why Choose Us</h2>
            <ul className="list-disc space-y-2 pl-6 leading-relaxed">
              <li>Verified drivers and safe vehicles</li>
              <li>Transparent, upfront pricing</li>
              <li>Multiple payment options: cash, card, mobile wallet</li>
              <li>Live tracking for every ride</li>
              <li>24/7 availability for city and intercity trips</li>
            </ul>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
