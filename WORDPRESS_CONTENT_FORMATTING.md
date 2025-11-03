# WordPress Content Formatting Guide

## Current Status

The blog post pages display content using `dangerouslySetInnerHTML` with Tailwind's `prose` class for typography. The content is there, but formatting may need enhancement.

## What We Get from WordPress API

From the WordPress REST API `/wp-json/wp/v2/posts`, we get:

1. **`content.rendered`** - Full HTML content of the post
2. **`title.rendered`** - Post title (HTML)
3. **`excerpt.rendered`** - Post excerpt (HTML)
4. **`featured_media`** - Featured image ID
5. **`categories`** - Array of category IDs
6. **`tags`** - Array of tag IDs
7. **`slug`** - URL slug
8. **`date`** - Publication date

## Content Processing in Extraction Script

The extraction script (`scripts/extract-wordpress-blog.ts`) now includes a `cleanWordPressContent()` function that:

### ✅ What It Does:

1. **Removes WordPress Shortcodes**

   - Removes `[shortcode]` patterns
   - Extensible for custom shortcodes

2. **Converts Image URLs**

   - Converts WordPress image URLs to local paths
   - Handles both `wp-content/uploads/` and CDN URLs
   - Example: `https://bearadventures.travel/wp-content/uploads/2024/image.jpg` → `/images/blog/image.jpg`

3. **Cleans WordPress Classes**

   - Removes `wp-*` classes
   - Removes `align-*` classes
   - Removes `size-*` classes

4. **Removes Inline Styles**

   - Cleans `style=""` attributes that might break layout

5. **Normalizes HTML**

   - Cleans up blockquotes
   - Removes empty paragraphs
   - Normalizes whitespace

6. **Image Processing**
   - Ensures images have alt text
   - Removes width/height (Next.js handles sizing)

## What Else We Might Need from WordPress API

If formatting is still not working well, we may need to:

### Option 1: Use WordPress API `_embed` Parameter

Add `?_embed` to the API call to get embedded content:

```
/wp-json/wp/v2/posts?_embed
```

This provides:

- `_embedded['wp:featuredmedia']` - Full featured image data
- `_embedded['author']` - Author information
- `_embedded['wp:term']` - Categories and tags with full data

### Option 2: Request Additional Fields

You can request additional fields with `?_fields=` parameter:

```
/wp-json/wp/v2/posts?_fields=id,title,content,excerpt,featured_media,date,slug,categories,tags,link
```

### Option 3: Use Block Editor API (Gutenberg)

If WordPress uses Gutenberg blocks, we might need:

```
/wp-json/wp/v2/posts?_embed&_fields=content.rendered,content.raw
```

The `content.raw` provides block data that could be processed more granularly.

### Option 4: Media API for Images

For better image handling, we can fetch media separately:

```
/wp-json/wp/v2/media?parent={post_id}
```

This gives:

- Original image URLs
- Different sizes
- Alt text
- Captions

## Current Formatting Approach

### In the Code:

```tsx
<div
  className="prose prose-lg prose-amber max-w-none"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
```

The `prose` class (from Tailwind Typography) should handle:

- Headings (h1-h6)
- Paragraphs
- Lists (ul, ol)
- Links
- Images
- Blockquotes
- Code blocks

### If Prose Isn't Working:

1. **Check Tailwind Config** - Ensure `@tailwindcss/typography` plugin is installed
2. **Verify HTML Structure** - WordPress HTML might need additional cleaning
3. **Add Custom Styles** - Extend prose classes for specific elements

## Recommended Next Steps

### 1. Test WordPress API Directly

```bash
curl "https://bearadventures.travel/wp-json/wp/v2/posts?per_page=1&_embed" | jq
```

Check what data is available and what the HTML structure looks like.

### 2. Run Extraction with Enhanced Processing

```bash
npx tsx scripts/extract-wordpress-blog.ts
```

Review the `extracted-blog-posts.json` to see how content was processed.

### 3. Check Browser DevTools

On a blog post page, inspect the HTML:

- Is the content there?
- Are images loading?
- Are styles applying?

### 4. Enhance Cleaning Function

If specific WordPress elements aren't formatting correctly, add cleaning rules:

```typescript
// Example: Handle WordPress galleries
cleaned = cleaned.replace(/\[gallery[^\]]+\]/g, '<!-- Gallery removed -->');

// Example: Handle WordPress embeds
cleaned = cleaned.replace(/<iframe[^>]*><\/iframe>/gi, '');
```

### 5. Add Tailwind Typography Plugin

If not already installed:

```bash
npm install @tailwindcss/typography
```

Then in `tailwind.config.ts`:

```typescript
plugins: [require('@tailwindcss/typography')];
```

## Common WordPress HTML Issues

### Issue 1: Images Not Displaying

**Solution:** Convert WordPress URLs to local paths or use Next.js Image component

### Issue 2: Links Broken

**Solution:** Update internal links from WordPress paths to new site paths

### Issue 3: Embedded Media Not Working

**Solution:** Convert iframes/embeds to static images or remove

### Issue 4: Inline Styles Breaking Layout

**Solution:** Already handled by cleaning function

### Issue 5: WordPress Classes Causing Issues

**Solution:** Already handled by cleaning function

## Testing Formatting

After extraction, test on a blog post page:

1. ✅ Headings display correctly
2. ✅ Paragraphs have proper spacing
3. ✅ Lists are formatted
4. ✅ Images load and display
5. ✅ Links work
6. ✅ Blockquotes styled
7. ✅ Text is readable

---

**Note:** The cleaning function is a starting point. You may need to adjust it based on the actual WordPress HTML structure you receive.
