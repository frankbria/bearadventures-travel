# Next Steps for AI Agent Developer

**Date Created:** November 2, 2024  
**Priority:** HIGH - Build must be fixed before deployment  
**Estimated Complexity:** Medium to High

## 🎯 Primary Objective

**Fix the Next.js static generation build error** that prevents `npm run build` from completing successfully. Once fixed, re-enable Strapi integration and proceed with deployment.

## 🔴 Critical Issue: Build Error

### Current Error
```
TypeError: tG is not a function
at Object.get (/home/frankbria/projects/bearadventures-travel/.next/server/app/page.js:1:112465)
Error occurred prerendering page "/"
```

### Why This Matters
- Prevents production builds
- Blocks deployment to server
- Strapi integration cannot be enabled until resolved

## 📋 Investigation Steps (Priority Order)

### Step 1: Verify Next.js Version Compatibility ⭐ START HERE
**Hypothesis:** Next.js 14.2.32 may have a bug with static generation

**Actions:**
```bash
# Check current Next.js version
npm list next

# Update to latest 14.x version
npm install next@latest

# Or try 14.3.x if available
npm install next@14.3.0

# Clean build and test
rm -rf .next node_modules/.cache
npm run build
```

**Success Criteria:** Build completes without errors

**If Still Fails:** Move to Step 2

---

### Step 2: Try Dynamic Rendering Instead of Static Generation
**Hypothesis:** Static generation may not be compatible with the current component structure

**File to Modify:** `app/page.tsx`

**Actions:**
1. Add to top of `app/page.tsx`:
   ```typescript
   export const dynamic = 'force-dynamic'
   // OR
   export const revalidate = 0
   ```

2. Convert back to async server component:
   ```typescript
   export default async function HomePage() {
     const featuredBlogPosts = await getFeaturedBlogPosts(3)
     // ... rest of component
   }
   ```

3. Test build:
   ```bash
   rm -rf .next && npm run build
   ```

**Success Criteria:** Build succeeds (even if page is now dynamically rendered)

**If Still Fails:** Move to Step 3

---

### Step 3: Simplify Homepage Component
**Hypothesis:** Something in the component tree is causing serialization issues

**Actions:**
1. Create minimal test version of `app/page.tsx`:
   ```typescript
   export default function HomePage() {
     return <div>Test</div>
   }
   ```

2. Test build:
   ```bash
   rm -rf .next && npm run build
   ```

3. If build succeeds, gradually add back sections:
   - Add hero section
   - Add features section
   - Add destinations section
   - Add testimonials section
   - Add blog posts section (last)

4. Identify which section causes the error

**Success Criteria:** Identify the problematic component/section

**If Build Still Fails:** Move to Step 4

---

### Step 4: Check for Component Serialization Issues
**Hypothesis:** Client components or their props may have serialization problems

**Actions:**
1. Check `components/content/BlogCard.tsx`:
   - Ensure all props are serializable
   - Remove any non-serializable data (functions, symbols, etc.)

2. Check other components used on homepage:
   - `TripCard`
   - `Button`
   - Any `motion` components

3. Verify props passed to client components:
   ```typescript
   // In app/page.tsx, ensure props are plain objects
   const props = {
     id: String(post.id),
     title: String(post.title),
     // ... ensure all values are primitives
   }
   ```

4. Test with minimal BlogCard:
   ```typescript
   // Temporary: Remove all complex props
   <BlogCard post={{ id: '1', title: 'Test', excerpt: 'Test', ... }} />
   ```

**Success Criteria:** Identify which prop or component causes the issue

---

### Step 5: Investigate Next.js Build Cache Issues
**Hypothesis:** Corrupted build cache or node_modules

**Actions:**
```bash
# Complete clean
rm -rf .next node_modules package-lock.json
npm install
npm run build

# If still fails, try with turbo disabled
rm -rf .next
TURBO=0 npm run build
```

---

### Step 6: Check for Circular Dependencies
**Hypothesis:** Circular imports may cause build-time issues

**Actions:**
```bash
# Install dependency checker
npm install --save-dev madge

# Check for circular dependencies
npx madge --circular --extensions ts,tsx lib/ app/

# Fix any circular dependencies found
```

---

### Step 7: Update Dependencies
**Hypothesis:** Dependency version conflicts

