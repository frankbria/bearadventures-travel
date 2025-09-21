/**
 * Site Configuration for Bear Adventures Travel
 * Central configuration without any WordPress dependencies
 */

import { SiteConfig } from '../types/content';

export const siteConfig: SiteConfig = {
  title: 'Bear Adventures Travel',
  description: 'Curated Luxury Gay Travel for Active Men - Creating luxurious adventures for the intrepid bear.',
  url: 'https://bearadventures.travel',
  logo: {
    light: '/images/logos/bear-adventures-logo.png',
    dark: '/images/logos/bear-adventures-logo-dark.png',
  },
  favicon: '/favicon.ico',
  social: {
    email: 'frank@bearadventures.travel',
    facebook: 'https://facebook.com/bearadventures',
    instagram: 'https://instagram.com/bearadventures',
    twitter: 'https://twitter.com/bearadventures',
  },
  contact: {
    email: 'frank@bearadventures.travel',
    phone: '+1 (555) 123-4567',
  },
  analytics: {
    googleAnalytics: 'GA_MEASUREMENT_ID', // Replace with actual GA ID
  },
  seo: {
    defaultImage: '/images/og-default.jpg',
    keywords: [
      'gay travel',
      'LGBTQ travel',
      'luxury travel',
      'adventure travel',
      'bear community',
      'group trips',
      'gay-friendly destinations',
      'LGBTQ tourism',
      'active travel',
      'curated experiences',
    ],
  },
};

export const navigationConfig = {
  header: [
    { text: 'Group Trips', href: '/group-trips' },
    { text: 'Plan Your Trip', href: '/plan-your-trip' },
    { text: 'Blog', href: '/blog' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ],
  footer: [
    { text: 'Terms & Conditions', href: '/terms-and-conditions' },
    { text: 'Privacy Policy', href: '/privacy-policy' },
    { text: 'Contact', href: '/contact' },
  ],
};

export const socialLinks = {
  facebook: siteConfig.social.facebook,
  instagram: siteConfig.social.instagram,
  twitter: siteConfig.social.twitter,
  email: `mailto:${siteConfig.contact.email}`,
};

export const metaDefaults = {
  title: siteConfig.title,
  description: siteConfig.description,
  image: siteConfig.seo.defaultImage,
  type: 'website',
  siteName: siteConfig.title,
  locale: 'en_US',
};