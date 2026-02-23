'use client';

import { Car, MapTrifold, Compass, AirplaneTakeoff } from '@phosphor-icons/react';

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
    <section
      className="px-6 pt-3 pb-20 bg-white"
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
                className="flex flex-1 flex-col items-center text-center border-r px-[12px] first:pl-0 last:border-r-0 last:pr-0"
                style={{
                  borderColor: 'rgb(235, 235, 235)',
                }}
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
      </div>
    </section>
  );
}
