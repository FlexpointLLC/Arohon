'use client';

import { motion } from 'framer-motion';
import { appearTransition, appearViewport, fadeUpVariants } from './AnimateIn';

const BRAND_GREEN = '#016b42';

export function PageSection({
  title,
  accent,
  subtitle,
  children,
  headingLevel = 'h1',
}: {
  title: string;
  accent: string;
  subtitle: string;
  children: React.ReactNode;
  headingLevel?: 'h1' | 'h2';
}) {
  const Heading = headingLevel;
  return (
    <motion.section
      className="relative flex flex-col items-center px-4 py-16 sm:px-6 sm:py-20 md:py-[120px] lg:py-[150px]"
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
        <div
          className="mx-auto mb-12 w-full max-w-[990px]"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <Heading
            className="font-semibold tracking-tight text-gray-900 text-3xl sm:text-4xl md:text-[48px]"
            style={{ lineHeight: '100%' }}
          >
            {title}{' '}
            <span
              style={{
                color: BRAND_GREEN,
                fontWeight: 800,
                fontFamily: 'var(--font-instrument), Georgia, serif',
                fontStyle: 'italic',
                letterSpacing: '1px',
              }}
            >
              {accent}
            </span>
          </Heading>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </motion.section>
  );
}
