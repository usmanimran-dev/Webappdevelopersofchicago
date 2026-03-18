import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBlogBySlug } from '@/services/public.api';
import { BlogPost as BlogPostType } from '@/types';
import { formatDate, readingTime, getValidImageUrl, stripHtml } from '@/utils/formatters';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

/**
 * Cleans article content for display:
 * - Decodes HTML entities
 * - Removes bracket artifacts like [Read more], [source], etc.
 * - Keeps valid HTML links intact
 */
function cleanArticleContent(content: string): string {
    if (!content) return '';
    let text = content;
    // Decode HTML entities
    text = text.replace(/&lt;/gi, '<');
    text = text.replace(/&gt;/gi, '>');
    text = text.replace(/&amp;/gi, '&');
    text = text.replace(/&quot;/gi, '"');
    text = text.replace(/&#39;/gi, "'");
    text = text.replace(/&nbsp;/gi, ' ');
    // Remove markdown-style links and convert to HTML links
    text = text.replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-mint hover:underline">$1</a>'
    );
    // Remove leftover bracket artifacts (but not the <a> tags we just created)
    text = text.replace(/\[[^\]]{0,40}\]/g, '');
    return text;
}

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (slug) {
            fetchBlogBySlug(slug).then(data => {
                setBlog(data);
                setLoading(false);
            });
        }
    }, [slug]);

    return (
        <div className="min-h-screen bg-darkNavy text-white">
            {blog && (
                <Helmet>
                    <title>{blog.title} | WDC</title>
                    <meta name="description" content={blog.excerpt || `Read ${blog.title} by WDC - Premium Web Development Agency.`} />
                    <meta property="og:title" content={blog.title} />
                    <meta property="og:description" content={blog.excerpt} />
                    {blog.featured_image && <meta property="og:image" content={getValidImageUrl(blog.featured_image)} />}
                    <meta property="og:type" content="article" />
                    <meta name="twitter:card" content="summary_large_image" />
                </Helmet>
            )}
            <Header />
            <main className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Link to="/blog" className="inline-flex items-center text-mint hover:underline mb-8 font-semibold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blogs
                </Link>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-mint animate-spin" />
                    </div>
                ) : !blog ? (
                    <div className="text-center py-20">
                        <h2 className="text-3xl font-bold mb-4">Blog Post Not Found</h2>
                        <p className="text-white/60">The article you are looking for does not exist.</p>
                    </div>
                ) : (
                    <article>
                        <header className="mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6">
                                {blog.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-white/50 border-b border-white/10 pb-8">
                                <span className="font-semibold text-white/80">{formatDate(blog.created_at)}</span>
                                <span>•</span>
                                <span>{readingTime(stripHtml(blog.content))}</span>
                            </div>
                        </header>
                        
                        {blog.featured_image && (
                            <img 
                                src={getValidImageUrl(blog.featured_image)} 
                                alt={blog.title} 
                                className="w-full h-auto rounded-2xl mb-12 shadow-2xl object-cover max-h-[500px]"
                            />
                        )}

                        <div 
                            className="prose prose-invert prose-lg max-w-none 
                                        prose-headings:font-display prose-a:text-mint hover:prose-a:underline
                                        whitespace-pre-wrap leading-relaxed text-white/80"
                            dangerouslySetInnerHTML={{ __html: cleanArticleContent(blog.content) }}
                        />

                        {/* Read Full Article link */}
                        {blog.source_url && (
                            <div className="mt-12 pt-8 border-t border-white/10">
                                <a
                                    href={blog.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-mint hover:underline font-bold text-lg inline-flex items-center gap-2"
                                >
                                    Read full article here
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        )}
                    </article>
                )}
            </main>
            <Footer />
        </div>
    );
}
