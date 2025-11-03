# WordPress API Requirements for Blog Posts

## Current Status

✅ **Text Content:** Extracted and displayed  
⚠️ **Formatting:** May need enhancement

## What We Currently Get from WordPress API

### Standard Endpoint:

```
/wp-json/wp/v2/posts?per_page=10&status=publish
```

**Returns:**

- ✅ `content.rendered` - Full HTML content (text is there)
- ✅ `title.rendered` - Post title
- ✅ `excerpt.rendered` - Post excerpt
- ✅ `featured_media` - Featured image ID
- ✅ `categories` - Category IDs (need separate lookup)
- ✅ `tags` - Tag IDs (need separate lookup)
- ✅ `slug` - URL slug
- ✅ `date` - Publication date
- ✅ `author` - Author ID (need separate lookup)

## Enhanced Endpoint with Embedded Data

### Recommended Endpoint:

```
/wp-json/wp/v2/posts?per_page=10&status=publish&_embed
```

**Additional Data Included:**

- ✅ `_embedded['wp:featuredmedia']` - Full featured image data with sizes
- ✅ `_embedded['author']` - Author name and avatar URLs
- ✅ `_embedded['wp:term']` - Categories and tags with names (no separate lookup needed)

## What We Need for Proper Formatting

### 1. Content HTML Structure

The `content.rendered` field contains HTML. We need:

✅ **What we get:**

- HTML paragraphs `<p>`
- Headings `<h1-h6>`
- Lists `<ul>`, `<ol>`
- Links `<a>`
- Images `<img>`
- Blockquotes `<blockquote>`

⚠️ **What might need cleaning:**

- WordPress shortcodes `[gallery]`, `[embed]`, etc.
- WordPress-specific classes `wp-*`, `align-*`
- Inline styles that break layout
- Embedded media (iframes, videos)

✅ **Solution:** The extraction script now includes `cleanWordPressContent()` function that:

- Removes shortcodes
- Converts image URLs
- Cleans WordPress classes
- Removes inline styles
- Normalizes HTML

### 2. Image Handling

**Options:**

1. Keep WordPress URLs (already configured in `next.config.js`)
2. Download and use local images (requires download step)
3. Use CDN URLs (if WordPress uses CDN)

**Current approach:** Convert to local paths in extraction script, but images need to be downloaded separately.

### 3. Additional Data We Might Need

#### Option A: Media API (for better image handling)

```
/wp-json/wp/v2/media?parent={post_id}
```

**Provides:**

- Original image URLs
- Different image sizes
- Alt text
- Captions

#### Option B: Block Editor Data (if using Gutenberg)

If WordPress uses Gutenberg blocks, we might need:

```
/wp-json/wp/v2/posts?_embed&_fields=content.rendered,content.raw
```

**Provides:**

- `content.raw` - Block data for more granular processing

#### Option C: Specific Fields

To reduce payload size:

```
/wp-json/wp/v2/posts?_fields=id,title,content,excerpt,featured_media,date,slug,categories,tags
```

## Content Formatting Issues

### Issue: Text is there but not formatted

**Possible Causes:**

1. ❌ Tailwind Typography plugin not installed
2. ⚠️ WordPress HTML structure needs cleaning
3. ⚠️ CSS not applying correctly

### Solution 1: Install Tailwind Typography Plugin

The `prose` class requires `@tailwindcss/typography`:

```bash
npm install @tailwindcss/typography
```

Then in `tailwind.config.js`:

```js
plugins: [
  require('tailwindcss-animate'),
  require('@tailwindcss/typography'), // Add this
];
```

### Solution 2: Enhanced Content Cleaning

The extraction script now cleans:

- ✅ WordPress shortcodes
- ✅ WordPress classes
- ✅ Inline styles
- ✅ Image URLs
- ✅ Empty elements

### Solution 3: Additional WordPress Fields

If formatting still doesn't work, we might need to request:

**Custom Fields (ACF):**
If WordPress uses Advanced Custom Fields:

```
/wp-json/wp/v2/posts?_embed&acf_format=standard
```

**Meta Fields:**

```
/wp-json/wp/v2/posts?_embed&meta_fields=format,custom_template
```

## Testing WordPress API

### Test Basic Endpoint:

```bash
curl "https://bearadventures.travel/wp-json/wp/v2/posts?per_page=1" | jq '.[0] | {title, content, featured_media, categories}'
```

### Test with Embed:

```bash
curl "https://bearadventures.travel/wp-json/wp/v2/posts?per_page=1&_embed" | jq '.[0]._embedded'
```

### Test Content Structure:

```bash
curl "https://bearadventures.travel/wp-json/wp/v2/posts?per_page=1" | jq -r '.[0].content.rendered' | head -50
```

## Recommended Approach

### Step 1: Use Enhanced Endpoint

```typescript
extractBlogPosts(10, true); // useEmbed = true
```

### Step 2: Clean Content

The `cleanWordPressContent()` function handles most WordPress HTML issues.

### Step 3: Install Typography Plugin

```bash
npm install @tailwindcss/typography
```

### Step 4: Test and Adjust

- Review extracted HTML in `extracted-blog-posts.json`
- Check browser DevTools on blog post pages
- Adjust cleaning function if needed

## Summary

**What we have:**

- ✅ Extraction script ready
- ✅ Content cleaning function
- ✅ Enhanced endpoint support (`_embed`)
- ✅ Image URL conversion
- ⚠️ Typography plugin may be needed

**What we might need:**

- Typography plugin installation
- Additional testing of WordPress HTML structure
- Custom field support (if WordPress uses ACF)
- Block editor support (if using Gutenberg)

**Next Steps:**

1. Run extraction script with `_embed=true`
2. Review extracted content
3. Install typography plugin if prose styles not working
4. Test on blog post pages
5. Adjust cleaning function based on actual WordPress HTML

---

**Key Point:** The text content is available from WordPress API. Formatting is handled by:

1. Content cleaning (in extraction script)
2. Tailwind Typography plugin (needs installation)
3. CSS classes (`prose prose-lg prose-amber`)
