import type { Metadata } from 'next';
import { PaymentsPage } from '@/components/services/ServicePages';

export const metadata: Metadata = {
  title: 'Payments | Cash for rides, coupons applied automatically',
  description: 'Rides on Arohon are paid in cash at the upfront fare. Coupons and promo codes apply automatically, and food orders also take bKash, Nagad and card.',
  alternates: { canonical: '/services/payment', languages: { en: '/services/payment', bn: '/bn/services/payment' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <PaymentsPage />
    </main>
  );
}
