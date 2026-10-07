import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Community Guidelines - Arohon',
  description: 'How riders, drivers, merchants and everyone on Arohon are expected to treat each other.',
};

export default function CommunityGuidelinesPage() {
  return (
    <LegalPageLayout title="Community Guidelines" lastUpdated="October 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. WHY THESE GUIDELINES EXIST</h2>
        <p className="mt-2 text-gray-600">Arohon brings together riders, drivers, captains, merchants and their customers across Bangladesh. These guidelines explain how everyone is expected to behave, so every trip and every delivery feels safe and respectful. They apply to everyone who uses Arohon, and form part of the Arohon Terms of Service.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">2. TREAT EVERYONE WITH RESPECT</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Be polite and patient with drivers, riders, merchants and support staff.</li>
          <li>Do not discriminate against anyone because of religion, gender, ethnicity, disability, age or any other personal characteristic.</li>
          <li>No harassment, threats, abusive language or unwanted physical contact.</li>
          <li>Respect personal space and privacy. Do not comment on someone&apos;s appearance or ask for personal details you do not need.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">3. STAY SAFE</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Riders: check the driver&apos;s name, photo, vehicle and plate in the app before getting in, and wear a seatbelt or helmet.</li>
          <li>Drivers: follow traffic laws, never drive tired or under the influence, and keep your vehicle roadworthy.</li>
          <li>Never carry weapons, illegal items or anything dangerous on a trip or in a parcel.</li>
          <li>If you feel unsafe, end the trip at a safe place and contact Support. In an emergency, call 999 first.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">4. BE HONEST</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Use your own account and your real name and phone number.</li>
          <li>Do not create fake trips, fake orders or multiple accounts, and do not misuse promo codes or rewards.</li>
          <li>Pay the fare or price shown in the app. Do not ask for, or offer, extra payment outside the app.</li>
          <li>Describe parcels and orders honestly.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">5. RESPECT VEHICLES AND PROPERTY</h2>
        <p className="mt-2 text-gray-600">Keep vehicles clean, do not smoke in them, and take care of the driver&apos;s and the merchant&apos;s property. Report any damage or lost items through Support.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">6. PROTECT PRIVACY</h2>
        <p className="mt-2 text-gray-600">Only use another person&apos;s phone number, address or location to complete the trip or order you are working on. Do not contact anyone you met through Arohon for personal reasons after the trip, and do not share their details.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">7. RATINGS AND REPORTS</h2>
        <p className="mt-2 text-gray-600">Rate every trip honestly. If something goes wrong, report it in the app. Our team reviews every report. False or malicious reports are themselves a breach of these guidelines.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">8. WHAT HAPPENS IF THE GUIDELINES ARE BROKEN</h2>
        <p className="mt-2 text-gray-600">Depending on what happened, Arohon may give a warning, limit features, or temporarily or permanently suspend an account. Serious incidents, such as violence or illegal activity, may be reported to the police.</p>
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
