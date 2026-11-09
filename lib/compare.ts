// Comparison pages at /compare/[slug]. Competitor facts are as reported by the linked sources, with the year.
// Keep claims factual: when a figure is not verified, say so instead of guessing.

export type Row = [feature: string, arohon: string, them: string];
export type Source = { label: string; url: string };

export type Compare = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  label: string;
  title: string;
  rest: string;
  intro: string;
  /** reported commission used by the earnings calculator, null when not verified */
  rate: number | null;
  rateNote: string;
  rows: Row[];
  verdict: { arohon: string; them: string };
  theirStrengths: string[];
  faqs: [string, string][];
  sources: Source[];
  /** false for apps not available in Bangladesh */
  local?: boolean;
  /** hide the commission comparison when it does not apply */
  noCalc?: boolean;
  /** hub table cells: commission, upfront fare, bike, CNG, parcel, food and medicine */
  glance: [string, string, string, string, string, string];
};

export const AROHON_ROWS = {
  commission: 'Flat 2% plus ৳3 safety charge and a small booking fee',
  pricing: 'Upfront fare before you book, no bargaining',
  payment: 'Cash for rides. bKash, Nagad and card for food and medicine',
  vehicles: 'Bike, EV bike, CNG, car, car plus, micro, Hiace',
  extras: 'Parcel in 1 hour in Dhaka, 64 districts in 1 to 3 days, food, medicine, rental, ambulance, airport rides',
  rental: 'Drivers send offers, you pick by price, rating and car',
};

/** page for an app that does not run in Bangladesh, answering "is X available in Bangladesh" */
function abroad(a: { slug: string; name: string; kind: string; what: string; best: string; rate: number | null; note: string; strengths: string[]; source: Source }): Compare {
  return {
    slug: `arohon-vs-${a.slug}`,
    local: false,
    glance: ['Not in Bangladesh', '', '', '', '', ''],
    name: a.name,
    metaTitle: `Is ${a.name} Available in Bangladesh? Try Arohon`,
    metaDescription: `${a.name} is not in Bangladesh. Arohon is the local alternative for ${a.kind}: 2% driver commission, upfront fares, bike, CNG, car and parcel.`,
    label: `Arohon vs ${a.name}`,
    title: `${a.name} in Bangladesh?`,
    rest: 'Meet the local alternative.',
    intro: `${a.what}. It is not available in Bangladesh. If you are looking for ${a.name} in Dhaka, Arohon gives you the same idea, built for Bangladeshi roads, prices and payments.`,
    rate: a.rate,
    rateNote: a.note,
    rows: [
      ['Available in Bangladesh', 'Yes, Dhaka and cities across Bangladesh', 'No'],
      ['Driver commission', AROHON_ROWS.commission, a.note.split('. ')[0].replace(/\.$/, '')],
      ['Pricing', AROHON_ROWS.pricing, 'Upfront fares where it operates'],
      ['Vehicles', AROHON_ROWS.vehicles, 'Varies by country'],
      ['Beyond rides', AROHON_ROWS.extras, 'Varies by country'],
      ['Payment', AROHON_ROWS.payment, 'Local wallets and cards where it operates'],
    ],
    verdict: {
      arohon: `In Bangladesh, choose Arohon for ${a.best}, at upfront fares with cash payment for rides.`,
      them: `Use ${a.name} when you travel to a country where it operates.`,
    },
    theirStrengths: a.strengths,
    faqs: [
      [`Is ${a.name} available in Bangladesh?`, `No. ${a.name} does not operate in Bangladesh. Arohon is a local app with bike, EV bike, CNG, car, micro and Hiace rides, plus parcel, food, medicine, rental, ambulance and airport rides.`],
      [`What is the best ${a.name} alternative in Bangladesh?`, 'Arohon. You see the fare before you book, there is no bargaining, and drivers pay a flat 2% commission plus ৳3 safety and a small booking fee, so on a ৳100 trip the driver keeps ৳90.'],
      [`How much commission does ${a.name} take?`, `${a.note} Commission rules differ by country.`],
      ['Can I pay for Arohon rides with a card?', 'Rides on Arohon are paid in cash. Food and medicine orders accept cash, bKash, Nagad and card.'],
    ],
    sources: [a.source],
  };
}

