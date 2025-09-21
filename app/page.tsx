'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/content/BlogCard'
import { TripCard } from '@/components/content/TripCard'
import { getFeaturedBlogPosts } from '@/lib/blog-data'
import {
  MapPin,
  Users,
  Calendar,
  Star,
  ArrowRight,
  Plane,
  Heart,
  Globe
} from 'lucide-react'

const featuredDestinations = [
  {
    id: 1,
    name: "Costa Rica Adventure",
    location: "Central America",
    image: "/images/destinations/costa-rica-hero.jpg",
    description: "Explore rainforests, beaches, and wildlife in this eco-paradise",
    duration: "7 days",
    groupSize: "8-12",
    price: "from $2,499"
  },
  {
    id: 2,
    name: "Iceland Northern Lights",
    location: "Nordic Europe",
    image: "/images/destinations/iceland-hero.jpg",
    description: "Chase the aurora borealis and discover dramatic landscapes",
    duration: "5 days",
    groupSize: "6-10",
    price: "from $3,299"
  },
  {
    id: 3,
    name: "Barcelona & Mediterranean",
    location: "Spain",
    image: "/images/destinations/barcelona-hero.jpg",
    description: "Art, culture, and coastal beauty in Catalonia",
    duration: "6 days",
    groupSize: "10-14",
    price: "from $2,899"
  }
]

const testimonials = [
  {
    name: "Michael & David",
    location: "San Francisco, CA",
    text: "Bear Adventures created the perfect balance of adventure and relaxation. Every detail was thoughtfully planned.",
    rating: 5,
    trip: "Costa Rica Adventure"
  },
  {
    name: "Sarah & Emily",
    location: "New York, NY",
    text: "Seeing the Northern Lights with this amazing group was a life-changing experience. Highly recommend!",
    rating: 5,
    trip: "Iceland Northern Lights"
  },
  {
    name: "James & Alex",
    location: "Chicago, IL",
    text: "The Barcelona trip exceeded all expectations. Great group, incredible experiences, and seamless planning.",
    rating: 5,
    trip: "Barcelona & Mediterranean"
  }
]

const features = [
  {
    icon: Users,
    title: "Small Group Travel",
    description: "Intimate groups of 6-14 travelers for personalized experiences"
  },
  {
    icon: Heart,
    title: "LGBTQ+ Friendly",
    description: "Welcoming, inclusive adventures where everyone can be themselves"
  },
  {
    icon: Globe,
    title: "Expert Planning",
    description: "Carefully curated itineraries with local insights and hidden gems"
  },
  {
    icon: Calendar,
    title: "Year-Round Adventures",
    description: "Seasonal trips designed to showcase destinations at their best"
  }
]

export default function HomePage() {
  const featuredBlogPosts = getFeaturedBlogPosts(3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/homepage-hero.jpg"
            alt="Bear Adventures Travel"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 to-orange-900/30" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Adventure
            <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Awaits
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 leading-relaxed"
          >
            Join small groups of like-minded travelers on carefully curated adventures
            to the world's most incredible destinations
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
              asChild
            >
              <Link href="/group-trips">
                Explore Trips <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
              asChild
            >
              <Link href="/plan-your-trip">
                Plan Custom Trip
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Bear Adventures?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We create transformative travel experiences that connect you with amazing destinations and fellow adventurers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Adventures</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular group trips, each designed to create unforgettable memories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-400 text-white">
                      <MapPin className="w-3 h-3 mr-1" />
                      {destination.location}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {destination.duration}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {destination.groupSize}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-600">{destination.price}</span>
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      asChild
                    >
                      <Link href="/group-trips">
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from our adventure community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                  <p className="text-sm text-amber-600 mt-1">{testimonial.trip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Travel Inspiration</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover insider tips, destination guides, and travel stories from our latest adventures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <BlogCard
                  post={{
                    id: post.id,
                    title: post.title,
                    excerpt: post.excerpt,
                    featuredImage: post.featuredImage,
                    category: post.category,
                    author: post.author,
                    publishDate: post.publishDate,
                    readTime: post.readTime,
                    slug: post.slug
                  }}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                size="lg"
                variant="outline"
                className="border-amber-200 text-amber-700 hover:bg-amber-50 px-8 py-3 text-lg"
              >
                View All Articles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready for Your Next Adventure?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community of travelers and discover the world with like-minded adventurers
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/group-trips">
                  Browse All Trips <Plane className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 text-lg"
                asChild
              >
                <Link href="/contact">
                  Get In Touch
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}