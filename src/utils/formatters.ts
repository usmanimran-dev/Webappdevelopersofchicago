/**
 * Converts a string title into a URL-friendly slug.
 * Example: "My Cool Project!" => "my-cool-project"
 */
export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * Formats a Supabase timestamp string into a readable date.
 * Example: "2024-02-24T00:00:00Z" => "Feb 24, 2024"
 */
export const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

/**
 * Returns an estimated reading time for a given text.
 * Example: "240 words" => "~2 min read"
 */
export const readingTime = (content: string): string => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
};

/**
 * Decodes HTML entities, strips all tags, removes bracket artifacts,
 * and returns clean readable text.
 */
export const stripHtml = (html: string): string => {
    if (!html) return '';
    let text = html;
    // Decode HTML entities first (&lt; &gt; &amp; &quot; &#39; etc.)
    text = text.replace(/&lt;/gi, '<');
    text = text.replace(/&gt;/gi, '>');
    text = text.replace(/&amp;/gi, '&');
    text = text.replace(/&quot;/gi, '"');
    text = text.replace(/&#39;/gi, "'");
    text = text.replace(/&nbsp;/gi, ' ');
    // Strip all HTML tags
    text = text.replace(/<[^>]*>?/gm, '');
    // Remove markdown links [text](url)
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    // Remove square bracket artifacts: [Read more], [source], [link], [ ... ], etc.
    text = text.replace(/\[[^\]]{0,40}\]/g, '');
    // Clean up extra whitespace
    text = text.replace(/\s{2,}/g, ' ').trim();
    return text;
};

/**
 * Returns a valid image URL, replacing deprecated or invalid ones with a fallback.
 */
export const getValidImageUrl = (url?: string): string => {
    const fallback = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800';
    if (!url) return fallback;
    if (!url.startsWith('http')) return fallback;
    if (url.includes('source.unsplash.com')) return fallback;
    return url;
};