export const COMPARES: Compare[] = [
  {
    slug: 'arohon-vs-uber',
    glance: ['Up to 25% (2023)', 'Estimate, surge', 'Yes', 'Yes', 'Yes', 'Closed 2020'],
    name: 'Uber',
    metaTitle: 'Arohon vs Uber Bangladesh: Fares and Commission',
    metaDescription: 'Arohon vs Uber Bangladesh: driver commission, upfront fares, surge, payment and services. Which ride sharing app is better and cheaper in Dhaka?',
    label: 'Arohon vs Uber',
    title: 'Arohon vs Uber.',
    rest: 'Which is better in Bangladesh?',
    intro: 'Uber is the best known ride app in the world. Arohon is built in Bangladesh, for Bangladesh. Here is an honest side by side on fares, driver commission, services and safety, so you can choose the app that fits your trip.',
    rate: 25,
    rateNote: 'Uber commission of up to 25%, as reported by Rest of World in 2023.',
    rows: [
      ['Driver commission', AROHON_ROWS.commission, 'Up to 25%, as reported in 2023'],
      ['Pricing', AROHON_ROWS.pricing, 'Upfront estimate, surge pricing at busy times'],
      ['Payment for rides', AROHON_ROWS.payment, 'Check the Uber app for current options'],
      ['Vehicles', AROHON_ROWS.vehicles, 'Car, moto and CNG, options vary by city'],
      ['Beyond rides', AROHON_ROWS.extras, 'Uber Parcel delivery, food delivery closed in 2020'],
      ['Rental and intercity', AROHON_ROWS.rental, 'Book trips in the app'],
    ],
    verdict: {
      arohon: 'Choose Arohon if you want a fare you know before you book, drivers who keep almost all of it, and one app for rides, parcels, food, medicine, rental and ambulance.',
      them: 'Choose Uber if you travel abroad often and want one app you already know in many countries.',
    },
    theirStrengths: ['Global brand that works in many countries', 'Long track record in Dhaka since 2016', 'Familiar app for international travellers'],
    faqs: [
      ['Is Arohon cheaper than Uber?', 'Arohon shows your full fare before you book, with no bargaining and no surprise at the end. Prices depend on distance, time and vehicle, so compare the two apps for your own route. Drivers on Arohon pay a flat 2% commission, which keeps fares fair for both sides.'],
      ['How much commission does Uber take in Bangladesh?', 'Rest of World reported in 2023 that Uber took up to 25% of each fare in Bangladesh and was testing lower fees. Check the Uber driver app for today\'s rate. Arohon charges drivers a flat 2% plus a ৳3 safety charge and a small booking fee, so on a ৳100 trip the driver keeps ৳90.'],
      ['Why is my Uber fare higher than the estimate?', 'News reports have described final fares rising above the first estimate because of surge pricing, route changes and waiting time. On Arohon the fare you see before booking is the fare you pay for that trip.'],
      ['Does Arohon have bikes and CNG like Uber?', 'Yes. Arohon offers bike, EV bike, CNG, car, car plus, micro and Hiace, plus parcel delivery, food and medicine, rental with driver, ambulance booking and airport rides.'],
      ['Can I pay with bKash on Arohon?', 'Rides on Arohon are paid in cash. Food and medicine orders accept cash, bKash, Nagad and card.'],
    ],
    sources: [
      { label: 'Rest of World, Uber commission in Bangladesh, 2023', url: 'https://restofworld.org/2023/uber-commission-fees-bangladesh/' },
      { label: 'bdnews24, rideshare customers unhappy with inconsistent fares', url: 'https://bdnews24.com/bangladesh/rideshare-customers-unhappy-with-inconsistent-fares' },
      { label: 'TOB News, Uber launches parcel delivery in Bangladesh, 2026', url: 'https://tob.news/uber-launches-parcel-delivery-service-with-gps-tracking/' },
      { label: 'TBS News, Uber Eats discontinues operations in Bangladesh', url: 'https://www.tbsnews.net/tech/uber-eats-discontinue-operations-bangladesh-june-2-83218' },
    ],
  },
  {
    slug: 'arohon-vs-pathao',
    glance: ['10% to 15% bikes (2021)', 'Yes', 'Yes', 'Yes', 'Yes', 'Food'],
    name: 'Pathao',
    metaTitle: 'Arohon vs Pathao: Which Is Better and Cheaper?',
    metaDescription: 'Arohon vs Pathao: bike commission, upfront fares, CNG, parcel, food and payment compared. Find the best Pathao alternative in Bangladesh.',
    label: 'Arohon vs Pathao',
    title: 'Arohon vs Pathao.',
    rest: 'The fair alternative for Bangladesh.',
    intro: 'Pathao made bike rides a daily habit in Dhaka. Arohon takes the same idea further with a flat 2% commission, CNG and EV bikes, and rental where drivers send you offers. Here is how the two compare.',
    rate: 15,
    rateNote: 'Pathao bike commission of 10% at peak hours and up to 15% off peak, as reported by TBS in 2021.',
    rows: [
      ['Driver commission', AROHON_ROWS.commission, '10% peak, up to 15% off peak on bikes, as reported in 2021'],
      ['Pricing', AROHON_ROWS.pricing, 'Upfront fare in the app'],
      ['Payment for rides', AROHON_ROWS.payment, 'Cash and digital options, check the app'],
      ['Vehicles', AROHON_ROWS.vehicles, 'Bike and car'],
      ['Beyond rides', AROHON_ROWS.extras, 'Food, parcel and courier'],
      ['Rental and intercity', AROHON_ROWS.rental, 'Check the Pathao app'],
    ],
    verdict: {
      arohon: 'Choose Arohon if you want CNG and EV bikes in the same app, drivers who keep almost the whole fare, and rental where drivers compete with offers.',
      them: 'Choose Pathao if you already use its wallet and food app every day and do not want to switch.',
    },
    theirStrengths: ['Large network of bikes in Dhaka', 'Well known food and courier service', 'Has been in Bangladesh since 2015'],
    faqs: [
      ['Is Arohon a good Pathao alternative?', 'Yes. Arohon covers bike, EV bike, CNG, car, micro and Hiace, plus parcel, food, medicine, rental, ambulance and airport rides, with upfront fares and no bargaining.'],
      ['What is Pathao\'s bike commission?', 'In 2021 Pathao cut its bike commission to 10% at peak hours and up to 15% at other times, as reported by TBS. Check the Pathao rider app for the current rate. On Arohon, drivers pay a flat 2% plus ৳3 safety and a small booking fee.'],
      ['Is Arohon cheaper than Pathao?', 'Both show an upfront fare. Fares depend on distance, time and vehicle, so compare your own route. What is different is how much the driver keeps: on a ৳100 Arohon trip the driver keeps ৳90.'],
      ['Does Arohon have CNG rides?', 'Yes. You can book a CNG on Arohon at an upfront fare, with no meter argument and no bargaining.'],
      ['Can I drive for both Pathao and Arohon?', 'Many drivers use more than one app. Arohon does not stop you from driving elsewhere. Sign up on the Arohon driver app with your licence and vehicle papers.'],
    ],
    sources: [
      { label: 'TBS, Pathao cuts commission on bike rides, 2021', url: 'https://www.tbsnews.net/bangladesh/transport/pathao-cuts-commission-bike-rides-334081' },
      { label: 'The Daily Star, Pathao cuts commission for bike trips', url: 'https://www.thedailystar.net/business/organisation-news/news/pathao-cuts-commission-bike-trips-2902391' },
    ],
  },
  {
    slug: 'arohon-vs-indrive',
    glance: ['Not verified', 'You bid', 'Yes', 'Not confirmed', 'Not confirmed', 'Not confirmed'],
    name: 'inDrive',
    metaTitle: 'Arohon vs inDrive: Bidding or Upfront Fares?',
    metaDescription: 'Arohon vs inDrive in Bangladesh: upfront fares or bargaining on price, driver commission, vehicles, parcel and safety. Which app saves you time and money?',
    label: 'Arohon vs inDrive',
    title: 'Arohon vs inDrive.',
    rest: 'Fixed fare or bargain every trip?',
    intro: 'On inDrive you offer a price and drivers accept or counter. On Arohon city rides have one upfront fare, and bidding is saved for rental and long trips where it helps you. Here is the difference.',
    rate: null,
    rateNote: 'inDrive ran with 0% commission in Bangladesh at launch, as reported by TBS. Its current rate is not published here because we could not verify it.',
    rows: [
      ['Driver commission', AROHON_ROWS.commission, 'Started at 0% in Bangladesh, current rate not verified'],
      ['Pricing', 'Upfront fare for city rides. Offers from drivers for rental and intercity', 'You offer a price, drivers accept or counter'],
      ['Payment for rides', AROHON_ROWS.payment, 'Cash, check the app'],
      ['Vehicles', AROHON_ROWS.vehicles, 'Car and bike, check the app'],
      ['Beyond rides', AROHON_ROWS.extras, 'City to city and freight in some countries'],
      ['Speed to book', 'Tap once, the fare is set', 'Wait for drivers to answer your offer'],
    ],
    verdict: {
      arohon: 'Choose Arohon if you want to tap once and go at a known fare in the city, and get competing offers only when you rent a car or travel far.',
      them: 'Choose inDrive if you enjoy setting your own price on every trip and do not mind waiting for replies.',
    },
    theirStrengths: ['You name your own price', 'Popular in many countries', 'Can work well for long trips'],
    faqs: [
      ['Is inDrive cheaper than Arohon?', 'On inDrive the price depends on what you offer and what a driver accepts, so it changes trip to trip. On Arohon you see one upfront fare for city rides and pay exactly that.'],
      ['Does inDrive charge commission in Bangladesh?', 'TBS reported that inDrive ran with 0% commission when it started in Bangladesh and did not say when charges would begin. Check the inDrive driver app for today\'s rate. Arohon publishes its rate: a flat 2% plus ৳3 safety and a small booking fee.'],
      ['How does bidding work on Arohon?', 'For rental and intercity trips you send your request, drivers send offers, and you pick by price, rating and car. City rides use a fixed upfront fare so you can leave right away.'],
      ['Which app is better for daily office commute?', 'For a daily commute, a fixed fare saves time every morning. Arohon gives you the fare before you book, so there is nothing to negotiate.'],
    ],
    sources: [{ label: 'TBS, inDrive inner workings in Bangladesh', url: 'https://www.tbsnews.net/features/panorama/indrive-mysterious-inner-workings-new-ridesharing-app-684294' }],
  },
  {
    slug: 'arohon-vs-obhai',
    glance: ['Not published', 'Yes', 'Closed 2021', 'Yes', 'Yes', 'Not confirmed'],
    name: 'Obhai',
    metaTitle: 'Arohon vs Obhai: CNG, Car and Bike Rides Compared',
    metaDescription: 'Arohon vs Obhai: bike, CNG and car rides, payment, cities, parcel and safety. Looking for an Obhai alternative in Bangladesh? See the comparison.',
    label: 'Arohon vs Obhai',
    title: 'Arohon vs Obhai.',
    rest: 'More ways to move, one app.',
    intro: 'Obhai is known for CNG and car rides and its women focused OBON service. Arohon adds bikes, EV bikes, micro and Hiace, plus parcel, food, medicine and rental. Here is how they line up.',
    rate: null,
    rateNote: 'Obhai does not publish a commission rate we could verify.',
    rows: [
      ['Driver commission', AROHON_ROWS.commission, 'Not published'],
      ['Pricing', AROHON_ROWS.pricing, 'Upfront fare in the app'],
      ['Payment for rides', 'Cash', 'Digital payments such as bKash and card, as reported in 2021'],
      ['Vehicles', AROHON_ROWS.vehicles, 'Car, CNG and truck. Bike rides suspended, as reported in 2023'],
      ['Beyond rides', AROHON_ROWS.extras, 'Parcel delivery, truck booking and vehicle tracking'],
      ['Cities', 'Dhaka and cities across Bangladesh', '23+ cities, according to its website'],
    ],
    verdict: {
      arohon: 'Choose Arohon if you want bikes and EV bikes too, pay in cash, and want parcels, food, medicine and rental in the same app.',
      them: 'Choose Obhai if you prefer paying digitally for rides and mostly take CNG or car.',
    },
    theirStrengths: ['Focus on CNG and car rides', 'OBON service designed for women', 'Booking also possible on WhatsApp'],
    faqs: [
      ['Does Obhai have bike rides?', 'Rest of World reported in 2022 that Obhai shut down its bike service in 2021. Arohon offers bike and EV bike rides alongside CNG and car.'],
      ['Is Obhai still working?', 'Obhai\'s website lists car, CNG, intercity, truck and parcel services in more than 23 cities. It does not list bike rides.'],
      ['Which is better for CNG in Dhaka, Arohon or Obhai?', 'Both let you book a CNG in the app. Arohon shows an upfront fare and lets you pay the driver in cash when you arrive.'],
      ['Is there a safe ride option for women on Arohon?', 'Every Arohon trip shows the driver\'s name, photo and plate before pickup, and you can share your live trip with family.'],
    ],
    sources: [
      { label: 'Rest of World, Bangladesh bike taxi apps, 2022', url: 'https://restofworld.org/2022/bangladesh-abandoning-bike-taxi-apps/' },
      { label: 'Obhai website, services and cities', url: 'https://obhai.com/' },
      { label: 'TBS, bike sharing apps halt service, 2023', url: 'https://www.tbsnews.net/economy/bike-sharing-thru-apps-decline-forcing-cos-halt-service-706030' },
    ],
  },
  {
    slug: 'arohon-vs-shohoz',
    noCalc: true,
    glance: ['Rides closed', 'No', 'No', 'No', 'No', 'No'],
    name: 'Shohoz',
    metaTitle: 'Shohoz (Sohoj) Ride Alternative: Arohon',
    metaDescription: 'Shohoz (often searched as Sohoj) rides stopped in 2021. Arohon is the Shohoz ride alternative for bike, CNG and car in Bangladesh, at upfront fares.',
    label: 'Arohon vs Shohoz',
    title: 'Arohon vs Shohoz.',
    rest: 'Looking for a Shohoz ride alternative?',
    intro: 'Many people still search for Shohoz rides, often spelled Sohoj. Shohoz moved away from ride sharing in 2021 and now focuses on tickets. If you used it for rides, here is what Arohon offers instead.',
    rate: null,
    rateNote: 'Shohoz rides are no longer running, as reported by Dhaka Tribune.',
    rows: [
      ['Ride service today', 'Running in Dhaka and across Bangladesh', 'Ride team laid off in 2021, as reported'],
      ['Driver commission', AROHON_ROWS.commission, 'Not applicable'],
      ['Pricing', AROHON_ROWS.pricing, 'Not applicable'],
      ['Vehicles', AROHON_ROWS.vehicles, 'Not applicable'],
      ['Beyond rides', AROHON_ROWS.extras, 'Bus, launch and train tickets'],
    ],
    verdict: {
      arohon: 'Choose Arohon for rides, parcels, food, medicine, rental and ambulance in one app.',
      them: 'Use Shohoz for bus, launch and train tickets.',
    },
    theirStrengths: ['Well known ticketing service', 'Bus, launch and train tickets in one place'],
    faqs: [
      ['Is Shohoz ride still available?', 'No. Dhaka Tribune reported that Shohoz laid off its ride sharing team in 2021. The company now focuses on ticketing.'],
      ['Is Sohoj the same as Shohoz?', 'Yes, Sohoj is a common spelling people use when searching for Shohoz.'],
      ['What is the best Shohoz ride alternative?', 'Arohon offers bike, EV bike, CNG, car, micro and Hiace rides at upfront fares, plus parcel, food, medicine, rental and ambulance booking.'],
      ['Can I book long trips on Arohon?', 'Yes. For intercity trips and rental, send your request and drivers send you offers. Pick the one you like by price, rating and car.'],
    ],
    sources: [{ label: 'Dhaka Tribune, Shohoz Truck shuts down, ride and food could be next', url: 'https://www.dhakatribune.com/business/315656/shohoz-truck-shuts-down-ride-and-food-could-be' }],
  },
  {
    slug: 'arohon-vs-garibook',
    noCalc: true,
    glance: ['Driver Pass', 'City yes, intercity bids', 'No', 'No', 'No', 'No'],
    name: 'Garibook',
    metaTitle: 'Arohon vs Garibook: Zero Commission vs 2%, Compared',
    metaDescription: 'Arohon vs Garibook: zero commission with a subscription or a flat 2%, bike, CNG and car rides, rental bidding, parcel and food. Which suits you?',
    label: 'Arohon vs Garibook',
    title: 'Arohon vs Garibook.',
    rest: 'Two fair models, compared.',
    intro: 'Garibook says drivers keep 100% of the fare and pay a subscription instead. Arohon takes a flat 2% only when you earn, with no subscription. Both let drivers keep far more than most apps. Here is how they differ.',
    rate: null,
    rateNote: 'Garibook says drivers keep 100% of the fare and pay a small monthly subscription. It does not publish the amount.',
    rows: [
      ['Driver fees', 'Flat 2% plus ৳3 safety and a small booking fee, only on trips you complete', 'Zero commission, drivers pay a subscription'],
      ['Pricing', 'Upfront fare in the city. Offers from drivers for rental and intercity', 'Fixed fare in the city, bidding for intercity'],
      ['Vehicles', AROHON_ROWS.vehicles, 'Sedan, Noah and Hiace'],
      ['Bike and CNG', 'Yes', 'Not offered'],
      ['Beyond rides', AROHON_ROWS.extras, 'Car rental and a car investment club'],
      ['Payment for rides', AROHON_ROWS.payment, 'Not published'],
    ],
    verdict: {
      arohon: 'Choose Arohon if you ride a bike or CNG, want to pay only when you earn, or want rides, parcels, food, medicine and ambulance in one app.',
      them: 'Choose Garibook if you drive a car full time and a fixed subscription works out cheaper for you than 2% per trip.',
    },
    theirStrengths: ['Zero commission model for drivers', 'Bidding on intercity trips', 'Large vehicles for family trips'],
    faqs: [
      ['Is Garibook really zero commission?', 'Garibook says drivers keep 100% of the fare and pay a small monthly subscription instead. It does not publish the amount, so ask Garibook for the current fee before comparing.'],
      ['Which is better for drivers, Garibook or Arohon?', 'It depends on how much you drive. A subscription costs the same in a slow week as in a busy one. On Arohon you pay a flat 2% plus ৳3 safety and a small booking fee only on trips you complete, so on a ৳100 trip you keep ৳90, and in a week with no trips you pay nothing.'],
      ['Does Garibook have bike rides?', 'Garibook focuses on cars, Noah and Hiace. Arohon offers bike, EV bike, CNG, car, car plus, micro and Hiace.'],
      ['Can I rent a car with driver on Arohon?', 'Yes. Send your trip, drivers send offers, and you pick by price, rating and car.'],
    ],
    sources: [{ label: 'Garibook, earn with Garibook', url: 'https://garibook.com/earn-with-garibook' }, { label: 'Dhaka Tribune, Garibook to offer Chander Gari', url: 'https://www.dhakatribune.com/business/365516/digital-app-garibook-to-offer-%E2%80%98chander-gari%E2%80%99' }],
  },
  {
    slug: 'arohon-vs-truck-lagbe',
    noCalc: true,
    glance: ['Not verified', 'Bids or fixed', 'No', 'No', 'Truck hire', 'No'],
    name: 'Truck Lagbe',
    metaTitle: 'Arohon vs Truck Lagbe: Parcels or Truck Hire?',
    metaDescription: 'Truck Lagbe or Arohon? Compare truck hire with parcel delivery in 1 hour in Dhaka, shipping to 64 districts and business delivery.',
    label: 'Arohon vs Truck Lagbe',
    title: 'Arohon vs Truck Lagbe.',
    rest: 'Trucks or parcels, pick the right one.',
    intro: 'Truck Lagbe is built for hiring a truck to move big loads. Arohon moves parcels, shop orders and people, fast. They solve different problems, so here is when to use each.',
    rate: null,
    rateNote: 'Truck Lagbe charges fees on bookings. Its exact commission on spot trips is not public.',
    rows: [
      ['Best for', 'Parcels up to 8 kg, shop orders, documents, people', 'Truck loads, house shifting, factory goods'],
      ['Speed in Dhaka', 'Parcel within 1 hour', 'Booked by trip'],
      ['Nationwide', 'Parcels to 64 districts in 1 to 3 days', 'Trucks between districts'],
      ['Pricing', 'Price in the app before you send', 'Drivers bid, or a fixed price option'],
      ['Business', 'Delivery for shops and online sellers', 'Freight for companies'],
      ['Rides', AROHON_ROWS.vehicles, 'Not offered'],
    ],
    verdict: {
      arohon: 'Choose Arohon for parcels, online orders, documents and anything a bike or car can carry, delivered the same hour in Dhaka.',
      them: 'Choose Truck Lagbe when you need a truck, such as moving a whole flat or shipping bulk goods.',
    },
    theirStrengths: ['Large truck network', 'Price competition from bidding', 'Coverage across districts'],
    faqs: [
      ['Is there a Truck Lagbe alternative for small parcels?', 'Yes. For parcels and shop orders, Arohon delivers within an hour in Dhaka and to all 64 districts in 1 to 3 days. You do not need a truck for a small load.'],
      ['Does Arohon rent trucks?', 'No. Arohon handles parcels, business deliveries and rides, including micro and Hiace for people. For truck loads, use a truck hire service.'],
      ['How do online sellers ship with Arohon?', 'Book a pickup from your shop, and Arohon delivers to your customer in Dhaka the same hour or to other districts in 1 to 3 days.'],
      ['How does Truck Lagbe pricing work?', 'Truck Lagbe lets drivers bid on your trip and also offers a fixed price option, as reported by the Financial Express in 2020.'],
    ],
    sources: [
      { label: 'Financial Express, Truck Lagbe new app version, 2020', url: 'https://thefinancialexpress.com.bd/trade/truck-lagbe-launches-new-version-of-app-1605780095' },
      { label: 'Deshi Startup, Truck Lagbe case study', url: 'https://deshistartup.com/en/case-studies/truck-lagbe' },
    ],
  },
  abroad({ slug: 'lalamove', name: 'Lalamove', kind: 'on demand delivery', what: 'Lalamove delivers with vans, trucks and motorbikes in 18 markets across Asia, the Middle East and Europe, and runs a ride service in the Philippines', best: 'parcels within an hour in Dhaka, shipping to 64 districts and rides', rate: null, note: 'Lalamove Ride started with a 2% commission in the Philippines, as reported by ABS-CBN in 2025.', strengths: ['Instant matching with vans and trucks', 'Multi stop routes', 'Fast growth across Asia'], source: { label: 'Wikipedia, Lalamove, 2026', url: 'https://en.wikipedia.org/wiki/Lalamove' } }),
  abroad({ slug: 'lyft', name: 'Lyft', kind: 'ride sharing', what: 'Lyft is a ride app in the United States and Canada', best: 'bike, CNG and car rides plus parcel, food and rental', rate: 25, note: 'Lyft take rate of about 20% to 25%, as estimated by Gridwise in 2026.', strengths: ['Polished app in North America', 'Bikes and scooters in some cities', 'Driver earnings tools'], source: { label: 'Gridwise, Lyft driver pay, 2026', url: 'https://gridwise.io/blog/lyft-driver-pay/how-much-do-lyft-drivers-make-2/' } }),
  abroad({ slug: 'grab', name: 'Grab', kind: 'a super app', what: 'Grab is the super app of Southeast Asia, with rides, food, delivery and payments in 8 countries', best: 'one app for rides, parcels, food, medicine and ambulance', rate: 20, note: 'Grab commission of 20% in Singapore, as reported in 2023. Indonesia capped bike ride commission at 8% from July 2026.', strengths: ['Super app for rides, food and payments', 'Own wallet, GrabPay', 'Strong across Southeast Asia'], source: { label: 'The Star, Indonesia caps ride commission at 8%, 2026', url: 'https://www.thestar.com.my/business/business-news/2026/05/01/indonesia-to-cut-ride-hailing-companies039-maximum-commission-taken-from-drivers-to-8' } }),
  abroad({ slug: 'gojek', name: 'Gojek', kind: 'bike rides', what: 'Gojek is the ride and delivery super app of Indonesia, best known for motorbike rides', best: 'bike, EV bike, CNG and car rides plus delivery', rate: null, note: 'Gojek defended a 20% fee in 2025. Indonesia capped bike ride commission at 8% from July 2026.', strengths: ['Motorbike rides at huge scale', 'GoPay wallet', 'Large network of small merchants'], source: { label: 'Malay Mail, Indonesian drivers demand a commission cap, 2025', url: 'https://malaymail.com/news/world/2025/05/20/indonesian-ride-hailing-drivers-demand-10pc-commission-cap-in-nationwide-protests/177500' } }),
];

