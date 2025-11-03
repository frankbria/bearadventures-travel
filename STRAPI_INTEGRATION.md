# Strapi Integration Guide

## Overview

The Bear Adventures Travel website now supports Strapi CMS for blog content management. The integration provides:

- ✅ **Flexible Content Management**: Edit blog posts through Strapi admin panel
- ✅ **Automatic Fallback**: Falls back to local data if Strapi is unavailable
- ✅ **Migration Tools**: Scripts to migrate existing content to Strapi
- ✅ **SEO Support**: Full support for SEO fields in Strapi

## Project Structure

```
├── lib/
│   ├── strapi.ts                    # Strapi API integration functions
│   ├── blog-data.ts                 # Unified blog data access layer
│   └── blog-data-local.ts           # Local fallback data (migrated from blog-data.ts)
├── strapi/
│   ├── schemas/
│   │   └── blog-post.schema.json    # Strapi content type schema
│   ├── scripts/
│   │   └── migrate-to-strapi.ts     # Migration script
│   └── README.md                    # Strapi setup guide
└── app/
    ├── blog/
    │   ├── page.tsx                 # Blog listing (updated for async)
    │   └── [slug]/
    │       └── page.tsx             # Blog post page (updated for async)
    └── page.tsx                     # Homepage (updated for async)
```

## How It Works

### 1. Data Access Layer (`lib/blog-data.ts`)

The unified access layer automatically chooses between Strapi and local data:

```typescript
// Automatically uses Strapi if enabled, otherwise local data
const posts = await getBlogPosts();
const post = await getBlogPostBySlug('post-slug');
const featured = await getFeaturedBlogPosts(3);
```

**Decision Logic:**

- Checks `NEXT_PUBLIC_USE_STRAPI=true`
- Checks `NEXT_PUBLIC_STRAPI_URL` is configured
- Attempts to fetch from Strapi
- Falls back to `lib/blog-data-local.ts` on error

### 2. Strapi Integration (`lib/strapi.ts`)

Handles all Strapi API communication:

- Fetches blog posts with populated images
- Converts Strapi format to app format
- Handles image URLs (local or remote)
- Manages API authentication

### 3. Local Data (`lib/blog-data-local.ts`)

Preserved as fallback and for migration:

- Original blog posts remain available
- Used when Strapi is unavailable
- Can be migrated to Strapi using migration script

## Setup Instructions

### Step 1: Install Strapi

```bash
# Create new Strapi project (or use existing)
npx create-strapi-app@latest bearadventures-strapi --quickstart
```

### Step 2: Create Blog Post Content Type

1. **Option A: Import Schema** (recommended)

   - Copy `strapi/schemas/blog-post.schema.json` to Strapi
   - Import via Content-Type Builder

2. **Option B: Manual Creation**
   - Create "Blog Post" content type
   - Add fields as defined in schema:
     - title (Text, required)
     - slug (UID, based on title)
     - excerpt (Long text)
     - content (Rich text)
     - featuredImage (Media)
     - category (Enumeration)
     - tags (JSON)
     - publishDate (Date)
     - readTime (Text)
     - authorName (Text)
     - authorAvatar (Media)
     - seoTitle, seoDescription, seoKeywords (optional)

### Step 3: Configure Permissions

1. Go to **Settings > Users & Permissions Plugin > Roles > Public**
2. Enable:
   - `blog-post.find`
   - `blog-post.findOne`
3. Save

### Step 4: Configure Environment Variables

Add to `.env.local` (development) or `.env.production`:

```env
# Enable Strapi
NEXT_PUBLIC_USE_STRAPI=true

# Strapi URL
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
# Production example:
# NEXT_PUBLIC_STRAPI_URL=https://strapi.bearadventures.travel

# Optional: API Token for authenticated requests
STRAPI_API_TOKEN=your_api_token_here
```

### Step 5: Migrate Existing Content

```bash
# Run migration script
npx tsx strapi/scripts/migrate-to-strapi.ts
```

This will:

- Read posts from `lib/blog-data-local.ts`
- Upload images to Strapi
- Create blog post entries

## Page Updates

All blog-related pages have been updated to support async data fetching:

### Blog Listing (`app/blog/page.tsx`)

- Now uses `useEffect` to load posts asynchronously
- Handles loading states
- Client-side component (for search/filter functionality)

### Blog Post Page (`app/blog/[slug]/page.tsx`)

- Converted to async server component
- Fetches post and related posts from Strapi/local data
- Maintains all existing functionality

### Homepage (`app/page.tsx`)

- Converted to async server component
- Fetches featured blog posts
- Server-side rendering for better SEO

### Sitemap (`app/sitemap.ts`)

- Updated to fetch blog posts asynchronously
- Includes all blog posts from Strapi/local data

## Development Workflow

### Local Development (No Strapi)

By default, the app uses local data:

- No configuration needed
- Works immediately
- All existing blog posts available

### Local Development (With Strapi)

1. Start Strapi: `npm run develop` (in Strapi directory)
2. Set environment variables
3. Run migration script
4. Next.js will fetch from Strapi

### Production

1. Deploy Strapi instance
2. Configure production URL
3. Set environment variables
4. Deploy Next.js app

## Migration Notes

### What Was Changed

1. **`lib/blog-data.ts`** - Refactored to unified access layer
2. **`lib/blog-data-local.ts`** - Renamed from `blog-data.ts` (preserved)
3. **`app/blog/[slug]/page.tsx`** - Made async
4. **`app/blog/page.tsx`** - Added async loading
5. **`app/page.tsx`** - Made async
6. **`app/sitemap.ts`** - Made async

### Backward Compatibility

✅ **Fully backward compatible:**

- If Strapi is not configured, uses local data
- All existing functionality preserved
- No breaking changes

## Troubleshooting

### Strapi Not Connecting

**Symptoms:** Console warnings, fallback to local data

**Solutions:**

- Check `NEXT_PUBLIC_STRAPI_URL` is correct
- Verify Strapi is running
- Check CORS settings in Strapi
- Verify permissions are set correctly

### Images Not Loading

**Symptoms:** Broken image URLs

**Solutions:**

- Check image URLs in Strapi response
- Verify Strapi media is publicly accessible
- Check `NEXT_PUBLIC_STRAPI_URL` includes protocol

### Migration Issues

**Symptoms:** Posts not appearing in Strapi

**Solutions:**

- Check Strapi is running
- Verify content type exists
- Check permissions allow creation
- Review migration script output

## Next Steps

1. ✅ **Structure created** - All files in place
2. ⏳ **Install Strapi** - Create Strapi instance
3. ⏳ **Migrate content** - Run migration script
4. ⏳ **Test integration** - Verify blog posts load from Strapi
5. ⏳ **Deploy** - Set up production Strapi instance

---

**Note:** The app continues to work with local data until Strapi is configured and enabled via environment variables.
