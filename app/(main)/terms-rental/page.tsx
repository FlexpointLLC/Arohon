import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Rental Policy - Arohon',
  description: 'Rules for hiring a car and driver with Arohon by the hour, day, week or month, including bids, cancellations and conduct.',
};

export default function RentalPolicyPage() {
  return (
    <LegalPageLayout title="Rental Policy" lastUpdated="October 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. SCOPE</h2>
        <p className="mt-2 text-gray-600">This Rental Policy applies to vehicles hired with a driver through Arohon Rental, including hourly, daily, weekly and monthly hires, airport transfers, events and outstation trips. It forms part of the Arohon Terms of Service.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">2. HOW RENTAL WORKS</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-6 text-gray-600">
          <li>You post a rental request with your pickup, destination or route, dates, times, number of passengers and vehicle type. You may add a budget.</li>
          <li>Drivers send you their offers. You choose and approve the offer you like.</li>
          <li>Your booking is confirmed once you approve an offer and the driver accepts. The agreed price is shown in the app.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">3. BOOKING IN ADVANCE</h2>
        <p className="mt-2 text-gray-600">For airport transfers and events we recommend booking 24 to 48 hours in advance so drivers have time to respond. Availability is not guaranteed for last minute requests.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">4. PRICE AND PAYMENT</h2>
        <p className="mt-2 text-gray-600">The price depends on the vehicle type, duration and distance, and is agreed through the offer you approve before your booking is confirmed. Tolls, ferry charges and parking during the hire are paid by you unless the offer says otherwise. The agreed price is paid as shown in the app.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">5. MONTHLY HIRES</h2>
        <p className="mt-2 text-gray-600">For weekly and monthly hires, the same driver is assigned for the agreed period and attendance is recorded in the app. Off days are agreed between you and the driver and shown in the app.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">6. CANCELLATION AND CHANGES</h2>
        <p className="mt-2 text-gray-600">To cancel or reschedule a confirmed rental, use the app or contact Support as early as possible. Terms may apply for last minute changes, as shown in the app at the time of booking. If a driver cancels a confirmed booking, we will help you find another driver.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">7. YOUR RESPONSIBILITIES</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Treat the driver and the vehicle with respect.</li>
          <li>Do not ask the driver to break traffic laws, exceed safe driving hours or carry more passengers than the vehicle allows.</li>
          <li>You are responsible for damage to the vehicle caused by you or your passengers, other than normal wear.</li>
          <li>Do not carry anything illegal or dangerous in the vehicle.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">8. DRIVER RESPONSIBILITIES</h2>
        <p className="mt-2 text-gray-600">Drivers must arrive on time, drive safely and lawfully, keep the vehicle clean and in good condition, and hold valid documents for the vehicle and its class. Report any concern through Support in the app.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">CHANGES TO THIS POLICY</h2>
        <p className="mt-2 text-gray-600">Arohon may update this policy from time to time. The latest version is always published on this page with its last updated date. Continuing to use the service after a change means you accept the updated policy.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">CONTACT</h2>
        <p className="mt-2 text-gray-600">For questions about this policy, contact Arohon Limited at support@arohon.co, through Support in the Arohon app, or via our contact page at arohon.co/contact.</p>
      </section>
    </LegalPageLayout>
  );
}
