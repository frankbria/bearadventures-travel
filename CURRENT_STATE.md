# Current State Documentation

**Date:** November 2, 2024  
**Last Commit:** `fc94de2` - "WIP: Continue debugging Next.js build error - isolate issue"

## Executive Summary

The Bear Adventures Travel website is a Next.js 14 application with Strapi CMS integration planned. The core structure is in place, but there is a persistent build error during static page generation that prevents successful builds. All Strapi integration code is ready but currently disabled due to this issue.

## ✅ What's Complete

### 1. Project Structure
- ✅ Next.js App Router structure (`app/` directory)
- ✅ Component organization (`components/` directory)
- ✅ TypeScript configuration
- ✅ Tailwind CSS with Typography plugin configured
- ✅ Path aliases (`@/` prefix) working correctly

### 2. Blog Data Layer
- ✅ `lib/blog-data-local.ts` - Contains 5 sample blog posts with full content
- ✅ `lib/blog-data.ts` - Unified data access layer (Strapi + local fallback)
- ✅ `lib/strapi.ts` - Complete Strapi API client implementation
- ✅ BlogPost interface defined consistently

### 3. Strapi Integration (Ready but Disabled)
- ✅ `strapi/schemas/blog-post.schema.json` - Complete Strapi content type schema
- ✅ `strapi/scripts/migrate-to-strapi.ts` - Migration script ready
- ✅ `strapi/README.md` - Setup instructions documented
- ✅ `STRAPI_INTEGRATION.md` - Integration documentation
- ⚠️ **Status:** All Strapi code is commented out/disabled due to build errors

### 4. Pages
- ✅ `app/page.tsx` - Homepage (has build error)
- ✅ `app/blog/page.tsx` - Blog listing page (client component, uses async loading)
- ✅ `app/blog/[slug]/page.tsx` - Individual blog post page (async server component)
- ✅ `app/sitemap.ts` - Dynamic sitemap generation (async)
- ✅ `app/layout.tsx` - Root layout with structured data

### 5. Components
- ✅ `components/content/BlogCard.tsx` - Blog card component (client component)
- ✅ `components/content/TripCard.tsx` - Trip card component
- ✅ `components/layout/Header.tsx` - Site header
- ✅ `components/layout/Footer.tsx` - Site footer
- ✅ `components/StructuredData.tsx` - JSON-LD structured data components
- ✅ UI components (Button, Card, Badge, Input) from shadcn/ui

### 6. Configuration Files
- ✅ `next.config.js` - Image domains, redirects, rewrites configured
- ✅ `tailwind.config.js` - Typography plugin enabled
- ✅ `tsconfig.json` - Path aliases configured
- ✅ `robots.txt` - SEO robots file

## ⚠️ Current Issue: Build Error

### Error Details
```
TypeError: tG is not a function (or tH is not a function)
at Object.get (/home/frankbria/projects/bearadventures-travel/.next/server/app/page.js:1:112465)
at aV (/home/frankbria/projects/bearadventures-travel/.next/server/app/page.js:334:5906)
...
Error occurred prerendering page "/"
```

### What We Know
1. **Error occurs during static generation** of the homepage (`app/page.tsx`)
2. **Not related to blog data** - Error persists even with empty array
3. **Not related to async functions** - Error persists with synchronous functions
4. **Not related to framer-motion** - Error persists without motion wrappers
5. **Occurs during serialization** - Error happens in `Array.toJSON` / `stringify` operations

### Current Workarounds in Place

#### 1. Synchronous Blog Posts Function
**File:** `lib/blog-data.ts`
- Created `getFeaturedBlogPostsSync()` - synchronous version for static generation
- `getFeaturedBlogPosts()` wraps the sync version in Promise.resolve()
- Strapi integration code is commented out to avoid static analysis issues

#### 2. Direct Import in Homepage
**File:** `app/page.tsx`
- Changed from async server component to regular function component
- Uses direct import: `import { getFeaturedBlogPostsSync } from '@/lib/blog-data'`
- Blog posts section conditionally renders to avoid empty array issues

