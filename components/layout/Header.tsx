/**
 * Header Component for Bear Adventures Travel
 * Modern responsive header with navigation, logo, and mobile menu
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, MapPin, Users, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { siteConfig } from '@/lib/site-config';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface HeaderProps {
  className?: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Group Trips',
    url: '/group-trips',
    items: [
      {
        title: 'Costa Rica Adventure',
        description: '9-day jungle and ocean bear adventure through Costa Rica',
        icon: <MapPin className="size-5 shrink-0" />,
        url: '/group-trips/costa-rica-adventure',
      },
      {
        title: 'Antarctica Expedition',
        description: 'Epic expedition to Antarctica with luxury accommodations',
        icon: <Users className="size-5 shrink-0" />,
        url: '/group-trips/antarctica-expedition',
      },
      {
        title: 'European Getaways',
        description: 'Curated city breaks and cultural experiences across Europe',
        icon: <Calendar className="size-5 shrink-0" />,
        url: '/group-trips/european-getaways',
      },
    ],
  },
  {
    title: 'Plan Your Trip',
    url: '/plan-your-trip',
    items: [
      {
        title: 'Custom Itineraries',
        description: 'Personalized travel plans tailored to your interests',
        icon: <Calendar className="size-5 shrink-0" />,
        url: '/plan-your-trip/custom-itineraries',
      },
      {
        title: 'Travel Guides',
        description: 'Comprehensive guides for LGBTQ+ friendly destinations',
        icon: <BookOpen className="size-5 shrink-0" />,
        url: '/plan-your-trip/travel-guides',
      },
      {
        title: 'Destinations',
        description: 'Explore our featured destinations around the world',
        icon: <MapPin className="size-5 shrink-0" />,
        url: '/destinations',
      },
    ],
  },
  { title: 'Blog', url: '/blog' },
  { title: 'About', url: '/about' },
  { title: 'Contact', url: '/contact' },
];

export default function Header({ className }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logos/cropped-Logo-20.png"
                  alt="Bear Adventures Travel"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {siteConfig.title}
              </span>
            </Link>

            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menuItems.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Link href="/contact">Plan My Trip</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium">
              <Link href="/group-trips">Join Adventure</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logos/cropped-Logo-20.png"
                  alt="Bear Adventures Travel"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Bear Adventures
              </span>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent">
                  <Menu className="size-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto bg-background/95 backdrop-blur">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src="/images/logos/cropped-Logo-20.png"
                          alt="Bear Adventures Travel"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        Bear Adventures
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="my-8 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    {menuItems.map((item) => renderMobileMenuItem(item))}
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex flex-col gap-3">
                      <Button asChild variant="ghost" className="justify-start text-muted-foreground hover:text-foreground">
                        <Link href="/contact">Plan My Trip</Link>
                      </Button>
                      <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium">
                        <Link href="/group-trips">Join Adventure</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger className="font-medium hover:text-foreground data-[state=open]:text-foreground">
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-96 p-4">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <Link
                    className="flex select-none gap-4 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground group"
                    href={subItem.url}
                  >
                    <div className="text-amber-600 group-hover:text-amber-700">
                      {subItem.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold mb-1">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
          href={item.url}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <div key={item.title} className="space-y-3">
        <h4 className="font-semibold text-foreground">{item.title}</h4>
        <div className="ml-4 space-y-2">
          {item.items.map((subItem) => (
            <Link
              key={subItem.title}
              className="flex select-none gap-3 rounded-lg p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
              href={subItem.url}
            >
              <div className="text-amber-600">
                {subItem.icon}
              </div>
              <div>
                <div className="text-sm font-medium">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-xs leading-snug text-muted-foreground mt-1">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      className="font-medium text-foreground hover:text-amber-600 transition-colors"
    >
      {item.title}
    </Link>
  );
};