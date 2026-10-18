import type { Metadata } from 'next';
import { PromotionList } from '@/components/promotion/Promotion';

export const metadata: Metadata = {
  title: { absolute: 'Promotions | Arohon offers, rewards and cashback' },
  description: 'Current Arohon campaigns, rewards and cashback offers for riders and drivers in Bangladesh.',
  alternates: { canonical: '/promotion', languages: { 'x-default': '/promotion', en: '/promotion', bn: '/bn/promotion' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <PromotionList />
    </main>
  );
}
