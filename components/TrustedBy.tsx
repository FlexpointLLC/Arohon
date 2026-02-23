'use client';

import { motion } from 'framer-motion';
import { Car, MapTrifold, Compass, AirplaneTakeoff } from '@phosphor-icons/react';
import { appearTransition, appearViewport, fadeUpVariants } from './AnimateIn';

const CARDS = [
  {
    title: 'City rides',
    lines: [
      'Reliable rides within the city.',
      'Safe, quick, and fairly priced.',
    ],
    icon: Car,
  },
  {
    title: 'City to city',
    lines: [
      'Comfortable intercity travel.',
      'Transparent pricing, every kilometer.',
    ],
    icon: MapTrifold,
  },
  {
    title: 'Long tour',
    lines: [
      'Multi-day trips to anywhere.',
      'Your comfort, your pace.',
    ],
    icon: Compass,
  },
  {
    title: 'Airport',
    lines: [
      'Hassle-free airport transfers.',
      'On-time pickup, flight tracking.',
    ],
    icon: AirplaneTakeoff,
  },
];

export function TrustedBy() {
  return (
    <motion.section
      className="overflow-visible px-4 pt-3 pb-2 sm:px-6 sm:pb-12"
      initial="initial"
      whileInView="animate"
      viewport={appearViewport}
      transition={appearTransition}
      variants={fadeUpVariants}
    >
      <div
        className="mx-auto mt-0 w-full max-w-[990px] rounded-[20px] bg-white py-8 text-white shadow-[0px_15px_32px_0px_rgba(0,0,0,0.08)]"
      >
        <div className="flex max-w-[1152px] w-full flex-col sm:flex-row">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="flex flex-1 flex-col items-center border-b border-gray-200 px-4 py-6 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:border-gray-200 sm:px-3 sm:py-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
              >
                {/* Icon: 48×38px container, 20px graphic */}
                <div
                  className="mb-[30px] flex h-[38px] w-[48px] shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'rgb(238, 238, 238)' }}
                >
                  <Icon
                    size={20}
                    color="rgb(55, 55, 55)"
                  />
                </div>
                {/* Title: 16px */}
                <h3
                  className="mb-[4px] text-[16px] font-semibold"
                  style={{
                    color: 'rgb(34, 34, 34)',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  }}
                >
                  {card.title}
                </h3>
                {/* Subtitle: 13px */}
                <p
                  className="w-full text-[13px] leading-[1.5]"
                  style={{
                    color: 'rgb(120, 120, 120)',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                  }}
                >
                  {card.lines[0]}
                  <br />
                  {card.lines[1]}
                </p>
              </div>
            );
          })}
        </div>
        <div
          className="mt-0 border-t border-gray-200 px-4 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-3"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <p className="w-full text-center text-[13px] leading-relaxed text-gray-600">
            <strong className="text-gray-900">Plan your ride, journey, or trip</strong> across Bangladesh
            with Arohon. Whether you need a quick city ride in Dhaka, an intercity journey to Sylhet, or
            a planned trip across 64 districts. Book a ride in one tap. Our ride-sharing platform connects
            you with verified drivers for safe, affordable travel.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
