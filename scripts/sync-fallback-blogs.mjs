import { createClient } from '@supabase/supabase-js';
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
    try {
        const envPath = resolve(__dirname, '..', '.env');
        const envContent = readFileSync(envPath, 'utf-8');
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.substring(0, eqIndex).trim();
            const value = trimmed.substring(eqIndex + 1).trim();
            if (!process.env[key]) process.env[key] = value;
        }
    } catch {}
}
loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncFallbackBlogs() {
   console.log("Fetching news and blogs...");
   const { data: news } = await supabase.from('ai_news').select('*');
   const { data: blogs } = await supabase.from('ai_blog_posts').select('news_id');
   
   if (!news) {
       console.log("No news found.");
       return;
   }
   
   const blogNewsIds = new Set((blogs || []).map(b => b.news_id));

   for (const n of news) {
       if (!blogNewsIds.has(n.id)) {
           const slug = n.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').substring(0, 80).replace(/^-|-$/g, '');
           const articleContent = `${n.excerpt}\n\n[Read the full article here](${n.link})`;
           
           const { error } = await supabase.from('ai_blog_posts').insert({
               news_id: n.id,
               title: n.title,
               slug,
               excerpt: n.excerpt,
               content: articleContent,
               featured_image: `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800`,
               tags: ['AI', 'Technology', 'News'],
               published: true,
            });
            
            if (error) {
                console.error("Error publishing fallback blog for", n.title, error.message);
            } else {
                console.log("Published fallback blog for", n.title);
            }
       }
   }
   console.log("Sync complete!");
}

syncFallbackBlogs().catch(console.error);
