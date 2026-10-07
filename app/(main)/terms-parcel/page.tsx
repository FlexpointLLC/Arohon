import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Parcel Policy - Arohon',
  description: 'Rules for sending parcels with Arohon in Dhaka and across Bangladesh: what you can send, weight limits, delivery times and responsibilities.',
};

export default function ParcelPolicyPage() {
  return (
    <LegalPageLayout title="Parcel Policy" lastUpdated="October 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. SCOPE</h2>
        <p className="mt-2 text-gray-600">This Parcel Policy applies to every parcel booked through the Arohon app, within Dhaka and to any of the 64 districts of Bangladesh. It forms part of the Arohon Terms of Service. By booking a parcel you agree to this policy.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">2. DELIVERY OPTIONS</h2>
        <p className="mt-2 text-gray-600">Arohon offers the following delivery options. The options available, the price and the expected delivery time are shown in the app before you confirm.</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li><strong>Express</strong> Across Dhaka, usually within about an hour of pickup.</li>
          <li><strong>4-Hour Delivery</strong> Across Dhaka, within 4 hours, the same afternoon.</li>
          <li><strong>Same Day Delivery</strong> Longer city runs, delivered by the end of the day.</li>
          <li><strong>Nationwide</strong> To any district in Bangladesh, usually within 1 to 3 days.</li>
        </ul>
        <p className="mt-2 text-gray-600">Delivery times are estimates. Traffic, weather, road closures, holidays and events outside our control may cause delays.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">3. WHAT YOU CAN SEND</h2>
        <p className="mt-2 text-gray-600">You may send documents, food, homemade food, clothes, gifts, cosmetics, medicine, accessories, electronics and other everyday items, as long as they are legal, safely packed and within the limits below.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">4. WEIGHT AND SIZE</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Each parcel may weigh up to 8 kg.</li>
          <li>A parcel must be packed so it can be carried safely by a rider on a bike.</li>
          <li>Items over 8 kg must be split into smaller parcels, or sent with a pickup or truck booking instead.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">5. PROHIBITED ITEMS</h2>
        <p className="mt-2 text-gray-600">You must not send any of the following. Arohon and its riders may refuse, or stop, any parcel that appears to contain them:</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Passports and other official identity documents</li>
          <li>Bank cheques, cash, gold, jewellery and other valuables</li>
          <li>Illegal or prohibited drugs, or medicine without a valid prescription where one is required</li>
          <li>Weapons, ammunition, explosives, fireworks and anything flammable, toxic or corrosive</li>
          <li>Live animals</li>
          <li>Alcohol, tobacco and any item that is illegal to own or transport in Bangladesh</li>
          <li>Stolen goods, counterfeit goods or anything that infringes another person&apos;s rights</li>
          <li>Anything that is leaking, spoiling or dangerously packed</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">6. PACKING AND DESCRIPTION</h2>
        <p className="mt-2 text-gray-600">You are responsible for packing your parcel securely and describing its contents honestly in the app, including choosing the right item type and weight. Food should be sealed and fragile items should be protected. Riders may inspect the outside of a parcel and may refuse a parcel that is unsafe, mislabeled or appears to break this policy.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">7. PICKUP AND DELIVERY</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>An Arohon rider or representative collects the parcel from the pickup address you entered. For regular parcels, a pickup charge is shown in the app before you confirm.</li>
          <li>Please make sure someone is available at both the pickup and drop off addresses with the correct phone number.</li>
          <li>You can follow your parcel in the app from pickup to delivery.</li>
          <li>If the receiver cannot be reached, the rider will try to contact you. The parcel may be returned to you, and extra charges for the return trip may apply.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">8. PRICE AND PAYMENT</h2>
        <p className="mt-2 text-gray-600">The price for your parcel is shown in the app before you confirm the booking and depends on the delivery option, distance and weight. Payment is collected as shown in the app at the time of booking.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">9. LOST OR DAMAGED PARCELS</h2>
        <p className="mt-2 text-gray-600">If your parcel is lost or arrives damaged, report it through Support in the Arohon app or at support@arohon.co as soon as possible, with your booking details and photos where available. Each claim is reviewed on its merits. Arohon is not responsible for loss or damage caused by poor packing, an incorrect description of the contents, or items that break this policy.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">10. CANCELLATION</h2>
        <p className="mt-2 text-gray-600">You can cancel a parcel booking in the app before it is picked up. After pickup, a parcel cannot be cancelled, but you may contact Support to arrange a return, which may be charged.</p>
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
