import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Arohon',
  description: 'Privacy Policy for Arohon ride-sharing platform in Bangladesh.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
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
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: February 2026</p>

        <div
          className="mt-10 max-w-none space-y-10"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
            <p className="mt-2 text-gray-600">
              Arohon (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our
              ride-sharing platform and related services in Bangladesh.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900">2. Information We Collect</h2>
            <p className="mt-2 text-gray-600">We may collect the following types of information:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>
                <strong>Account information:</strong> Name, phone number, email, and profile photo when you
                register.
              </li>
              <li>
                <strong>Location data:</strong> Your pick-up and drop-off locations, and real-time location
                during rides when you grant permission.
              </li>
              <li>
                <strong>Transaction data:</strong> Ride history, payment details, and fare information.
              </li>
              <li>
                <strong>Device information:</strong> Device type, operating system, and app usage data.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
            <p className="mt-2 text-gray-600">We use your information to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Facilitate rides and connect you with drivers</li>
              <li>Process payments and send receipts</li>
              <li>Improve our services and develop new features</li>
              <li>Send important updates, security alerts, and support messages</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900">4. Information Sharing</h2>
            <p className="mt-2 text-gray-600">
              We may share your information with drivers to complete rides, with payment processors for
              transactions, and with authorities when required by law. We do not sell your personal information
              to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900">5. Data Security</h2>
            <p className="mt-2 text-gray-600">
              We implement appropriate technical and organizational measures to protect your personal
              information. However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900">6. Your Rights</h2>
            <p className="mt-2 text-gray-600">
              You may access, update, or delete your account information through the app. You can also
              request a copy of your data or withdraw consent for certain processing. Contact us for
              assistance.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900">7. Contact Us</h2>
            <p className="mt-2 text-gray-600">
              For questions about this Privacy Policy or our data practices, please contact us through our
              app or website.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
