/**
 * WordPress Blog Post Extraction Script
 * 
 * Extracts blog posts from WordPress site and converts to TypeScript format
 * 
 * Usage:
 * 1. Get WordPress REST API endpoint URL
 * 2. Run: npx tsx scripts/extract-wordpress-blog.ts
 * 3. Review output and integrate into lib/blog-data.ts
 */

import fs from 'fs';
import path from 'path';

interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, any>;
  categories: number[];
  tags: number[];
  _links: Record<string, any>;
  acf?: Record<string, any>; // Advanced Custom Fields if available
}

interface WordPressMedia {
  id: number;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, any>;
  };
  alt_text: string;
  caption: {
    rendered: string;
  };
  description: {
    rendered: string;
  };
}

interface ExtractedBlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishDate: string;
  readTime: string;
  slug: string;
  tags: string[];
}

// WordPress site URL - UPDATE THIS
const WORDPRESS_URL = 'https://bearadventures.travel';
const WORDPRESS_API = `${WORDPRESS_URL}/wp-json/wp/v2`;

// Category ID to name mapping (update based on your WordPress categories)
const CATEGORY_MAP: Record<number, string> = {
  1: 'Destinations',
  2: 'Featured',
  3: 'Tips & Tricks',
  4: 'Luxury Travel',
};

// Function to strip HTML tags
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

// Function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = stripHtml(content).split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Function to extract featured image URL
async function getFeaturedImageUrl(mediaId: number, embedded?: any): Promise<string> {
  if (!mediaId) return '/images/blog/default-featured.jpg';
  
  // If we have embedded media data, use it (no extra API call needed)
  if (embedded && embedded['wp:featuredmedia'] && embedded['wp:featuredmedia'][0]) {
    const media = embedded['wp:featuredmedia'][0];
    const sizes = media.media_details?.sizes;
    
    if (sizes?.large?.source_url) {
      return sizes.large.source_url;
    }
    if (sizes?.medium_large?.source_url) {
      return sizes.medium_large.source_url;
    }
    
    return media.source_url || '/images/blog/default-featured.jpg';
  }
  
  // Fallback to fetching media separately
  try {
    const response = await fetch(`${WORDPRESS_API}/media/${mediaId}`);
    if (!response.ok) return '/images/blog/default-featured.jpg';
    
    const media: WordPressMedia = await response.json();
    
    // Use medium_large or large size if available, otherwise source_url
    const sizes = media.media_details?.sizes;
    if (sizes?.large?.source_url) {
      return sizes.large.source_url;
    }
    if (sizes?.medium_large?.source_url) {
      return sizes.medium_large.source_url;
    }
    
    return media.source_url || '/images/blog/default-featured.jpg';
  } catch (error) {
    console.error(`Error fetching media ${mediaId}:`, error);
    return '/images/blog/default-featured.jpg';
  }
}

// Function to get category name
async function getCategoryName(categoryIds: number[]): Promise<string> {
  if (!categoryIds || categoryIds.length === 0) return 'Featured';
  
  try {
    const categoryId = categoryIds[0];
    if (CATEGORY_MAP[categoryId]) {
      return CATEGORY_MAP[categoryId];
    }
    
    const response = await fetch(`${WORDPRESS_API}/categories/${categoryId}`);
    if (!response.ok) return 'Featured';
    
    const category = await response.json();
    return category.name || 'Featured';
  } catch (error) {
    console.error(`Error fetching category:`, error);
    return 'Featured';
  }
}

// Function to get tag names
async function getTagNames(tagIds: number[]): Promise<string[]> {
  if (!tagIds || tagIds.length === 0) return [];
  
  try {
    const tagPromises = tagIds.slice(0, 5).map(async (tagId) => {
      const response = await fetch(`${WORDPRESS_API}/tags/${tagId}`);
      if (!response.ok) return null;
      const tag = await response.json();
      return tag.name;
    });
    
    const tags = await Promise.all(tagPromises);
    return tags.filter((tag): tag is string => tag !== null);
  } catch (error) {
    console.error(`Error fetching tags:`, error);
    return [];
  }
}

