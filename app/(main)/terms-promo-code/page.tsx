import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Promo Code Terms - Arohon',
  description: 'Terms and conditions for Arohon promo codes and discounts on ride-sharing in Bangladesh.',
};

export default function PromoCodePage() {
  return (
    <LegalPageLayout title="Promo Code" lastUpdated="February 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE APPLYING PROMO CODES AND PARTICIPATING IN RIDE SHARING</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-gray-600">
          <li>Arohon has the right to decide who gets promo codes.</li>
          <li>A promo code sent to a particular user cannot be transferred to anyone else.</li>
          <li>
            Any promo code received via SMS in a user&apos;s mobile number will only be applicable if their Arohon account is registered against that particular number. The promo code will not work with an account registered with a different mobile number.
          </li>
          <li>User who got the promo code can use it during the time when the promo is valid.</li>
          <li>User who got the promo code can use it as many times as mentioned in the SMS.</li>
          <li>Promo code will only be applicable during a ride when the User applies the promo code in the app before taking the ride.</li>
          <li>If a User has more than one promo code, the first applied promo code will be applicable.</li>
          <li>
            If a promo code does not work then the event must be reported to Arohon Support. No action can be taken before allowing Arohon the time to come to a solution.
          </li>
          <li>A promo code sent to a particular geographic region can only be used there.</li>
          <li>Promo codes can only be used in regions where Arohon is available.</li>
          <li>A promo code will only be applicable for a ride when it is active for more than 100 seconds.</li>
          <li>Arohon has the right to modify and amend these terms and conditions.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">CONTACT</h2>
        <p className="mt-2 text-gray-600">
          For questions about promo codes, please contact us at support@arohon.co, through our app, or via our contact page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
