# Project Structure Analysis

## Answers to Your Questions

### 1. Where is blog text stored on beta site?

**Location:** `lib/blog-data.ts`

**Current State:**

- Blog posts are **hardcoded** in a TypeScript file
- Stored as a TypeScript array `blogPosts: BlogPost[]`
- Each post has `content` field with HTML string
- This file is bundled into the Next.js build
- On the server, it's at: `/var/www/bearadventures/app/lib/blog-data.ts`

**Structure:**

```typescript
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Costa Rica Gay Travel...',
    content: `<h2>Welcome to...</h2><p>Content...</p>`,
    // ... other fields
  },
  // ... more posts
];
```

**How it's accessed:**

- Imported in pages: `import { getBlogPostBySlug } from '@/lib/blog-data'`
- Used in: `app/blog/[slug]/page.tsx`
- Static at build time (not dynamic from database/API)

---

### 2. Why are there 2 components directories?

**Current Structure:**

```
├── components/              ← Main components directory (CORRECT)
│   ├── content/
│   ├── layout/
│   ├── ui/
│   └── StructuredData.tsx
│
└── app/
    └── components/           ← Duplicate (WRONG LOCATION)
        └── StructuredData.tsx
```

**Why this happened:**

- I mistakenly created `app/components/StructuredData.tsx` during development
- The correct location is root `components/`
- Next.js App Router convention: components should be in root `components/`, not `app/components/`

**What's being used:**

- All imports use `@/components/StructuredData` which resolves to `components/StructuredData.tsx` (correct)
- The `app/components/StructuredData.tsx` is unused and should be deleted

---

### 3. Next.js Structure: Pages or App Router?

**Answer: App Router** ✅

**Evidence:**

- ✅ Has `app/` directory (not `pages/`)
- ✅ Uses `app/layout.tsx` (root layout)
- ✅ Uses `app/page.tsx` (homepage)
- ✅ Uses route groups: `app/blog/[slug]/page.tsx`
- ✅ Next.js version: 14.2.32 (supports App Router)
- ✅ Uses `next/font`, `next/image` (App Router patterns)

**Structure:**

```
app/
├── layout.tsx              ← Root layout
├── page.tsx                ← Homepage (/)
├── blog/
│   ├── page.tsx           ← Blog list (/blog)
│   └── [slug]/
│       └── page.tsx       ← Blog post (/blog/:slug)
├── about/page.tsx          ← About page (/about)
└── ... other routes
```

**NOT using:**

- ❌ No `pages/` directory
- ❌ Not using Pages Router

---

## Cleanup Needed?

### Issues Found:

1. **Duplicate StructuredData Component** ⚠️

   - `app/components/StructuredData.tsx` - DELETE (unused)
   - `components/StructuredData.tsx` - KEEP (correct)

2. **Project Structure is Correct** ✅
   - Using App Router correctly
   - Components in root `components/` (correct)
   - App routes in `app/` (correct)
   - Blog data in `lib/` (correct)

### Recommended Cleanup:

**Action:** Delete `app/components/StructuredData.tsx` since it's unused and confusing.

**Everything else is correct:**

- ✅ App Router structure is proper
- ✅ Components location is correct
- ✅ Blog data location is correct
- ✅ Import paths are correct (`@/components` → `components/`)

---

## Summary

| Question                 | Answer                                                     |
| ------------------------ | ---------------------------------------------------------- |
| **Blog text storage**    | `lib/blog-data.ts` - Hardcoded TypeScript array            |
| **Two components dirs?** | Yes - duplicate, needs cleanup (delete `app/components/`)  |
| **Next.js structure**    | **App Router** (not Pages Router)                          |
| **Needs cleanup?**       | Yes - delete duplicate `app/components/StructuredData.tsx` |

---

## Path Resolution

From `tsconfig.json`:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```

This means:

- `@/components` → `./components/` (root level)
- `@/lib` → `./lib/` (root level)
- `@/app` → `./app/` (root level)

So imports like:

```typescript
import { BlogCard } from '@/components/content/BlogCard';
// Resolves to: ./components/content/BlogCard.tsx

import { blogPosts } from '@/lib/blog-data';
// Resolves to: ./lib/blog-data.ts
```

---

**Next Steps:**

1. Delete `app/components/StructuredData.tsx` (duplicate)
2. Keep everything else as-is (structure is correct)
