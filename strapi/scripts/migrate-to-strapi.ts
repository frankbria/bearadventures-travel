/**
 * Migration Script: Local Blog Data → Strapi
 * 
 * This script migrates blog posts from lib/blog-data-local.ts to Strapi CMS
 * 
 * Usage:
 *  1. Start your Strapi instance
 *  2. Set environment variables:
 *     - STRAPI_URL (default: http://localhost:1337)
 *     - STRAPI_API_TOKEN (optional, for authenticated requests)
 *  3. Run: npx tsx strapi/scripts/migrate-to-strapi.ts
 */

import fs from 'fs';
import path from 'path';
import { blogPosts } from '../../lib/blog-data-local';

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

interface StrapiBlogPost {
  data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    publishDate: string;
    readTime: string;
    authorName: string;
    featuredImage?: number;
    authorAvatar?: number;
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];
  };
}

/**
 * Upload image to Strapi and return media ID
 */
async function uploadImageToStrapi(imageUrl: string): Promise<number | null> {
  try {
    // Handle local images
    if (imageUrl.startsWith('/')) {
      const imagePath = path.join(process.cwd(), 'public', imageUrl);
      
      if (!fs.existsSync(imagePath)) {
        console.warn(`Image not found: ${imagePath}`);
        return null;
      }
      
      const formData = new FormData();
      const file = fs.readFileSync(imagePath);
      const blob = new Blob([file]);
      const filename = path.basename(imagePath);
      
      formData.append('files', blob, filename);
      formData.append('ref', 'api::blog-post.blog-post');
      formData.append('refId', '1');
      formData.append('field', 'featuredImage');
      
      const headers: HeadersInit = {
        'Authorization': STRAPI_API_TOKEN ? `Bearer ${STRAPI_API_TOKEN}` : '',
      };
      
      const response = await fetch(`${STRAPI_URL}/api/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        console.error(`Failed to upload image: ${response.statusText}`);
        return null;
      }
      
      const data = await response.json();
      return data[0]?.id || null;
    }
    
    // Handle remote images (download first)
    console.warn(`Remote image download not implemented: ${imageUrl}`);
    return null;
  } catch (error) {
    console.error(`Error uploading image ${imageUrl}:`, error);
    return null;
  }
}

/**
 * Create blog post in Strapi
 */
async function createBlogPostInStrapi(post: typeof blogPosts[0]): Promise<boolean> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }
    
    // Upload featured image if it exists
    let featuredImageId: number | null = null;
    if (post.featuredImage && post.featuredImage !== '/images/blog/default-featured.jpg') {
      featuredImageId = await uploadImageToStrapi(post.featuredImage);
      if (featuredImageId) {
        console.log(`  ✓ Uploaded featured image: ${post.featuredImage}`);
      }
    }
    
    // Upload author avatar if it exists
    let authorAvatarId: number | null = null;
    if (post.author.avatar && post.author.avatar !== '/images/team/frank-avatar.jpg') {
      authorAvatarId = await uploadImageToStrapi(post.author.avatar);
      if (authorAvatarId) {
        console.log(`  ✓ Uploaded author avatar: ${post.author.avatar}`);
      }
    }
    
    // Parse publish date
    const publishDate = new Date(post.publishDate);
    
    // Create Strapi blog post data
    const strapiPost: StrapiBlogPost = {
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content, // HTML content
        category: post.category,
        tags: post.tags,
        publishDate: publishDate.toISOString(),
        readTime: post.readTime,
        authorName: post.author.name,
        featuredImage: featuredImageId || undefined,
        authorAvatar: authorAvatarId || undefined,
      },
    };
    
    // Create post in Strapi
    const response = await fetch(`${STRAPI_URL}/api/blog-posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(strapiPost),
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`Failed to create post "${post.title}":`, error);
      return false;
    }
    
    const created = await response.json();
    console.log(`  ✓ Created: ${post.title} (ID: ${created.data.id})`);
    return true;
  } catch (error) {
    console.error(`Error creating post "${post.title}":`, error);
    return false;
  }
}

/**
 * Check if post already exists in Strapi
 */
async function postExistsInStrapi(slug: string): Promise<boolean> {
  try {
    const headers: HeadersInit = {};
    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }
    
    const response = await fetch(
      `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}`,
      { headers }
    );
    
    if (!response.ok) return false;
    
    const data = await response.json();
    return data.data && data.data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Main migration function
 */
async function migrateToStrapi() {
  console.log('🚀 Starting migration to Strapi...\n');
  console.log(`Strapi URL: ${STRAPI_URL}`);
  console.log(`Posts to migrate: ${blogPosts.length}\n`);
  
  // Check Strapi connection
  try {
    const testResponse = await fetch(`${STRAPI_URL}/api/blog-posts?pagination[limit]=1`);
    if (!testResponse.ok) {
      console.error('❌ Cannot connect to Strapi. Is it running?');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Cannot connect to Strapi:', error);
    process.exit(1);
  }
  
  console.log('✓ Connected to Strapi\n');
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  
  for (const post of blogPosts) {
    console.log(`Processing: ${post.title}`);
    
    // Check if already exists
    const exists = await postExistsInStrapi(post.slug);
    if (exists) {
      console.log(`  ⊘ Already exists, skipping`);
      skipCount++;
      continue;
    }
    
    const success = await createBlogPostInStrapi(post);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n✅ Migration complete!');
  console.log(`   Created: ${successCount}`);
  console.log(`   Skipped: ${skipCount}`);
  console.log(`   Errors: ${errorCount}`);
}

// Run migration
if (require.main === module) {
  migrateToStrapi().catch(console.error);
}

export { migrateToStrapi };

