import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Megaphone, ArrowRight } from 'lucide-react';
import { fetchAllBlogs } from '@/services/public.api';

export const AnnouncementBar = () => {
    const [announcements, setAnnouncements] = useState<{ title: string; link: string }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Fetch real blogs and use them as announcements
        fetchAllBlogs()
            .then(data => {
                if (data && data.length > 0) {
                    setAnnouncements(data.map(b => ({ 
                        title: b.title, 
                        link: `/blog/${b.slug}` 
                    })));
                } else {
                    setAnnouncements([{ 
                        title: "Welcome to WDC! Discover our Premium Software Solutions.", 
                        link: "/#services" 
                    }]);
                }
            })
            .catch(console.error);
    }, []);

    // Change announcement every 5 seconds
    useEffect(() => {
        if (announcements.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % announcements.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [announcements.length]);

    if (announcements.length === 0) return null;

    const currentAnnouncement = announcements[currentIndex];
    const isSectionLink = currentAnnouncement.link.startsWith('/#');

    return (
        <div className="relative z-50 bg-transparent border-b border-white/5 text-white/90 py-2 px-4 text-[13px] sm:text-sm font-medium w-full flex items-center justify-center overflow-hidden h-[40px]">
            {/* Subtle animated shine */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
            
            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex items-center gap-2 relative z-10 w-full justify-center"
                >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint/20 text-mint shadow-[0_0_10px_rgba(0,229,160,0.3)]">
                        {!isSectionLink ? <Sparkles className="w-3 h-3" /> : <Megaphone className="w-3 h-3" />}
                    </span>
                    <span className="hidden sm:inline text-white/50 tracking-wider text-xs uppercase font-bold">
                        {!isSectionLink ? 'Trending News' : 'ANNOUNCEMENT'}
                    </span>
                    <div className="h-3 w-px bg-white/20 hidden sm:block mx-1"></div>
                    <a 
                        href={currentAnnouncement.link} 
                        className="font-semibold text-white hover:text-mint transition-colors inline-flex items-center gap-1 group truncate max-w-[250px] sm:max-w-none"
                        onClick={(e) => {
                            if (isSectionLink) {
                                e.preventDefault();
                                const element = document.querySelector(currentAnnouncement.link.replace('/', ''));
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }
                        }}
                    >
                        {currentAnnouncement.title}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform opacity-70 flex-shrink-0" />
                    </a>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
