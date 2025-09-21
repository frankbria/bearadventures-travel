/**
 * Content Management System - Bear Adventures Travel
 * Converts WordPress data to clean, type-safe content
 */

import {
  BasePage,
  BlogPost,
  HomePage,
  Trip,
  Destination,
  Category,
  Tag,
  Author,
  SiteConfig,
  ContentSection,
  HeroContent,
  TextContent,
  ImageContent,
  CTAContent,
  NavigationMenu,
  NavigationLink,
} from '../types/content';

// Mock data structures for development
const siteStructure = { pages: [], categories: [] };
const contentData = { posts: [], pages: [] };
const navigationData = { menus: [], social: [] };
const assetMap = { images: {}, videos: {} };

class ContentManager {
  private static instance: ContentManager;
  private pages: Map<string, BasePage> = new Map();
  private trips: Map<string, Trip> = new Map();
  private destinations: Map<string, Destination> = new Map();
  private categories: Map<string, Category> = new Map();
  private tags: Map<string, Tag> = new Map();
  private authors: Map<string, Author> = new Map();
  private menus: Map<string, NavigationMenu> = new Map();

  private constructor() {
    this.initializeContent();
  }

  static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  private initializeContent() {
    this.createNavigationMenus();
    this.createAuthors();
    this.createCategories();
    this.createTags();
    this.createDestinations();
    this.createTrips();
    this.createPages();
  }

