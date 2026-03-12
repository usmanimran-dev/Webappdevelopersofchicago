/**
 * AI News Automation Script
 * =========================
 * 1. Fetches AI news from RSS feeds every 10 minutes
 * 2. Deduplicates against Supabase ai_news table
 * 3. Saves new items to Supabase
 * 4. Generates SEO blog articles using Google Gemini (FREE)
 * 5. Publishes blog articles to Supabase ai_blog_posts table
 * 6. Logs every operation
 *
 * Usage:
 *   node scripts/ai-news-automation.mjs
 *
 * Required ENV vars (create a .env file in project root):
 *   VITE_SUPABASE_URL=your_supabase_url
 *   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
 *   GEMINI_API_KEY=your_gemini_api_key
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env manually (no dotenv dependency needed) ────────────────────────
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
    } catch {
        console.warn('⚠️  No .env file found. Using system environment variables.');
    }
}
loadEnv();

// ─── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
    process.exit(1);
}
if (!GEMINI_API_KEY) {
    console.error('❌ Missing GEMINI_API_KEY in .env (get free key: https://aistudio.google.com/apikey)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── RSS Feeds (AI News Sources) ─────────────────────────────────────────────
const RSS_FEEDS = [
    'https://www.artificialintelligence-news.com/feed/',
    'https://techcrunch.com/category/artificial-intelligence/feed/',
    'https://feeds.feedburner.com/venturebeat/SZYF',
    'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
];

// ─── Logger ──────────────────────────────────────────────────────────────────
async function log(action, details) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${action}: ${details}`);
    try {
        await supabase.from('automation_logs').insert({ action, details });
    } catch (err) {
        console.error('Failed to write log to Supabase:', err.message);
    }
}

// ─── Parse RSS XML ───────────────────────────────────────────────────────────
function parseRSSItems(xmlText) {
    const items = [];
    // Match each <item>...</item> block
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
        const block = match[1];

        const getTag = (tag) => {
            const r = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, 'is');
            const m = block.match(r);
            return m ? m[1].trim() : '';
        };

        const title = getTag('title');
        const link = getTag('link') || getTag('guid');
        const description = getTag('description').replace(/<[^>]*>/g, '').substring(0, 500);
        const pubDate = getTag('pubDate');

        if (title) {
            items.push({
                title,
                link,
                excerpt: description,
                published_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
            });
        }
    }
    return items;
}

// ─── Fetch RSS Feed ──────────────────────────────────────────────────────────
async function fetchRSSFeed(feedUrl) {
    try {
        const response = await fetch(feedUrl, {
            headers: { 'User-Agent': 'WDC-AI-News-Bot/1.0' },
            signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const xml = await response.text();
        return parseRSSItems(xml);
    } catch (err) {
        await log('feed_error', `Failed to fetch ${feedUrl}: ${err.message}`);
        return [];
    }
}

// ─── Check Duplicate ─────────────────────────────────────────────────────────
async function isDuplicate(title) {
    const { data } = await supabase
        .from('ai_news')
        .select('id')
        .eq('title', title)
        .limit(1);
    return data && data.length > 0;
}

// ─── Save News Item ──────────────────────────────────────────────────────────
async function saveNewsItem(item) {
    const { data, error } = await supabase
        .from('ai_news')
        .insert({
            title: item.title,
            excerpt: item.excerpt,
            link: item.link,
            published_at: item.published_at,
        })
        .select()
        .single();

    if (error) {
        await log('save_error', `Failed to save "${item.title}": ${error.message}`);
        return null;
    }
    await log('article_saved', `Saved: "${item.title}"`);
    return data;
}

// ─── Generate Blog Article via Gemini ────────────────────────────────────────
async function generateBlogArticle(title, excerpt) {
    const prompt = `Write a 800–1000 word SEO optimized blog article based on the following AI news.

Title: ${title}
Summary: ${excerpt}

Structure:
- Introduction
- What happened
- Key details
- Impact on AI industry
- What developers and businesses should know
- Future outlook
- Conclusion

Important rules:
- Use markdown headings (##) for each section
- Write in a professional but engaging tone
- Include relevant keywords naturally
- Do NOT include the title as an H1 — start directly with the introduction
- Make it informative and actionable`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Gemini API error ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) throw new Error('Empty response from Gemini');
        return content;
    } catch (err) {
        await log('generation_error', `Failed to generate article for "${title}": ${err.message}`);
        return null;
    }
}

// ─── Create Slug ─────────────────────────────────────────────────────────────
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 80)
        .replace(/^-|-$/g, '');
}

// ─── Publish Blog Post ──────────────────────────────────────────────────────
async function publishBlogPost(newsItem, content) {
    const slug = createSlug(newsItem.title);

    const { error } = await supabase.from('ai_blog_posts').insert({
        news_id: newsItem.id,
        title: newsItem.title,
        slug,
        excerpt: newsItem.excerpt,
        content,
        featured_image: `https://source.unsplash.com/800x400/?artificial-intelligence,technology`,
        tags: ['AI', 'Technology', 'News'],
        published: true,
    });

    if (error) {
        await log('publish_error', `Failed to publish blog "${newsItem.title}": ${error.message}`);
        return;
    }
    await log('blog_generated', `Published blog: "${newsItem.title}" → /blog/${slug}`);
}

// ─── Main Pipeline ───────────────────────────────────────────────────────────
async function runPipeline() {
    await log('feed_checked', `Starting RSS feed check across ${RSS_FEEDS.length} sources...`);

    let totalNew = 0;
    let totalSkipped = 0;

    for (const feedUrl of RSS_FEEDS) {
        const items = await fetchRSSFeed(feedUrl);
        await log('feed_checked', `Fetched ${items.length} items from ${feedUrl}`);

        for (const item of items) {
            // Deduplicate
            if (await isDuplicate(item.title)) {
                totalSkipped++;
                continue;
            }

            // Save to ai_news
            const savedItem = await saveNewsItem(item);
            if (!savedItem) continue;

            totalNew++;

            // Generate blog article
            let articleContent = await generateBlogArticle(item.title, item.excerpt);
            if (!articleContent) {
                console.log(`Fallback: Using original excerpt for "${item.title}" due to API error.`);
                articleContent = `${item.excerpt}\n\n[Read the full article here](${item.link})`;
            }
            await publishBlogPost(savedItem, articleContent);

            // Small delay to respect API rate limits
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    await log('feed_checked', `Pipeline complete. New: ${totalNew}, Skipped (duplicates): ${totalSkipped}`);
}

// ─── Scheduler ───────────────────────────────────────────────────────────────
console.log(`
╔══════════════════════════════════════════════╗
║  🤖 WDC AI News Automation                  ║
║  Checking RSS feeds every 10 minutes         ║
║  Press Ctrl+C to stop                        ║
╚══════════════════════════════════════════════╝
`);

// Run immediately on start
runPipeline().catch(console.error);

// Then run every 10 minutes
setInterval(() => {
    runPipeline().catch(console.error);
}, INTERVAL_MS);
