/**
 * Vitrinly — veri şemaları
 * Tüm sayfa ve bileşenler bu tipleri kullanır.
 * Mock data Faz 2'de doldurulur, gerçek müşteri verisi Faz 6+'da aynı şemaya yazar.
 */

export interface KV {
  label: string;
  value: string;
}

export interface SocialLink {
  platform: 'instagram' | 'pinterest' | 'web' | 'mail' | 'youtube' | 'tiktok';
  icon: string;
  url: string;
  handle?: string;
}

export interface ShowroomLocation {
  slug: string;
  type: 'showroom' | 'atolye';
  name: string;
  addressLines: string[];
  district: string;
  city: string;
  phone: string;
  hours: { days: string; range: string }[];
  mapImage?: string;
  mapLink?: string;
  directions?: string;
}

export interface Stat {
  icon: string;
  value: string;
  label: string;
}

export interface Principle {
  icon: string;
  title: string;
  body: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  body: string;
}

export interface ArtisanQuote {
  name: string;
  role: string;
  quote: string;
  portrait?: string;
}

export interface CustomerConfig {
  slug: string;
  brand: {
    name: string;
    italicWord?: string;
    tagline: string;
    foundedYear: number;
    seasonLabel: string;
    seasonNumber: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    whatsappFormatted: string;
    email: string;
  };
  marqueeLines: string[];
  story: {
    eyebrow: string;
    heading: string;
    italicWord?: string;
    dropcap: string;
    paragraphs: string[];
    heroImage: string;
  };
  stats: Stat[];
  principles: Principle[];
  timeline: TimelineEvent[];
  atelierPhotos: string[];
  atelierQuote?: ArtisanQuote;
  locations: ShowroomLocation[];
  social: SocialLink[];
}

export interface FilterChip {
  slug: string;
  label: string;
}

export interface Category {
  slug: string;
  name: string;
  italicWord?: string;
  shortLabel: string;
  description: string;
  longDescription: string;
  heroImage: string;
  isCustomOrder?: boolean;
  artisanQuote?: ArtisanQuote;
}

export interface FabricSwatch {
  slug: string;
  name: string;
  hex: string;
  /** GLB material için baseColorFactor (RGB 0-1). null ise sadece UI swatch. */
  rgb?: [number, number, number];
}

export interface ProductSpecs {
  technical: KV[];
  care: KV[];
  shipping: KV[];
}

export interface Product {
  slug: string;
  name: string;
  italicWord?: string;
  category: string;
  dimensions: { w: number; d: number; h: number };
  priceNote: string;
  deliveryTime: string;
  modelUrl: string | null;
  posterUrl: string;
  galleryImages: string[];
  description: {
    eyebrow: string;
    dropcap: string;
    body: string;
  };
  features: string[];
  fabrics: FabricSwatch[];
  specs: ProductSpecs;
  artisan?: ArtisanQuote;
  similarSlugs: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  badges?: string[];
  sketchHint?: string;
}
