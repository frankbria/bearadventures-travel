# Content Extraction Approach

## Philosophy

**We don't match WordPress formatting** - instead, we extract clean semantic HTML and let our site's design system handle all styling.

## What We Extract

### Clean Semantic HTML Only

We preserve:

- ✅ Headings (`h1-h6`) - converted to proper hierarchy (h1 → h2)
- ✅ Paragraphs (`p`)
- ✅ Lists (`ul`, `ol`, `li`)
- ✅ Links (`a`) - with proper external link handling
- ✅ Images (`img`) - with alt text, URLs converted
- ✅ Blockquotes (`blockquote`)
- ✅ Code blocks (`pre`, `code`)
- ✅ Text formatting (`strong`, `em`)

### What We Strip Out

We remove:

- ❌ ALL WordPress classes (`wp-*`, `align-*`, etc.)
- ❌ ALL inline styles (`style=""`)
- ❌ ALL IDs and custom attributes
- ❌ WordPress shortcodes (`[gallery]`, `[embed]`, etc.)
- ❌ WordPress wrapper divs and spans
- ❌ WordPress figure/caption wrappers
- ❌ WordPress-specific markup

## Styling Approach

### Tailwind Typography Plugin

The `@tailwindcss/typography` plugin provides beautiful default styling via `prose` classes.

### Custom Prose Styling

We've added custom prose modifiers to match the Bear Adventures design:

```tsx
className="prose prose-lg prose-amber max-w-none
  prose-headings:font-bold prose-headings:text-gray-900
  prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
  prose-p:text-gray-700 prose-p:leading-relaxed
  prose-a:text-amber-600 hover:prose-a:underline
  prose-img:rounded-lg prose-img:shadow-lg
  prose-blockquote:border-amber-400
  ..."
```

This ensures:

- Headings match site typography
- Links use brand colors (amber/orange)
- Images are properly styled
- Blockquotes match brand aesthetic
- Everything is readable and beautiful

## Content Cleaning Function

The `cleanWordPressContent()` function in the extraction script:

1. **Removes WordPress-specific markup** - shortcodes, wrappers, classes
2. **Preserves semantic structure** - headings, paragraphs, lists, etc.
3. **Handles images intelligently** - converts URLs, preserves alt text
4. **Handles links intelligently** - detects external links, adds proper attributes
5. **Normalizes structure** - ensures proper heading hierarchy, spacing

## Result

When WordPress content is extracted:

- ✅ Clean, semantic HTML structure
- ✅ No WordPress-specific markup
- ✅ Beautiful styling via Tailwind Typography
- ✅ Consistent with site design
- ✅ Responsive and accessible

## Example

**WordPress HTML:**

```html
<div class="wp-block-group">
  <h2 class="wp-block-heading">Travel Tips</h2>
  <p
    class="has-medium-font-size"
    style="color: #333;"
  >
    Content here...
  </p>
</div>
```

**Extracted HTML:**

```html
<h2>Travel Tips</h2>
<p>Content here...</p>
```

**Rendered with:**

- `prose-h2:text-3xl` - Large, bold heading
- `prose-p:text-gray-700` - Readable paragraph text
- Automatic spacing and typography from prose classes

## Benefits

1. **Consistency** - All content matches site design
2. **Maintainability** - Styling is controlled by CSS, not embedded HTML
3. **Performance** - Less HTML, faster rendering
4. **Accessibility** - Clean semantic HTML is more accessible
5. **Flexibility** - Easy to update styling across all posts

---

**Key Point:** We extract the _content_ and _structure_, not the _formatting_. The site's design system handles all visual styling beautifully.
