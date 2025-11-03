/**
 * Strapi API Integration
 * 
 * Provides functions to fetch content from Strapi CMS
 */

export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface StrapiBlogPost {
  id: number
  attributes: {
    title: string
    slug: string
    excerpt: string
    content: string
    category: 'Destinations' | 'Featured' | 'Tips & Tricks' | 'Luxury Travel'
    tags: string[]
    publishDate: string
    readTime: string
    authorName: string
    authorAvatar?: {
      data: {
        attributes: {
          url: string
          alternativeText?: string
        }
      } | null
    }
    featuredImage?: {
      data: {
        attributes: {
          url: string
          alternativeText?: string
          width?: number
          height?: number
        }
      } | null
    }
    seoTitle?: string
    seoDescription?: string
    seoKeywords?: string[]
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

// Strapi configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || 'http://localhost:1337'
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

/**
 * Get Strapi API URL
 */
function getStrapiUrl(path: string): string {
  const baseUrl = STRAPI_URL.replace(/\/$/, '')
  const apiPath = path.startsWith('/') ? path : `/${path}`
  return `${baseUrl}/api${apiPath}`
}

/**
 * Fetch from Strapi API with error handling
 */
async function fetchStrapi<T>(path: string, options?: RequestInit): Promise<StrapiResponse<T>> {
  const url = getStrapiUrl(path)
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  }
  
  // Add API token if available
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`
  }
  
  try {
    // Use global fetch (available in Node.js 18+ and browsers)
    const response = await fetch(url, {
      ...options,
      headers: headers as HeadersInit,
      next: { revalidate: 60 }, // Revalidate every 60 seconds (Next.js cache)
    })
    
    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching from Strapi (${url}):`, error)
    throw error
  }
}

/**
 * Convert Strapi image to local URL
 */
function getImageUrl(image: StrapiBlogPost['attributes']['featuredImage']): string {
  if (!image?.data) {
    return '/images/blog/default-featured.jpg'
  }
  
  const url = image.data.attributes.url
  // If it's a full URL, return as-is
  if (url.startsWith('http')) {
    return url
  }
  
  // Otherwise, prepend Strapi URL
  const baseUrl = STRAPI_URL.replace(/\/$/, '')
  return `${baseUrl}${url}`
}

/**
 * Convert Strapi avatar to local URL
 */
function getAvatarUrl(avatar: StrapiBlogPost['attributes']['authorAvatar']): string {
  if (!avatar?.data) {
    return '/images/team/frank-avatar.jpg'
  }
  
  const url = avatar.data.attributes.url
  // If it's a full URL, return as-is
  if (url.startsWith('http')) {
    return url
  }
  
  // Otherwise, prepend Strapi URL
  const baseUrl = STRAPI_URL.replace(/\/$/, '')
  return `${baseUrl}${url}`
}

/**
 * Convert Strapi blog post to app format
 */
export function convertStrapiPost(strapiPost: StrapiBlogPost) {
  return {
    id: strapiPost.id.toString(),
    title: strapiPost.attributes.title,
    slug: strapiPost.attributes.slug,
    excerpt: strapiPost.attributes.excerpt,
    content: strapiPost.attributes.content,
    featuredImage: getImageUrl(strapiPost.attributes.featuredImage),
    category: strapiPost.attributes.category,
    tags: strapiPost.attributes.tags || [],
    publishDate: new Date(strapiPost.attributes.publishDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    readTime: strapiPost.attributes.readTime || '5 min read',
    author: {
      name: strapiPost.attributes.authorName || 'Frank',
      avatar: getAvatarUrl(strapiPost.attributes.authorAvatar),
    },
  }
}

/**
 * Fetch all blog posts from Strapi
 */
export async function fetchBlogPostsFromStrapi(limit?: number) {
  try {
    const queryParams = new URLSearchParams({
      'populate': 'featuredImage,authorAvatar',
      'sort': 'publishDate:desc',
      'pagination[limit]': limit ? limit.toString() : '100',
    })
    
    const response = await fetchStrapi<StrapiBlogPost[]>(`/blog-posts?${queryParams}`)
    return response.data.map(convertStrapiPost)
  } catch (error) {
    console.error('Error fetching blog posts from Strapi:', error)
    // Return empty array on error (graceful degradation)
    return []
  }
}

/**
 * Fetch a single blog post by slug from Strapi
 */
export async function fetchBlogPostBySlugFromStrapi(slug: string) {
  try {
    const queryParams = new URLSearchParams({
      'populate': 'featuredImage,authorAvatar',
      'filters[slug][$eq]': slug,
    })
    
    const response = await fetchStrapi<StrapiBlogPost[]>(`/blog-posts?${queryParams}`)
    
    if (!response.data || response.data.length === 0) {
      return null
    }
    
    return convertStrapiPost(response.data[0])
  } catch (error) {
    console.error(`Error fetching blog post (${slug}) from Strapi:`, error)
    return null
  }
}

/**
 * Fetch blog posts by category from Strapi
 */
export async function fetchBlogPostsByCategoryFromStrapi(category: string) {
  try {
    const queryParams = new URLSearchParams({
      'populate': 'featuredImage,authorAvatar',
      'filters[category][$eq]': category,
      'sort': 'publishDate:desc',
    })
    
    const response = await fetchStrapi<StrapiBlogPost[]>(`/blog-posts?${queryParams}`)
    return response.data.map(convertStrapiPost)
  } catch (error) {
    console.error(`Error fetching blog posts by category (${category}) from Strapi:`, error)
    return []
  }
}

/**
 * Fetch featured blog posts from Strapi
 */
export async function fetchFeaturedBlogPostsFromStrapi(limit: number = 3) {
  try {
    const queryParams = new URLSearchParams({
      'populate': 'featuredImage,authorAvatar',
      'filters[category][$eq]': 'Featured',
      'sort': 'publishDate:desc',
      'pagination[limit]': limit.toString(),
    })
    
    const response = await fetchStrapi<StrapiBlogPost[]>(`/blog-posts?${queryParams}`)
    return response.data.map(convertStrapiPost)
  } catch (error) {
    console.error('Error fetching featured blog posts from Strapi:', error)
    return []
  }
}

