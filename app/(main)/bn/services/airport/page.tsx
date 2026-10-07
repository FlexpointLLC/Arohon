import type { Metadata } from 'next';
export { default } from '../../../services/airport/page';

export const metadata: Metadata = {
  title: 'এয়ারপোর্ট রাইড | ৮টি এয়ারপোর্টে আগে থেকে বুক করুন',
  description: 'ঢাকা, চট্টগ্রাম, সিলেট, কক্সবাজারসহ ৮টি এয়ারপোর্টে আগে থেকে রাইড বুক করুন। চালকেরা অফার দেন।',
  alternates: { canonical: '/bn/services/airport', languages: { en: '/services/airport', bn: '/bn/services/airport' } },
};
