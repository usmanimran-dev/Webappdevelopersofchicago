import { motion } from 'framer-motion';
import { Award, Users, Target, Sparkles } from 'lucide-react';

const stats = [
    { icon: Award, label: 'Years Experience', value: '10+' },
    { icon: Users, label: 'Enterprise Clients', value: 'Global' },
    { icon: Target, label: 'Scalable Platforms', value: 'Production' },
];

export const About = () => {
    return (
        <section id="about" className="py-24 bg-darkNavy relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left side - Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-mint/10 border border-mint/20 backdrop-blur-sm mb-6">
                            <Sparkles className="text-mint mr-2" size={16} />
                            <span className="text-mint font-medium text-sm">About WDC</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Architecting resilient systems
                            <span className="block gradient-text">for Enterprise & Fintech.</span>
                        </h2>

                        <p className="text-white text-lg mb-6 leading-relaxed">
                            We are WDC (Webapp Developers of Chicago), a premium Software Development Agency with a specialized focus on Enterprise Fintech, SaaS architecture, and expansive Digital Mobility & Logistics platforms.
                        </p>

                        <p className="text-textSecondary text-lg leading-relaxed mb-8">
                            We've helped major banking institutions (like HBL and Finastra), mobility platforms (like Swifpack), and agile SaaS startups build and scale highly resilient, production-grade applications. Our expertise spans clean logic engines, real-time tracking, B2B data synchronization, and secure, high-availability deployments.
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="h-1 w-20 bg-gradient-to-r from-royalBlue to-mint rounded-full"></div>
                            <span className="text-textSecondary font-medium">To engineer systems that empower users and scale dynamically.</span>
                        </div>
                    </motion.div>

                    {/* Right side - Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 gap-6"
                    >
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group bg-cardBg rounded-2xl p-8 hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-royalBlue to-mint p-3 flex items-center justify-center group-hover:scale-110 group-hover:shadow-glow-blue transition-all duration-300">
                                            <Icon className="w-full h-full text-white" />
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold text-textDark mb-1 group-hover:text-royalBlue transition-colors">{stat.value}</div>
                                            <div className="text-gray-600 font-medium">{stat.label}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
