import type { Metadata } from 'next';
export { default } from '../../contact/page';

export const metadata: Metadata = {
  title: 'যোগাযোগ | যাত্রী, চালক ও বিজনেস সাপোর্ট',
  description: 'রাইড, চালক বা বিজনেস নিয়ে আরোহন টিমের সাথে কথা বলুন। হোয়াটসঅ্যাপ, ইমেইল বা গুলশানের অফিসে।',
  alternates: { canonical: '/bn/contact', languages: { en: '/contact', bn: '/bn/contact' } },
};
