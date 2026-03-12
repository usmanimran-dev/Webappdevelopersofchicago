import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Fingerprint } from "lucide-react";
import { useRef, useEffect, useState } from 'react';
import { gsap } from '../utils/gsapConfig';
import { fetchAllBlogs } from '@/services/public.api';
import { BlogPost } from '@/types';
import { formatDate, readingTime } from '@/utils/formatters';
import { Link } from 'react-router-dom';

export default function Blog() {
    const sectionRef = useRef<HTMLElement>(null);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);

    useEffect(() => {
        fetchAllBlogs().then(data => {
            setBlogs(data.slice(0, 3)); // Only show latest 3
        });
    }, []);

    useEffect(() => {
        if (blogs.length === 0) return;
        const ctx = gsap.context(() => {
            gsap.from('.blog-card', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                },
            });
        }, sectionRef);
        return () => ctx.revert();
    }, [blogs]);

    return (
        <section ref={sectionRef} id="blog" className="py-32 bg-darkNavy relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-mint/5 via-darkNavy to-black pointer-events-none" />
            <div className="container mx-auto px-6 max-w-7xl relative z-10">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <motion.h2
                            className="text-5xl md:text-7xl font-bold font-display leading-tight mb-4 text-white"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            Latest <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">Insights</span>
                        </motion.h2>
                    </div>
                    
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/blog" className="group flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 font-semibold border border-white/10 hover:border-mint/50 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md">
                            View All Articles
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-mint" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.map((blog, idx) => (
                        <Link
                            key={blog.id}
                            to={`/blog/${blog.slug}`}
                            className="blog-card group relative flex flex-col p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-mint/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,229,160,0.15)] flex-grow"
                        >
                            {/* Decorative background glow on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-mint/0 via-mint/0 to-mint/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3 bg-mint/10 border border-mint/20 rounded-2xl text-mint transition-all transform group-hover:scale-110 group-hover:bg-mint/20 duration-500">
                                        {idx % 2 === 0 ? <BookOpen className="w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-mint border border-white/10 text-white/50 transition-colors duration-500">
                                        <ArrowUpRight className="w-5 h-5 group-hover:text-darkNavy block" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white leading-snug mb-4 group-hover:text-mint transition-colors line-clamp-3">
                                    {blog.title}
                                </h3>
                                <p className="text-sm text-white/50 leading-relaxed line-clamp-4 flex-grow mb-8">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                                    <span className="text-[10px] font-bold tracking-widest text-mint uppercase">
                                        {formatDate(blog.created_at)}
                                    </span>
                                    <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase border border-white/10 px-3 py-1.5 rounded-lg group-hover:border-white/30 transition-colors bg-black/20">
                                        {readingTime(blog.content)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
