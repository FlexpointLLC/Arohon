'use client';

import { motion } from 'framer-motion';
import { CaretRight, Article } from '@phosphor-icons/react';
import { appearTransition, appearViewport, fadeUpVariants } from './AnimateIn';

const BRAND_GREEN = '#016b42';

const POSTS = [
  {
    id: 1,
    title: 'Tips for safer rides in Dhaka traffic',
    excerpt:
      'Navigate city traffic with confidence. Simple habits that make every ride safer and smoother for riders and drivers alike.',
    date: 'Feb 18, 2025',
    readTime: '4 min',
    href: '#',
  },
  {
    id: 2,
    title: 'How transparent pricing works on Arohon',
    excerpt:
      'We show you the fare before you book. No surprise charges, no hidden fees—just clear numbers you can trust.',
    date: 'Feb 12, 2025',
    readTime: '3 min',
    href: '#',
  },
  {
    id: 3,
    title: 'Intercity travel: What to expect',
    excerpt:
      'From booking to drop-off, here’s how Arohon makes long-distance rides comfortable and hassle-free.',
    date: 'Feb 5, 2025',
    readTime: '5 min',
    href: '#',
  },
];

export function BlogSection() {
  return (
    <motion.section
      className="relative flex flex-col items-center px-4 py-16 sm:px-6 sm:py-24 md:py-[100px] lg:py-[150px]"
      initial="initial"
      whileInView="animate"
      viewport={appearViewport}
      transition={appearTransition}
      variants={fadeUpVariants}
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-12 w-full max-w-[990px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
          <h2
            className="font-semibold tracking-tight text-gray-900 text-3xl sm:text-4xl lg:text-[48px]"
            style={{ lineHeight: '100%' }}
          >
            From our <span style={{ color: BRAND_GREEN, fontWeight: 800, fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', letterSpacing: '1px' }}>blog</span>
          </h2>
          <p className="mt-1 max-w-[600px] text-base leading-relaxed text-gray-600">
            Tips, updates, and stories about riding safer and smarter across Bangladesh.
          </p>
        </div>

        {/* Post cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post) => (
            <a
              key={post.id}
              href={post.href}
              className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-gray-200 hover:shadow-lg"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${BRAND_GREEN}15` }}
              >
                <Article size={24} style={{ color: BRAND_GREEN }} weight="fill" />
              </div>
              <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-[#016b42]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '18px' }}>
                {post.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{post.date}</span>
                <span>{post.readTime} read</span>
              </div>
            </a>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
            style={{ backgroundColor: BRAND_GREEN }}
          >
            View all posts
            <CaretRight size={18} weight="bold" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
