import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Rewards and Missions Terms - Arohon',
  description: 'Terms for Arohon reward points, tiers, coupons and daily missions.',
};

export default function RewardsTermsPage() {
  return (
    <LegalPageLayout title="Rewards and Missions" lastUpdated="October 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">1. SCOPE</h2>
        <p className="mt-2 text-gray-600">These terms apply to the Arohon rewards program, including reward points, tiers, coupons and daily missions in the Arohon app. They form part of the Arohon Terms of Service.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">2. EARNING POINTS</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>You earn reward points for each completed ride and each delivered parcel booked with your Arohon account.</li>
          <li>You may earn extra points by completing daily missions and keeping your streak.</li>
          <li>Points are added once the ride or delivery is completed. Cancelled trips do not earn points.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">3. TIERS</h2>
        <p className="mt-2 text-gray-600">Your lifetime points place you on a ladder of 16 tiers, from Member to Legend, grouped into Base, Classic, Pro and Super. Higher tiers unlock better rewards. Tier names, thresholds and benefits are shown in the app and may change.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">4. COUPONS</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-600">
          <li>Points can be turned into coupons in the app, with discounts of up to 50% off.</li>
          <li>A coupon is applied automatically to your next eligible ride.</li>
          <li>Coupons cannot be exchanged for cash, transferred to another account or combined unless the app says so.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">5. DAILY MISSIONS</h2>
        <p className="mt-2 text-gray-600">New missions appear every day at midnight. Complete them within the day to earn their points. Missing a day may reset your streak. Weekly and streak rewards are shown in the app.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">6. NO CASH VALUE</h2>
        <p className="mt-2 text-gray-600">Reward points and coupons have no cash value, cannot be sold or transferred, and belong only to the account that earned them.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">7. MISUSE</h2>
        <p className="mt-2 text-gray-600">Arohon may remove points, coupons or tiers, or suspend the account, where rewards were earned through fake trips, multiple accounts, collusion with a driver, or any other misuse of the program.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">8. CHANGES AND ENDING THE PROGRAM</h2>
        <p className="mt-2 text-gray-600">Arohon may change how points are earned or used, or end the program, at any time. Points and coupons may be removed if your account is deleted.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">CONTACT</h2>
        <p className="mt-2 text-gray-600">For questions about this policy, contact Arohon Limited at support@arohon.co, through Support in the Arohon app, or via our contact page at arohon.co/contact.</p>
      </section>
    </LegalPageLayout>
  );
}
