import fs from 'fs';

const env = Object.fromEntries(
    fs.readFileSync('.env', 'utf-8')
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.split('=').map(str => str.trim()))
);

const url = env.VITE_SUPABASE_URL + '/rest/v1/ai_blog_posts?select=id,news_id,content';
const headers = {
    'apikey': env.VITE_SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + env.VITE_SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
};

async function cleanBadPosts() {
    console.log('Fetching posts...');
    const response = await fetch(url, { headers });
    const posts = await response.json();
    
    if (posts.error) {
        console.error('Error fetching:', posts.error);
        return;
    }
    
    if (!Array.isArray(posts)) {
        console.error('Expected array, got:', posts);
        return;
    }

    const badPosts = posts.filter(p => !p.content || p.content.length < 300);
    console.log(`Found ${badPosts.length} bad posts.`);
    
    if (badPosts.length > 0) {
        const newsIds = badPosts.map(p => p.news_id).filter(Boolean);
        console.log(`Deleting ${newsIds.length} corresponding news items...`);
        
        const deleteUrl = env.VITE_SUPABASE_URL + '/rest/v1/ai_news?id=in.(' + newsIds.join(',') + ')';
        const deleteResponse = await fetch(deleteUrl, { 
            method: 'DELETE',
            headers
        });
        
        if (!deleteResponse.ok) {
            console.error('Failed to delete:', await deleteResponse.text());
        } else {
            console.log(`Successfully deleted short/empty blog posts.`);
        }
    } else {
        console.log('No bad posts found.');
    }
}

cleanBadPosts();
