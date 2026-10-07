import type { Metadata } from 'next';
export { default } from '../../../services/ambulance/page';

export const metadata: Metadata = {
  title: 'অ্যাম্বুলেন্স | যেকোনো সময় বুক করুন',
  description: 'আরোহন অ্যাপ থেকে যেকোনো সময় অ্যাম্বুলেন্স বুক করুন। হাসপাতাল বেছে নিন, কাছের অ্যাম্বুলেন্স অফার পাঠাবে।',
  alternates: { canonical: '/bn/services/ambulance', languages: { en: '/services/ambulance', bn: '/bn/services/ambulance' } },
};
