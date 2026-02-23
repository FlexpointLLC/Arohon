'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Car, CaretRight } from '@phosphor-icons/react';

const BRAND_GREEN = '#016b42';

const TABS = [
  { id: 'city-ride', label: 'City Ride', image: '1.png' },
  { id: 'intercity', label: 'Intercity', image: '2.png' },
  { id: 'rental', label: 'Rental', image: '3.png' },
  { id: 'pickup', label: 'Pickup', image: '4.png' },
  { id: 'ambulance', label: 'Ambulance', image: '5.png' },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface FeatureBlock {
  heading: string;
  text: string;
}

interface TabContentType {
  features: [FeatureBlock, FeatureBlock, FeatureBlock];
}

const TAB_CONTENT: Record<TabId, TabContentType> = {
  'city-ride': {
    features: [
      {
        heading: 'Available Vehicles',
        text: 'Choose from bikes, cars, and CNG for your city rides. Whether you need a quick trip or a comfortable AC ride, we have the right vehicle for you.',
      },
      {
        heading: 'Comfort With Affordability',
        text: "With Arohon's rates, you can travel with ease and comfort that is affordable—whether it's a quick errand or a longer ride across town.",
      },
      {
        heading: 'Hassle-free and Quick',
        text: 'With just a few clicks on the app, you can find a bike, car, or CNG easily, in minutes.',
      },
    ],
  },
  intercity: {
    features: [
      {
        heading: 'Car Plus & Hiace',
        text: 'Travel between cities in comfort. Book Car Plus for a premium ride or Hiace for group trips—both offer spacious seating and safe, experienced drivers.',
      },
      {
        heading: 'Long-Distance Made Easy',
        text: 'Our intercity fleet is built for the journey. Ideal for family trips, business travel, or weekend getaways.',
      },
      {
        heading: 'Book Ahead or Last Minute',
        text: 'Plan your trip in advance or book on the go. Arohon makes intercity travel simple and reliable.',
      },
    ],
  },
  rental: {
    features: [
      {
        heading: 'Hourly & Daily Rentals',
        text: 'Need a vehicle for the day or longer? Rent by the hour or day. Perfect for errands, events, or when you need wheels on your schedule.',
      },
      {
        heading: 'Drive Yourself or Hire',
        text: 'Choose to drive yourself or hire a driver. Either way, we make vehicle rental straightforward and hassle-free.',
      },
      {
        heading: 'Wide Selection',
        text: 'From cars to micro buses, find the right vehicle for your needs with just a few taps.',
      },
    ],
  },
  pickup: {
    features: [
      {
        heading: 'Moving Home or Furniture',
        text: 'Moving to a new place? Need to transport furniture or heavy items? Our pickup and truck services make moving easy.',
      },
      {
        heading: 'Built for Heavy Loads',
        text: 'Pickups and trucks designed for hauling. Whether it is household goods, appliances, or deliveries—we handle it.',
      },
      {
        heading: 'Book When You Need',
        text: 'Book by the hour or for the full trip. Transparent pricing, reliable drivers, available when you need them.',
      },
    ],
  },
  ambulance: {
    features: [
      {
        heading: 'Emergency Medical Transport',
        text: 'When every second counts, our ambulance service is there. Equipped and ready for urgent care needs.',
      },
      {
        heading: '24/7 Availability',
        text: 'Medical emergencies do not wait. Our ambulance service is available around the clock, whenever you need it.',
      },
      {
        heading: 'Coverage Across the Country',
        text: 'Wherever you are, we work to get you or your loved ones to care quickly and safely.',
      },
    ],
  },
};

export function ServicesTabsSection() {
  const [activeTab, setActiveTab] = useState<TabId>('city-ride');
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const content = TAB_CONTENT[activeTab];
  const activeTabImage = TABS.find((t) => t.id === activeTab)?.image ?? '1.png';
  const activeTabLabel = TABS.find((t) => t.id === activeTab)?.label;
  const showPlaceholder = imageError[activeTabImage];

  return (
    <section
      className="relative flex flex-col items-center px-6 py-[150px]"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-6xl">
        {/* Title & description */}
        <div className="mx-auto mb-12 w-full max-w-[990px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
          <h2
            className="font-semibold tracking-tight text-gray-900"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '48px', lineHeight: '100%' }}
          >
            How we <span style={{ color: BRAND_GREEN, fontWeight: 800, fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', letterSpacing: '1px' }}>get</span> you there
          </h2>
          <p className="mt-1 max-w-[600px] text-base text-gray-600 leading-relaxed">
            From short hops to long journeys—choose the ride that fits your trip. Tap a tab to explore each service.
          </p>
        </div>

        {/* Tabs - bottom bar style */}
        <div className="mb-10 flex w-full gap-4 px-4 md:px-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative -mb-px flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
              style={
                activeTab === tab.id
                  ? { borderColor: BRAND_GREEN, color: BRAND_GREEN }
                  : { borderColor: '#d1d5db', color: '#6b7280' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content - Two columns: Left features + CTA, Right phone mockup */}
        <div className="grid min-h-[400px] grid-cols-1 gap-10 px-7 lg:grid-cols-2 lg:items-start">
          <div className="flex w-full max-w-[450px] flex-col justify-start py-10">
            <div className="space-y-6">
              {content.features.map((feature, i) => (
                <div key={i}>
                  <h3
                    className="font-semibold text-gray-900"
                    style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '18px', lineHeight: '1.3' }}
                  >
                    {feature.heading}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-gray-600">{feature.text}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-8 flex w-fit items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              style={{ backgroundColor: BRAND_GREEN }}
            >
              Learn More
              <CaretRight size={18} weight="bold" />
            </button>
          </div>

          {/* Phone mockup - competitor style */}
          <div className="flex justify-center">
            <div
              className="relative w-[280px] overflow-hidden rounded-[2.5rem] border-[12px] border-gray-800 shadow-2xl sm:w-[300px]"
              style={{ aspectRatio: '9/19' }}
            >
              <div className="absolute inset-x-0 top-0 h-8 rounded-t-[1.5rem] bg-gray-800" />
              <div
                className="absolute inset-x-2 top-10 bottom-2 overflow-hidden rounded-2xl bg-gray-100"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }}
              >
                {showPlaceholder ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${BRAND_GREEN}20` }}>
                      <Car size={28} weight="fill" style={{ color: BRAND_GREEN }} />
                    </div>
                    <span className="text-sm font-medium text-gray-500">{activeTabLabel}</span>
                    <span className="text-xs text-gray-400">Add 1.png–5.png to /public/</span>
                  </div>
                ) : (
                  <Image
                    src={`/${activeTabImage}`}
                    alt={`${content.features[0].heading} - App preview`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 240px, 260px"
                    onError={() => setImageError((prev) => ({ ...prev, [activeTabImage]: true }))}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
