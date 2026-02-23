'use client';

import {
  Bicycle,
  Car,
  Bus,
  GasPump,
  AirplaneTakeoff,
  Clock,
  Ambulance,
  Truck,
  Key,
  Money,
  CreditCard,
  Wallet,
  DeviceMobile,
} from '@phosphor-icons/react';

const BRAND_GREEN = '#016b42';

const CARDS = [
  {
    titleBig: 'Go',
    titleSmall: 'anywhere',
    bgColor: '#3b82f6',
    textColor: 'white',
    arrowColor: 'white',
    arrowCircleBg: 'rgba(255,255,255,0.35)',
    items: [
      { label: 'Bike', icon: Bicycle },
      { label: 'Car', icon: Car },
      { label: 'Micro Bus', icon: Bus },
      { label: 'CNG', icon: GasPump },
    ],
  },
  {
    titleBig: 'Ride',
    titleSmall: 'more',
    bgColor: '#bbf7d0',
    textColor: '#166534',
    arrowColor: '#166534',
    arrowCircleBg: 'rgba(255,255,255,0.7)',
    items: [
      { label: 'Car Plus', icon: Car },
      { label: 'Hiace', icon: Bus },
      { label: 'Airport', icon: AirplaneTakeoff },
      { label: 'Hourly Rental', icon: Clock },
    ],
  },
  {
    titleBig: 'Special',
    titleSmall: 'services',
    bgColor: '#8b5cf6',
    textColor: 'white',
    arrowColor: 'white',
    arrowCircleBg: 'rgba(255,255,255,0.35)',
    items: [
      { label: 'Ambulance', icon: Ambulance },
      { label: 'Pickup', icon: Truck },
      { label: 'Truck', icon: Truck },
      { label: 'Rental', icon: Key },
    ],
  },
  {
    titleBig: 'Pay',
    titleSmall: 'your way',
    bgColor: '#1e3a8a',
    textColor: 'white',
    arrowColor: 'white',
    arrowCircleBg: 'rgba(255,255,255,0.35)',
    items: [
      { label: 'Cash', icon: Money },
      { label: 'Card', icon: CreditCard },
      { label: 'Wallet', icon: Wallet },
      { label: 'Mobile Wallet', icon: DeviceMobile },
    ],
  },
];

function ServiceCard({
  titleBig,
  titleSmall,
  bgColor,
  textColor,
  arrowColor,
  arrowCircleBg,
  items,
}: {
  titleBig: string;
  titleSmall: string;
  bgColor: string;
  textColor: string;
  arrowColor: string;
  arrowCircleBg: string;
  items: { label: string; icon: React.ElementType }[];
}) {
  return (
    <div
      className="flex h-[456px] flex-col justify-between rounded-3xl p-6"
      style={{
        backgroundColor: bgColor,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <div>
        <h3 className="flex flex-col gap-0" style={{ color: textColor }}>
          <span className="font-bold leading-[90%]" style={{ fontSize: '48px' }}>{titleBig}</span>
          <span
            className="font-bold italic"
            style={{
              fontSize: '28px',
              lineHeight: '90%',
              fontFamily: 'var(--font-instrument), Georgia, serif',
              letterSpacing: '1px',
              color: textColor,
            }}
          >
            {titleSmall}
          </span>
        </h3>
        <ul className="mt-5 space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className="flex items-center gap-3 text-base">
                <span className="shrink-0"><Icon size={20} color={textColor} weight="fill" /></span>
                <span style={{ color: textColor }}>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-6 flex justify-end">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: arrowCircleBg }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: arrowColor }}>
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ServicesSection() {
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
        <div className="mx-auto mb-12 w-full max-w-[990px]" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
          <h2
            className="font-semibold tracking-tight text-gray-900"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', fontSize: '48px', lineHeight: '100%' }}
          >
            How we <span style={{ color: BRAND_GREEN, fontWeight: 800, fontFamily: 'var(--font-instrument), Georgia, serif', fontStyle: 'italic', letterSpacing: '1px' }}>serve</span> you
          </h2>
          <p className="mt-1 max-w-[600px] text-base text-gray-600 leading-relaxed">
            From quick city rides to long-distance trips and special services—book bikes, cars, buses, and more. Pay your way with cash, card, or mobile wallet.
          </p>
        </div>
        {/* Service cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <ServiceCard
              key={card.titleBig + card.titleSmall}
              titleBig={card.titleBig}
              titleSmall={card.titleSmall}
              bgColor={card.bgColor}
              textColor={card.textColor}
              arrowColor={card.arrowColor}
              arrowCircleBg={card.arrowCircleBg}
              items={card.items}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
