import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
        
        let dynamicUrls = '';
        const domain = 'https://webappdevelopersofchicago.vercel.app';

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);
            
            // Fetch published AI blogs
            const { data: blogs, error } = await supabase
                .from('ai_blog_posts')
                .select('slug, updated_at, created_at')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (!error && blogs) {
                dynamicUrls = blogs.map(blog => {
                    const date = new Date(blog.updated_at || blog.created_at).toISOString().split('T')[0];
                    return `
    <url>
        <loc>${domain}/blog/${blog.slug}</loc>
        <lastmod>${date}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
                }).join('');
            }
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${domain}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${domain}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>${dynamicUrls}
</urlset>
        `;

        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(sitemap);
    } catch (err) {
        console.error('Sitemap error:', err);
        return res.status(500).json({ error: 'Failed to generate sitemap' });
    }
}
