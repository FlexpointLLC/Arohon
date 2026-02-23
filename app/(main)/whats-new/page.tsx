import type { Metadata } from 'next';
import { ContactPageLayout } from '@/components/ContactPageLayout';

export const metadata: Metadata = {
  title: "What's New - Arohon",
  description: 'Latest updates, features, and news from Arohon.',
};

export default function WhatsNewPage() {
  return (
    <ContactPageLayout
      title="What's New"
      heroTitle="What's New"
      heroSubtitle="Stay up to date with the latest features, updates, and news from Arohon."
    >
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Coming Soon</h2>
        <p className="mt-2 text-gray-600">
          We are working on exciting updates. Check back soon for the latest news and feature releases.
        </p>
      </section>
    </ContactPageLayout>
  );
}
