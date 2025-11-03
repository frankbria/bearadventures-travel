# WordPress Blog Post Extraction Guide

## Overview

This guide explains how to extract blog posts from the WordPress site at https://bearadventures.travel and integrate them into the Next.js application.

## Prerequisites

- Access to WordPress REST API (usually available at `/wp-json/wp/v2/posts`)
- Node.js and npm installed locally
- TypeScript support (`tsx` or `ts-node`)

## WordPress REST API

The WordPress REST API should be accessible at:

```
https://bearadventures.travel/wp-json/wp/v2/posts
```

To test if the API is available:

```bash
curl https://bearadventures.travel/wp-json/wp/v2/posts?per_page=1
```

## Extraction Methods

### Method 1: Automated Script (Recommended)

Use the provided extraction script:

```bash
# Install dependencies if needed
npm install tsx --save-dev

# Update WORDPRESS_URL in scripts/extract-wordpress-blog.ts if needed
# Then run:
npx tsx scripts/extract-wordpress-blog.ts
```

The script will:

1. Fetch posts from WordPress REST API
2. Convert them to the required format
3. Generate TypeScript code
4. Create `extracted-blog-posts.ts` and `extracted-blog-posts.json`

### Method 2: Manual Extraction

1. Access WordPress admin or use REST API directly
2. Export posts via WordPress export tool
3. Convert XML/JSON to TypeScript format manually

### Method 3: WordPress Plugin Export

Use a WordPress export plugin that outputs JSON format compatible with the script.

## Blog Post Format Requirements

Each blog post needs:

```typescript
{
  id: string,              // Unique identifier
  title: string,          // Post title (HTML stripped)
  excerpt: string,        // Short excerpt (HTML stripped)
  content: string,        // Full content (HTML preserved)
  featuredImage: string,  // Image path/URL
  category: string,       // Category name
  author: {
    name: string,        // Author name
    avatar?: string      // Author avatar URL
  },
  publishDate: string,    // Formatted date
  readTime: string,       // Calculated read time
  slug: string,          // URL slug
  tags: string[]         // Array of tag names
}
```

## Extraction Process

### Step 1: Run Extraction Script

```bash
npx tsx scripts/extract-wordpress-blog.ts
```

### Step 2: Review Extracted Posts

Check the generated files:

- `extracted-blog-posts.ts` - TypeScript format
- `extracted-blog-posts.json` - JSON format for inspection

### Step 3: Select Posts to Keep

Focus on:

- **Quality content** that aligns with Bear Adventures brand
- **LGBTQ+ travel** focused posts
- **Destination guides** and travel tips
- **Recent and relevant** posts

Keep existing sample posts that are high quality:

- Costa Rica guide (already good)
- Iceland guide (already good)
- Barcelona guide (already good)

### Step 4: Integrate into lib/blog-data.ts

1. Open `extracted-blog-posts.ts`
2. Copy relevant posts
3. Paste into `lib/blog-data.ts` replacing or adding to existing array
4. Ensure no duplicate IDs
5. Verify image paths are correct

### Step 5: Download and Optimize Images

1. Check `featuredImage` URLs in extracted posts
2. Download images from WordPress media library
3. Optimize images (compress, resize if needed)
4. Upload to `/public/images/blog/`
5. Update image paths in blog data

## Image Handling

### Downloading Featured Images

If images are on WordPress:

```bash
# Example: Download from WordPress media URL
curl -o public/images/blog/post-slug.jpg "https://bearadventures.travel/wp-content/uploads/..."
```

### Image Optimization

Use tools like:

- ImageOptim
- Squoosh
- Next.js Image optimization (automatic)

### Image Paths

Update image paths to match local structure:

- WordPress URL: `https://bearadventures.travel/wp-content/uploads/2024/03/image.jpg`
- Local path: `/images/blog/image.jpg`

## Category Mapping

Update category mapping in the extraction script:

```typescript
const CATEGORY_MAP: Record<number, string> = {
  // WordPress category ID => Display name
  1: 'Destinations',
  2: 'Featured',
  3: 'Tips & Tricks',
  4: 'Luxury Travel',
  // Add more as needed
};
```

To find category IDs:

```bash
curl https://bearadventures.travel/wp-json/wp/v2/categories
```

## Content Adaptation

Since front page and travel planning pages will be adapted (not 100% copy), focus extraction on:

### Priority Content Types:

1. **Blog Posts** - Main focus ✅
2. **Destination Guides** - Keep for reference
3. **Travel Tips** - Keep for reference

### Content That Will Be Adapted (Not Direct Copy):

- Homepage hero content
- Travel planning page content
- Form content

These will be redesigned for the new site architecture.

## Troubleshooting

### API Not Accessible

- Check if WordPress REST API is enabled
- Verify URL is correct
- Check for security plugins blocking API

### Missing Images

- Download images manually from WordPress
- Use placeholder images temporarily
- Update paths in blog data

### Content Format Issues

- HTML in WordPress may need cleanup
- Remove WordPress-specific shortcodes
- Clean up embedded media references

## Post-Extraction Checklist

- [ ] Posts extracted and reviewed
- [ ] Quality content selected (5-10 posts)
- [ ] Integrated into `lib/blog-data.ts`
- [ ] Images downloaded and optimized
- [ ] Image paths updated
- [ ] Categories mapped correctly
- [ ] Tags extracted
- [ ] Read times calculated
- [ ] Dates formatted correctly
- [ ] Slug structure preserved
- [ ] Test blog pages load correctly
- [ ] SEO metadata included

## Example Extraction Workflow

```bash
# 1. Test WordPress API
curl "https://bearadventures.travel/wp-json/wp/v2/posts?per_page=1" | jq

# 2. Run extraction
npx tsx scripts/extract-wordpress-blog.ts

# 3. Review output
cat extracted-blog-posts.json | jq '.[0]'

# 4. Edit lib/blog-data.ts and add extracted posts

# 5. Download images
mkdir -p public/images/blog
# Download each featured image

# 6. Test locally
npm run dev
# Visit http://localhost:3000/blog
```

## Next Steps After Extraction

1. ✅ Verify blog posts display correctly
2. ✅ Test individual post pages
3. ✅ Check image loading
4. ✅ Verify SEO metadata
5. ✅ Test blog search/filter
6. ✅ Update sitemap with new posts

---

**Note:** Focus on blog content extraction. Homepage and planning pages will be adapted/redesigned rather than copied directly.
