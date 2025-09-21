const fs = require('fs').promises;
const path = require('path');

class ComponentGenerator {
  constructor() {
    this.componentsDir = './src/components';
    this.pagesDir = './src/pages';
    this.contentData = null;
    this.navigationData = null;
  }

  async init() {
    // Create directory structure
    const dirs = [
      './src/components/layout',
      './src/components/sections',
      './src/components/ui',
      './src/pages',
      './src/content'
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }

    console.log('📁 Created React component directory structure');
  }

  async loadData() {
    try {
      const contentRaw = await fs.readFile('./content-data.json', 'utf8');
      this.contentData = JSON.parse(contentRaw);

      const navRaw = await fs.readFile('./navigation-data.json', 'utf8');
      this.navigationData = JSON.parse(navRaw);

      console.log('📊 Loaded content and navigation data');
    } catch (error) {
      console.error('❌ Error loading data:', error.message);
    }
  }

  generateHeader() {
    const headerCode = `import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={\`header--row header-main layout-full-contained nv-navbar \${className}\`}>
      <nav className="navigation-container">
        <Link to="/" className="brand">
          <img
            src="/src/assets/images/logos/cropped-Logo-20.png"
            alt="Bear Adventures Travel"
            className="logo"
          />
        </Link>

        <div className="main-navigation">
          <Link to="/group-trips" className="nav-link">Group Trips</Link>
          <Link to="/plan-your-trip" className="nav-link">Plan Your Trip</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/about-us" className="nav-link">About Us</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        <div className="external-trips">
          <a
            href="https://www.wetravel.com/trips/costa-rica-9-days-8-night-jungle-ocean-bear-adventure-bear-adventures-la-fortuna-90267234"
            target="_blank"
            rel="noopener noreferrer"
            className="trip-link costa-rica"
          >
            Costa Rica Adventure
          </a>
          <a
            href="https://www.wetravel.com/trips/south-america-antarctica-bear-adventures-for-gay-men-2026-bear-adventures-buenos-aires-43130642"
            target="_blank"
            rel="noopener noreferrer"
            className="trip-link antarctica"
          >
            Antarctica Expedition
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;`;

    return headerCode;
  }

  generateFooter() {
    const footerCode = `import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-nav">
          <Link to="/terms-and-conditions" className="footer-link">
            Terms and Conditions
          </Link>
          <Link to="/privacy-policy" className="footer-link">
            Privacy Policy
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </div>

        <div className="footer-contact">
          <a href="mailto:frank@bearadventures.travel" className="contact-email">
            frank@bearadventures.travel
          </a>
        </div>

        <div className="footer-copy">
          <p>&copy; {new Date().getFullYear()} Bear Adventures Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;`;

    return footerCode;
  }

  generateLayout() {
    const layoutCode = `import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={\`site-layout \${className}\`}>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;`;

    return layoutCode;
  }

  generateHomePage() {
    const homePageCode = `import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import FeaturedTrips from '../components/sections/FeaturedTrips';
import BlogPreview from '../components/sections/BlogPreview';

const HomePage: React.FC = () => {
  return (
    <Layout className="home-page">
      <Hero />
      <FeaturedTrips />
      <BlogPreview />
    </Layout>
  );
};

export default HomePage;`;

    return homePageCode;
  }

  generateBlogPage() {
    const blogPageCode = `import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import BlogGrid from '../components/sections/BlogGrid';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  featuredImage?: string;
}

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load blog posts from content files
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      // This would load from your content system
      // For now, using extracted data structure
      const mockPosts: BlogPost[] = [
        {
          id: '1',
          title: 'The Best Time to Go to Cappadocia',
          excerpt: 'Discover the perfect timing for your Cappadocia adventure...',
          slug: 'the-best-time-to-go-to-cappadocia',
          category: 'Tips & Tricks',
          date: '2024-03-15',
          featuredImage: '/src/assets/images/content/cappadocia-hero.jpg'
        },
        {
          id: '2',
          title: '10 Luxury Hotels Every Luxury Traveler Should Visit',
          excerpt: 'Explore the world\\'s most exclusive luxury accommodations...',
          slug: '10-luxury-hotels-every-luxury-traveler-should-visit',
          category: 'Luxury Travel',
          date: '2024-03-10',
          featuredImage: '/src/assets/images/content/luxury-hotels.jpg'
        },
        {
          id: '3',
          title: 'Costa Rica Gay Travel: Ultimate Bear Adventures Guide',
          excerpt: 'Your complete guide to gay-friendly Costa Rica adventures...',
          slug: 'costa-rica-gay-travel-ultimate-bear-adventures-guide',
          category: 'Destinations',
          date: '2024-03-05',
          featuredImage: '/src/assets/images/content/costa-rica-guide.jpg'
        }
      ];

      setPosts(mockPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-spinner">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout className="blog-page">
      <div className="blog-header">
        <h1>Travel Blog</h1>
        <p>Discover luxury travel destinations, tips, and adventures for the modern gay traveler.</p>
      </div>
      <BlogGrid posts={posts} />
    </Layout>
  );
};

export default BlogPage;`;

    return blogPageCode;
  }

