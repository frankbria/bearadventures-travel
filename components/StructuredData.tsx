/**
 * Structured Data (JSON-LD) Component
 * Adds schema.org structured data for SEO
 */

import { siteConfig } from '@/lib/site-config'

interface StructuredDataProps {
  type: 'Organization' | 'BlogPost' | 'Article' | 'Website'
  data?: Record<string, any>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteConfig.title,
          url: siteConfig.url,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}${siteConfig.logo.light}`,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            email: siteConfig.contact.email,
            contactType: 'Customer Service',
          },
          sameAs: [
            siteConfig.social.facebook,
            siteConfig.social.instagram,
            siteConfig.social.twitter,
          ],
          description: siteConfig.description,
        }

      case 'Website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteConfig.title,
          url: siteConfig.url,
          description: siteConfig.description,
          publisher: {
            '@type': 'Organization',
            name: siteConfig.title,
          },
        }

      case 'BlogPost':
      case 'Article':
        if (!data) return null
        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          description: data.excerpt,
          image: data.featuredImage?.startsWith('http')
            ? data.featuredImage
            : `${siteConfig.url}${data.featuredImage}`,
          datePublished: data.publishDate,
          author: {
            '@type': 'Person',
            name: data.author?.name || 'Frank',
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.title,
            logo: {
              '@type': 'ImageObject',
              url: `${siteConfig.url}${siteConfig.logo.light}`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${siteConfig.url}/blog/${data.slug}`,
          },
        }

      default:
        return null
    }
  }

  const structuredData = getStructuredData()

  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Organization structured data (add to layout)
export function OrganizationStructuredData() {
  return <StructuredData type="Organization" />
}

// Website structured data (add to layout)
export function WebsiteStructuredData() {
  return <StructuredData type="Website" />
}

// Blog post structured data (add to blog post pages)
export function BlogPostStructuredData({ post }: { post: any }) {
  return <StructuredData type="BlogPost" data={post} />
}

