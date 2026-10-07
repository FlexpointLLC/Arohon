export type Vehicle = {
  id: string;
  name: string;
  bn: string;
  tag: string;
  copy: string;
  seats: string;
  best: string;
  img: string;
};

// Copy mirrors vehicle descriptions in the customer app (LanguageContext / SearchScreen).
export const FLEET: Vehicle[] = [
  { id: 'bike', name: 'Bike', bn: 'বাইক', tag: 'Less fare', copy: 'Safe, fast and affordable. Cut through rush hour at the lowest fare in the city.', seats: '1', best: 'Solo commutes', img: '/icons/bike.webp' },
  { id: 'cng', name: 'CNG', bn: 'সিএনজি', tag: 'Short hops', copy: 'The everyday three-wheeler, upfront fares, live tracking, zero haggling.', seats: '3', best: 'Short distances', img: '/icons/cng.webp' },
  { id: 'car', name: 'Car', bn: 'কার', tag: 'Family friendly', copy: 'Every ride, safe and premium. AC sedans for the daily run.', seats: '4', best: 'Everyday comfort', img: '/icons/car.webp' },
  { id: 'carplus', name: 'Car Plus', bn: 'কার প্লাস', tag: 'Premium comfort', copy: 'Executive sedans and top-rated drivers for meetings and airport runs.', seats: '4', best: 'Business & airport', img: '/icons/car_plus.webp' },
  { id: 'micro', name: 'Micro', bn: 'মাইক্রো', tag: 'Spacious for groups', copy: 'Comfortable group rides with room for the luggage. Built for intercity.', seats: '7', best: 'Family & intercity', img: '/icons/micro.webp' },
  { id: 'hiace', name: 'Hiace', bn: 'হায়েস', tag: 'Best for big groups', copy: 'Office trips, weddings and tours, up to 12 people in one booking.', seats: '12', best: 'Tours & events', img: '/icons/hiace.webp' },
  { id: 'ambulance', name: 'Ambulance', bn: 'অ্যাম্বুলেন্স', tag: '24/7 emergency', copy: 'Emergency medical transport, any hour, from the same app.', seats: 'N/A', best: 'Emergencies', img: '/icons/ambulance.webp' },
  { id: 'pickup', name: 'Pickup', bn: 'পিকআপ', tag: 'Move anything', copy: 'House shifts, shop stock, furniture. Pick the size, we bring the truck.', seats: '2', best: 'Goods & moving', img: '/icons/pickup.webp' },
];
