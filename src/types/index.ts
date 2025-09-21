// WordPress content types for migration
export interface WordPressPost {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  date: string
  modified: string
  status: 'publish' | 'draft' | 'private'
  categories: string[]
  tags: string[]
  featuredImage?: string
  author: string
  meta: Record<string, unknown>
}

export interface WordPressPage {
  id: number
  title: string
  content: string
  slug: string
  date: string
  modified: string
  status: 'publish' | 'draft' | 'private'
  parent?: number
  template?: string
  featuredImage?: string
  meta: Record<string, unknown>
}

export interface MediaAsset {
  id: number
  url: string
  title: string
  alt: string
  caption: string
  description: string
  mimeType: string
  width?: number
  height?: number
  sizes?: Record<string, { url: string; width: number; height: number }>
}

// React component types
export interface NavigationItem {
  label: string
  href: string
  children?: NavigationItem[]
}

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
}