#### 3. Disabled Dynamic Imports
**File:** `lib/blog-data.ts`
- `getStrapiFunctions()` always returns `null` (Strapi code commented out)
- Prevents Next.js from analyzing dynamic import during build

### Investigation Attempts
- ✅ Tested with empty blog posts array - error persists
- ✅ Tested with synchronous functions - error persists  
- ✅ Tested without framer-motion - error persists
- ✅ Tested direct imports from blog-data-local - error persists
- ✅ Verified data is serializable (JSON.stringify works)
- ✅ Checked for circular dependencies - none found
- ✅ Verified all imports resolve correctly

## 🔧 Technical Stack

- **Framework:** Next.js 14.2.32
- **React:** 18.3.1
- **TypeScript:** Latest
- **Node.js:** 24.1.0
- **Styling:** Tailwind CSS with `@tailwindcss/typography`
- **Animation:** framer-motion
- **CMS:** Strapi (ready but not configured)

## 📁 Key Files & Their Status

### Working Files ✅
- `app/blog/page.tsx` - Client component, loads posts asynchronously
- `app/blog/[slug]/page.tsx` - Async server component, fetches individual posts
- `lib/blog-data-local.ts` - Contains all blog post data (serializable, verified)
- `lib/strapi.ts` - Strapi client ready (not tested due to build error)
- All component files

### Problematic Files ⚠️
- `app/page.tsx` - Homepage fails to build (static generation error)
- `app/sitemap.ts` - May have similar issues (not tested yet)

### Disabled/Commented Files 🔇
- Strapi integration in `lib/blog-data.ts` (commented out)
- Dynamic import logic (returning null)

## 🎯 What Works

1. **Development Server** - `npm run dev` should work (not fully tested)
2. **Blog Listing Page** - Client component with async loading works
3. **Individual Blog Posts** - Async server component should work
4. **All Components** - UI components render correctly
5. **Data Structure** - Blog posts are properly typed and structured

## 🚫 What Doesn't Work

1. **Production Build** - `npm run build` fails on homepage static generation
2. **Strapi Integration** - Disabled due to build issues
3. **Static Generation** - Homepage cannot be statically generated

## 📝 Code Patterns Used

### Data Access Pattern
```typescript
// Synchronous (for static generation)
import { getFeaturedBlogPostsSync } from '@/lib/blog-data'
const posts = getFeaturedBlogPostsSync(3)

// Asynchronous (for server components - when build works)
import { getFeaturedBlogPosts } from '@/lib/blog-data'
const posts = await getFeaturedBlogPosts(3)
```

### Blog Post Structure
```typescript
interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string        // HTML string
  featuredImage: string  // URL path
  category: string
  author: {
    name: string
    avatar?: string
  }
  publishDate: string    // Formatted date string
  readTime: string
  slug: string
  tags: string[]
}
```

## 🔍 Debugging Commands Used

```bash
# Clean build
rm -rf .next && npm run build

# Check serialization
node -e "const { blogPosts } = require('./lib/blog-data-local.ts'); JSON.stringify(blogPosts[0])"

# Verify imports
node --check lib/blog-data.ts
```

## 📚 Documentation Files

- `STRAPI_INTEGRATION.md` - Complete Strapi setup guide
- `strapi/README.md` - Strapi-specific instructions
- `STRAPI_SETUP_SUMMARY.md` - High-level integration summary
- `PROJECT_STRUCTURE_ANALYSIS.md` - Project organization details

## 🎯 Git Status

- **Last Commit:** `fc94de2` - "WIP: Continue debugging Next.js build error - isolate issue"
- **Branch:** `main`
- **Status:** All changes committed
- **Uncommitted:** None

---

**Note:** This document represents the state as of the last debugging session. The build error requires further investigation, potentially involving Next.js version updates or architectural changes to how static generation is handled.

