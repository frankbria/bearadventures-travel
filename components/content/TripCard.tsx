'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Trip {
  id: string
  name: string
  location: string
  image: string
  description: string
  duration: string
  groupSize: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  price: number
  highlights: string[]
  dates: string[]
  rating: number
  reviews: number
  slug: string
}

interface TripCardProps {
  trip: Trip
  className?: string
}

export const TripCard: React.FC<TripCardProps> = ({ trip, className }) => {
  const [isHovered, setIsHovered] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500'
      case 'Moderate':
        return 'bg-yellow-500'
      case 'Challenging':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <motion.div
      className={cn('group', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0">
        <div className="relative h-64 overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={trip.image}
              alt={trip.name}
              fill
              className={cn(
                'object-cover transition-transform duration-700',
                isHovered ? 'scale-110' : 'scale-100'
              )}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Difficulty Badge */}
          <div className="absolute top-4 left-4">
            <Badge className={cn(
              'text-white border-0',
              getDifficultyColor(trip.difficulty)
            )}>
              {trip.difficulty}
            </Badge>
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

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{trip.name}</h3>
            <p className="text-gray-600 line-clamp-3">{trip.description}</p>
          </div>

          {/* Trip Details */}
          <div className="space-y-2">
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
          <div>
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
          <div>
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
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-sm text-gray-500">Starting from</span>
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
                <span className="text-2xl font-bold text-amber-600">
                  {trip.price.toLocaleString()}
                </span>
              </div>
            </div>
            <Link href={`/group-trips/${trip.slug}`}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                <span className="mr-2">View Details</span>
                <motion.div
                  animate={{ x: isHovered ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Button>
            </Link>
          </div>
        </CardContent>

        {/* Hover overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Card>
    </motion.div>
  )
}