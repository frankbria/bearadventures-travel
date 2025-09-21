/**
 * Content Type Definitions for Bear Adventures Travel
 * Completely independent from WordPress - pure TypeScript interfaces
 */

// Base content types
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  author?: string;
  publishedAt?: string;
  updatedAt?: string;
  featured?: boolean;
}

export interface Heading {
  text: string;
  id?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  anchor?: string;
}

export interface ContentSection {
  id: string;
  type: 'text' | 'image' | 'gallery' | 'video' | 'quote' | 'list' | 'cta' | 'hero';
  content: any;
  order: number;
  classes?: string[];
  style?: Record<string, any>;
}

export interface TextContent extends ContentSection {
  type: 'text';
  content: {
    html: string;
    text?: string;
    markdown?: string;
  };
}

export interface ImageContent extends ContentSection {
  type: 'image';
  content: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
    lazy?: boolean;
    priority?: boolean;
  };
}

export interface GalleryContent extends ContentSection {
  type: 'gallery';
  content: {
    images: ImageContent['content'][];
    layout: 'grid' | 'carousel' | 'masonry';
    columns?: number;
    spacing?: string;
  };
}

export interface VideoContent extends ContentSection {
  type: 'video';
  content: {
    src: string;
    poster?: string;
    autoplay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
  };
}

export interface QuoteContent extends ContentSection {
  type: 'quote';
  content: {
    text: string;
    author?: string;
    source?: string;
    style: 'blockquote' | 'pullquote' | 'testimonial';
  };
}

export interface ListContent extends ContentSection {
  type: 'list';
  content: {
    items: string[];
    ordered: boolean;
    style?: 'default' | 'bullets' | 'numbered' | 'checkmarks';
  };
}

export interface CTAContent extends ContentSection {
  type: 'cta';
  content: {
    heading: string;
    description?: string;
    buttons: Array<{
      text: string;
      href: string;
      style: 'primary' | 'secondary' | 'outline';
      external?: boolean;
    }>;
    background?: 'default' | 'gradient' | 'image';
    backgroundImage?: string;
  };
}

export interface HeroContent extends ContentSection {
  type: 'hero';
  content: {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    overlay?: boolean;
    overlayOpacity?: number;
    textAlign: 'left' | 'center' | 'right';
    buttons?: CTAContent['content']['buttons'];
  };
}

// Navigation types
export interface NavigationLink {
  text: string;
  href: string;
  external?: boolean;
  submenu?: NavigationLink[];
  icon?: string;
  badge?: string;
}

export interface NavigationMenu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'mobile' | 'sidebar';
  links: NavigationLink[];
}

// Page types
export interface BasePage {
  id: string;
  slug: string;
  metadata: PageMetadata;
  content: ContentSection[];
  template: 'default' | 'home' | 'blog' | 'post' | 'page' | 'contact';
  status: 'published' | 'draft' | 'private';
  featured?: boolean;
}

export interface HomePage extends BasePage {
  template: 'home';
  hero: HeroContent;
  sections: {
    featuredTrips?: ContentSection[];
    aboutPreview?: ContentSection[];
    testimonials?: ContentSection[];
    blogPreview?: ContentSection[];
    newsletter?: ContentSection[];
  };
}

export interface BlogPost extends BasePage {
  template: 'post';
  excerpt: string;
  featuredImage?: ImageContent['content'];
  categories: Category[];
  tags: Tag[];
  author: Author;
  readingTime?: number;
  relatedPosts?: string[]; // Post IDs
}

export interface TripPage extends BasePage {
  template: 'page';
  trip: Trip;
}

// Content entity types
export interface Trip {
  id: string;
  title: string;
  slug: string;
  description: string;
  destination: Destination;
  duration: number; // days
  groupSize: {
    min: number;
    max: number;
  };
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  price: {
    currency: string;
    amount: number;
    includes: string[];
    excludes: string[];
  };
  dates: TripDate[];
  itinerary: ItineraryDay[];
  images: ImageContent['content'][];
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  requirements: string[];
  bookingUrl?: string;
  featured: boolean;
  active: boolean;
}

export interface TripDate {
  id: string;
  startDate: string;
  endDate: string;
  price?: number;
  available: boolean;
  spotsLeft?: number;
  status: 'available' | 'limited' | 'sold-out' | 'cancelled';
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  accommodation?: string;
  transportation?: string;
  highlights?: string[];
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: string;
  description: string;
  climate: string;
  bestTimeToVisit: string;
  timezone: string;
  currency: string;
  language: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  featuredImage?: ImageContent['content'];
  gallery?: ImageContent['content'][];
  highlights: string[];
  tips: string[];
  lgbtqFriendly: boolean;
  lgbtqInfo?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

// Site configuration
export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  logo: {
    light: string;
    dark: string;
  };
  favicon: string;
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    email: string;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  analytics?: {
    googleAnalytics?: string;
    facebookPixel?: string;
  };
  seo: {
    defaultImage: string;
    keywords: string[];
  };
}

// API response types
export interface APIResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface SearchResult {
  type: 'page' | 'post' | 'trip' | 'destination';
  id: string;
  title: string;
  excerpt: string;
  url: string;
  image?: string;
  relevance: number;
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  tripInterest?: string;
  preferredDates?: string;
  groupSize?: number;
  budget?: string;
  consent: boolean;
}

export interface NewsletterForm {
  email: string;
  name?: string;
  interests?: string[];
  consent: boolean;
}

export interface TripInquiryForm extends ContactForm {
  tripId: string;
  departureDate?: string;
  specialRequirements?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
}

// Content management types
export interface ContentUpdate {
  id: string;
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
  author: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  data: any;
  createdAt: string;
  createdBy: string;
  comment?: string;
}

// Utility types
export type ContentType = TextContent | ImageContent | GalleryContent | VideoContent | QuoteContent | ListContent | CTAContent | HeroContent;

export type PageType = HomePage | BlogPost | TripPage | BasePage;

export type EntityType = Trip | Destination | Category | Tag | Author;

// Type guards
export function isTextContent(content: ContentSection): content is TextContent {
  return content.type === 'text';
}

export function isImageContent(content: ContentSection): content is ImageContent {
  return content.type === 'image';
}

export function isGalleryContent(content: ContentSection): content is GalleryContent {
  return content.type === 'gallery';
}

export function isVideoContent(content: ContentSection): content is VideoContent {
  return content.type === 'video';
}

export function isHeroContent(content: ContentSection): content is HeroContent {
  return content.type === 'hero';
}

export function isCTAContent(content: ContentSection): content is CTAContent {
  return content.type === 'cta';
}

export function isBlogPost(page: BasePage): page is BlogPost {
  return page.template === 'post';
}

export function isHomePage(page: BasePage): page is HomePage {
  return page.template === 'home';
}

export function isTripPage(page: BasePage): page is TripPage {
  return page.template === 'page' && 'trip' in page;
}