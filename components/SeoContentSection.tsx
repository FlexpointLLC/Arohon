'use client';

import { motion } from 'framer-motion';
import { appearTransition, appearViewport, fadeUpVariants } from './AnimateIn';

export function SeoContentSection() {
  return (
    <motion.section
      className="relative mx-auto max-w-4xl px-4 pt-1 pb-12 text-center sm:px-6 md:pt-1 md:pb-16"
      aria-labelledby="seo-heading"
      initial="initial"
      whileInView="animate"
      viewport={appearViewport}
      transition={appearTransition}
      variants={fadeUpVariants}
    >
      <h2 id="seo-heading" className="sr-only">
        Ride, journey, and trip planning in Bangladesh
      </h2>
      <article
        className="mx-auto max-w-2xl text-left text-base leading-relaxed text-gray-600 sm:text-lg"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <p className="mb-4 text-gray-600">
          <strong className="text-gray-900">Plan your ride, journey, or trip</strong> across Bangladesh
          with Arohon. Whether you need a quick city ride in Dhaka, an intercity journey to Sylhet, or
          a planned trip across 64 districts. Book a ride in one tap. Our ride-sharing platform connects
          you with verified drivers for safe, affordable travel.
        </p>
        <p className="mb-4 text-gray-600">
          Plan your commute, plan your journey, or plan a weekend trip. Live tracking and transparent
          pricing make every ride simple. From hourly rentals to long-distance travel, Arohon is your
          partner for ride booking in Bangladesh. Ride safe, anywhere.
        </p>
      </article>
    </motion.section>
  );
}
