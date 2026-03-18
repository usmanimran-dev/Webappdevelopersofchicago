import { motion, useInView } from 'framer-motion';
import { Code, Smartphone, Database, Wrench, Globe, Cloud } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { gsap } from '../utils/gsapConfig';

const services = [
    {
        title: 'Full-Stack Development',
        description: 'Building highly resilient, production-grade platforms with React.js, Next.js, and Node.js.',
        icon: Code,
        stack: ['React.js', 'Next.js', 'Node.js']
    },
    {
        title: 'Enterprise Solutions & Banking',
        description: 'System architecture for major banking institutions (e.g., HBL, Finastra) with compliance-heavy workflows.',
        icon: Globe,
        stack: ['Angular', 'Node.js', 'AWS']
    },
    {
        title: 'Digital Mobility & Logistics',
        description: 'Integrated ride-sharing, real-time fleet tracking, and courier delivery platforms (e.g., Swifpack).',
        icon: Smartphone,
        stack: ['Flutter', 'Real-time', 'MQTT']
    },
    {
        title: 'Backend & Database Engineering',
        description: 'Designing scalable data models and APIs with Node.js, Prisma, PostgreSQL, and Supabase.',
        icon: Database,
        stack: ['PostgreSQL', 'Prisma', 'Supabase']
    },
    {
        title: 'Cloud & DevOps',
        description: 'AWS, CI/CD pipelines, zero-downtime deployments for high-availability systems.',
        icon: Cloud,
        stack: ['AWS', 'Docker', 'CI/CD']
    },
    {
        title: 'Complex Integrations',
        description: 'Secure payments, custom B2B sync engines, IoT telemetry (e.g., Smart Pump).',
        icon: Wrench,
        stack: ['B2B', 'IoT', 'Stripe']
    },
];

export const Services = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        const ctx = gsap.context(() => {
            //  Stagger reveal for service cards
            gsap.from('.service-card', {
                y: 40,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: 'top 85%',
                },
            });

            // Heading animation
            gsap.from('.services-heading', {
                y: 30,
                duration: 0.8,
                ease: 'power2.out',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isInView]);

    return (
        <section ref={sectionRef} id="services" className="py-24 bg-darkNavy relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={headingRef} className="services-heading text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="gradient-text">Our Services</span>
                    </h2>
                    <p className="text-textSecondary text-lg max-w-2xl mx-auto">
                        Professional web development solutions to bring your vision to life
                    </p>
                </div>

                <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((svc, _index) => {
                        const Icon = svc.icon;
                        return (
                            <motion.div
                                key={svc.title}
                                className="service-card flex flex-col group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-mint/30 transition-all duration-300 hover:bg-white/10 cursor-pointer overflow-hidden"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Icon Container */}
                                <div className="w-14 h-14 rounded-xl bg-mint/10 border border-mint/20 text-mint flex items-center justify-center mb-6 group-hover:bg-mint group-hover:text-darkNavy transition-colors duration-300">
                                    <Icon className="w-7 h-7" />
                                </div>

                                {/* Content */}
                                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-mint transition-colors duration-300">
                                    {svc.title}
                                </h3>

                                <p className="text-white/70 leading-relaxed mb-6 flex-grow">
                                    {svc.description}
                                </p>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {svc.stack.map(tech => (
                                        <span key={tech} className="text-xs font-medium text-white/50 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Services;
