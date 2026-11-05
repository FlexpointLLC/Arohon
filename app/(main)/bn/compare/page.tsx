import type { Metadata } from 'next';
import { CompareHubRoute } from '@/components/compare/routes';

export default function Page() {
  return <CompareHubRoute bn />;
}

export const metadata: Metadata = {
  title: { absolute: 'বাংলাদেশের সেরা রাইড শেয়ারিং অ্যাপ তুলনা (২০২৬)' },
  description: 'আরোহন, Uber, Pathao, inDrive, Obhai ও Garibook: চালকের কমিশন, ভাড়া, বাইক, সিএনজি, পার্সেল ও খাবার। বাংলাদেশে সবচেয়ে সস্তা রাইড অ্যাপ খুঁজুন।',
  alternates: { canonical: '/bn/compare', languages: { 'x-default': '/compare', en: '/compare', bn: '/bn/compare' } },
  openGraph: { title: 'বাংলাদেশের সেরা রাইড শেয়ারিং অ্যাপ তুলনা', url: 'https://arohon.co/bn/compare', images: ['/hero.png'], locale: 'bn_BD' },
};
