'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Star,
  Filter,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input'

const trips = [
  {
    id: 1,
    name: "Costa Rica Adventure",
    location: "Central America",
    image: "/images/trips/costa-rica-group.jpg",
    description: "Explore lush rainforests, pristine beaches, and incredible wildlife in this eco-paradise. Experience zip-lining through canopies, wildlife spotting, and relaxing beach time.",
    duration: "7 days / 6 nights",
    groupSize: "8-12 travelers",
    difficulty: "Moderate",
    price: 2499,
    highlights: ["Manuel Antonio National Park", "Arenal Volcano", "Cloud Forest", "Pacific Coast"],
    dates: ["March 15-21, 2024", "May 10-16, 2024", "October 5-11, 2024"],
    rating: 4.9,
    reviews: 127
  },
  {
    id: 2,
    name: "Iceland Northern Lights",
    location: "Nordic Europe",
    image: "/images/trips/iceland-northern-lights.jpg",
    description: "Chase the magical aurora borealis while discovering Iceland's dramatic landscapes, geysers, waterfalls, and geothermal hot springs.",
    duration: "5 days / 4 nights",
    groupSize: "6-10 travelers",
    difficulty: "Easy",
    price: 3299,
    highlights: ["Northern Lights viewing", "Blue Lagoon", "Golden Circle", "Reykjavik culture"],
    dates: ["January 20-24, 2024", "February 15-19, 2024", "November 10-14, 2024"],
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    name: "Barcelona & Mediterranean",
    location: "Spain",
    image: "/images/trips/barcelona-group.jpg",
    description: "Immerse yourself in Catalonian culture, art, and coastal beauty. Explore Gaudí's masterpieces, enjoy world-class cuisine, and relax on Mediterranean beaches.",
    duration: "6 days / 5 nights",
    groupSize: "10-14 travelers",
    difficulty: "Easy",
    price: 2899,
    highlights: ["Sagrada Familia", "Park Güell", "Gothic Quarter", "Beach excursions"],
    dates: ["April 8-13, 2024", "June 12-17, 2024", "September 15-20, 2024"],
    rating: 4.7,
    reviews: 156
  },
  {
    id: 4,
    name: "Antarctic Explorer",
    location: "Antarctica",
    image: "/images/trips/antarctica-expedition.jpg",
    description: "The ultimate adventure to the white continent. Witness massive glaciers, penguin colonies, and pristine wilderness in one of Earth's last frontiers.",
    duration: "12 days / 11 nights",
    groupSize: "6-8 travelers",
    difficulty: "Challenging",
    price: 8999,
    highlights: ["Penguin colonies", "Glacier cruising", "Zodiac expeditions", "Antarctic Circle"],
    dates: ["December 15-26, 2024", "January 10-21, 2025"],
    rating: 5.0,
    reviews: 34
  },
  {
    id: 5,
    name: "Japanese Cultural Journey",
    location: "Asia",
    image: "/images/trips/japan-cultural.jpg",
    description: "Experience the perfect blend of ancient traditions and modern innovation. From Tokyo's neon lights to Kyoto's serene temples.",
    duration: "10 days / 9 nights",
    groupSize: "8-12 travelers",
    difficulty: "Moderate",
    price: 4599,
    highlights: ["Tokyo exploration", "Kyoto temples", "Mount Fuji", "Traditional ryokan"],
    dates: ["March 25 - April 3, 2024", "October 15-24, 2024"],
    rating: 4.9,
    reviews: 92
  },
  {
    id: 6,
    name: "Patagonia Wilderness",
    location: "South America",
    image: "/images/trips/patagonia-wilderness.jpg",
    description: "Discover the raw beauty of Patagonia's mountains, glaciers, and endless skies. Perfect for nature lovers seeking dramatic landscapes.",
    duration: "9 days / 8 nights",
    groupSize: "6-10 travelers",
    difficulty: "Challenging",
    price: 5299,
    highlights: ["Torres del Paine", "Glacier hiking", "Wildlife spotting", "Estancia visit"],
    dates: ["February 10-18, 2024", "November 5-13, 2024"],
    rating: 4.8,
    reviews: 67
  }
]

const filters = [
  { name: "All Destinations", value: "all" },
  { name: "Easy", value: "easy" },
  { name: "Moderate", value: "moderate" },
  { name: "Challenging", value: "challenging" }
]

export default function GroupTripsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-amber-600 to-orange-600 flex items-center">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-4">Group Adventures</h1>
            <p className="text-xl max-w-2xl">
              Join small groups of like-minded travelers on carefully curated adventures
              to the world's most incredible destinations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700 font-medium">Filter by difficulty:</span>
              <div className="flex gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={filter.value === "all" ? "default" : "outline"}
                    size="sm"
                    className={filter.value === "all" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search destinations..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trip Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-64">
                  <Image
                    src={trip.image}
                    alt={trip.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      trip.difficulty === 'Easy' ? 'bg-green-500' :
                      trip.difficulty === 'Moderate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    } text-white`}>
                      {trip.difficulty}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-400 text-white">
                      <MapPin className="w-3 h-3 mr-1" />
                      {trip.location}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-2 py-1">
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-amber-400 fill-current mr-1" />
                      <span className="font-medium">{trip.rating}</span>
                      <span className="text-gray-500 ml-1">({trip.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{trip.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{trip.description}</p>

                  {/* Trip Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {trip.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {trip.groupSize}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {trip.highlights.slice(0, 3).map((highlight, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                      {trip.highlights.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{trip.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Available Dates */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Available Dates:</h4>
                    <div className="space-y-1">
                      {trip.dates.slice(0, 2).map((date, idx) => (
                        <div key={idx} className="text-sm text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-2" />
                          {date}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Starting from</span>
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-amber-600" />
                        <span className="text-2xl font-bold text-amber-600">{trip.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      asChild
                    >
                      <Link href={`/group-trips/${trip.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find the Perfect Trip?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let us create a custom itinerary tailored to your interests and travel style
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            asChild
          >
            <Link href="/plan-your-trip">
              Plan Custom Trip
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}