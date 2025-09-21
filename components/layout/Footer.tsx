/**
 * Footer Component for Bear Adventures Travel
 * Modern footer with contact info, social links, and newsletter signup
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Plane,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig, socialLinks } from '@/lib/site-config';

interface FooterLink {
  title: string;
  href: string;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  href?: string;
}

const footerSections: FooterSection[] = [
  {
    label: 'Destinations',
    links: [
      { title: 'Costa Rica', href: '/destinations/costa-rica' },
      { title: 'Iceland', href: '/destinations/iceland' },
      { title: 'Barcelona', href: '/destinations/barcelona' },
      { title: 'Antarctica', href: '/destinations/antarctica' },
    ],
  },
  {
    label: 'Travel',
    links: [
      { title: 'Group Trips', href: '/group-trips' },
      { title: 'Custom Itineraries', href: '/plan-your-trip' },
      { title: 'Travel Guides', href: '/blog' },
      { title: 'LGBTQ+ Travel', href: '/featured' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'Our Story', href: '/about#story' },
      { title: 'Contact', href: '/contact' },
      { title: 'Blog', href: '/blog' },
    ],
  },
];

const socialIcons = [
  { icon: Facebook, href: socialLinks.facebook, label: 'Facebook' },
  { icon: Instagram, href: socialLinks.instagram, label: 'Instagram' },
  { icon: Twitter, href: socialLinks.twitter, label: 'Twitter' },
];

const contactInfo: ContactInfo[] = [
  { icon: Mail, text: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
  { icon: Phone, text: siteConfig.contact.phone || '+1 (555) 123-4567', href: `tel:${siteConfig.contact.phone?.replace(/\s/g, '')}` },
  { icon: MapPin, text: 'Los Angeles, CA' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

function AnimatedContainer({ children, delay = 0.1, className }: AnimatedContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    // TODO: Implement newsletter signup
  };

  return (
    <footer className="relative w-full bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-amber-950 dark:via-orange-950 dark:to-amber-900">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 via-orange-500/5 to-transparent pointer-events-none" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-400/10 to-amber-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8"
        >
          {/* Brand Section */}
          <AnimatedContainer className="lg:col-span-1">
            <div className="space-y-6">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logos/cropped-Logo-20.png"
                    alt="Bear Adventures Travel"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  {siteConfig.title}
                </h2>
              </Link>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {siteConfig.description}
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialIcons.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded-lg hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </motion.a>
                ))}
              </div>
            </div>
          </AnimatedContainer>

          {/* Navigation Sections */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
            {footerSections.map((section, sectionIndex) => (
              <AnimatedContainer key={section.label} delay={0.1 + sectionIndex * 0.1}>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-4">
                    {section.label}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <motion.li key={link.title} variants={itemVariants}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 text-sm group relative"
                        >
                          <span className="relative">
                            {link.title}
                            <motion.span
                              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500"
                              initial={{ width: 0 }}
                              whileHover={{ width: "100%" }}
                              transition={{ duration: 0.3 }}
                            />
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>

          {/* Contact & Newsletter Section */}
          <AnimatedContainer delay={0.4} className="lg:col-span-1">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Stay Connected
              </h3>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <contact.icon className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    {contact.href ? (
                      <a
                        href={contact.href}
                        className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300 text-sm"
                      >
                        {contact.text}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">{contact.text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Adventure Newsletter</h4>
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 border-amber-200 dark:border-amber-800 focus:border-amber-400 dark:focus:border-amber-600"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </AnimatedContainer>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 pt-8 border-t border-amber-200 dark:border-amber-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} {siteConfig.title}. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}