// Function to intelligently extract clean semantic HTML from WordPress content
// Strips WordPress-specific markup and lets the site's design system handle formatting
function cleanWordPressContent(html: string, wordpressUrl: string): string {
  if (!html) return '';
  
  let cleaned = html;
  
  // Step 1: Remove WordPress shortcodes (gallery, embed, etc.)
  cleaned = cleaned.replace(/\[gallery[^\]]*\][^\[]*\[\/gallery\]/gi, '');
  cleaned = cleaned.replace(/\[embed[^\]]*\][^\[]*\[\/embed\]/gi, '');
  cleaned = cleaned.replace(/\[[^\]]+\]/g, '');
  
  // Step 2: Remove WordPress-specific wrapper divs and spans with classes
  // Remove divs/span that only contain WordPress classes
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*wp-[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, '$1');
  cleaned = cleaned.replace(/<span[^>]*class="[^"]*wp-[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  
  // Step 3: Strip ALL classes and IDs from semantic elements (let prose handle styling)
  // Preserve semantic structure but remove all styling attributes
  const semanticTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'strong', 'em', 'a', 'img'];
  semanticTags.forEach(tag => {
    // Remove class and id attributes
    cleaned = cleaned.replace(
      new RegExp(`<${tag}([^>]*?)(?:\\s+(?:class|id)="[^"]*")([^>]*?)>`, 'gi'),
      `<${tag}$1$2>`
    );
    cleaned = cleaned.replace(
      new RegExp(`<${tag}([^>]*?)(?:\\s+(?:class|id)="[^"]*")`, 'gi'),
      `<${tag}$1`
    );
  });
  
  // Step 4: Remove ALL inline styles (let CSS handle styling)
  cleaned = cleaned.replace(/\sstyle="[^"]*"/gi, '');
  
  // Step 5: Handle images intelligently
  // Convert WordPress image URLs to local paths, preserve alt text, remove WordPress attributes
  cleaned = cleaned.replace(
    /<img([^>]*)>/gi,
    (match, attrs) => {
      // Extract src
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      let src = srcMatch ? srcMatch[1] : '';
      
      // Convert WordPress URLs to local paths
      if (src && wordpressUrl && src.includes(wordpressUrl)) {
        const wpContentMatch = src.match(/wp-content\/uploads\/(.+)/i);
        if (wpContentMatch) {
          const filename = wpContentMatch[1].split('/').pop();
          src = `/images/blog/${filename}`;
        }
      }
      
      // Extract alt text
      const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : '';
      
      // Build clean img tag with only essential attributes
      return `<img src="${src}"${alt ? ` alt="${alt.replace(/"/g, '&quot;')}"` : ''}>`;
    }
  );
  
  // Step 6: Clean up links - preserve href but remove WordPress classes
  cleaned = cleaned.replace(
    /<a([^>]*)>/gi,
    (match, attrs) => {
      // Extract href
      const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
      const href = hrefMatch ? hrefMatch[1] : '#';
      
      // Check if external link
      const isExternal = href.startsWith('http') && !href.includes(wordpressUrl.replace(/^https?:\/\//, ''));
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      
      return `<a href="${href}"${target}>`;
    }
  );
  
  // Step 7: Remove empty paragraphs and clean up whitespace
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<p><\/p>/gi, '');
  
  // Step 8: Normalize headings - ensure proper hierarchy
  // Convert h1 in content to h2 (since page already has h1 for title)
  cleaned = cleaned.replace(/<h1([^>]*)>/gi, '<h2$1>');
  cleaned = cleaned.replace(/<\/h1>/gi, '</h2>');
  
  // Step 9: Remove WordPress figure wrappers around images, keep just the img
  cleaned = cleaned.replace(/<figure[^>]*>([\s\S]*?<img[^>]*>[\s\S]*?)<\/figure>/gi, '$1');
  cleaned = cleaned.replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, '');
  
  // Step 10: Remove empty divs and spans
  cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, '');
  cleaned = cleaned.replace(/<span[^>]*>\s*<\/span>/gi, '');
  
  // Step 11: Clean up extra whitespace and line breaks
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/\s+</g, '<'); // Remove whitespace before tags
  cleaned = cleaned.replace(/>\s+/g, '>'); // Remove whitespace after tags
  cleaned = cleaned.replace(/>\s+</g, '><'); // Remove whitespace between tags
  
  // Step 12: Ensure proper spacing around block elements
  cleaned = cleaned.replace(/><(h[1-6]|p|ul|ol|blockquote|pre)/g, '>\n<$1');
  cleaned = cleaned.replace(/(<\/(h[1-6]|p|ul|ol|blockquote|pre|li)>)</g, '$1\n<');
  
  return cleaned.trim();
}

// Function to get author information from embedded data
function getAuthorInfo(embedded?: any): { name: string; avatar?: string } {
  if (embedded && embedded.author && embedded.author[0]) {
    return {
      name: embedded.author[0].name || 'Frank',
      avatar: embedded.author[0].avatar_urls?.['96'] || '/images/team/frank-avatar.jpg',
    };
  }
  return {
    name: 'Frank',
    avatar: '/images/team/frank-avatar.jpg',
  };
}

