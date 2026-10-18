import type { Metadata } from 'next';
export { default } from '../../../services/business/page';

export const metadata: Metadata = {
  title: { absolute: 'আরোহন বিজনেস | ই-কমার্স ডেলিভারি ফ্লিট ও লজিস্টিকস' },
  description: 'অনলাইন স্টোর, সুপারশপ, ফার্মেসি আর ইলেকট্রনিক্স ব্র্যান্ডের জন্য ম্যানেজড ডেলিভারি ফ্লিট, অফিসের কর্মীদের যাতায়াত আর হোটেলের এয়ারপোর্ট পিকআপ, সারা বাংলাদেশে।',
  alternates: { canonical: '/bn/services/business', languages: { 'x-default': '/services/business', en: '/services/business', bn: '/bn/services/business' } },
};
