import type { Metadata } from 'next';
import Link from 'next/link';
import { PageSection } from '@/components/PageSection';

const BRAND_GREEN = '#016b42';

export const metadata: Metadata = {
  title: 'Use Your Way - Payment Options | Arohon',
  description: 'Pay with cash, card, wallet, or mobile wallet. Flexible payment options for every rider.',
};

const PAYMENT_OPTIONS = [
  { label: 'Cash', desc: 'Pay in cash at the end of your ride.' },
  { label: 'Card', desc: 'Credit or debit card payments through the app.' },
  { label: 'Wallet', desc: 'Use your Arohon wallet for quick, cashless rides.' },
  { label: 'Mobile Wallet', desc: 'bKash, Nagad, and other mobile wallets supported.' },
];

export default function PaymentPage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Use"
        accent="your way"
        subtitle="Cash, card, wallet, or mobile wallet. Choose the payment method that works for you."
      >
        <div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          {PAYMENT_OPTIONS.map((item) => (
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
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://play.google.com/store/apps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            Download the app
          </a>
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
