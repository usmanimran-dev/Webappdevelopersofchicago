import { useState, useEffect } from 'react';
import { fetchAllBlogs } from '@/services/public.api';
import { BlogPost as BlogPostType } from '@/types';
import { formatDate, readingTime } from '@/utils/formatters';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BookOpen, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BlogList() {
    const [blogs, setBlogs] = useState<BlogPostType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAllBlogs().then(data => {
            setBlogs(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-darkNavy text-white flex flex-col">
            <Header />
            <main className="flex-grow pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 backdrop-blur-sm mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-mint" />
                        <span className="text-mint font-semibold text-xs tracking-wider uppercase">WDC Publications</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-display mb-6"
                    >
                        Industry <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">Insights</span> & <br className="hidden md:block"/> News
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl text-lg"
                    >
                        Deep dives into enterprise architecture, AI integrations, scalable SaaS builds, and stories from our top engineers.
                    </motion.p>
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-mint rounded-full animate-spin"></div>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10">
                        <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No Articles Yet</h2>
                        <p className="text-white/50">Check back soon for our latest updates and engineering blogs.</p>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                            >
                                <Link 
                                    to={`/blog/${blog.slug}`} 
                                    className="group flex flex-col h-full bg-[#0d1428] hover:bg-[#121b36] border border-white/5 hover:border-mint/30 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,229,160,0.1)] hover:-translate-y-2"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-64 w-full overflow-hidden p-3 pb-0">
                                        <div className="relative h-full w-full rounded-3xl overflow-hidden">
                                            <div className="absolute inset-0 bg-darkNavy/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                            <img 
                                                src={blog.featured_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'} 
                                                alt={blog.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                            />
                                            <div className="absolute top-3 right-3 z-20">
                                                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-mint group-hover:border-mint transition-all duration-300">
                                                    <ArrowUpRight className="w-5 h-5 text-white group-hover:text-darkNavy block" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-3 left-3 z-20">
                                                <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                                        {blog.tags?.[0] || 'Engineering'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-[11px] font-bold text-mint tracking-widest uppercase mb-4">
                                            <span>{formatDate(blog.created_at)}</span>
                                            <div className="w-1 h-1 rounded-full bg-mint/50"></div>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {readingTime(blog.content)}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white leading-tight mb-4 group-hover:text-mint transition-colors line-clamp-3">
                                            {blog.title}
                                        </h3>
                                        <p className="text-sm text-white/50 leading-relaxed mb-8 line-clamp-3 flex-grow">
                                            {blog.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-mint transition-colors mt-auto pt-6 border-t border-white/5">
                                            Read Article <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
}
