import type { Metadata } from 'next';
export { default } from '../../../services/rental/page';

export const metadata: Metadata = {
  title: 'রেন্টাল | চালকসহ গাড়ি ভাড়া, চালকেরা অফার দেন',
  description: 'ঘণ্টা, দিন, সপ্তাহ বা মাস হিসেবে চালকসহ গাড়ি ভাড়া নিন। অনুরোধ দিন, চালকেরা অফার পাঠাবে।',
  alternates: { canonical: '/bn/services/rental', languages: { en: '/services/rental', bn: '/bn/services/rental' } },
};
