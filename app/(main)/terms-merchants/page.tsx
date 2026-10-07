import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Merchant Terms - Arohon',
  description: 'Terms for restaurants, shops and pharmacies selling on Arohon through the Arohon Shop app.',
};

export default function MerchantTermsPage() {
  return (
    <LegalPageLayout title="Merchant Terms" lastUpdated="October 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. SCOPE</h2>
        <p className="mt-2 text-gray-600">These Merchant Terms apply to restaurants, shops and pharmacies (each a &quot;Merchant&quot;) that sell food, medicine and other products to customers through Arohon, using the Arohon Shop or Arohon Agent apps. They apply together with any written agreement between the Merchant and Arohon Limited. If the two differ, the written agreement applies.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">2. JOINING AROHON</h2>
        <p className="mt-2 text-gray-600">Merchant accounts are set up by Arohon, including the shop, its branches and the staff logins. The Merchant must hold every trade licence, food safety, drug and other permit required for what it sells, and provide them to Arohon on request.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">3. HANDLING ORDERS</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>New orders appear in the app in real time. The Merchant accepts or rejects each order promptly.</li>
          <li>Accepting an order means the Merchant starts preparing it. The Merchant marks the order as ready when it can be collected.</li>
          <li>An Arohon rider collects ready orders from the Merchant&apos;s branch and delivers them to the customer.</li>
          <li>The Merchant keeps its opening status, menu, prices and stock up to date, and closes the shop in the app when it cannot take orders.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">4. QUALITY AND SAFETY</h2>
        <p className="mt-2 text-gray-600">The Merchant is responsible for the products it sells, including their quality, ingredients, hygiene, labels, expiry dates and packaging. Food must be sealed and packed for delivery. Pharmacies must only supply medicine lawfully and must ask for a prescription where one is required.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">5. PRICES, FEES AND PAYMENT</h2>
        <p className="mt-2 text-gray-600">The Merchant sets its own prices. Arohon charges the commission and fees agreed with the Merchant, which are recorded for each order. Customer payments collected on the Merchant&apos;s behalf are settled to the Merchant after deducting the agreed commission and fees.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">6. CANCELLATIONS AND REFUNDS</h2>
        <p className="mt-2 text-gray-600">If the Merchant rejects or cannot fulfil an order, the customer is not charged and any payment is refunded. If a customer reports a missing, wrong or damaged item caused by the Merchant, Arohon may review the order with the Merchant and the cost may be charged back to the Merchant.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">7. CONDUCT</h2>
        <p className="mt-2 text-gray-600">Merchants and their staff must treat customers and riders with respect, keep customer details private and use them only to fulfil orders, and must not ask customers to order or pay outside Arohon for orders that came through the app.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">8. SUSPENSION</h2>
        <p className="mt-2 text-gray-600">Arohon may pause or remove a Merchant that repeatedly rejects orders, receives serious complaints, sells unsafe or prohibited products, or breaks these terms.</p>
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
