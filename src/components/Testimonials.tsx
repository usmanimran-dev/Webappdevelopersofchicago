import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from '../utils/gsapConfig';

const testimonials = [
    {
        name: 'Enterprise Client',
        role: 'Enterprise Sector',
        content: 'Incredibly efficient — delivered a very complex, secure enterprise solution in record time.',
        avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
        name: 'SaaS Startup Founder',
        role: 'Tech Industry',
        content: 'Went beyond coding — offered strategic architectural input that saved us thousands in cloud costs.',
        avatar: 'https://i.pravatar.cc/150?img=14'
    },
    {
        name: 'Logistics Director',
        role: 'Mobility Platform',
        content: 'Architected a system that effortlessly handles our massive data syncing and real-time tracking without breaking.',
        avatar: 'https://i.pravatar.cc/150?img=33'
    },
];

const clients = [
    'TechCorp', 'StartupXYZ', 'BrandCo', 'InnovateCo', 'DesignHub', 'CloudSys'
];

export const Testimonials = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        const ctx = gsap.context(() => {
            // Stagger testimonial cards
            gsap.from('.testimonial-card', {
                y: 80,
                opacity: 0,
                rotateX: 15,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: 'top 75%',
                },
            });

            // Client logos animation
            gsap.from('.client-logo', {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: '.clients-section',
                    start: 'top 85%',
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isInView]);

    return (
        <section ref={sectionRef} id="testimonials" className="py-24 bg-darkNavy relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05),transparent_70%)]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Client Testimonials</span>
                    </h2>
                    <p className="text-textSecondary text-lg max-w-2xl mx-auto">
                        Don't just take our word for it - hear what our clients have to say
                    </p>
                </motion.div>

                <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {testimonials.map((testimonial, _index) => (
                        <motion.div
                            key={testimonial.name}
                            className="testimonial-card group bg-cardBg rounded-2xl p-8 relative perspective-1000"
                            whileHover={{
                                y: -8,
                                rotateX: 2,
                                rotateY: 2,
                                scale: 1.02,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Quote icon */}
                            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Quote className="w-16 h-16 text-royalBlue" />
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        whileInView={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.5 }}
                                    >
                                        <Star className="w-5 h-5 text-mint fill-current" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <motion.img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full border-2 border-royalBlue/30 group-hover:border-mint transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                />
                                <div>
                                    <div className="text-textDark font-bold">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>

                            {/* Gradient Border on Hover */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-royalBlue to-mint opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none -z-10 blur-xl"></div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
