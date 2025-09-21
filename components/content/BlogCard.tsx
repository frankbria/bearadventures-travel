'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  featuredImage: string
  category: string
  author: {
    name: string
    avatar?: string
  }
  publishDate: string
  readTime: string
  slug: string
}

interface BlogCardProps {
  post: BlogPost
  className?: string
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, className }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      const rotateX = -(y / rect.height) * 8
      const rotateY = (x / rect.width) * 8
      setRotation({ x: rotateX, y: rotateY })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn('group perspective-1000', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Card className="relative overflow-hidden bg-background/80 backdrop-blur-sm border-amber-200/20 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="relative h-64 overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 via-orange-500/20 to-amber-600/30 animate-pulse" />
            </div>

            <div className="relative w-full h-full">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className={cn(
                  'object-cover transition-transform duration-700',
                  isHovered ? 'scale-110' : 'scale-100'
                )}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <motion.div
              className="absolute top-4 left-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-amber-500/90 text-amber-900 hover:bg-amber-500 border-amber-400/50 backdrop-blur-sm">
                <Tag className="w-3 h-3 mr-1" />
                {post.category}
              </Badge>
            </motion.div>

            <motion.div
              className="absolute bottom-4 left-4 right-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                {post.title}
              </h3>
            </motion.div>
          </div>

          <CardContent className="p-6 space-y-4">
            <motion.p
              className="text-muted-foreground line-clamp-3 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {post.excerpt}
            </motion.p>

            <motion.div
              className="flex items-center justify-between pt-4 border-t border-amber-200/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-3">
                {post.author.avatar && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="rounded-full object-cover border-2 border-amber-200/30"
                    />
                  </div>
                )}
                <div className="text-sm">
                  <p className="font-medium text-foreground">{post.author.name}</p>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <motion.button
                  className="group/btn w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Read Full Article</span>
                  <motion.div
                    animate={{ x: isHovered ? 4 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </Link>
            </motion.div>
          </CardContent>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 border border-amber-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}