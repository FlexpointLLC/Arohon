import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Return and Refund Policy - Arohon',
  description: 'Return and Refund Policy for Arohon ride-sharing services in Bangladesh.',
};

export default function ReturnRefundPage() {
  return (
    <LegalPageLayout title="Return and Refund Policy" lastUpdated="February 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. SCOPE</h2>
        <p className="mt-2 text-gray-600">
          This Return and Refund Policy applies to transportation services booked and paid for through the Arohon platform. Since we facilitate ride-sharing (and do not sell physical products), refunds relate to ride cancellations, fare adjustments, and disputes arising from completed or canceled rides.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">2. CONDITIONS FOR REFUND</h2>
        <p className="mt-2 text-gray-600">You may be eligible for a refund in the following circumstances:</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>
            <strong>Cancellation before driver arrival:</strong> If you cancel a ride before the driver has arrived at the pickup point, you may be eligible for a full or partial refund depending on the cancellation timing and our cancellation policy at the time of booking.
          </li>
          <li>
            <strong>Driver no-show:</strong> If the driver does not arrive within the expected timeframe and you have waited as instructed, you may request a refund.
          </li>
          <li>
            <strong>Incorrect fare charged:</strong> If the fare charged differs materially from the upfront or estimated fare due to technical error or miscalculation, you may request a fare adjustment or refund of the excess amount.
          </li>
          <li>
            <strong>Service not rendered:</strong> If the ride was not completed due to fault of the driver or platform (e.g., vehicle breakdown, driver cancellation after accepting), you may be eligible for a full refund.
          </li>
        </ul>
        <p className="mt-2 text-gray-600">
          Change of mind after a ride has been completed, or cancellation after the driver has arrived, may not qualify for a refund. Each case is reviewed on its merits.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">3. THINGS TO ENSURE FOR YOUR REFUND REQUEST</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>You must submit a refund request within 7 days of the date of the ride or transaction.</li>
          <li>You must provide accurate details of the ride, including ride ID, date, time, and reason for the refund request.</li>
          <li>You may be required to provide supporting information or evidence (e.g., screenshots, ride history) as we reasonably request.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">4. HOW TO REQUEST A REFUND</h2>
        <p className="mt-2 text-gray-600">
          Open the Arohon App, go to your ride history, select the ride in question, and use the &quot;Report a problem&quot; or &quot;Request refund&quot; option. Alternatively, you may contact us through the app&apos;s Help section or our website. Fill in the refund request form with the required details and submit. Our support team will review your request and respond within 7–15 business days.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">5. ISSUANCE OF REFUNDS</h2>
        <p className="mt-2 text-gray-600">
          You will be refunded only the fare and any applicable fees that you paid to Arohon for the ride in question, in cases where a refund is approved.
        </p>
        <p className="mt-2 text-gray-600">
          The refund will be processed using the same payment method you used for the ride, where possible. For cash payments, refunds may be issued via mobile wallet or voucher as determined by the Company. The whole refund process may take 7–15 business days depending on the payment method and your bank or payment provider.
        </p>
        <p className="mt-2 text-gray-600">
          If your request is not approved after our review, we will notify you with the reason. We reserve the right to deny refund requests that do not meet our policy criteria or that we reasonably believe to be fraudulent or abusive.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">6. DISPUTES</h2>
        <p className="mt-2 text-gray-600">
          Any dispute regarding the quality of the transportation service itself (e.g., driver behavior, vehicle condition) should be raised with the third-party transportation provider. For fare, payment, or platform-related refund disputes, please contact Arohon through the app or website. Our decision on refund eligibility is final, subject to your rights under applicable law.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">7. CONTACT</h2>
        <p className="mt-2 text-gray-600">
          For questions about this Return and Refund Policy, please contact us at support@arohon.co, through our app, or via our contact page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
