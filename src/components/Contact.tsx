import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Button } from './Button';
import { MagneticButton } from './MagneticButton';
import { useRef, useEffect } from 'react';
import { gsap } from '../utils/gsapConfig';

export const Contact = () => {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.contact-reveal', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 70%',
                },
            });
        }, formRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="contact" className="relative py-32 overflow-hidden bg-darkNavy">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-royalBlue/10 via-darkNavy to-black pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
                    {/* Left Column: Typography & Info */}
                    <div className="space-y-12">
                        <div>
                            <motion.h2
                                className="contact-reveal text-6xl md:text-8xl font-bold font-display leading-tight mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                Let's start a <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">project</span>
                            </motion.h2>
                            <p className="contact-reveal text-xl text-textSecondary max-w-md">
                                We help ambitious brands build the future. Get in touch and let's build something extraordinary.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="contact-reveal">
                                <span className="block text-sm text-mint mb-2 font-mono tracking-wider">EMAIL US</span>
                                <a href="mailto:inquiry@wdc.com" className="text-xl md:text-2xl font-medium text-white hover:text-mint transition-colors inline-flex items-center gap-2 group break-all">
                                    inquiry@wdc.com
                                    <ArrowUpRight className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform flex-shrink-0" />
                                </a>
                            </div>

                            <div className="contact-reveal">
                                <span className="block text-sm text-mint mb-2 font-mono tracking-wider">CALL US</span>
                                <a href="tel:+923259283582" className="text-2xl md:text-3xl font-medium text-white hover:text-mint transition-colors inline-flex items-center gap-2 group">
                                    +92 3259283582
                                    <ArrowUpRight className="w-6 h-6 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Minimal Form */}
                    <form ref={formRef} className="space-y-8 lg:pl-10">
                        <div className="contact-reveal">
                            <label className="block text-sm font-medium tracking-widest text-mint uppercase mb-3">01. What's your name?</label>
                            <input
                                type="text"
                                placeholder="John Doe *"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all shadow-sm"
                            />
                        </div>

                        <div className="contact-reveal">
                            <label className="block text-sm font-medium tracking-widest text-mint uppercase mb-3">02. What's your email?</label>
                            <input
                                type="email"
                                placeholder="john@example.com *"
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all shadow-sm"
                            />
                        </div>

                        <div className="contact-reveal">
                            <label className="block text-sm font-medium tracking-widest text-mint uppercase mb-3">03. Tell us about your project</label>
                            <textarea
                                rows={4}
                                placeholder="I need a custom software solution for..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 text-white placeholder-white/20 focus:border-mint focus:bg-white/10 focus:outline-none transition-all resize-none shadow-sm"
                            />
                        </div>

                        <div className="contact-reveal pt-8">
                            <MagneticButton strength={0.3}>
                                <Button type="submit" variant="mint" size="lg" className="w-full md:w-auto px-12 py-6 text-lg rounded-full">
                                    Send Message
                                </Button>
                            </MagneticButton>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
