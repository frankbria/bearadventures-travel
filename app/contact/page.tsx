'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Calendar,
  MessageCircle,
  Heart,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us a message and we\'ll respond within 24 hours',
    info: 'frank@bearadventures.travel',
    action: 'mailto:frank@bearadventures.travel'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak directly with our travel experts',
    info: '+1 (555) 123-4567',
    action: 'tel:+15551234567'
  },
  {
    icon: Calendar,
    title: 'Schedule a Call',
    description: 'Book a consultation to discuss your travel dreams',
    info: 'Free 30-minute consultation',
    action: '#'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with us in real-time during business hours',
    info: 'Available Mon-Fri, 9AM-6PM PST',
    action: '#'
  }
]

const officeHours = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM PST' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM PST' },
  { day: 'Sunday', hours: 'By appointment only' }
]

const faqs = [
  {
    question: 'How far in advance should I book my trip?',
    answer: 'We recommend booking 3-6 months in advance for the best selection of accommodations and experiences. However, we can often accommodate last-minute requests depending on availability.'
  },
  {
    question: 'Do you offer custom trip planning?',
    answer: 'Absolutely! Our custom trip planning service allows us to create a completely personalized itinerary based on your interests, travel style, and budget.'
  },
  {
    question: 'What\'s included in your group trips?',
    answer: 'Our group trips typically include accommodations, most meals, guided tours, transportation between destinations, and access to exclusive experiences. Flights are usually not included unless specified.'
  },
  {
    question: 'Are your trips LGBTQ+ friendly?',
    answer: 'Yes! All our trips are specifically designed for the LGBTQ+ community. We carefully vet all accommodations and destinations to ensure they are welcoming and safe for our travelers.'
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    travelDates: '',
    groupSize: '',
    interests: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // TODO: Implement form submission
    alert('Thank you for your message! We\'ll get back to you soon.')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6">Let's Plan Your Adventure</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Whether you're interested in joining a group trip or creating a custom adventure,
              we're here to help make your travel dreams come true
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">
              Choose the way that works best for you to start planning your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-amber-200/50 cursor-pointer group">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{method.title}</h3>
                    <p className="text-gray-600 text-sm">{method.description}</p>
                    <p className="font-medium text-amber-600">{method.info}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="border-amber-200/50">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-900 flex items-center">
                      <Send className="w-6 h-6 mr-3 text-amber-500" />
                      Send Us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            required
                            className="border-amber-200 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            required
                            className="border-amber-200 focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="(555) 123-4567"
                            className="border-amber-200 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject
                          </label>
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="What can we help you with?"
                            className="border-amber-200 focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Travel Dates
                          </label>
                          <Input
                            name="travelDates"
                            value={formData.travelDates}
                            onChange={handleInputChange}
                            placeholder="e.g., June 2024"
                            className="border-amber-200 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Group Size
                          </label>
                          <Input
                            name="groupSize"
                            value={formData.groupSize}
                            onChange={handleInputChange}
                            placeholder="Number of travelers"
                            className="border-amber-200 focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Travel Interests & Destinations
                        </label>
                        <Input
                          name="interests"
                          value={formData.interests}
                          onChange={handleInputChange}
                          placeholder="e.g., Adventure travel, Cultural experiences, Luxury resorts..."
                          className="border-amber-200 focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={6}
                          placeholder="Tell us about your travel dreams and any specific requirements..."
                          required
                          className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 text-lg"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Info & Hours */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="border-amber-200/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-amber-500" />
                      Office Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">{schedule.day}</span>
                        <span className="text-gray-600">{schedule.hours}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card className="border-amber-200/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-amber-500" />
                      Our Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900">Bear Adventures Travel</p>
                      <p className="text-gray-600">Los Angeles, California</p>
                      <p className="text-gray-600">United States</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      We're a fully remote team, allowing us to be available across time zones
                      and maintain close relationships with destinations worldwide.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      We're Here to Help
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Every journey begins with a conversation. We're excited to learn about
                      your travel dreams and help bring them to life.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about traveling with Bear Adventures
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-amber-200/50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join hundreds of satisfied travelers who have discovered the world with Bear Adventures
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                <Globe className="w-5 h-5 mr-2" />
                Explore Group Trips
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 text-lg"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}