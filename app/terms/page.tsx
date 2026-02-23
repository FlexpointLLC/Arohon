import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Arohon',
  description: 'Terms of Service for Arohon ride-sharing platform in Bangladesh.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <h1
          className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: February 2026</p>

        <div
          className="mt-10 max-w-none space-y-10"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-2 text-gray-600">
              By accessing or using the Arohon ride-sharing platform (“Service”), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Description of Service</h2>
            <p className="mt-2 text-gray-600">
              Arohon provides a platform that connects riders with drivers for transportation services across
              Bangladesh. Our services include city rides, intercity travel, rentals, pickup, and ambulance
              transport. We facilitate bookings and payments between riders and drivers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. User Accounts</h2>
            <p className="mt-2 text-gray-600">
              To use certain features of the Service, you must register for an account. You agree to provide
              accurate and complete information and to keep your account credentials secure. You are responsible
              for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Use of the Service</h2>
            <p className="mt-2 text-gray-600">
              You agree to use the Service only for lawful purposes and in accordance with these terms. You
              must not use the Service to harm others, violate laws, or interfere with the operation of the
              platform. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Payments and Fees</h2>
            <p className="mt-2 text-gray-600">
              Fares are displayed before you confirm a ride. You agree to pay all applicable fees for
              services received. Payment methods include cash, card, and mobile wallet. Refunds are subject to
              our refund policy as communicated at the time of booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Limitation of Liability</h2>
            <p className="mt-2 text-gray-600">
              Arohon acts as a platform connecting riders and drivers. We are not responsible for the acts or
              omissions of drivers or riders. Our liability is limited to the extent permitted by applicable
              law. We do not guarantee uninterrupted or error-free service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Contact</h2>
            <p className="mt-2 text-gray-600">
              For questions about these Terms of Service, please contact us through our app or website.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
