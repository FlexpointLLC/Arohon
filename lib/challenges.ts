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
    brief: 'Build an app, a tool, a site or a prototype that makes life in Bangladesh move better. Rides, parcels, food, payments, safety, traffic, anything. Send a link we can open and the repo behind it.',
    prize: 'GTA 6',
    winners: 2,
    opens: '2026-11-25T00:00:00+06:00',
    closes: '2026-12-10T23:59:59+06:00',
    results: '2026-12-20',
    faq: [
      ['What should I build?', 'Anything that helps people in Bangladesh move better. Rides, parcels, food, payments, safety, traffic. A live jam map, a fare splitter for Eid trips, a night pharmacy finder, or something we never thought of.'],
      ['What do I need to submit?', 'A link we can open (APK, Play Store, TestFlight, Vercel or Netlify, a Figma prototype or a demo video) and your GitHub repo. The repo must be public, or shared with the Arohon team, until results are out.'],
      ['Who can join?', 'Anyone in Bangladesh. Students, developers, designers, first time builders. Solo or a team of up to 4, one entry per person.'],
      ['How are winners picked?', 'The Arohon team opens every entry and judges on four things: it works, it solves a real problem, the craft and UX, and readable code. Leaderboard votes show us what people love.'],
      ['Does it have to use Arohon?', 'No. Work you started before the challenge is fine too, as long as you built it. You keep full ownership.'],
      ['Can I submit a design only?', 'Yes, if the prototype is clickable. Use the Figma link as your project link. A GitHub repo is still needed, it can hold your notes and screens.'],
      ['Can I edit my entry after submitting?', 'Submit again with the same email. We judge your latest entry.'],
      ['How will I know if I won?', 'We email the two winners and post the results on our socials. One GTA 6 copy per winning entry.'],
      ['Which platform is the GTA 6 copy for?', 'Winners choose the console version they want.'],
    ],
  },
];

export const challengeBySlug = (slug: string) => CHALLENGES.find((c) => c.slug === slug);
export const isOpen = (c: Challenge, now = Date.now()) => now >= +new Date(c.opens) && now <= +new Date(c.closes);
