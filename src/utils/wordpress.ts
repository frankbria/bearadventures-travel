import type { WordPressPost, MediaAsset } from '@/types'

/**
 * Utility functions for WordPress content migration
 * These will be used during Phase 1: Content Extraction
 */

export const parseWordPressContent = (htmlContent: string): string => {
  // Clean up WordPress-specific HTML and convert to React-friendly format
  return htmlContent
    .replace(/\[caption[^\]]*\]/g, '') // Remove caption shortcodes
    .replace(/\[\/caption\]/g, '')
    .replace(/\[gallery[^\]]*\]/g, '') // Remove gallery shortcodes
    .replace(/\[embed[^\]]*\]/g, '') // Remove embed shortcodes
    .replace(/\[\/embed\]/g, '')
}

export const extractFeaturedImage = (post: WordPressPost): string | null => {
  return post.featuredImage || null
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const optimizeMediaUrl = (mediaAsset: MediaAsset, size: 'thumbnail' | 'medium' | 'large' | 'full' = 'full'): string => {
  if (size === 'full' || !mediaAsset.sizes) {
    return mediaAsset.url
  }

  return mediaAsset.sizes[size]?.url || mediaAsset.url
}