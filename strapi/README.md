# Strapi Integration for Bear Adventures Travel

## Overview

This directory contains Strapi CMS configuration and migration files for the Bear Adventures Travel website.

## Structure

```
strapi/
├── schemas/
│   └── blog-post.schema.json    # Strapi content type schema for blog posts
├── scripts/
│   └── migrate-to-strapi.ts     # Script to migrate local blog data to Strapi
└── README.md                     # This file
```

## Installation

### 1. Install Strapi

```bash
# In your project root or separate Strapi directory
npx create-strapi-app@latest bearadventures-strapi --quickstart
```

Or use an existing Strapi instance.

### 2. Import Schema

1. Start your Strapi instance
2. Go to Content-Type Builder
3. Import `strapi/schemas/blog-post.schema.json`
4. Or manually create the content type with these fields:
   - title (Text)
   - slug (UID, based on title)
   - excerpt (Long text)
   - content (Rich text)
   - featuredImage (Media - Single image)
   - category (Enumeration: Destinations, Featured, Tips & Tricks, Luxury Travel)
   - tags (JSON)
   - publishDate (Date)
   - readTime (Text)
   - authorName (Text)
   - authorAvatar (Media - Single image)
   - seoTitle (Text, optional)
   - seoDescription (Long text, optional)
   - seoKeywords (JSON, optional)

### 3. Configure Permissions

1. Go to Settings > Users & Permissions Plugin > Roles > Public
2. Enable `find` and `findOne` for Blog Post
3. Save

### 4. Set Environment Variables

Add to your `.env.local` or `.env.production`:

```env
# Strapi Configuration
NEXT_PUBLIC_USE_STRAPI=true
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
# or for production:
# NEXT_PUBLIC_STRAPI_URL=https://strapi.bearadventures.travel

# Optional: API Token for private endpoints
STRAPI_API_TOKEN=your_api_token_here
```

### 5. Migrate Content

Run the migration script to import existing blog posts:

```bash
npx tsx strapi/scripts/migrate-to-strapi.ts
```

## Next.js Integration

The Next.js app automatically uses Strapi when:

- `NEXT_PUBLIC_USE_STRAPI=true` is set
- `NEXT_PUBLIC_STRAPI_URL` is configured
- Strapi API is accessible

If Strapi is unavailable, the app falls back to local data (`lib/blog-data-local.ts`).

## API Endpoints

The integration uses these Strapi endpoints:

- `GET /api/blog-posts` - Get all blog posts
- `GET /api/blog-posts?filters[slug][$eq]={slug}` - Get post by slug
- `GET /api/blog-posts?filters[category][$eq]={category}` - Get posts by category

## Content Structure

### Blog Post Fields

- **title**: Post title
- **slug**: URL-friendly identifier (auto-generated from title)
- **excerpt**: Short summary for listings
- **content**: Full blog post content (Rich text - HTML)
- **featuredImage**: Main image for the post
- **category**: One of: Destinations, Featured, Tips & Tricks, Luxury Travel
- **tags**: Array of tag strings
- **publishDate**: When the post was published
- **readTime**: Estimated reading time (e.g., "5 min read")
- **authorName**: Author display name
- **authorAvatar**: Author profile image
- **seoTitle**: SEO title (optional, defaults to title)
- **seoDescription**: SEO description (optional)
- **seoKeywords**: SEO keywords array (optional)

## Migration from Local Data

See `strapi/scripts/migrate-to-strapi.ts` for the migration script.

The script will:

1. Read blog posts from `lib/blog-data-local.ts`
2. Clean HTML content (remove WordPress artifacts)
3. Upload images to Strapi
4. Create blog post entries in Strapi

## Development Workflow

1. **Local Development**: Use local data (default)
2. **Strapi Development**: Set `NEXT_PUBLIC_USE_STRAPI=true` with local Strapi
3. **Production**: Use production Strapi instance

## Troubleshooting

### Strapi Not Available

The app automatically falls back to local data. Check console for warnings.

### Images Not Loading

- Ensure Strapi media library is publicly accessible
- Check `NEXT_PUBLIC_STRAPI_URL` is correct
- Verify image URLs in Strapi response

### API Errors

- Check Strapi permissions (Public role)
- Verify API URL is correct
- Check CORS settings in Strapi if accessing from different domain
