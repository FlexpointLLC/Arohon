import type { Metadata } from 'next';
import { ContactPage } from '@/components/contact/ContactPage';

export const metadata: Metadata = {
  title: 'Contact Arohon | Rider, driver and business support',
  description: 'Reach Arohon support for rides, drivers and business. Message us on WhatsApp, email support@arohon.co, or visit us at Navana HR Tower, Gulshan Link Road, Dhaka.',
  alternates: { canonical: '/contact', languages: { en: '/contact', bn: '/bn/contact' } },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[#FDFDFD] dark:bg-black">
      <ContactPage />
    </main>
  );
}