**Actions:**
```bash
# Update all dependencies
npm update

# Or update specific packages
npm install react@latest react-dom@latest
npm install framer-motion@latest
npm install next@latest

# Clean and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## ✅ Once Build Error is Fixed

### Immediate Next Steps

#### 1. Re-enable Strapi Integration
**Files to Modify:**
- `lib/blog-data.ts` - Uncomment Strapi integration code
- Restore `getStrapiFunctions()` implementation
- Re-enable async `getFeaturedBlogPosts()` with Strapi fallback

**Actions:**
```typescript
// In lib/blog-data.ts
export async function getFeaturedBlogPosts(limit: number = 3): Promise<BlogPost[]> {
  if (shouldUseStrapi()) {
    try {
      const strapi = await getStrapiFunctions()
      if (strapi) {
        const posts = await strapi.fetchFeaturedBlogPostsFromStrapi(limit)
        if (posts.length > 0) return posts
      }
    } catch (error) {
      console.warn('Strapi unavailable, falling back to local data:', error)
    }
  }
  
  // Fallback to local data
  return getFeaturedBlogPostsSync(limit)
}
```

#### 2. Convert Homepage Back to Async Server Component
**File:** `app/page.tsx`

```typescript
export default async function HomePage() {
  const featuredBlogPosts = await getFeaturedBlogPosts(3)
  // ... rest of component
}
```

#### 3. Test Sitemap Generation
**File:** `app/sitemap.ts`

Verify sitemap builds correctly:
```bash
npm run build
# Check .next/server/app/sitemap.xml/route.js exists
```

---

## 🚀 After Build is Working

### Phase 1: Strapi Setup (If Not Done)
1. **Install Strapi:**
   ```bash
   cd strapi
   npx create-strapi-app@latest . --quickstart
   ```

2. **Import Schema:**
   - Copy `strapi/schemas/blog-post.schema.json` to Strapi
   - Create content type via Strapi admin or CLI

3. **Configure Environment:**
   ```env
   NEXT_PUBLIC_USE_STRAPI=true
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   STRAPI_API_TOKEN=your_token_here
   ```

4. **Run Migration:**
   ```bash
   npx ts-node strapi/scripts/migrate-to-strapi.ts
   ```

### Phase 2: Testing
1. Test local data fallback (Strapi disabled)
2. Test Strapi integration (Strapi enabled)
3. Test all pages build correctly
4. Test sitemap generation
5. Test blog post rendering

### Phase 3: Deployment
1. Build for production: `npm run build`
2. Test production build locally
3. Deploy to server
4. Configure production Strapi instance
5. Update environment variables on server

---

## 🔍 Debugging Tips

### Enable Verbose Logging
```bash
# Next.js debug mode
DEBUG=* npm run build

# Or specific Next.js debug
NODE_OPTIONS='--trace-warnings' npm run build
```

### Check Generated Code
```bash
# Inspect the compiled page
cat .next/server/app/page.js | grep -A 20 "tG\|tH"
```

### Test Individual Components
```bash
# Create test page
echo 'export default function Test() { return <div>Test</div> }' > app/test/page.tsx
npm run build
# If this works, the issue is in page.tsx specifically
```

### Use Next.js Diagnostics
```javascript
// In next.config.js
const nextConfig = {
  // ... existing config
  experimental: {
    // Enable diagnostics
    instrumentationHook: true,
  },
}
```

---

## 📝 Files to Review

### Critical Files
- `app/page.tsx` - Homepage (currently failing)
- `lib/blog-data.ts` - Data access layer (Strapi disabled)
- `lib/strapi.ts` - Strapi client (ready but untested)
- `next.config.js` - Next.js configuration

### Reference Files
- `CURRENT_STATE.md` - Complete current state documentation
- `STRAPI_INTEGRATION.md` - Strapi integration guide
- `lib/blog-data-local.ts` - Sample blog data (5 posts)

---

## 🎯 Success Criteria

1. ✅ `npm run build` completes without errors
2. ✅ All pages can be statically generated (or dynamically rendered)
3. ✅ Homepage displays featured blog posts correctly
4. ✅ Strapi integration can be enabled without breaking build
5. ✅ Sitemap generates correctly
6. ✅ Production build works on server

---

## 📞 If All Else Fails

### Alternative Approaches

1. **Use ISR (Incremental Static Regeneration)** instead of full static generation
2. **Convert homepage to client component** with useEffect for data fetching
3. **Split homepage into smaller server components** to isolate the issue
4. **Consider Next.js 15** if available (may have fixes)
5. **File GitHub issue** with Next.js team if it appears to be a framework bug

### Temporary Workaround
If urgent deployment is needed:
1. Remove blog posts section from homepage temporarily
2. Create separate `/blog` page (already working)
3. Deploy without homepage blog posts
4. Fix and add back later

---

## 📚 Resources

- **Next.js Docs:** https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- **Next.js GitHub Issues:** https://github.com/vercel/next.js/issues
- **Strapi Docs:** https://docs.strapi.io/
- **Current State:** See `CURRENT_STATE.md`

---

**Good luck! The structure is solid, it just needs the build error resolved. Once that's fixed, everything else should fall into place.**

