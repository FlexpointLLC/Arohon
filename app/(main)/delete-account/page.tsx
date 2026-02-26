import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Account Deletion - Arohon',
  description: 'How to request deletion of your Arohon account and associated data.',
};

export default function DeleteAccountPage() {
  return (
    <LegalPageLayout
      title="Account Deletion"
      lastUpdated="February 2026"
      heroTitle="Account Deletion"
      heroSubtitle="How to request deletion of your Arohon account and data."
    >
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Requesting account deletion</h2>
        <p className="mt-2 text-gray-600">
          Arohon allows you to request deletion of your account and associated data. To request that your account and data be deleted, please follow the steps below.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Steps to request account deletion</h2>
        <p className="mt-2 text-gray-600">
          To request deletion of your Arohon account and associated data, use one of the following:
        </p>
        <ol className="mt-2 list-decimal space-y-2 pl-6 text-gray-600">
          <li><strong>From the app:</strong> Open the Arohon app, go to <strong>Profile</strong> → <strong>Support Tickets</strong>, and create a new ticket requesting account deletion. Include the phone number registered with your account.</li>
          <li><strong>By email:</strong> Send an email to{' '}
            <a href="mailto:support@arohon.co" className="text-[#016b42] underline hover:no-underline">
              support@arohon.co
            </a>
            {' '}with the subject line &quot;Delete my account&quot; and include the phone number registered with your Arohon account.
          </li>
        </ol>
        <p className="mt-2 text-gray-600">
          We will process your request and confirm once the deletion is complete.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Data that is deleted</h2>
        <p className="mt-2 text-gray-600">
          When your account is deleted, we delete or anonymize the following data associated with your account:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Account credentials and authentication data</li>
          <li>Profile information (name, profile photo)</li>
          <li>Registered phone number</li>
          <li>Saved addresses (e.g. home, work)</li>
          <li>Ride history and trip details</li>
          <li>Support tickets and related communications</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Data that may be retained</h2>
        <p className="mt-2 text-gray-600">
          We may retain certain data where required by law or for legitimate business purposes:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Anonymized or aggregated data used for analytics and improving our services</li>
          <li>Data we are legally required to keep (e.g. for tax, legal claims, or regulatory compliance)</li>
          <li>Backup copies for a limited period until they are overwritten</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Retention period</h2>
        <p className="mt-2 text-gray-600">
          We process account deletion requests as soon as practicable. Deletion of your account and the data listed above is typically completed within <strong>30 days</strong>. Where we are required to retain certain data for legal or compliance reasons, that data may be kept for up to <strong>90 days</strong> (or longer if required by law) and then permanently deleted.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
        <p className="mt-2 text-gray-600">
          For any questions about account deletion or your data, contact Arohon at{' '}
          <a href="mailto:support@arohon.co" className="text-[#016b42] underline hover:no-underline">
            support@arohon.co
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
