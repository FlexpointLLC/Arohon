// Build challenges listed on /challenges, each with its own shareable page and submit form at /challenges/[slug].
// English only: the audience is developers and designers.
export type Challenge = {
  slug: string;
  no: string; // shown as a code, e.g. "01"
  name: string;
  tagline: string;
  brief: string;
  prize: string;
  winners: number;
  opens: string; // ISO
  closes: string; // ISO, submissions shut at this moment
  results: string; // ISO date results are announced
  faq: [string, string][];
};

export const CHALLENGES: Challenge[] = [
  {
    slug: 'build-for-bangladesh',
    no: '01',
    name: 'Build for Bangladesh',
    tagline: 'Ship something real. Top two win GTA\u00a06.',
    brief: 'Pick any problem around you and build an app, a tool, a site or a prototype that solves it. Study, health, money, farming, games, anything. Send a link we can open, and the repo if you have one.',
    prize: 'GTA 6',
    winners: 2,
    opens: '2026-11-25T00:00:00+06:00',
    closes: '2026-12-10T23:59:59+06:00',
    results: '2026-12-20',
    faq: [
      ['What should I build?', 'Anything that solves a real problem. Study tools, health, small business, farming, money, games, rides, safety. Be creative. If it helps someone and it works, it counts.'],
      ['What do I need to submit?', 'A link we can open (APK, Play Store, TestFlight, Vercel or Netlify, a Figma prototype or a demo video). A GitHub repo is optional, but it helps us judge the code. If you add one, keep it public until results are out.'],
      ['Who can join?', 'Anyone in Bangladesh. Students, developers, designers, first time builders. Solo or a team of up to 4, one entry per person.'],
      ['How are winners picked?', 'The Arohon team opens every entry and judges on four things: it works, it solves a real problem, the craft and UX, and readable code if you shared a repo. Leaderboard votes show us what people love.'],
      ['Does it have to use Arohon?', 'No. Work you started before the challenge is fine too, as long as you built it. You keep full ownership.'],
      ['Can I submit a design only?', 'Yes, if the prototype is clickable. Use the Figma link as your project link. No repo needed.'],
      ['Can I edit my entry after submitting?', 'Email support@arohon.co from the address you entered and tell us what to change. One entry per email.'],
      ['How will I know if I won?', 'We email the two winners and post the results on our socials. One GTA 6 copy per winning entry.'],
      ['Which platform is the GTA 6 copy for?', 'Winners choose the console version they want.'],
    ],
  },
];

export const challengeBySlug = (slug: string) => CHALLENGES.find((c) => c.slug === slug);
export const isOpen = (c: Challenge, now = Date.now()) => now >= +new Date(c.opens) && now <= +new Date(c.closes);
