/**
 * Blog Data Access Layer
 * 
 * This module provides a unified interface for accessing blog posts.
 * It supports both Strapi CMS and fallback to local data.
 */

// Import local blog posts (fallback) - always available
import { blogPosts as localBlogPosts } from './blog-data-local'

// Strapi imports are dynamic to avoid build-time errors
let strapiModule: typeof import('./strapi') | null = null

async function getStrapiModule() {
  if (!strapiModule) {
    try {
      strapiModule = await import('./strapi')
    } catch (error) {
      console.warn('Could not load Strapi module:', error)
      return null
    }
  }
  return strapiModule
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  author: {
    name: string
    avatar?: string
  }
  publishDate: string
  readTime: string
  slug: string
  tags: string[]
}

// Configuration: Use Strapi if enabled, otherwise use local data
const USE_STRAPI = process.env.NEXT_PUBLIC_USE_STRAPI === 'true' || process.env.USE_STRAPI === 'true'
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL

/**
 * Check if Strapi is available
 */
function shouldUseStrapi(): boolean {
  if (!USE_STRAPI) return false
  if (!STRAPI_URL) return false
  return true
}

/**
 * Get all blog posts
 * Falls back to local data if Strapi is unavailable
 */
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  if (shouldUseStrapi()) {
    try {
      const strapi = await getStrapiModule()
      if (strapi) {
        const posts = await strapi.fetchBlogPostsFromStrapi(limit)
        if (posts.length > 0) {
          return posts
        }
      }
    } catch (error) {
      console.warn('Strapi unavailable, falling back to local data:', error)
    }
  }
  
  // Fallback to local data
  const posts = localBlogPosts
  return limit ? posts.slice(0, limit) : posts
}

/**
 * Get a blog post by slug
 * Falls back to local data if Strapi is unavailable
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (shouldUseStrapi()) {
    try {
      const strapi = await getStrapiModule()
      if (strapi) {
        const post = await strapi.fetchBlogPostBySlugFromStrapi(slug)
        if (post) {
          return post
        }
      }
    } catch (error) {
      console.warn('Strapi unavailable, falling back to local data:', error)
    }
  }
  
  // Fallback to local data
  return localBlogPosts.find(post => post.slug === slug)
}

/**
 * Get blog posts by category
 * Falls back to local data if Strapi is unavailable
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  if (shouldUseStrapi()) {
    try {
      const strapi = await getStrapiModule()
      if (strapi) {
        const posts = await strapi.fetchBlogPostsByCategoryFromStrapi(category)
        if (posts.length > 0) {
          return posts
        }
      }
    } catch (error) {
      console.warn('Strapi unavailable, falling back to local data:', error)
    }
  }
  
  // Fallback to local data
  return localBlogPosts.filter(
    post => post.category.toLowerCase() === category.toLowerCase()
  )
}

/**
 * Get featured blog posts
 * Falls back to local data if Strapi is unavailable
 */
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  if (shouldUseStrapi()) {
    try {
      const strapi = await getStrapiModule()
      if (strapi) {
        const posts = await strapi.fetchFeaturedBlogPostsFromStrapi(limit)
        if (posts.length > 0) {
          return posts
        }
      }
    } catch (error) {
      console.warn('Strapi unavailable, falling back to local data:', error)
    }
  }
  
  // Fallback to local data - get first posts or featured category
  const featured = localBlogPosts.filter(
    post => post.category === 'Featured'
  )
  return featured.length > 0 
    ? featured.slice(0, limit)
    : localBlogPosts.slice(0, limit)
}

// Export local posts array for backward compatibility (synchronous access)
export const blogPosts = localBlogPosts