  generateHeroSection() {
    const heroCode = `import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Curated Luxury Gay Travel for Active Men
        </h1>
        <p className="hero-subtitle">
          We're husbands, partners in crime, and fun-loving travel experts who enjoy
          creating luxurious adventures for the intrepid bear.
        </p>
        <div className="hero-actions">
          <a
            href="/group-trips"
            className="btn btn-primary"
          >
            Explore Group Trips
          </a>
          <a
            href="/plan-your-trip"
            className="btn btn-secondary"
          >
            Plan Custom Trip
          </a>
        </div>
      </div>
      <div className="hero-image">
        <img
          src="/src/assets/images/content/hero-background.jpg"
          alt="Luxury gay travel adventures"
          className="hero-bg"
        />
      </div>
    </section>
  );
};

export default Hero;`;

    return heroCode;
  }

  generateRouterSetup() {
    const routerCode = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GroupTripsPage from './pages/GroupTripsPage';
import PlanTripPage from './pages/PlanTripPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/group-trips" element={<GroupTripsPage />} />
        <Route path="/plan-your-trip" element={<PlanTripPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/about-us" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />

        {/* Blog category routes */}
        <Route path="/tips-tricks/:slug" element={<BlogPost />} />
        <Route path="/adventures/:slug" element={<BlogPost />} />
        <Route path="/luxury-travel/:slug" element={<BlogPost />} />
        <Route path="/destinations/:region/:slug" element={<BlogPost />} />
        <Route path="/featured/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  );
};

export default App;`;

    return routerCode;
  }

  generateTailwindConfig() {
    const tailwindCode = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bear Adventures brand colors (extract from design analysis)
        primary: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        accent: {
          gold: '#fbbf24',
          warm: '#f59e0b',
        }
      },
      fontFamily: {
        // Match WordPress typography
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}`;

    return tailwindCode;
  }

  async generateComponents() {
    const components = [
      { path: './src/components/layout/Header.tsx', code: this.generateHeader() },
      { path: './src/components/layout/Footer.tsx', code: this.generateFooter() },
      { path: './src/components/layout/Layout.tsx', code: this.generateLayout() },
      { path: './src/components/sections/Hero.tsx', code: this.generateHeroSection() },
      { path: './src/pages/HomePage.tsx', code: this.generateHomePage() },
      { path: './src/pages/BlogPage.tsx', code: this.generateBlogPage() },
      { path: './src/App.tsx', code: this.generateRouterSetup() },
      { path: './tailwind.config.js', code: this.generateTailwindConfig() }
    ];

    for (const component of components) {
      await fs.writeFile(component.path, component.code);
      console.log(`✅ Generated: ${component.path}`);
    }
  }

  async generateContentFiles() {
    if (!this.contentData) return;

    // Extract homepage content
    const homepageData = this.contentData['https://bearadventures.travel'] ||
                        this.contentData['https://bearadventures.travel/'];

    if (homepageData) {
      const homepageContent = {
        metadata: homepageData.metadata,
        hero: {
          title: "Curated Luxury Gay Travel for Active Men",
          subtitle: homepageData.metadata.description,
          backgroundImage: "/src/assets/images/content/hero-background.jpg"
        },
        content: homepageData.content
      };

      await fs.writeFile('./src/content/homepage.json', JSON.stringify(homepageContent, null, 2));
      console.log('✅ Generated: ./src/content/homepage.json');
    }

    // Extract blog posts content
    const blogPosts = [];
    Object.entries(this.contentData).forEach(([url, data]) => {
      if (url.includes('/blog/') ||
          url.includes('/tips-tricks/') ||
          url.includes('/destinations/') ||
          url.includes('/luxury-travel/') ||
          url.includes('/featured/') ||
          url.includes('/adventures/')) {

        blogPosts.push({
          url,
          slug: url.split('/').pop() || '',
          metadata: data.metadata,
          content: data.content,
          category: this.extractCategoryFromUrl(url)
        });
      }
    });

    await fs.writeFile('./src/content/blog-posts.json', JSON.stringify(blogPosts, null, 2));
    console.log('✅ Generated: ./src/content/blog-posts.json');
  }

  extractCategoryFromUrl(url) {
    if (url.includes('/tips-tricks/')) return 'Tips & Tricks';
    if (url.includes('/destinations/')) return 'Destinations';
    if (url.includes('/luxury-travel/')) return 'Luxury Travel';
    if (url.includes('/featured/')) return 'Featured';
    if (url.includes('/adventures/')) return 'Adventures';
    return 'General';
  }

  async generatePackageJson() {
    const packageJson = {
      "name": "bearadventures-travel",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview",
        "type-check": "tsc --noEmit"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.15.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        "@vitejs/plugin-react": "^4.0.3",
        "autoprefixer": "^10.4.14",
        "eslint": "^8.45.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.3",
        "postcss": "^8.4.27",
        "tailwindcss": "^3.3.0",
        "@tailwindcss/typography": "^0.5.9",
        "@tailwindcss/forms": "^0.5.4",
        "typescript": "^5.0.2",
        "vite": "^4.4.5"
      }
    };

    await fs.writeFile('./package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Generated: ./package.json');
  }

  async run() {
    console.log('🚀 Generating React components from Bear Adventures crawl data...\n');

    await this.init();
    await this.loadData();
    await this.generateComponents();
    await this.generateContentFiles();
    await this.generatePackageJson();

    console.log('\n🎉 Component generation completed!');
    console.log('\nNext steps:');
    console.log('1. npm install');
    console.log('2. npm run dev');
    console.log('3. Customize components based on screenshots');
    console.log('4. Run asset download script: node download-assets.cjs');
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new ComponentGenerator();
  generator.run();
}

module.exports = ComponentGenerator;