import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, ArrowRight, CheckCircle2, Bot, Code2, Clock, Mail, Send } from 'lucide-react';

interface AIEstimatorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EstimateData {
    minPrice: number;
    maxPrice: number;
    timeline: string;
    features: string[];
    techStack: string[];
    summary: string;
}

export const AIEstimatorModal: React.FC<AIEstimatorModalProps> = ({ isOpen, onClose }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [estimate, setEstimate] = useState<EstimateData | null>(null);
    const [userEmail, setUserEmail] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    const handleEstimate = async () => {
        if (description.trim().length < 15) {
            setError('Please provide a bit more detail (at least 15 characters) so the AI can analyze your project properly.');
            return;
        }

        setLoading(true);
        setError(null);
        setEmailSent(false);
        setEmailError(null);

        try {
            const res = await fetch('/api/estimate-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectDescription: description })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to get estimate');
            }

            const data = await res.json();
            setEstimate(data);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async () => {
        if (!userEmail || !userEmail.includes('@')) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setSendingEmail(true);
        setEmailError(null);

        try {
            const res = await fetch('/api/send-estimate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, estimateData: estimate })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to send email');
            }

            setEmailSent(true);
        } catch (err: any) {
            setEmailError(err.message || 'Failed to send email.');
        } finally {
            setSendingEmail(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-darkNavy/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-darkNavy border border-white/10 rounded-3xl shadow-2xl shadow-mint/10 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-mint/20 text-mint flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold font-display text-white">AI Project Estimator</h3>
                                    <p className="text-sm text-white/50">Get an instant quote and timeline powered by Gemini</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            {!estimate ? (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-white/80 mb-2">
                                            Describe your project in detail
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Example: I need a highly secure SaaS dashboard for accountants that integrates with QuickBooks, allows users to upload PDF receipts, and generates monthly tax reports..."
                                            className="w-full h-40 bg-darkNavy border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition-all resize-none"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleEstimate}
                                        disabled={loading || description.length < 5}
                                        className="w-full relative group overflow-hidden rounded-xl p-[1px] disabled:opacity-50"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-mint via-emerald-500 to-mint opacity-70 group-hover:opacity-100 animate-gradient-xy transition-opacity" />
                                        <div className="relative bg-darkNavy px-8 py-4 rounded-xl flex items-center justify-center gap-2 group-hover:bg-opacity-0 transition-all duration-300">
                                            {loading ? (
                                                <><Loader2 className="w-5 h-5 animate-spin text-mint group-hover:text-darkNavy" /> <span className="text-white group-hover:text-darkNavy font-bold tracking-wide">Analyzing Project...</span></>
                                            ) : (
                                                <><Sparkles className="w-5 h-5 text-mint group-hover:text-darkNavy transition-colors" /> <span className="text-white group-hover:text-darkNavy font-bold tracking-wide">Generate AI Estimate</span></>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Cost & Timeline Tracker */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <div className="text-white/50 text-sm font-semibold mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                                                ESTIMATED INVESTMENT
                                            </div>
                                            <div className="text-2xl font-bold font-display text-white">
                                                {formatCurrency(estimate.minPrice)} <span className="text-white/30 text-xl font-normal">to</span> {formatCurrency(estimate.maxPrice)}
                                            </div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                            <div className="text-white/50 text-sm font-semibold mb-2 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-royalBlue" />
                                                ESTIMATED TIMELINE
                                            </div>
                                            <div className="text-2xl font-bold font-display text-white">
                                                {estimate.timeline}
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Summary */}
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-2">Project Analysis</h4>
                                        <p className="text-white/70 leading-relaxed text-sm">
                                            {estimate.summary}
                                        </p>
                                    </div>

                                    {/* Features & Tech */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-mint" /> 
                                                Recommended Features
                                            </h4>
                                            <ul className="space-y-3">
                                                {estimate.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-mint/50 mt-1.5 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                                <Code2 className="w-4 h-4 text-royalBlue" /> 
                                                Suggested Tech Stack
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {estimate.techStack.map((tech, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-royalBlue/10 border border-royalBlue/20 text-royalBlue text-xs font-semibold rounded-lg">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Capture */}
                                    <div className="pt-8 border-t border-white/10">
                                        {emailSent ? (
                                            <div className="bg-mint/10 border border-mint/20 rounded-2xl p-6 text-center">
                                                <div className="w-12 h-12 bg-mint/20 text-mint rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-white font-bold mb-1">Estimate Sent!</h4>
                                                <p className="text-white/60 text-sm">Check your inbox at {userEmail} for your custom breakdown.</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-royalBlue" />
                                                    Email me this estimate
                                                </h4>
                                                <p className="text-white/50 text-xs mb-4">We'll send a full copy of this analysis and private access to our discovery booking link.</p>
                                                
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <input 
                                                        type="email" 
                                                        placeholder="you@example.com"
                                                        value={userEmail}
                                                        onChange={(e) => setUserEmail(e.target.value)}
                                                        className="flex-1 bg-darkNavy border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-mint transition-all"
                                                    />
                                                    <button
                                                        onClick={handleSendEmail}
                                                        disabled={sendingEmail}
                                                        className="bg-mint text-darkNavy font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-mintDark transition-all disabled:opacity-50"
                                                    >
                                                        {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                        Send
                                                    </button>
                                                </div>
                                                {emailError && <p className="text-red-400 text-xs mt-2">{emailError}</p>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Reset CTA */}
                                    <button 
                                        onClick={() => setEstimate(null)}
                                        className="w-full text-center text-sm text-white/40 hover:text-white transition-colors"
                                    >
                                        ← Recalculate with different requirements
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AIEstimatorModal;
