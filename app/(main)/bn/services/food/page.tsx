import type { Metadata } from 'next';
export { default } from '../../../services/food/page';

export const metadata: Metadata = {
  title: 'খাবার ও ওষুধ ডেলিভারি | আরোহন',
  description: 'কাছের রেস্টুরেন্ট আর ফার্মেসি থেকে খাবার ও ওষুধ, নগদ, বিকাশ, নগদ বা কার্ডে পেমেন্ট।',
  alternates: { canonical: '/bn/services/food', languages: { en: '/services/food', bn: '/bn/services/food' } },
};
