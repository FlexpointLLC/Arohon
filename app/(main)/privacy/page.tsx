import type { Metadata } from 'next';
import { LegalPageLayout } from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy - Arohon',
  description: 'Privacy Policy for Arohon ride-sharing platform in Bangladesh.',
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="February 2026">
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Introduction</h2>
        <p className="mt-2 text-gray-600">
          This privacy policy describes how the Arohon website and related application (the &quot;Site&quot;, &quot;we&quot; or &quot;us&quot;) collects, uses, shares and protects the personal information that we collect through this Site. Arohon has established this Site to link up users who need transportation services (&quot;Customers&quot;) with individuals who will provide the transportation services (&quot;Drivers&quot;) or riders. This policy also applies to any mobile applications that we develop for use with our services. Please read below to learn more about our information practices. By using this Site, you agree to these practices.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">How We Collect Information</h2>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Information Provided By Your Web Browser</h3>
        <p className="mt-2 text-gray-600">
          You have to provide us with personal information like your name, contact no, mailing address and email id. Our app will also fetch your location information in order to give you the best service. Like many other websites, we may record information that your web browser routinely shares, such as your browser type, browser language, software and hardware attributes, the date and time of your visit, the web page from which you came, your Internet Protocol address and the geographic location associated with that address, the pages on this Site that you visit and the time you spent on those pages. This will generally be anonymous data that we collect on an aggregate basis. We may also use Google Analytics or a similar service to gather statistical information about the visitors to this Site and how they use the Site. This, also, is done on an anonymous basis. We will not try to associate anonymous data with your personally identifiable data.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Personal Information That You Provide</h3>
        <p className="mt-2 text-gray-600">
          If you want to use our service or contact an Arohon member, you must create an account on our Site. To establish your account, we will ask for personally identifiable information that can be used to contact or identify you, which may include your name, phone number, and e-mail address. We may also collect demographic information about you, such as your zip code, and allow you to submit additional information that will be part of your Arohon profile.
        </p>
        <p className="mt-2 text-gray-600">
          Other than basic information that we need to establish your account, it will be up to you to decide how much information to share as part of your profile. We encourage you to think carefully about the information that you share and we recommend that you guard your identity and your sensitive information. Of course, you can review and revise your profile at any time.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Payment Information</h3>
        <p className="mt-2 text-gray-600">
          We accept cash, digital payment methods, and mobile wallet. If you are a Customer, you may make payments once the ride is completed. We will have your address and contact no. in order to identify the customer and facilitate the ride. Payment processing may be handled by third-party payment providers whose privacy practices may differ from ours.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Device Information</h3>
        <p className="mt-2 text-gray-600">
          When you use your mobile device to access or avail our service or visit our site, we may receive information about your mobile device, including the hardware models, device IP address, SDK versions, operating systems and versions, software, preferred language and country site, internet browser, unique device identifiers, advertising identifiers, serial numbers and mobile network information.
        </p>
        <p className="mt-2 text-gray-600">
          We and our service providers and third parties we collaborate with, including ad networks, may use cross-device/cross-context tracking. For example, you might use multiple browsers on a single device, or use various devices (such as desktops, smartphones, and tablets), which can result in your having multiple accounts or profiles across these various contexts and devices. Cross-device/cross-context technology may be used to connect these various accounts or profiles and the corresponding data from the different contexts and devices. Device information i.e. the devices you use (mobile phones, computers, tablets, etc.) to access our services such as the hardware models, operation system information, software information and version, language preferences, IP address cookie information, advertising identifiers, browser version, device settings, and mobile network information. We may recognize your devices to provide you with personalized experiences and advertising across the services you use.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Use Of Cookies And Similar Technology</h2>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Session And Persistent Cookies</h3>
        <p className="mt-2 text-gray-600">
          As is commonly done on websites, we may use cookies and similar technology to keep track of our users and the services they have elected. A &quot;cookie&quot; is a small text file containing alphanumeric characters that is stored on your computer&apos;s hard drive and uniquely identifies your browser. We use both &quot;session&quot; and &quot;persistent&quot; cookies. Session cookies are deleted after you leave our website and when you close your browser. We use data collected with session cookies to enable certain features on our Site, to help us understand how users interact with our Site, and to monitor at an aggregate level Site usage and web traffic routing.
        </p>
        <p className="mt-2 text-gray-600">
          If you have created an account, we will also use persistent cookies that remain on your computer&apos;s hard-drive between visits, so that when you return to our Site we can remember who you are and your preferences. For example, after you log out of our Site, these persistent cookies can enable you to return to our Site without the need to log back in.
        </p>
        <p className="mt-2 text-gray-600">
          We may allow business partners who provide services to our Site to place cookies on your computer that assist us in analyzing usage data. We do not allow these business partners to collect your personal information from our website except as may be necessary for the services that they provide. You can manage these cookies through your browser settings. If you disable cookies, however, it may interfere with the functionality of our Site and you may not be able to use all of the Site&apos;s features.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Web Beacons</h3>
        <p className="mt-2 text-gray-600">
          We may also use web beacons or similar technology to help us track the effectiveness of our communications. For example, if you have elected to receive any of our e-mail newsletters, we may use technology that allows us to see how many recipients have opened the message and how many have clicked on one of its links.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Advertising Cookies</h3>
        <p className="mt-2 text-gray-600">
          We may use third parties, such as Google, to serve ads about our website over the internet. These third parties may use cookies to identify ads that may be relevant to your interest (for example, based on your recent visit to our website), to limit the number of times that you see an ad, and to measure the effectiveness of the ads. You can disable these advertising cookies through your browser or by opting out at the third party&apos;s privacy settings.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">From Time to Time</h2>
        <p className="mt-2 text-gray-600">
          From time to time, we may run contests or promotions and ask for a postal mailing address and other personal information relating to the contest or promotion. It will always be your choice whether to provide your personal information in order to participate in these events.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">What We Do With The Information We Collect</h2>
        <p className="mt-2 text-gray-600">
          We will generally use the information that we collect to provide our services, to monitor and analyze visitor activity on our website, promote and support our services, and develop a knowledge base regarding our website users. Certain information that you provide may be shared with Drivers to facilitate rides, and some information will be shared between Customers and Drivers as necessary for the service.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Your Contact Information</h3>
        <p className="mt-2 text-gray-600">
          When you provide us with your contact information, we will use that information to communicate with you about your use of our service. For example, when you have entered into a confirmed ride with us, we will use your contact information to notify you of the ride. We will also share your contact information with the Drivers so that you may contact each other about the ride. If you agree, we may also use your e-mail address to send you a newsletter or other information about our services. You may change your preferences at any time, though you will not be able to opt out of messages relating to your use of our service.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Registered Arohon Users</h3>
        <p className="mt-2 text-gray-600">
          When you register on our Site or App, you will create a user name and profile. Your user name and profile will be accessible by the users of our Site. With your prior permission, we may also share information about your use of the service on third party sites. For example, we may allow you to elect to share information about the services we provide through this site as updates to your social media accounts.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Testimonials</h3>
        <p className="mt-2 text-gray-600">
          We may allow you to submit testimonials about your experience with our Site. If you provide a testimonial, we may post it on this website along with your name. If you want your testimonial removed, please contact us through our app or website.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Ratings And Reviews</h3>
        <p className="mt-2 text-gray-600">
          If you are a Customer, you will be able to rate and review a Driver. If you choose to submit a rating, this will be aggregated with other ratings and available to other registered users of the Site. If you submit a review, your review along with your user name may be posted for others to see.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Anonymous Data</h3>
        <p className="mt-2 text-gray-600">
          We use the anonymous data that we collect on an aggregate basis to gain a better understanding of the visitors to our Site and to improve our website and product offerings. We reserve the right to license or use this aggregated information for industry analysis, demographic profiling and other purposes, but this information will not contain your individually identifiable personal information.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Information Shared With Drivers And Service Teams</h3>
        <p className="mt-2 text-gray-600">
          When you book a ride, we share necessary information with the Driver assigned to your ride and with our operations and support teams. This may include your name, contact number, pickup and drop-off locations, and ride details, so that we can complete the ride and provide customer support when needed.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Referrals</h3>
        <p className="mt-2 text-gray-600">
          We may also provide you with the opportunity to refer a potential customer to our Arohon services and earn a commission on the referral. To take advantage of this opportunity, you will need to provide Arohon with the e-mail address of the potential customer. We will include your name in the promotional message that we send the potential customer, but will always give the potential customer the option to decline any future promotional messages. Of course, we will not share recipient or potential customer contact information with other third parties for their marketing purposes.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Information Shared With Our Business Partners</h3>
        <p className="mt-2 text-gray-600">
          We may use business partners to help us design and operate our Site and provide services to support the Site. We may also hire a company to run certain website applications, provide data storage and processing services, or help us analyze our data. These business partners may have access to the personal information that we keep, but only so that they may perform these tasks on our behalf. We do not allow these business partners to make any independent commercial use of the individually identifiable information that we store, to share such data with third parties or from making the data publicly available. Keep in mind, however, that if you establish a separate relationship with one of these business partners, the information you provide directly to that organization will be subject to its terms of use and its privacy practices.
        </p>
        <p className="mt-2 text-gray-600">
          We may also provide your personal information to our business partners or other trusted entities for the purpose of providing you with information on goods or services we believe will be of interest to you. You can, at any time, opt out of receiving such communications. Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits. You can disable these specific cookies that track prior visits for the sake of follow-up advertising through your browser or third-party opt-out tools.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Business Operations, Law Enforcement And Legal Actions</h3>
        <p className="mt-2 text-gray-600">
          We may release your information without prior notice when we believe it is appropriate to prevent fraud or to prevent or stop activity that we know or suspect may be illegal, unethical or legally actionable; to comply with law or to cooperate with law enforcement activity or other governmental request; to respond to subpoenas, court orders or administrative agency requests for information; to enforce our policies; to protect the rights, property and safety of our business and of others; or when otherwise required by law. If there is a sale or merger of the company, division or business unit that operates this Site, we may also transfer the information we have collected in connection with such sale or merger.
        </p>
        <p className="mt-2 text-gray-600">
          We will use the information we collect to continuously improve our business and our website development. Your comments and suggestions are always appreciated. Please contact us through our app or website if you have any comments or suggestions.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Third Party Websites</h2>
        <p className="mt-2 text-gray-600">
          This Site may contain links to other websites operated by companies that are not affiliated with us. Also, you may have come to this website from a website that is not operated by us. We are not responsible for the operation of these other sites or the information that they collect from their visitors. If you would like to know how another site collects and uses your information, please review its privacy policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Changes To Your Information</h2>
        <p className="mt-2 text-gray-600">
          The information you provide us isn&apos;t set in stone. You may review, update, correct or delete the personal information in your profile at any time through the Application. If you would like us to remove your information from our records, please contact us through our app or website. We will attempt to accommodate your request if we do not have a legal obligation to retain the record.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">How We Protect Your Data</h2>
        <p className="mt-2 text-gray-600">
          If you have registered on this Site, you should be sure to protect your user ID and password to prevent others from being able to access the Site in your name. You should also be on guard for &quot;phishing&quot; scams and similar types of identity theft schemes. We do not and will not, at any time, request your credit card information, your account ID, login password, or national identification numbers in a non-secure or unsolicited e-mail or telephone communication.
        </p>
        <p className="mt-2 text-gray-600">
          If there is a breach of security involving your personal data that requires notification, you agree that we may notify you about the breach via email or by a conspicuous posting on this Site. We will make the notification without unreasonable delay, consistent with the legitimate needs of law enforcement and any measures necessary to determine the scope of the breach and restore the reasonable integrity of the data system.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Data Integrity And Retention</h3>
        <p className="mt-2 text-gray-600">
          We use the information that we collect about you only for the purposes for which it is collected and consistent with this policy. We keep information provided to us for as long as we believe necessary for our business purposes and as permitted by applicable law.
        </p>

        <h3 className="mt-4 text-base font-semibold text-gray-900">Changes To This Policy</h3>
        <p className="mt-2 text-gray-600">
          Our business and the laws that regulate us change from time to time, and we reserve the right to change this policy. If we do change this policy, we will post the revised version on this Site. If we propose to change our policy in a way that would permit us to make additional uses of information that we had previously collected about you, we will provide you with a meaningful way to opt out of those additional uses.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Data Subject To Bangladesh Law</h2>
        <p className="mt-2 text-gray-600">
          Arohon is located and operates its website in Dhaka, Bangladesh. Depending on where you live, the information that you provide and that this Site collects may be stored on servers that are outside of your state, province, country or other governmental jurisdiction, and the privacy laws that apply may not be as protective as those in your home jurisdiction. If you are located outside Bangladesh and choose to provide information to us, Bangladesh law may permit the transfer and processing of personal information to other countries. By using this website, you consent to this transfer and processing of data.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Children</h2>
        <p className="mt-2 text-gray-600">
          While our Site is available for all to come visit, you must be an adult to register on our website and use our services. We will not knowingly collect information about children under the age of 18. If you are a parent who believes that we have collected information about a child under age 18, please contact us with your child&apos;s name and address, and we will be happy to delete the information we have about your child from our records in accordance with applicable law (including the Children&apos;s Act 2013 where applicable).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">This Policy Is An Agreement</h2>
        <p className="mt-2 text-gray-600">
          When you visit this Site, you are accepting the practices described in this Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900">Contacting Us</h2>
        <p className="mt-2 text-gray-600">
          For any questions or comments about our policies or practices, please contact us at{' '}
          <a href="mailto:support@arohon.co" className="text-[#016b42] underline hover:no-underline">
            support@arohon.co
          </a>
          , through our app, or via our contact page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
