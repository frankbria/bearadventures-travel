/**
 * Utility functions for WordPress content migration
 * These will be used during Phase 1: Content Extraction
 */
export const parseWordPressContent = (htmlContent) => {
    // Clean up WordPress-specific HTML and convert to React-friendly format
    return htmlContent
        .replace(/\[caption[^\]]*\]/g, '') // Remove caption shortcodes
        .replace(/\[\/caption\]/g, '')
        .replace(/\[gallery[^\]]*\]/g, '') // Remove gallery shortcodes
        .replace(/\[embed[^\]]*\]/g, '') // Remove embed shortcodes
        .replace(/\[\/embed\]/g, '');
};
export const extractFeaturedImage = (post) => {
    return post.featuredImage || null;
};
export const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
export const optimizeMediaUrl = (mediaAsset, size = 'full') => {
    if (size === 'full' || !mediaAsset.sizes) {
        return mediaAsset.url;
    }
    return mediaAsset.sizes[size]?.url || mediaAsset.url;
};