export const findCompare = (slug: string) => COMPARES.find((c) => c.slug === slug);

/** what an Arohon driver keeps: fare minus 2%, ৳3 safety and the booking fee */
export function arohonKeeps(fare: number) {
  const booking = fare < 200 ? 5 : fare < 350 ? 10 : fare < 500 ? 15 : 20;
  return Math.round(fare - fare * 0.02 - 3 - booking);
}

export const HUB_FAQS: [string, string][] = [
  ['Which is the best ride sharing app in Bangladesh in 2026?', 'It depends on your trip. Arohon gives you upfront fares, bike, EV bike, CNG, car, micro and Hiace, plus parcel, food, medicine, rental and ambulance in one app, and drivers pay a flat 2% commission.'],
  ['Which ride sharing app is the cheapest in Bangladesh?', 'Fares depend on distance, time and vehicle, so compare apps for your own route. Arohon shows the full fare before you book, with no bargaining and no surprise at the end of the trip.'],
  ['Which ride app takes the lowest commission from drivers?', 'Arohon charges drivers a flat 2% plus a ৳3 safety charge and a small booking fee, so on a ৳100 trip the driver keeps ৳90. Most ride apps take 15% to 25%. Garibook advertises zero commission but charges drivers a subscription.'],
  ['Pathao or Uber, which is cheaper?', 'Both show an upfront price, and Uber can add surge pricing at busy times. Compare both for your route, and try Arohon too, where the fare you see is the fare you pay.'],
  ['Are Grab, Gojek, Lyft or Lalamove available in Bangladesh?', 'No. None of them operate in Bangladesh. Arohon is a local app for rides, parcels, food, medicine and more.'],
];
