import type { Metadata } from 'next';
import { PageSection } from '@/components/PageSection';

export const metadata: Metadata = {
  title: 'Join Our Team - Arohon',
  description: 'Careers at Arohon. Explore open roles and join us in building the future of ride-sharing in Bangladesh.',
};

export default function JoinOurTeamPage() {
  return (
    <main className="min-h-screen">
      <PageSection
        title="Join our"
        accent="team"
        subtitle="We are building the future of transportation in Bangladesh. Join a team that moves people, powers innovation, and creates real impact across the country."
      >
        <div
          className="space-y-10"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">Why Arohon</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="text-[#016b42] font-bold">•</span>
                <span>Work on products that touch millions of lives across Bangladesh</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#016b42] font-bold">•</span>
                <span>A fast-paced, mission-driven environment</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#016b42] font-bold">•</span>
                <span>Collaborative culture with room to grow and lead</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#016b42] font-bold">•</span>
                <span>Competitive benefits and a focus on work-life balance</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-[#016b42]/20 bg-[#016b42]/5 p-6 text-center sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900">Explore open roles</h3>
            <p className="mt-2 text-gray-600">
              We are always looking for talented people to join our team. Check back soon for current
              openings, or reach out to us directly.
            </p>
            <a
              href="mailto:careers@arohon.co"
              className="mt-6 flex w-full items-center justify-center rounded-xl px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-95 sm:inline-flex sm:w-auto"
              style={{ backgroundColor: '#016b42' }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </PageSection>
    </main>
  );
}