  private createNavigationMenus() {
    // Create main navigation menu
    const headerMenu: NavigationMenu = {
      id: 'header-main',
      name: 'Main Navigation',
      location: 'header',
      links: [
        { text: 'Home', href: '/' },
        { text: 'Group Trips', href: '/group-trips' },
        { text: 'Plan Your Trip', href: '/plan-your-trip' },
        { text: 'Blog', href: '/blog' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' },
      ],
    };
    this.menus.set('header-main', headerMenu);

    // Create footer menu
    const footerMenu: NavigationMenu = {
      id: 'footer',
      name: 'Footer Navigation',
      location: 'footer',
      links: [
        { text: 'Terms & Conditions', href: '/terms-and-conditions' },
        { text: 'Privacy Policy', href: '/privacy-policy' },
        { text: 'Contact', href: '/contact' },
      ],
    };
    this.menus.set('footer', footerMenu);
  }

  private createAuthors() {
    // Create default author (Frank from Bear Adventures)
    const frankAuthor: Author = {
      id: 'frank',
      name: 'Frank',
      bio: 'Co-founder of Bear Adventures Travel, passionate about creating luxury gay travel experiences for active men.',
      email: 'frank@bearadventures.travel',
      social: {
        twitter: '',
        instagram: '',
        facebook: '',
        linkedin: '',
      },
    };
    this.authors.set('frank', frankAuthor);
  }

  private createCategories() {
    const categories: Category[] = [
      {
        id: 'destinations',
        name: 'Destinations',
        slug: 'destinations',
        description: 'Travel destination guides and information',
        color: '#3B82F6',
        icon: '🌍',
      },
      {
        id: 'tips-tricks',
        name: 'Tips & Tricks',
        slug: 'tips-tricks',
        description: 'Travel tips and insider knowledge',
        color: '#10B981',
        icon: '💡',
      },
      {
        id: 'luxury-travel',
        name: 'Luxury Travel',
        slug: 'luxury-travel',
        description: 'Luxury travel experiences and accommodations',
        color: '#F59E0B',
        icon: '✨',
      },
      {
        id: 'featured',
        name: 'Featured',
        slug: 'featured',
        description: 'Featured travel content and highlights',
        color: '#EF4444',
        icon: '⭐',
      },
      {
        id: 'adventures',
        name: 'Adventures',
        slug: 'adventures',
        description: 'Adventure travel and outdoor activities',
        color: '#8B5CF6',
        icon: '🏔️',
      },
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  private createTags() {
    const tags: Tag[] = [
      { id: 'gay-travel', name: 'Gay Travel', slug: 'gay-travel', color: '#FF6B6B' },
      { id: 'lgbtq', name: 'LGBTQ+', slug: 'lgbtq', color: '#4ECDC4' },
      { id: 'luxury', name: 'Luxury', slug: 'luxury', color: '#FFE66D' },
      { id: 'adventure', name: 'Adventure', slug: 'adventure', color: '#FF8B94' },
      { id: 'europe', name: 'Europe', slug: 'europe', color: '#95E1D3' },
      { id: 'costa-rica', name: 'Costa Rica', slug: 'costa-rica', color: '#F38BA8' },
      { id: 'iceland', name: 'Iceland', slug: 'iceland', color: '#A8DADC' },
      { id: 'barcelona', name: 'Barcelona', slug: 'barcelona', color: '#457B9D' },
      { id: 'cappadocia', name: 'Cappadocia', slug: 'cappadocia', color: '#F1FAEE' },
    ];

    tags.forEach(tag => {
      this.tags.set(tag.id, tag);
    });
  }

  private createDestinations() {
    const destinations: Destination[] = [
      {
        id: 'costa-rica',
        name: 'Costa Rica',
        slug: 'costa-rica',
        country: 'Costa Rica',
        continent: 'Central America',
        description: 'A tropical paradise perfect for adventure-seeking gay travelers.',
        climate: 'Tropical',
        bestTimeToVisit: 'December to April',
        timezone: 'CST',
        currency: 'CRC',
        language: ['Spanish', 'English'],
        coordinates: { lat: 9.7489, lng: -83.7534 },
        highlights: [
          'Stunning biodiversity',
          'Adventure activities',
          'LGBTQ+ friendly culture',
          'Beautiful beaches',
          'Volcano experiences'
        ],
        tips: [
          'Pack light, breathable clothing',
          'Bring reef-safe sunscreen',
          'Learn basic Spanish phrases',
          'Respect local wildlife'
        ],
        lgbtqFriendly: true,
        lgbtqInfo: 'Costa Rica is very LGBTQ+ friendly with legal same-sex marriage.',
      },
      {
        id: 'iceland',
        name: 'Iceland',
        slug: 'iceland',
        country: 'Iceland',
        continent: 'Europe',
        description: 'Land of fire and ice, offering spectacular natural wonders.',
        climate: 'Subarctic',
        bestTimeToVisit: 'June to August',
        timezone: 'GMT',
        currency: 'ISK',
        language: ['Icelandic', 'English'],
        coordinates: { lat: 64.9631, lng: -19.0208 },
        highlights: [
          'Northern Lights',
          'Geysers and hot springs',
          'Dramatic landscapes',
          'Progressive LGBTQ+ rights',
          'Unique culture'
        ],
        tips: [
          'Pack warm, waterproof clothing',
          'Rent a 4WD vehicle',
          'Book accommodations early',
          'Respect the natural environment'
        ],
        lgbtqFriendly: true,
        lgbtqInfo: 'Iceland is one of the most LGBTQ+ friendly countries in the world.',
      },
      {
        id: 'barcelona',
        name: 'Barcelona',
        slug: 'barcelona',
        country: 'Spain',
        continent: 'Europe',
        description: 'Vibrant Mediterranean city with rich culture and nightlife.',
        climate: 'Mediterranean',
        bestTimeToVisit: 'April to June, September to November',
        timezone: 'CET',
        currency: 'EUR',
        language: ['Spanish', 'Catalan', 'English'],
        coordinates: { lat: 41.3851, lng: 2.1734 },
        highlights: [
          'Gaudí architecture',
          'Vibrant LGBTQ+ scene',
          'Beautiful beaches',
          'World-class cuisine',
          'Rich cultural heritage'
        ],
        tips: [
          'Learn about Catalan culture',
          'Use public transportation',
          'Dine late like locals',
          'Explore beyond tourist areas'
        ],
        lgbtqFriendly: true,
        lgbtqInfo: 'Barcelona has a thriving LGBTQ+ community and vibrant nightlife scene.',
      },
    ];

    destinations.forEach(destination => {
      this.destinations.set(destination.id, destination);
    });
  }

  private createTrips() {
    const trips: Trip[] = [
      {
        id: 'costa-rica-adventure',
        title: 'Costa Rica 9-Day Jungle & Ocean Bear Adventure',
        slug: 'costa-rica-9-day-jungle-ocean-adventure',
        description: 'An unforgettable 9-day adventure through Costa Rica\'s jungles and coastlines, designed for active gay men.',
        destination: this.destinations.get('costa-rica')!,
        duration: 9,
        groupSize: { min: 6, max: 12 },
        difficulty: 'moderate',
        price: {
          currency: 'USD',
          amount: 3299,
          includes: [
            'All accommodations',
            'Most meals',
            'Professional guide',
            'Transportation',
            'Activities',
          ],
          excludes: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Tips',
          ],
        },
        dates: [
          {
            id: 'cr-2025-03',
            startDate: '2025-03-15',
            endDate: '2025-03-23',
            available: true,
            spotsLeft: 8,
            status: 'available',
          },
        ],
        itinerary: [
          {
            day: 1,
            title: 'Arrival in San José',
            description: 'Welcome to Costa Rica! Meet your group and settle in.',
            activities: ['Airport transfer', 'Welcome dinner', 'Group orientation'],
            meals: ['dinner'],
            accommodation: 'Luxury hotel in San José',
          },
          {
            day: 2,
            title: 'Journey to Manuel Antonio',
            description: 'Travel to the beautiful Manuel Antonio National Park.',
            activities: ['Scenic drive', 'Beach time', 'Wildlife spotting'],
            meals: ['breakfast', 'lunch', 'dinner'],
            accommodation: 'Beachfront resort',
          },
        ],
        images: [],
        highlights: [
          'Manuel Antonio National Park',
          'Zipline adventures',
          'Wildlife encounters',
          'Beautiful beaches',
          'Luxury accommodations',
        ],
        inclusions: [
          'All accommodations (luxury hotels)',
          'Professional English-speaking guide',
          'All transportation in Costa Rica',
          'Most meals as specified',
          'All activities and entrance fees',
        ],
        exclusions: [
          'International airfare',
          'Travel insurance',
          'Personal expenses and souvenirs',
          'Tips and gratuities',
          'Meals not specified',
        ],
        requirements: [
          'Valid passport',
          'Good physical fitness',
          'Comfortable with outdoor activities',
          'Swimming ability recommended',
        ],
        bookingUrl: 'https://www.wetravel.com/trips/costa-rica-9-days-8-night-jungle-ocean-bear-adventure-bear-adventures-la-fortuna-90267234',
        featured: true,
        active: true,
      },
      {
        id: 'antarctica-expedition',
        title: 'South America & Antarctica Bear Adventures 2026',
        slug: 'south-america-antarctica-expedition-2026',
        description: 'Epic expedition to Antarctica with luxury accommodations and expert guides.',
        destination: this.destinations.get('costa-rica')!, // Placeholder, would have Antarctica destination
        duration: 16,
        groupSize: { min: 10, max: 20 },
        difficulty: 'challenging',
        price: {
          currency: 'USD',
          amount: 12999,
          includes: [
            'All accommodations',
            'All meals',
            'Expedition cruise',
            'Professional guides',
            'All activities',
          ],
          excludes: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
          ],
        },
        dates: [
          {
            id: 'ant-2026-01',
            startDate: '2026-01-10',
            endDate: '2026-01-25',
            available: true,
            spotsLeft: 15,
            status: 'available',
          },
        ],
        itinerary: [],
        images: [],
        highlights: [
          'Antarctica expedition',
          'Luxury cruise ship',
          'Wildlife photography',
          'Glacier exploration',
          'Once-in-a-lifetime experience',
        ],
        inclusions: [],
        exclusions: [],
        requirements: [
          'Valid passport',
          'Excellent physical fitness',
          'Previous travel experience',
          'Comfortable with expedition conditions',
        ],
        bookingUrl: 'https://www.wetravel.com/trips/south-america-antarctica-bear-adventures-for-gay-men-2026-bear-adventures-buenos-aires-43130642',
        featured: true,
        active: true,
      },
    ];

    trips.forEach(trip => {
      this.trips.set(trip.id, trip);
    });
  }

  private createPages() {
    // Create basic pages
    const homePageData = {
      metadata: {
        title: 'Bear Adventures Travel - Curated Luxury Gay Travel for Active Men',
        description: 'We create luxurious adventures for the intrepid bear. Expert-led group trips and custom travel planning.',
      },
      content: {},
    };

    const homePage = this.convertWordPressDataToPage('home', homePageData);
    this.pages.set('home', homePage);
  }

  private extractSlugFromUrl(url: string): string {
    if (url === 'https://bearadventures.travel' || url === 'https://bearadventures.travel/') {
      return 'home';
    }

    const urlObj = new URL(url);
    let pathname = urlObj.pathname;

    // Remove trailing slash
    if (pathname.endsWith('/') && pathname.length > 1) {
      pathname = pathname.slice(0, -1);
    }

    // Remove leading slash
    if (pathname.startsWith('/')) {
      pathname = pathname.slice(1);
    }

    return pathname || 'home';
  }

  private convertWordPressDataToPage(slug: string, wpData: any): BasePage {
    const metadata = wpData.metadata || {};
    const content = wpData.content || {};

    // Determine page template
    let template: BasePage['template'] = 'page';
    if (slug === 'home') template = 'home';
    if (slug === 'blog' || slug.includes('blog/') || this.isContentUnderBlogCategory(slug)) {
      template = 'post';
    }

    const basePage: BasePage = {
      id: slug,
      slug,
      metadata: {
        title: metadata.title || 'Bear Adventures Travel',
        description: metadata.description || '',
        keywords: metadata.keywords ? metadata.keywords.split(',') : [],
        ogTitle: metadata.ogTitle,
        ogDescription: metadata.ogDescription,
        ogImage: this.convertAssetUrl(metadata.ogImage),
        canonical: metadata.canonical,
        author: metadata.author,
      },
      content: this.extractContentSections(content),
      template,
      status: 'published',
      featured: slug === 'home' || this.isFeaturedContent(slug),
    };

    // Enhance specific page types
    if (template === 'home') {
      return this.createHomePage(basePage);
    } else if (template === 'post') {
      return this.createBlogPost(basePage, wpData);
    }

    return basePage;
  }

  private extractContentSections(content: any): ContentSection[] {
    const sections: ContentSection[] = [];
    let order = 0;

    // Extract text content
    if (content.text && content.text.length > 0) {
      const textSection: TextContent = {
        id: `text-${order}`,
        type: 'text',
        content: {
          html: content.text.join('\n'),
          text: content.text.join(' '),
        },
        order: order++,
      };
      sections.push(textSection);
    }

    // Extract images
    if (content.images && content.images.length > 0) {
      content.images.forEach((img: any, index: number) => {
        const imageSection: ImageContent = {
          id: `image-${order}`,
          type: 'image',
          content: {
            src: this.convertAssetUrl(img.src),
            alt: img.alt || '',
            caption: img.caption,
            width: img.width,
            height: img.height,
          },
          order: order++,
        };
        sections.push(imageSection);
      });
    }

    return sections;
  }

  private createHomePage(basePage: BasePage): HomePage {
    const heroSection: HeroContent = {
      id: 'hero',
      type: 'hero',
      content: {
        title: 'Curated Luxury Gay Travel for Active Men',
        subtitle: 'Bear Adventures Travel',
        description: 'We\'re husbands, partners in crime, and fun-loving travel experts who enjoy creating luxurious adventures for the intrepid bear.',
        backgroundImage: '/images/hero/main-carousel.webp',
        overlay: true,
        overlayOpacity: 0.4,
        textAlign: 'center',
        buttons: [
          {
            text: 'Explore Group Trips',
            href: '/group-trips',
            style: 'primary',
          },
          {
            text: 'Plan Your Trip',
            href: '/plan-your-trip',
            style: 'secondary',
          },
        ],
      },
      order: 0,
    };

    return {
      ...basePage,
      template: 'home',
      hero: heroSection,
      sections: {
        featuredTrips: [],
        aboutPreview: [],
        testimonials: [],
        blogPreview: [],
        newsletter: [],
      },
    };
  }

  private createBlogPost(basePage: BasePage, wpData: any): BlogPost {
    return {
      ...basePage,
      template: 'post',
      excerpt: this.extractExcerpt(wpData),
      categories: this.getCategoriesForPost(basePage.slug),
      tags: this.getTagsForPost(basePage.slug),
      author: this.authors.get('frank')!,
      readingTime: this.calculateReadingTime(basePage.content),
    };
  }

  private extractExcerpt(wpData: any): string {
    const content = wpData.content;
    if (content.text && content.text.length > 0) {
      const text = content.text.join(' ');
      return text.substring(0, 160) + (text.length > 160 ? '...' : '');
    }
    return wpData.metadata?.description || '';
  }

  private getCategoriesForPost(slug: string): Category[] {
    const categories = [];

    if (slug.includes('destinations/')) {
      categories.push(this.categories.get('destinations')!);
    }
    if (slug.includes('tips-tricks/')) {
      categories.push(this.categories.get('tips-tricks')!);
    }
    if (slug.includes('luxury-travel/')) {
      categories.push(this.categories.get('luxury-travel')!);
    }
    if (slug.includes('featured/')) {
      categories.push(this.categories.get('featured')!);
    }
    if (slug.includes('adventures/')) {
      categories.push(this.categories.get('adventures')!);
    }

    return categories.filter(Boolean);
  }

  private getTagsForPost(slug: string): Tag[] {
    const tags = [];

    if (slug.includes('gay-travel') || slug.includes('lgbtq')) {
      tags.push(this.tags.get('gay-travel')!, this.tags.get('lgbtq')!);
    }
    if (slug.includes('costa-rica')) {
      tags.push(this.tags.get('costa-rica')!);
    }
    if (slug.includes('iceland')) {
      tags.push(this.tags.get('iceland')!);
    }
    if (slug.includes('barcelona')) {
      tags.push(this.tags.get('barcelona')!);
    }
    if (slug.includes('cappadocia')) {
      tags.push(this.tags.get('cappadocia')!);
    }
    if (slug.includes('luxury')) {
      tags.push(this.tags.get('luxury')!);
    }

    return tags.filter(Boolean);
  }

  private calculateReadingTime(content: ContentSection[]): number {
    const wordsPerMinute = 200;
    let totalWords = 0;

    content.forEach(section => {
      if (section.type === 'text') {
        const textContent = section as TextContent;
        const words = textContent.content.text?.split(/\s+/).length || 0;
        totalWords += words;
      }
    });

    return Math.ceil(totalWords / wordsPerMinute);
  }

  private isContentUnderBlogCategory(slug: string): boolean {
    return slug.includes('destinations/') ||
           slug.includes('tips-tricks/') ||
           slug.includes('luxury-travel/') ||
           slug.includes('featured/') ||
           slug.includes('adventures/');
  }

  private isFeaturedContent(slug: string): boolean {
    return slug.includes('featured/') ||
           slug.includes('costa-rica') ||
           slug.includes('iceland') ||
           slug.includes('barcelona');
  }

  private convertAssetUrl(url?: string): string {
    if (!url) return '';
    // Return original URL as fallback for now
    return url;
  }

  private cleanUrl(url: string): string {
    if (!url) return '/';

    // Convert WordPress URLs to clean Next.js routes
    if (url.includes('bearadventures.travel')) {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;

      // Remove trailing slash except for root
      if (pathname.endsWith('/') && pathname.length > 1) {
        pathname = pathname.slice(0, -1);
      }

      // Convert specific WordPress patterns
      if (pathname === '/about-us/') pathname = '/about';

      return pathname || '/';
    }

    return url;
  }

  // Public API methods
  getPage(slug: string): BasePage | null {
    return this.pages.get(slug) || null;
  }

  getAllPages(): BasePage[] {
    return Array.from(this.pages.values());
  }

  getBlogPosts(): BlogPost[] {
    return Array.from(this.pages.values())
      .filter(page => page.template === 'post') as BlogPost[];
  }

  getFeaturedPosts(): BlogPost[] {
    return this.getBlogPosts().filter(post => post.featured);
  }

  getTrip(id: string): Trip | null {
    return this.trips.get(id) || null;
  }

  getAllTrips(): Trip[] {
    return Array.from(this.trips.values());
  }

  getFeaturedTrips(): Trip[] {
    return Array.from(this.trips.values()).filter(trip => trip.featured);
  }

  getDestination(id: string): Destination | null {
    return this.destinations.get(id) || null;
  }

  getAllDestinations(): Destination[] {
    return Array.from(this.destinations.values());
  }

  getMenu(location: string): NavigationMenu | null {
    return this.menus.get(location) || null;
  }

  getCategory(id: string): Category | null {
    return this.categories.get(id) || null;
  }

  getAllCategories(): Category[] {
    return Array.from(this.categories.values());
  }

  searchContent(query: string): BasePage[] {
    const searchTerm = query.toLowerCase();
    return Array.from(this.pages.values()).filter(page =>
      page.metadata.title.toLowerCase().includes(searchTerm) ||
      page.metadata.description.toLowerCase().includes(searchTerm) ||
      page.content.some(section => {
        if (section.type === 'text') {
          const textContent = section as TextContent;
          return textContent.content.text?.toLowerCase().includes(searchTerm);
        }
        return false;
      })
    );
  }
}

// Export singleton instance
export const contentManager = ContentManager.getInstance();

// Export utility functions
export const getPage = (slug: string) => contentManager.getPage(slug);
export const getAllPages = () => contentManager.getAllPages();
export const getBlogPosts = () => contentManager.getBlogPosts();
export const getFeaturedPosts = () => contentManager.getFeaturedPosts();
export const getTrip = (id: string) => contentManager.getTrip(id);
export const getAllTrips = () => contentManager.getAllTrips();
export const getFeaturedTrips = () => contentManager.getFeaturedTrips();
export const getDestination = (id: string) => contentManager.getDestination(id);
export const getAllDestinations = () => contentManager.getAllDestinations();
export const getMenu = (location: string) => contentManager.getMenu(location);
export const searchContent = (query: string) => contentManager.searchContent(query);