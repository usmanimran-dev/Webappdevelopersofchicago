import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './Button';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { useRef, useEffect, useState } from 'react';
import { gsap } from '../utils/gsapConfig';
import { useMousePosition } from '../hooks/useMousePosition';
import HireUsModal from './HireUsModal';

export const Hero = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const mousePosition = useMousePosition();
    const { scrollY } = useScroll();
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    // Parallax transforms based on scroll
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Mouse parallax for background orbs

    const orbX = (mousePosition.x - window.innerWidth / 2) * 0.02;
    const orbY = (mousePosition.y - window.innerHeight / 2) * 0.02;

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Smooth fade-in for badge instead of bouncing
            gsap.from('.hero-badge', { opacity: 0, scale: 0.9, duration: 1, ease: 'power3.out', delay: 0.2 });

            // Stagger animation for hero content
            gsap.from('.hero-content-item', {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.3,
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const scrollToNextSection = () => {
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
        <section
            ref={sectionRef}
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-darkNavy"
        >
            {/* Enterprise Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/fintech_hero_bg.png"
                    alt="Enterprise Solutions Background"
                    className="w-full h-full object-cover opacity-20"
                />
            </div>

            {/* Dark Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-darkNavy/50"></div>

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

            {/* Floating Gradient Orbs with mouse parallax */}
            <motion.div
                style={{
                    x: orbX,
                    y: orbY + y1.get(),
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/4 -left-48 w-96 h-96 bg-royalBlue rounded-full blur-3xl"
            />
            <motion.div
                style={{
                    x: -orbX,
                    y: -orbY + y2.get(),
                }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.15, 0.25, 0.15],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-1/4 -right-48 w-96 h-96 bg-mint rounded-full blur-3xl"
            />

            <motion.div
                style={{ opacity }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20"
            >
                {/* Badge */}
                <div className="hero-badge hero-content-item flex items-center justify-center mb-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-royalBlue/10 border border-royalBlue/20 backdrop-blur-sm">
                        <Sparkles className="text-mint mr-2" size={20} />
                        <span className="text-textSecondary font-medium uppercase tracking-wide text-sm">Software Development Agency</span>
                    </div>
                </div>

                {/* Main Headline with 3D effect */}
                <h1 className="hero-content-item text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight perspective-1000">
                    <span className="block text-white transform transition-transform duration-700 hover:scale-105">Software</span>
                    <span className="block gradient-text transform transition-transform duration-700 hover:scale-105">Engineers & Developers</span>
                </h1>

                {/* Subheadline */}
                <p className="hero-content-item text-xl md:text-2xl text-textSecondary mb-12 max-w-3xl mx-auto leading-relaxed">
                    Building scalable, modern web & mobile applications — transforming complex logic into intuitive products.
                </p>

                {/* CTA Buttons with magnetic effect */}
                <div className="hero-content-item flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <MagneticButton strength={0.4}>
                        <Button
                            variant="mint"
                            size="lg"
                            className="group min-w-[200px] transform transition-all duration-300 hover:scale-105 hover:shadow-glow-mint"
                            onClick={() => setIsHireModalOpen(true)}
                        >
                            Hire Us
                            <ArrowRight className="ml-2 inline-block group-hover:translate-x-1 transition-transform" size={20} />
                        </Button>
                    </MagneticButton>
                    <MagneticButton strength={0.3}>
                        <Button
                            variant="outline"
                            size="lg"
                            className="min-w-[200px] transform transition-all duration-300 hover:scale-105"
                            onClick={() => {
                                const element = document.querySelector('#projects');
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            View Our Work
                        </Button>
                    </MagneticButton>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group"
                    onClick={scrollToNextSection}
                >
                    <motion.div
                        animate={{
                            y: [0, 10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-textSecondary text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
                        <ChevronDown className="text-textSecondary group-hover:text-mint transition-colors" size={32} />
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>

        {/* Hire Us Modal */}
        <HireUsModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
        </>
    );
};

export default Hero;

