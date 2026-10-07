import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Food and Medicine Orders Policy - Arohon',
  description: 'Rules for ordering food and medicine through Arohon: orders, payment, cancellations and refunds.',
};

export default function FoodPolicyPage() {
  return (
    <LegalPageLayout title="Food and Medicine Orders" lastUpdated="October 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. SCOPE</h2>
        <p className="mt-2 text-gray-600">This policy applies to food and medicine orders placed through the Arohon app from restaurants, shops and pharmacies (each a &quot;Merchant&quot;). It forms part of the Arohon Terms of Service. Arohon connects you with Merchants and delivers your order. The Merchant prepares the order and is responsible for the food or products it sells.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">2. PLACING AN ORDER</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Menus, prices and availability are set by each Merchant and may change at any time.</li>
          <li>Your order is confirmed only when the Merchant accepts it in the app. A Merchant may decline an order, for example when an item is out of stock or the shop is closing.</li>
          <li>Once accepted, the Merchant prepares your order and an Arohon rider collects and delivers it. You can follow every step in the app.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">3. PAYMENT</h2>
        <p className="mt-2 text-gray-600">You can pay for food and medicine orders with cash on delivery, bKash, Nagad or card, as offered at checkout. Prices include the item price set by the Merchant. Any delivery fee, platform fee or discount is shown in the app before you place your order.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">4. MEDICINE</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Medicine is supplied by licensed pharmacies only.</li>
          <li>Where a medicine requires a prescription, the pharmacy may ask to see a valid prescription and may refuse the order without one.</li>
          <li>Always read the label and follow your doctor&apos;s advice. Arohon does not give medical advice.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">5. ALLERGIES AND FOOD SAFETY</h2>
        <p className="mt-2 text-gray-600">If you have an allergy or dietary need, check with the Merchant before ordering. Merchants are responsible for the ingredients, preparation, hygiene and packaging of the food they sell.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">6. CANCELLATIONS</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>You can cancel an order in the app before the Merchant accepts it.</li>
          <li>If the Merchant cannot take your order, or the order is cancelled before it is prepared, it is cancelled at no cost to you.</li>
          <li>Once the Merchant has started preparing your order, it may no longer be possible to cancel it.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">7. REFUNDS</h2>
        <p className="mt-2 text-gray-600">If a Merchant cannot take your order, or your order is cancelled, any charge you have paid is refunded. Refunds for digital payments are returned to the payment method you used. If an item is missing, wrong or damaged on delivery, report it through Support in the app with your order details and photos where available, and we will review it with the Merchant.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">8. DELIVERY</h2>
        <p className="mt-2 text-gray-600">Delivery times shown in the app are estimates. Please make sure someone is available at the delivery address with the phone number you provided. If the rider cannot reach you, the order may be cancelled without a refund for food that has already been prepared.</p>
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
