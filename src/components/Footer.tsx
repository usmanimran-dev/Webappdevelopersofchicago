import { motion } from 'framer-motion';
import {  Linkedin,  Facebook } from 'lucide-react';
import logoUrl from '../assets/ChatGPT Image Mar 12, 2026, 03_18_26 AM.png';

export const Footer = () => {
    return (
        <footer className="bg-darkNavy border-t border-white/10 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center mb-6">
                            <div className="h-32 sm:h-40 md:h-48 flex items-center">
                                <img src={logoUrl} alt="Agency Logo" className="w-auto h-full object-contain drop-shadow-lg" />
                            </div>
                        </div>
                        <p className="text-textSecondary mb-6 max-w-md">
                            Building powerful web solutions that transform businesses and deliver exceptional results.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61579562632163', label: 'Facebook', target: '_blank', rel: 'noopener noreferrer' },
                                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                            ].map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target={social.target || '_self'}
                                        rel={social.rel || ''}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 hover:border-mint hover:bg-mint/10 flex items-center justify-center transition-all duration-300"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5 text-textSecondary hover:text-mint transition-colors" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-4 font-display">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Services', href: '/#services' },
                                { label: 'Projects', href: '/#projects' },
                                { label: 'About', href: '/#about' },
                                { label: 'Blog', href: '/blog' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-textSecondary hover:text-mint transition-colors duration-300 inline-flex items-center group"
                                    >
                                        <span className="w-0 h-px bg-mint group-hover:w-4 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-4 font-display">Contact</h4>
                        <ul className="space-y-3 text-textSecondary">
                            <li className="hover:text-mint transition-colors duration-300">
                                <a href="mailto:inquiry@wdc.com">inquiry@wdc.com</a>
                            </li>
                            <li>Chicago, IL</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-textSecondary text-sm">
                        © {new Date().getFullYear()} WDC. All rights reserved.
                    </p>
                    <p className="text-textSecondary text-sm flex items-center gap-2">
                        Made with <Heart className="w-4 h-4 text-mint fill-current animate-pulse" /> by WDC
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
