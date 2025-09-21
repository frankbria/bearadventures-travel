'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MapPin,
  Users,
  Calendar,
  Star,
  CheckCircle,
  MessageCircle,
  Plane,
  Heart,
  Globe,
  Clock,
  Phone,
  Mail
} from 'lucide-react'

const planningSteps = [
  {
    step: 1,
    title: "Tell Us Your Dreams",
    description: "Share your travel interests, preferred destinations, and what kind of experience you're looking for",
    icon: Heart
  },
  {
    step: 2,
    title: "We Design Your Journey",
    description: "Our travel experts create a personalized itinerary based on your preferences and travel style",
    icon: Globe
  },
  {
    step: 3,
    title: "Refine Together",
    description: "We work with you to perfect every detail until your trip is exactly what you envisioned",
    icon: MessageCircle
  },
  {
    step: 4,
    title: "Adventure Awaits",
    description: "Embark on your custom adventure with all logistics handled and unforgettable experiences curated",
    icon: Plane
  }
]

const customTripExamples = [
  {
    title: "Romantic Getaway",
    image: "/images/custom/romantic-santorini.jpg",
    description: "Intimate escapes designed for couples seeking romance and connection",
    features: ["Private dining experiences", "Couples activities", "Luxury accommodations", "Sunset experiences"]
  },
  {
    title: "Adventure Expedition",
    image: "/images/custom/adventure-patagonia.jpg",
    description: "Thrilling adventures for those seeking adrenaline and challenge",
    features: ["Extreme activities", "Expert guides", "Remote locations", "Achievement focus"]
  },
  {
    title: "Cultural Immersion",
    image: "/images/custom/cultural-japan.jpg",
    description: "Deep cultural experiences with local communities and traditions",
    features: ["Local interactions", "Traditional experiences", "Cultural guides", "Authentic cuisine"]
  },
  {
    title: "Wellness Retreat",
    image: "/images/custom/wellness-bali.jpg",
    description: "Restorative journeys focusing on health, mindfulness, and renewal",
    features: ["Spa treatments", "Meditation sessions", "Healthy cuisine", "Nature connection"]
  }
]

const testimonials = [
  {
    name: "Jennifer & Mark",
    location: "Seattle, WA",
    text: "Bear Adventures created our dream honeymoon in New Zealand. Every detail was perfect and exceeded our expectations.",
    trip: "Custom New Zealand Adventure",
    image: "/images/testimonials/jennifer-mark.jpg"
  },
  {
    name: "Robert & Thomas",
    location: "Miami, FL",
    text: "The custom African safari they planned was life-changing. We saw incredible wildlife and had amazing cultural experiences.",
    trip: "Custom African Safari",
    image: "/images/testimonials/robert-thomas.jpg"
  }
]

export default function PlanYourTripPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/custom/custom-travel-hero.jpg"
            alt="Custom Travel Planning"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/40 to-orange-900/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Your Perfect
            <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Adventure
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 leading-relaxed"
          >
            Let us create a completely customized travel experience tailored to your dreams,
            interests, and travel style
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
              asChild
            >
              <Link href="#planning-form">
                Start Planning Today
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Custom Planning Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our personalized approach ensures every detail of your journey is crafted to perfection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {planningSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Trip Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Types of Custom Adventures</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whatever your travel style, we'll create the perfect experience for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {customTripExamples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={example.image}
                    alt={example.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{example.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-4">{example.description}</p>
                  <div className="space-y-2">
                    {example.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Form */}
      <section id="planning-form" className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's Start Planning</h2>
            <p className="text-xl text-gray-600">
              Tell us about your dream trip and we'll create something amazing together
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input placeholder="Enter your full name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input type="email" placeholder="your@email.com" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input placeholder="(555) 123-4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <Input placeholder="2" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Travel Dates
                  </label>
                  <Input placeholder="e.g., June 2024" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Duration
                  </label>
                  <Input placeholder="e.g., 7-10 days" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Interests
                </label>
                <Input placeholder="e.g., Japan, Europe, Costa Rica" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Style & Interests
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={4}
                  placeholder="Tell us about your travel interests, activity level, accommodation preferences, and what makes a perfect trip for you..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range (Optional)
                </label>
                <Input placeholder="e.g., $3,000 - $5,000 per person" />
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-12 py-3 text-lg"
                  type="submit"
                >
                  Submit Planning Request
                </Button>
                <p className="text-sm text-gray-500 mt-3">
                  We'll get back to you within 24 hours with initial ideas and next steps
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Custom Trip Success Stories</h2>
            <p className="text-xl text-gray-600">Hear from travelers who experienced their perfect custom adventure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <p className="text-sm text-amber-600 mt-1">{testimonial.trip}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Plan Your Dream Trip?</h2>
            <p className="text-xl text-white/90 mb-8">
              Get in touch with our travel experts to start designing your perfect adventure
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                asChild
              >
                <Link href="#planning-form">
                  Start Planning <Calendar className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 text-lg"
                asChild
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}