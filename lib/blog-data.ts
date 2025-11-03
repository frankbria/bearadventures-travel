/**
 * Blog Data Access Layer
 * 
 * This module provides a unified interface for accessing blog posts.
 * It supports both Strapi CMS and fallback to local data.
 */

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

// Import local blog posts (fallback) - always available
import { blogPosts as localBlogPosts } from './blog-data-local'

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
 * Dynamically import Strapi module only when needed
 * This function is only called when Strapi is actually enabled
 */
async function getStrapiFunctions() {
  // Only try to load if Strapi is configured
  if (!shouldUseStrapi()) {
    return null
  }
  
  try {
    // Dynamic import - this is safe because it's inside an async function
    // and only called when Strapi is actually configured
    // Use a function import to avoid static analysis issues
    const strapiModule = await import('./strapi' + '.ts')
    if (!strapiModule) return null
    
    return {
      fetchBlogPostsFromStrapi: strapiModule.fetchBlogPostsFromStrapi,
      fetchBlogPostBySlugFromStrapi: strapiModule.fetchBlogPostBySlugFromStrapi,
      fetchBlogPostsByCategoryFromStrapi: strapiModule.fetchBlogPostsByCategoryFromStrapi,
      fetchFeaturedBlogPostsFromStrapi: strapiModule.fetchFeaturedBlogPostsFromStrapi,
    }
  } catch (error) {
    // Silently fail - will use local data
    console.warn('Strapi module not available:', error)
    return null
  }
}

/**
 * Get all blog posts
 * Falls back to local data if Strapi is unavailable
 */
export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  if (shouldUseStrapi()) {
    try {
      const strapi = await getStrapiFunctions()
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
      const strapi = await getStrapiFunctions()
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
      const strapi = await getStrapiFunctions()
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
 * Get featured blog posts (synchronous version for static generation)
 * Falls back to local data if Strapi is unavailable
 */
export function getFeaturedBlogPostsSync(limit: number = 3): BlogPost[] {
  const featured = localBlogPosts.filter(
    post => post.category === 'Featured'
  )
  
  if (featured.length > 0) {
    return featured.slice(0, limit)
  }
  
  return localBlogPosts.slice(0, limit)
}

/**
 * Get featured blog posts (async wrapper for future Strapi integration)
 * Currently uses synchronous version for static generation compatibility
 */
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  // For static generation, use synchronous version
  return Promise.resolve(getFeaturedBlogPostsSync(limit))
}

// Export local posts array for backward compatibility (synchronous access)
export const blogPosts = localBlogPosts
