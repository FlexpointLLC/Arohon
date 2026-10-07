import type { Metadata } from 'next';
export { default } from '../page';

export const revalidate = 60;
export const metadata: Metadata = {
  title: 'আরোহন | বাংলাদেশে রাইড বুক করুন, ঢাকা থেকে ৬৪ জেলায়',
  description: 'বাইক, সিএনজি, কার, মাইক্রো বা হায়েস বুক করুন। আগেই ভাড়া জানুন, যাচাই করা চালক, ঢাকা থেকে বাংলাদেশের ৬৪ জেলায়।',
  alternates: { canonical: '/bn', languages: { en: '/', bn: '/bn' } },
};
