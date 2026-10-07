import type { Metadata } from 'next';
export { default } from '../../../services/payment/page';

export const metadata: Metadata = {
  title: 'পেমেন্ট | রাইডে নগদ, কুপন নিজে থেকেই',
  description: 'আরোহনে রাইডের ভাড়া নগদে, আগেই দেখানো ভাড়ায়। কুপন ও প্রোমো কোড নিজে থেকেই কাটে।',
  alternates: { canonical: '/bn/services/payment', languages: { en: '/services/payment', bn: '/bn/services/payment' } },
};
