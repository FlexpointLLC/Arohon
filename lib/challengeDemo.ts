import type { PublicEntry } from './challengeDb';

// ponytail: sample board so the UI can be seen before Supabase is connected. Only used in dev when the database key is missing.
const d = (h: number) => new Date(Date.now() - h * 3600000).toISOString();
export const DEMO_ENTRIES: PublicEntry[] = [
  { id: '00000000-0000-4000-8000-000000000001', project: 'Jam Radar', pitch: 'Live waterlogging and jam map for Dhaka, built from rider reports.', live_url: 'https://jam-radar.vercel.app', repo_url: 'https://github.com/nafis/jam-radar', name: 'Nafis Rahman', team: null, votes: 148, created_at: d(70) },
  { id: '00000000-0000-4000-8000-000000000002', project: 'Split Koro', pitch: 'Split micro and Hiace fares for Eid trips in one tap, with bKash requests.', live_url: 'https://play.google.com/store/apps/details?id=com.splitkoro', repo_url: 'https://github.com/teamshiki/split-koro', name: 'Tasnim Akter', team: 'Team Shiki', votes: 131, created_at: d(52) },
  { id: '00000000-0000-4000-8000-000000000003', project: 'Oushodh Now', pitch: 'Find which pharmacy near you is open at 3 AM and has your medicine.', live_url: 'https://oushodh-now.netlify.app', repo_url: 'https://github.com/rifat/oushodh-now', name: 'Rifat Hasan', team: null, votes: 97, created_at: d(30) },
  { id: '00000000-0000-4000-8000-000000000004', project: 'SafeHome', pitch: 'Auto check in when your late night ride ends, alerts family if you do not.', live_url: 'https://github.com/mim/safehome/releases/download/v1/safehome.apk', repo_url: 'https://github.com/mim/safehome', name: 'Mim Chowdhury', team: 'Two Pixel', votes: 64, created_at: d(20) },
  { id: '00000000-0000-4000-8000-000000000005', project: 'Parcel Pal', pitch: 'One link order tracker for Facebook shops, with cash on delivery status.', live_url: 'https://parcel-pal.vercel.app', repo_url: 'https://github.com/sadman/parcel-pal', name: 'Sadman Sakib', team: null, votes: 41, created_at: d(9) },
  { id: '00000000-0000-4000-8000-000000000006', project: 'Bus Koi', pitch: 'Which local bus goes from here to there, with stops and real fares.', live_url: 'https://www.figma.com/proto/buskoi', repo_url: 'https://github.com/ayesha/bus-koi', name: 'Ayesha Siddika', team: null, votes: 12, created_at: d(2) },
];
