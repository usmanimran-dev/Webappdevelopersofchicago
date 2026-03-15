import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { AnnouncementBar } from './AnnouncementBar';
import logoUrl from '../assets/ChatGPT Image Mar 12, 2026, 03_18_26 AM.png';
import HireUsModal from './HireUsModal';
import { AIEstimatorModal } from './AIEstimatorModal';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/#services' },
        { label: 'Projects', href: '/#projects' },
        { label: 'Blog', href: '/blog' },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#') && window.location.pathname === '/') {
            e.preventDefault();
            const element = document.querySelector(href.replace('/', ''));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                setIsMobileMenuOpen(false);
            }
        }
    };

    return (<>
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex flex-col ${isScrolled
                ? 'bg-darkNavy/80 backdrop-blur-xl shadow-premium border-b border-white/5 supports-[backdrop-filter]:bg-darkNavy/60'
                : 'bg-transparent'
                }`}
        >
            <AnnouncementBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex items-center justify-between h-24 md:h-28">
                    {/* Logo */}
                    <motion.a
                        href="#home"
                        onClick={(e) => scrollToSection(e, '#home')}
                        className="flex items-center group py-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="relative h-24 sm:h-32 md:h-40 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={logoUrl} alt="Agency Logo" className="w-auto h-full object-contain drop-shadow-lg" />
                        </motion.div>
                    </motion.a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                onMouseEnter={() => setHoveredPath(item.href)}
                                onMouseLeave={() => setHoveredPath(null)}
                                className="relative px-4 py-2 rounded-lg font-medium text-textSecondary hover:text-white transition-colors"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                            >
                                <span className="relative z-10">{item.label}</span>
                                {hoveredPath === item.href && (
                                    <motion.div
                                        className="absolute inset-0 bg-white/10 rounded-lg -z-0"
                                        layoutId="navbar-hover"
                                        transition={{
                                            type: "spring",
                                            bounce: 0.2,
                                            duration: 0.6
                                        }}
                                    />
                                )}
                            </motion.a>
                        ))}
                    </nav>

                    {/* CTA Button and AI Estimate - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <motion.button
                            onClick={() => setIsEstimateModalOpen(true)}
                            className="hidden items-center gap-2 px-4 py-2 rounded-xl border border-mint/30 text-mint font-medium hover:bg-mint/10 hover:border-mint transition-all pointer-events-none opacity-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 0, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Sparkles className="w-4 h-4" /> AI Estimate
                        </motion.button>
                        
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button
                                variant="mint"
                                className="shadow-glow-mint hover:shadow-glow-mint-lg transition-shadow duration-300"
                                onClick={() => setIsHireModalOpen(true)}
                            >
                                Get Started
                            </Button>
                        </motion.div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                        whileTap={{ scale: 0.9 }}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Scroll Progress Bar */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-royalBlue via-mint to-royalBlue origin-left"
                style={{ scaleX }}
            />

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden overflow-hidden bg-darkNavy/95 backdrop-blur-xl border-t border-white/10"
                    >
                        <nav className="px-4 py-4 space-y-2">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className="block px-4 py-3 rounded-lg font-medium text-textSecondary hover:bg-white/10 hover:text-white transition-colors"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                            <motion.div
                                className="pt-2 flex flex-col gap-3"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <button
                                    className="hidden items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-mint/30 text-mint font-medium hover:bg-mint/10 transition-all pointer-events-none opacity-0"
                                    onClick={() => {
                                        setIsEstimateModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <Sparkles className="w-4 h-4" /> AI Project Estimate
                                </button>
                                <Button
                                    variant="mint"
                                    className="w-full"
                                    onClick={() => {
                                        setIsHireModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    Get Started
                                </Button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>

        {/* Hire Us Modal */}
        <HireUsModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
        {/* AI Estimator Modal */}
        <AIEstimatorModal isOpen={isEstimateModalOpen} onClose={() => setIsEstimateModalOpen(false)} />
    </>);
}
