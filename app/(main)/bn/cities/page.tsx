import type { Metadata } from 'next';
export { default } from '../../cities/page';

export const metadata: Metadata = {
  title: { absolute: 'শহর | সারা বাংলাদেশে আরোহন' },
  description: 'বাংলাদেশের প্রতিটি বিভাগ থেকে চালকেরা আরোহনে যোগ দিয়েছেন। দেখুন আমরা এখন কোথায়।',
  alternates: { canonical: '/bn/cities', languages: { 'x-default': '/cities', en: '/cities', bn: '/bn/cities' } },
};
