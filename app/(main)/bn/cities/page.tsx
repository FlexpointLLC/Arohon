import type { Metadata } from 'next';
export { default } from '../../cities/page';

export const metadata: Metadata = {
  title: 'শহর | সারা বাংলাদেশে আরোহন',
  description: 'বাংলাদেশের প্রতিটি বিভাগ থেকে চালকেরা আরোহনে যোগ দিয়েছেন। দেখুন আমরা এখন কোথায়।',
  alternates: { canonical: '/bn/cities', languages: { en: '/cities', bn: '/bn/cities' } },
};
