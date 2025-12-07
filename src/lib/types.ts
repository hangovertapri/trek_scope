export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  altitude?: number;
}

export type TrekDifficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Expert';

export interface Trek {
  id: string;
  slug: string;
  name: string;
  region: string;
  difficulty: TrekDifficulty;
  duration: number; // in days
  altitude: number; // in meters
  price_range: [number, number];
  best_season: string[];
  permit_required: boolean;
  highlights: string[];
  itinerary: ItineraryItem[];
  images: string[]; // array of image IDs from placeholder-images.json
  safety_tips: string[];
  map_embed_url: string;
  coordinates?: [number, number]; // [lat, lng]
  description: string;
  overview: string;
  faq: { question: string; answer: string }[];
  agencyId?: string; // The agency that owns/manages this trek. If null, trek is managed by admin
}

export interface Inquiry {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  trekName: string;
  preferredDates: string;
  groupSize: number;
  notes?: string;
  submittedAt?: Date;
}
