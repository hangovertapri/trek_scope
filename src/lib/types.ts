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

export interface Agent {
  id: string;
  username: string;
  email: string;
  agency_name: string;
  phone: string;
  address: string;
  description: string;
  website: string;
  license_number: string;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  verified: boolean;
  active: boolean;
  created_at: string;
}

export interface AgentTrekOffer {
  id: string;
  agent_id: string;
  agent_name: string;
  agent_rating: number;
  trek_id: string;
  trek_slug: string;
  price_usd: number;
  group_size_min: number;
  group_size_max: number;
  availability_start: string;
  availability_end: string;
  includes: string[];
  excludes: string[];
  custom_notes: string;
  booking_terms: string;
  active: boolean;
  created_at: string;
  updated_at: string;
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
