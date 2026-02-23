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
        <blockquote className="relative mb-4 pl-14 italic text-gray-600">
          <span className="absolute -top-1 left-0 font-serif text-6xl leading-none text-gray-300">
            &ldquo;
          </span>
          <span className="relative">
            Plan your commute, plan your journey, or plan a weekend trip. Live tracking and transparent
            pricing make every ride simple. From hourly rentals to long-distance travel, Arohon is your
            partner for ride booking in Bangladesh. Ride safe, anywhere.
          </span>
          <span className="ml-1 font-serif text-2xl text-gray-300">&rdquo;</span>
        </blockquote>
      </article>
    </motion.section>
  );
}
