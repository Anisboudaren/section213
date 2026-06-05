import { addDays, format, startOfDay } from "date-fns";

export type ShootPackage = {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  duration: string;
  badge?: string;
  highlight?: boolean;
  features: string[];
  description: string;
};

export type TimeSlot = {
  id: string;
  label: string;
  time: string;
};

export type MapLocation = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
};

export type MapPin = {
  lat: number;
  lng: number;
};

export const SHOOT_PACKAGES: ShootPackage[] = [
  {
    id: "starter",
    name: "Starter",
    price: 750,
    priceLabel: "$750",
    duration: "2 hours on-site",
    features: [
      "Professional HDR photography",
      "Up to 25 edited images",
      "Standard 48h turnaround",
    ],
    description: "Perfect for single listings and quick brand refreshes.",
  },
  {
    id: "signatures",
    name: "Signatures",
    price: 1100,
    priceLabel: "$1,100",
    duration: "Half-day shoot",
    badge: "Popular",
    features: [
      "Everything in Starter",
      "Cinematic walkthrough video",
      "Aerial drone photos",
      "Floor plans included",
    ],
    description: "Our most booked package for agents who want photo + video.",
  },
  {
    id: "full-stable",
    name: "Full Stable",
    price: 1425,
    priceLabel: "$1,425",
    duration: "Full-day production",
    badge: "Best Value",
    highlight: true,
    features: [
      "Everything in Signatures",
      "Cinematic brand video",
      "3 social reels",
      "Drone video + twilight shots",
      "Same-day highlight cut",
    ],
    description: "End-to-end media built to go viral the same week.",
  },
  {
    id: "custom",
    name: "Custom",
    price: 0,
    priceLabel: "Custom quote",
    duration: "Flexible",
    features: [
      "Multi-day campaigns",
      "Brand films & long-form",
      "Travel shoots",
      "Automation add-ons",
    ],
    description: "Tell us the vision — we'll scope timeline and crew.",
  },
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: "morning", label: "Morning", time: "8:00 AM – 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "1:00 PM – 5:00 PM" },
  { id: "golden", label: "Golden hour", time: "5:30 PM – 7:30 PM" },
];

export const MAP_LOCATIONS: MapLocation[] = [
  { id: "oran", name: "Oran", region: "Western Algeria", lat: 35.6969, lng: -0.6331 },
  { id: "algiers", name: "Algiers", region: "North Algeria", lat: 36.7538, lng: 3.0588 },
  { id: "tlemcen", name: "Tlemcen", region: "Western Algeria", lat: 34.8811, lng: -1.3172 },
  { id: "constantine", name: "Constantine", region: "Eastern Algeria", lat: 36.365, lng: 6.6147 },
  { id: "annaba", name: "Annaba", region: "Northeast coast", lat: 36.9, lng: 7.7667 },
];

/** Default map view — centered on Algeria */
export const MAP_DEFAULT_CENTER = { lat: 35.5, lng: 2.5 };
export const MAP_DEFAULT_ZOOM = 6;

const today = startOfDay(new Date());

/** Mock blocked dates — Sundays plus a handful of booked days */
export const MOCK_BLOCKED_DATES = new Set(
  Array.from({ length: 90 }, (_, i) => {
    const date = addDays(today, i);
    const key = format(date, "yyyy-MM-dd");
    const isSunday = date.getDay() === 0;
    const isMockBooked = [3, 7, 11, 19, 24, 31, 42, 55, 68].includes(i);
    return isSunday || isMockBooked ? key : null;
  }).filter(Boolean) as string[],
);

export function isDateBookable(date: Date): boolean {
  const key = format(startOfDay(date), "yyyy-MM-dd");
  if (date < today) return false;
  if (date > addDays(today, 90)) return false;
  return !MOCK_BLOCKED_DATES.has(key);
}

export function formatBookingDate(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
}

export function generateBookingRef(): string {
  return `S213-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