// Function to convert WordPress post to our format
async function convertWordPressPost(wpPost: WordPressPost & { _embedded?: any }): Promise<ExtractedBlogPost> {
  const embedded = wpPost._embedded;
  
  // Get featured image (prefer embedded data)
  const featuredImage = await getFeaturedImageUrl(
    wpPost.featured_media,
    embedded
  );
  
  // Get category (prefer embedded data)
  let category = 'Featured';
  if (embedded && embedded['wp:term']) {
    const categories = embedded['wp:term'].find((term: any) => term.length > 0 && term[0].taxonomy === 'category');
    if (categories && categories[0]) {
      category = categories[0].name;
    } else {
      category = await getCategoryName(wpPost.categories);
    }
  } else {
    category = await getCategoryName(wpPost.categories);
  }
  
  // Get tags (prefer embedded data)
  let tags: string[] = [];
  if (embedded && embedded['wp:term']) {
    const tagTerms = embedded['wp:term'].find((term: any) => term.length > 0 && term[0].taxonomy === 'post_tag');
    if (tagTerms) {
      tags = tagTerms.map((tag: any) => tag.name).slice(0, 5);
    } else {
      tags = await getTagNames(wpPost.tags);
    }
  } else {
    tags = await getTagNames(wpPost.tags);
  }
  
  // Get author info (prefer embedded data)
  const author = getAuthorInfo(embedded);
  
  // Clean and format the content HTML
  const cleanedContent = cleanWordPressContent(wpPost.content.rendered, WORDPRESS_URL);
  
  return {
    id: wpPost.id.toString(),
    title: stripHtml(wpPost.title.rendered),
    excerpt: stripHtml(wpPost.excerpt.rendered),
    content: cleanedContent, // Cleaned and formatted HTML
    featuredImage: featuredImage,
    category: category,
    author: author,
    publishDate: formatDate(wpPost.date),
    readTime: calculateReadTime(wpPost.content.rendered),
    slug: wpPost.slug,
    tags: tags,
  };
}

// Main extraction function
async function extractBlogPosts(limit: number = 10, useEmbed: boolean = false): Promise<ExtractedBlogPost[]> {
  console.log('Fetching blog posts from WordPress...');
  
  try {
    // Use _embed parameter to get additional data (featured media, author, categories, tags)
    const embedParam = useEmbed ? '&_embed' : '';
    const response = await fetch(
      `${WORDPRESS_API}/posts?per_page=${limit}&status=publish&orderby=date&order=desc${embedParam}`
    );
    
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }
    
    const posts: WordPressPost[] = await response.json();
    console.log(`Found ${posts.length} posts. Converting...`);
    
    const convertedPosts: ExtractedBlogPost[] = [];
    
    for (const post of posts) {
      console.log(`Processing: ${post.title.rendered}`);
      const converted = await convertWordPressPost(post);
      convertedPosts.push(converted);
    }
    
    return convertedPosts;
  } catch (error) {
    console.error('Error extracting blog posts:', error);
    throw error;
  }
}

// Generate TypeScript code for blog posts
function generateTypeScriptCode(posts: ExtractedBlogPost[]): string {
  const postsCode = posts.map((post) => {
    // Escape quotes in strings
    const escapeString = (str: string) => str.replace(/'/g, "\\'").replace(/\n/g, '\\n');
    const escapeHtml = (html: string) => html.replace(/'/g, "\\'").replace(/`/g, '\\`').replace(/\n/g, '\\n');
    
    return `  {
    id: '${post.id}',
    title: '${escapeString(post.title)}',
    excerpt: '${escapeString(post.excerpt)}',
    content: \`
${post.content.split('\n').map(line => '      ' + line).join('\n')}
    \`,
    featuredImage: '${post.featuredImage}',
    category: '${post.category}',
    author: {
      name: '${post.author.name}',
      avatar: '${post.author.avatar || ''}'
    },
    publishDate: '${post.publishDate}',
    readTime: '${post.readTime}',
    slug: '${post.slug}',
    tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}]
  }`;
  }).join(',\n\n');
  
  return `export const blogPosts: BlogPost[] = [\n${postsCode}\n]`;
}

// Main execution
async function main() {
  try {
    // Use _embed=true to get full embedded data (recommended)
    const posts = await extractBlogPosts(10, true);
    
    // Generate TypeScript code
    const tsCode = generateTypeScriptCode(posts);
    
    // Write to output file
    const outputPath = path.join(process.cwd(), 'extracted-blog-posts.ts');
    fs.writeFileSync(outputPath, `// Extracted WordPress Blog Posts\n// Generated: ${new Date().toISOString()}\n\n${tsCode}\n`);
    
    console.log(`\n✅ Successfully extracted ${posts.length} blog posts`);
    console.log(`📄 Output written to: ${outputPath}`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Review the extracted posts in ${outputPath}`);
    console.log(`2. Copy relevant posts to lib/blog-data.ts`);
    console.log(`3. Download and optimize featured images`);
    console.log(`4. Update image paths if needed`);
    
    // Also output JSON for easier inspection
    const jsonPath = path.join(process.cwd(), 'extracted-blog-posts.json');
    fs.writeFileSync(jsonPath, JSON.stringify(posts, null, 2));
    console.log(`📄 JSON output written to: ${jsonPath}`);
    
  } catch (error) {
    console.error('Extraction failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { extractBlogPosts, convertWordPressPost };

