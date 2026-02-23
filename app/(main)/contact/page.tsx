import type { Metadata } from 'next';
import { ContactPageLayout } from '@/components/ContactPageLayout';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Book a Ride, Plan Your Trip - Arohon Bangladesh',
  description: 'Contact Arohon for ride booking, trip planning, or support. Get help with your journey across Bangladesh. support@arohon.co',
};

const BRAND_GREEN = '#016b42';

const iconClass = 'shrink-0';
const IconMapPin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={iconClass} style={{ color: BRAND_GREEN }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const IconPhone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={iconClass} style={{ color: BRAND_GREEN }}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);
const IconEnvelope = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={iconClass} style={{ color: BRAND_GREEN }}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

export default function ContactPage() {
  return (
    <ContactPageLayout title="Contact Us">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex min-h-[480px] flex-col lg:flex-row">
          {/* Left: Contact form (2/3 width) */}
          <div className="min-w-0 flex-[2] p-6 lg:border-r lg:border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Send your message</h2>
            <div className="mt-4">
              <ContactForm />
            </div>
          </div>

          {/* Right: Address, Call, Email (1/3 width) */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-6 border-t border-gray-200 bg-gray-50/50 p-6 lg:border-t-0 lg:border-l-0">
            <div className="flex flex-col gap-1.5">
              <IconMapPin />
              <h3 className="text-base font-semibold text-gray-900">Address</h3>
              <p className="text-gray-600">Navana HR Tower-1, Plot No. 205</p>
              <p className="text-gray-600">1 Bir Uttam Mir Shawkat Ali Sarak (Gulshan Link Road), 1208</p>
              <a
                href="https://maps.google.com/?q=Navana+HR+Tower+Gulshan+Link+Road+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium"
                style={{ color: BRAND_GREEN }}
              >
                View in map →
              </a>
            </div>
            <div className="flex flex-col gap-1.5">
              <IconPhone />
              <h3 className="text-base font-semibold text-gray-900">Call</h3>
              <a
                href="tel:01834911911"
                className="font-medium hover:underline"
                style={{ color: BRAND_GREEN }}
              >
                01834911911
              </a>
            </div>
            <div className="flex flex-col gap-1.5">
              <IconEnvelope />
              <h3 className="text-base font-semibold text-gray-900">Email</h3>
              <a
                href="mailto:support@arohon.co"
                className="font-medium hover:underline"
                style={{ color: BRAND_GREEN }}
              >
                support@arohon.co
              </a>
            </div>
          </div>
        </div>
      </section>
    </ContactPageLayout>
  );
}
