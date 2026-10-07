// Live intercity rates from fare_config (the quote-fare server's table), as provided 2026-10-07.
// Fare = max(base + km*perKm + min*perMin, minFare), rounded; Total = Fare + ৳3 safety + booking fee.
// Intercity discounts are off. Pickup/trucks have no intercity rates.
export const INTERCITY = {
  bike: { label: 'Bike', base: 50, perKm: 12, perMin: 1.13, min: 60, booking: 'city' },
  cng: { label: 'CNG', base: 70, perKm: 14, perMin: 1.5, min: 80, booking: 'city' },
  car: { label: 'Car', base: 135, perKm: 33.75, perMin: 2.7, min: 500, booking: 100 },
  car_plus: { label: 'Car Plus', base: 203, perKm: 36.45, perMin: 4.73, min: 1350, booking: 100 },
  micro: { label: 'Micro', base: 162, perKm: 40.5, perMin: 8.1, min: 1350, booking: 100 },
  hiace: { label: 'Hiace', base: 270, perKm: 47.25, perMin: 10.8, min: 2025, booking: 100 },
} as const;
export type IntercityV = keyof typeof INTERCITY;
export const SAFETY_FEE = 3;

/** booking fee by fare: ৳5 below ৳200, ৳10 below ৳350, ৳15 below ৳500, ৳20 from ৳500 (confirmed 2026-10-07) */
export const cityBooking = (fare: number) => (fare < 200 ? 5 : fare < 350 ? 10 : fare < 500 ? 15 : 20);

export function quoteIntercity(v: IntercityV, km: number, minutes: number) {
  const r = INTERCITY[v];
  const dist = km * r.perKm;
  const time = minutes * r.perMin;
  const fare = Math.round(Math.max(r.base + dist + time, r.min));
  const booking = r.booking === 'city' ? cityBooking(fare) : r.booking;
  return { base: r.base, dist: Math.round(dist), time: Math.round(time), fare, booking, safety: SAFETY_FEE, total: fare + SAFETY_FEE + booking };
}
