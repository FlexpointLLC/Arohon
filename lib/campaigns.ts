// Campaigns shown on /promotion. Each one gets a card on the list and its own page at /promotion/[slug].
// Copy is bilingual: [english, bangla].
export type L = [string, string];
export type Campaign = {
  slug: string;
  name: L;
  badge: L;
  headline: L;
  sub: L;
  start: string; // ISO date
  end?: string; // no end = ongoing
  cta: L;
  img: string;
  howTitle: L;
  steps: { title: L; copy: L }[];
  details: { k: L; v: L }[];
  faq: { q: L; a: L }[];
};

export const CAMPAIGNS: Campaign[] = [
  {
    slug: 'passenger-income',
    name: ['Passengers earn too', 'যাত্রীদের ইনকাম'],
    badge: ['A new era of ride sharing', 'নতুন যুগের রাইড শেয়ারিং বিপ্লব'],
    headline: ['Why should only drivers earn? Now passengers earn too, with Arohon.', 'শুধু ড্রাইভাররাই কেন ইনকাম করবেন? যাত্রীদের ইনকাম নিয়ে আসছে আরোহন!'],
    sub: [
      'Ride sharing is no longer just travel costs and traffic fatigue. From now on, every trip and every referral earns you something back with Arohon.',
      'রাইড শেয়ারিং মানেই শুধু যাতায়াত খরচ আর ট্রাফিকের ক্লান্তি নয়। এবার থেকে যাতায়াতের পাশাপাশি আপনার প্রতিটি ট্রিপ এবং রেফারেল থেকে নিশ্চিত আয় হবে আরোহনের সাথে।',
    ],
    start: '2026-10-10',
    cta: ['Join today', 'আজই যুক্ত হোন'],
    img: '/img/promo-passenger-income.webp',
    howTitle: ['Start earning in 3 simple steps', 'খুব সহজ ৩টি ধাপে আপনার উপার্জন শুরু করুন'],
    steps: [
      { title: ['Sign up', 'রেজিস্ট্রেশন করুন'], copy: ['Open your account in the Arohon app, or log in to the one you already have.', 'আরোহন অ্যাপে আপনার অ্যাকাউন্ট ওপেন করুন অথবা বর্তমান অ্যাকাউন্টে লগইন করুন।'] },
      { title: ['Ride or share', 'রাইড নিন বা শেয়ার করুন'], copy: ['Keep riding as usual, and share your unique referral link or code with friends.', 'রেগুলার যাতায়াতের পাশাপাশি আপনার ইউনিক রেফারেল লিংক বা কোড বন্ধুদের সাথে শেয়ার করুন।'] },
      { title: ['Enjoy the income', 'ইনকাম উপভোগ করুন'], copy: ['Rewards and cashback keep adding up in your wallet for every successful ride and campaign activity.', 'প্রতি সফল রাইড ও ক্যাম্পেইন অ্যাক্টিভিটির ভিত্তিতে আপনার ওয়ালেটে রিওয়ার্ড ও ক্যাশব্যাক জমা হতে থাকবে।'] },
    ],
    details: [
      { k: ['Who can join', 'কারা যুক্ত হতে পারবেন'], v: ['Anyone using the Arohon app while the campaign runs.', 'ক্যাম্পেইন চলাকালীন আরোহন অ্যাপ ব্যবহারকারী যে কেউ।'] },
      { k: ['Campaign period', 'ক্যাম্পেইনের সময়'], v: ['From 10 October 2026, ongoing.', '১০ অক্টোবর ২০২৬ থেকে, চলমান।'] },
      { k: ['How you earn', 'কীভাবে আয় হবে'], v: ['Completed rides, referrals and activity on the platform.', 'সফল রাইড, রেফারেল আর প্ল্যাটফর্মের অ্যাক্টিভিটি থেকে।'] },
      { k: ['What you get', 'কী পাবেন'], v: ['Points or cashback in your wallet, which you can redeem later.', 'আপনার ওয়ালেটে পয়েন্ট বা ক্যাশব্যাক, যা পরে রিডিম করতে পারবেন।'] },
      { k: ['Terms', 'শর্ত'], v: ['Arohon may change or end the campaign. Promo code and rewards terms apply.', 'আরোহন ক্যাম্পেইন পরিবর্তন বা বন্ধ করতে পারে। প্রোমো কোড ও রিওয়ার্ডের শর্ত প্রযোজ্য।'] },
    ],
    faq: [
      { q: ['How do passengers earn?', 'যাত্রীরা কীভাবে ইনকাম করবেন?'], a: ['During the campaign period, you earn points or cashback from your rides, referrals and activity on the platform, which you can redeem later.', 'নির্দিষ্ট ক্যাম্পেইন পিরিয়ডে রাইড নেওয়ার পাশাপাশি রেফারেল এবং প্ল্যাটফর্ম অ্যাক্টিভিটির মাধ্যমে পয়েন্ট বা ক্যাশব্যাক অর্জিত হবে, যা পরবর্তীতে রিডিম করা যাবে।'] },
      { q: ['Is this offer open to everyone?', 'এই অফার কি সবার জন্য উন্মুক্ত?'], a: ['Yes. Anyone can join while the campaign is running, just by using the Arohon app.', 'হ্যাঁ, ক্যাম্পেইন চলাকালীন সময়ে যে কেউ আরোহন অ্যাপ ব্যবহার করে এই অফারে যুক্ত হতে পারবেন।'] },
    ],
  },
];

export const campaignBySlug = (slug: string) => CAMPAIGNS.find((c) => c.slug === slug);
/** live until the end date passes; no end date means ongoing */
// dates are Bangladesh days, so compare in Dhaka time (UTC+6) whatever the visitor's clock says
export const isLive = (c: Campaign, now = new Date()) => new Date(`${c.start}T00:00:00+06:00`) <= now && (!c.end || new Date(`${c.end}T23:59:59+06:00`) >= now);
