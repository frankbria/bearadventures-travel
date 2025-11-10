'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BlogCard } from '@/components/content/BlogCard'
import { getFeaturedBlogPostsSync, type BlogPost } from '@/lib/blog-data'
import {
  Users,
  Calendar,
  Star,
  ArrowRight,
  Plane,
  Heart,
  Globe
} from 'lucide-react'

const testimonials = [
  {
    name: "Michael R.",
    location: "San Francisco, CA",
    text: "Working with Bear Adventures to plan my custom Costa Rica trip was incredible. They knew all the hidden gems and made everything seamless.",
    rating: 5,
    trip: "Custom Costa Rica Trip"
  },
  {
    name: "Sarah K.",
    location: "New York, NY",
    text: "The travel guides and blog posts helped me plan an amazing Iceland adventure. Their expertise really shows!",
    rating: 5,
    trip: "Self-Planned Iceland Trip"
  },
  {
    name: "James L.",
    location: "Chicago, IL",
    text: "From initial consultation to final itinerary, Bear Adventures made planning my dream Barcelona trip effortless and personalized.",
    rating: 5,
    trip: "Custom Barcelona Experience"
  }
]

const features = [
  {
    icon: Globe,
    title: "Custom Itineraries",
    description: "Personalized trip planning tailored to your interests and travel style"
  },
  {
    icon: Heart,
    title: "LGBTQ+ Friendly",
    description: "Welcoming, inclusive travel experiences where everyone can be themselves"
  },
  {
    icon: Calendar,
    title: "Expert Travel Guides",
    description: "Detailed blog posts and destination guides to inspire your adventures"
  },
  {
    icon: Users,
    title: "Personal Consultation",
    description: "One-on-one planning assistance to create your perfect journey"
  }
]

export default function HomePage() {
  // Use synchronous function with existing blog data
  const featuredBlogPosts = getFeaturedBlogPostsSync(3)

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
            Discover expert travel guides, destination insights, and personalized trip planning
            for your next unforgettable adventure
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
              <Link href="/blog">
                Explore Travel Guides <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
              asChild
            >
              <Link href="/plan-your-trip">
                Plan My Trip
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

          {featuredBlogPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBlogPosts.map((post) => (
                <div key={post.id}>
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
                </div>
              ))}
            </div>
          )}
          {featuredBlogPosts.length === 0 && (
            <div className="text-center text-gray-600">No featured posts available</div>
          )}

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
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Plan Your Adventure?</h2>
            <p className="text-xl text-white/90 mb-8">
              Let us help you create a personalized travel experience tailored to your dreams
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="/plan-your-trip">
                  Plan My Trip <Plane className="ml-2 h-5 w-5" />
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