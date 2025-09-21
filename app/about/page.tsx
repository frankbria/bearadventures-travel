'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Heart,
  Globe,
  Users,
  Star,
  MapPin,
  Award,
  Plane,
  Camera,
  Coffee,
  Mountain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

const teamMembers = [
  {
    name: 'Frank',
    role: 'Co-Founder & Travel Expert',
    image: '/images/team/frank-portrait.jpg',
    bio: 'With over 15 years of experience in luxury travel and a passion for creating authentic adventures, Frank brings his expertise in LGBTQ+ travel to curate unforgettable experiences for our community.',
    specialties: ['Luxury Travel', 'Adventure Planning', 'LGBTQ+ Tourism', 'Cultural Immersion'],
    favoriteDestination: 'Patagonia, Chile'
  },
  {
    name: 'David',
    role: 'Co-Founder & Operations Director',
    image: '/images/team/david-portrait.jpg',
    bio: 'David\'s background in hospitality and operations ensures every detail of your journey is perfectly executed. His attention to detail and commitment to excellence makes every trip seamless.',
    specialties: ['Operations Management', 'Hotel Relations', 'Group Dynamics', 'Customer Experience'],
    favoriteDestination: 'Iceland'
  }
]

const values = [
  {
    icon: Heart,
    title: 'Authenticity',
    description: 'We believe in genuine experiences that connect you with local cultures and communities while respecting traditions and environments.'
  },
  {
    icon: Globe,
    title: 'Inclusion',
    description: 'Travel should be accessible and welcoming for everyone. We create safe, inclusive spaces where all travelers can be themselves.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building connections between like-minded travelers creates friendships that last long after the journey ends.'
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'We partner with the best local guides, luxury accommodations, and unique experiences to exceed your expectations.'
  }
]

const stats = [
  { number: '500+', label: 'Happy Travelers' },
  { number: '50+', label: 'Destinations Visited' },
  { number: '15+', label: 'Years Experience' },
  { number: '98%', label: 'Return Customer Rate' }
]

const milestones = [
  {
    year: '2009',
    title: 'The Beginning',
    description: 'Frank and David met while traveling through Southeast Asia and discovered their shared passion for luxury adventure travel.'
  },
  {
    year: '2012',
    title: 'First Group Trip',
    description: 'Organized our first group adventure to Costa Rica with 8 travelers, creating the foundation for what would become Bear Adventures.'
  },
  {
    year: '2015',
    title: 'Company Launch',
    description: 'Officially launched Bear Adventures Travel, focusing exclusively on luxury LGBTQ+ group travel experiences.'
  },
  {
    year: '2018',
    title: 'Global Expansion',
    description: 'Expanded to offer adventures across six continents, partnering with local LGBTQ+ organizations worldwide.'
  },
  {
    year: '2021',
    title: 'Sustainable Travel',
    description: 'Launched our sustainability initiative, partnering with eco-friendly accommodations and supporting local conservation efforts.'
  },
  {
    year: '2024',
    title: 'Custom Journeys',
    description: 'Introduced personalized travel planning services, creating bespoke adventures tailored to individual interests and dreams.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/about/about-hero.jpg"
            alt="Bear Adventures Travel Team"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/40 to-orange-900/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our
              <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Story
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Two partners in love and adventure, creating extraordinary travel experiences
              for the LGBTQ+ community since 2015
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Born from a Shared Passion
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Bear Adventures Travel began with a simple belief: that travel should be about
                  authentic connections, extraordinary experiences, and the freedom to be yourself.
                  As partners in both life and business, Frank and David discovered early in their
                  relationship that their shared love for adventure and luxury travel could become
                  something much bigger.
                </p>
                <p>
                  What started as personal journeys to incredible destinations evolved into a mission
                  to create safe, inclusive, and luxurious travel experiences for the LGBTQ+ community.
                  We understand the unique needs of gay travelers because we are gay travelers ourselves.
                </p>
                <p>
                  Every trip we curate reflects our personal experiences and relationships built over
                  years of exploration. We don't just plan vacations—we craft life-changing adventures
                  that connect like-minded individuals while respecting and celebrating the destinations
                  we visit.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/founders-traveling.jpg"
                  alt="Frank and David traveling"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every journey we create and every relationship we build
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow border-amber-200/50">
                  <CardContent className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind every extraordinary adventure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative h-80">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                      <p className="text-amber-200">{member.role}</p>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <p className="text-gray-700 leading-relaxed">{member.bio}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Favorite Destination: {member.favoriteDestination}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Numbers that reflect our commitment to exceptional travel experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              Key milestones in building Bear Adventures Travel
            </p>
          </motion.div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className="flex-1">
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-3">
                      <div className="text-2xl font-bold text-amber-600">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900">{milestone.title}</h3>
                      <p className="text-gray-700">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>

                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Create Your Own Story?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of adventurous travelers and discover the world with people who share your passion for authentic experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/group-trips">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8 py-3 text-lg"
                >
                  <Plane className="w-5 h-5 mr-2" />
                  Explore Adventures
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 px-8 py-3 text-lg"
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  Let's Chat
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}