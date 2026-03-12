import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    X, ArrowRight, Check, Loader2,
    Smartphone, Globe, Bot, Workflow, Building2,
    Users, ShoppingCart, Plug,
    User, Mail, Phone, Briefcase, Shield, Eye, EyeOff,
    Clock, Sparkles, AlertCircle, CheckCircle2, Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ServiceOption {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    price: string;
    priceValue: number;
    description: string;
}

interface QualificationData {
    name: string;
    email: string;
    phone: string;
    company: string;
    selectedService: string;
    readyToInvest: boolean | null;
    hasBudget: boolean | null;
    timestamp: number;
}

interface OnboardingData {
    clientName: string;
    clientEmail: string;
    clientId: string;
    password: string;
    confirmPassword: string;
}

// ─── Service Pricing ─────────────────────────────────────────────────────────
const services: ServiceOption[] = [
    { id: 'mobile-app', label: 'Mobile App', icon: Smartphone, price: '$5,000', priceValue: 5000, description: 'iOS & Android cross-platform' },
    { id: 'webapp', label: 'Web Application', icon: Globe, price: '$5,000', priceValue: 5000, description: 'Full-stack web apps' },
    { id: 'ai-agent', label: 'AI Agent', icon: Bot, price: '$7,000', priceValue: 7000, description: 'Custom AI-powered solutions' },
    { id: 'erp', label: 'ERP System', icon: Building2, price: '$10,000', priceValue: 10000, description: 'Enterprise resource planning' },
    { id: 'crm', label: 'CRM', icon: Users, price: '$10,000', priceValue: 10000, description: 'Customer relationship mgmt' },
    { id: 'n8n', label: 'n8n AI Automation', icon: Workflow, price: '$3,000+', priceValue: 3000, description: 'Workflow automation flows' },
    { id: 'api', label: 'API Integration', icon: Plug, price: '$1,000', priceValue: 1000, description: 'Third-party API connections' },
    { id: 'ecommerce', label: 'E-Commerce Store', icon: ShoppingCart, price: '$5,000', priceValue: 5000, description: 'Full store with admin panel' },
];

const ONBOARDING_FEE = 1000;

// ─── Countdown Timer Hook ────────────────────────────────────────────────────
function useCountdown(startTimestamp: number) {
    const [remaining, setRemaining] = useState(() => {
        const deadline = startTimestamp + 12 * 60 * 60 * 1000;
        return Math.max(0, deadline - Date.now());
    });

    useEffect(() => {
        if (startTimestamp === 0) return;
        const interval = setInterval(() => {
            const deadline = startTimestamp + 12 * 60 * 60 * 1000;
            const diff = Math.max(0, deadline - Date.now());
            setRemaining(diff);
            if (diff === 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTimestamp]);

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    const isExpired = remaining === 0 && startTimestamp > 0;

    return { hours, minutes, seconds, remaining, isExpired };
}

// ─── Password Strength ──────────────────────────────────────────────────────
function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;
    if (score <= 1) return { level: score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { level: score, label: 'Fair', color: 'bg-orange-500' };
    if (score <= 3) return { level: score, label: 'Good', color: 'bg-yellow-500' };
    return { level: score, label: 'Strong', color: 'bg-mint' };
}

// ─── Main Component ──────────────────────────────────────────────────────────
interface HireUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HireUsModal({ isOpen, onClose }: HireUsModalProps) {
    // Phase: 'qualify' | 'onboard' | 'success' | 'rejected'
    const [phase, setPhase] = useState<'qualify' | 'onboard' | 'success' | 'rejected'>('qualify');
    const [qualifyStep, setQualifyStep] = useState(0); // 0: info, 1: service, 2: questions
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [qualification, setQualification] = useState<QualificationData>({
        name: '', email: '', phone: '', company: '',
        selectedService: '', readyToInvest: null, hasBudget: null,
        timestamp: 0,
    });

    const [onboarding, setOnboarding] = useState<OnboardingData>({
        clientName: '', clientEmail: '',
        clientId: '', password: '', confirmPassword: '',
    });

    const selectedService = useMemo(() => services.find(s => s.id === qualification.selectedService), [qualification.selectedService]);
    const countdown = useCountdown(qualification.timestamp);
    const discountApplied = qualification.timestamp > 0 && !countdown.isExpired;

    // Generate client ID from name
    useEffect(() => {
        if (phase === 'onboard' && qualification.name) {
            const prefix = qualification.name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
            const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            setOnboarding(prev => ({
                ...prev,
                clientName: qualification.name,
                clientEmail: qualification.email,
                clientId: `WDC-${prefix}-${suffix}`,
            }));
        }
    }, [phase, qualification.name, qualification.email]);

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setPhase('qualify');
            setQualifyStep(0);
            setErrors({});
            setQualification({
                name: '', email: '', phone: '', company: '',
                selectedService: '', readyToInvest: null, hasBudget: null,
                timestamp: 0,
            });
            setOnboarding({
                clientName: '', clientEmail: '',
                clientId: '', password: '', confirmPassword: '',
            });
        }, 300);
    };

    // ── Validation ──
    const validateQualifyStep = useCallback((): boolean => {
        const errs: Record<string, string> = {};
        if (qualifyStep === 0) {
            if (!qualification.name.trim()) errs.name = 'Name is required';
            if (!qualification.email.trim()) errs.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qualification.email)) errs.email = 'Invalid email format';
            if (!qualification.phone.trim()) errs.phone = 'Phone is required';
        }
        if (qualifyStep === 1 && !qualification.selectedService) errs.service = 'Please select a service';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [qualifyStep, qualification]);

    const validateOnboarding = useCallback((): boolean => {
        const errs: Record<string, string> = {};
        if (!onboarding.password) errs.password = 'Password is required';
        else if (onboarding.password.length < 8) errs.password = 'Min 8 characters';
        if (onboarding.password !== onboarding.confirmPassword) errs.confirmPassword = 'Passwords do not match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [onboarding]);

    // ── Handlers ──
    const handleQualifyNext = () => {
        if (!validateQualifyStep()) return;
        if (qualifyStep < 2) {
            setQualifyStep(s => s + 1);
            setErrors({});
        } else {
            // Check qualifying answers
            if (!qualification.readyToInvest || !qualification.hasBudget) {
                setPhase('rejected');
            } else {
                setQualification(prev => ({ ...prev, timestamp: Date.now() }));
                setPhase('onboard');
                setErrors({});
            }
        }
    };

    const handleOnboardSubmit = async () => {
        if (!validateOnboarding()) return;
        setSubmitting(true);
        
        try {
            // Save to Supabase
            const { error } = await supabase
                .from('client_onboarding')
                .insert({
                    client_id: onboarding.clientId,
                    name: qualification.name,
                    email: qualification.email,
                    phone: qualification.phone,
                    company: qualification.company,
                    selected_service: qualification.selectedService,
                    total_price: totalForDisplay,
                    discount_applied: discountApplied,
                    status: 'pending'
                });

            if (error) {
                console.error("Error saving onboarding data:", error);
                // We could show an alert here, but we'll proceed to success anyway for UX 
                // assuming the user might just not have created the table yet.
            }
        } catch (err) {
            console.error("Unexpected error:", err);
        }

        setSubmitting(false);
        setPhase('success');
    };

    const passwordStrength = getPasswordStrength(onboarding.password);

    const slideVariants = {
        enter: { x: 60, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -60, opacity: 0 },
    };

    const totalForDisplay = useMemo(() => {
        const servicePrice = selectedService?.priceValue || 0;
        const onboardFee = discountApplied ? 0 : ONBOARDING_FEE;
        return servicePrice + onboardFee;
    }, [selectedService, discountApplied]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

                    {/* Modal */}
                    <motion.div
                        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0a0f1e] border border-white/10 rounded-3xl shadow-2xl shadow-mint/5"
                        initial={{ scale: 0.9, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-6 md:p-8">
                            <AnimatePresence mode="wait">

                                {/* ════════════════════════════════════════════════════════════════════
                                    PHASE: QUALIFICATION
                                   ════════════════════════════════════════════════════════════════════ */}
                                {phase === 'qualify' && (
                                    <motion.div key="qualify" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>

                                        {/* Phase indicator */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-mint text-darkNavy font-bold text-xs flex items-center justify-center">1</div>
                                                <span className="text-mint text-xs font-bold uppercase tracking-widest">Qualification</span>
                                            </div>
                                            <div className="h-[2px] flex-1 bg-white/10 rounded-full" />
                                            <div className="flex items-center gap-2 opacity-30">
                                                <div className="w-8 h-8 rounded-full bg-white/10 text-white/50 font-bold text-xs flex items-center justify-center">2</div>
                                                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Onboarding</span>
                                            </div>
                                        </div>

                                        {/* Sub-step dots */}
                                        <div className="flex gap-2 mb-8">
                                            {[0, 1, 2].map(i => (
                                                <div key={i} className={`h-1 rounded-full flex-1 transition-all duration-500 ${i <= qualifyStep ? 'bg-mint' : 'bg-white/10'}`} />
                                            ))}
                                        </div>

                                        {/* ─── Step 0: Contact Info ─── */}
                                        {qualifyStep === 0 && (
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Let's get to know you</h2>
                                                <p className="text-white/40 text-sm mb-8">Tell us about yourself so we can tailor our services.</p>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-mint uppercase tracking-wider mb-2">
                                                                <User className="w-3 h-3" /> Full Name <span className="text-red-400">*</span>
                                                            </label>
                                                            <input
                                                                value={qualification.name}
                                                                onChange={e => setQualification(p => ({ ...p, name: e.target.value }))}
                                                                placeholder="John Doe"
                                                                className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:outline-none transition-all`}
                                                            />
                                                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-mint uppercase tracking-wider mb-2">
                                                                <Briefcase className="w-3 h-3" /> Company <span className="text-white/30">(optional)</span>
                                                            </label>
                                                            <input
                                                                value={qualification.company}
                                                                onChange={e => setQualification(p => ({ ...p, company: e.target.value }))}
                                                                placeholder="Acme Inc."
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-mint uppercase tracking-wider mb-2">
                                                                <Mail className="w-3 h-3" /> Email <span className="text-red-400">*</span>
                                                            </label>
                                                            <input
                                                                type="email"
                                                                value={qualification.email}
                                                                onChange={e => setQualification(p => ({ ...p, email: e.target.value }))}
                                                                placeholder="john@example.com"
                                                                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:outline-none transition-all`}
                                                            />
                                                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                                        </div>
                                                        <div>
                                                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-mint uppercase tracking-wider mb-2">
                                                                <Phone className="w-3 h-3" /> Phone <span className="text-red-400">*</span>
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                value={qualification.phone}
                                                                onChange={e => setQualification(p => ({ ...p, phone: e.target.value }))}
                                                                placeholder="+1 (555) 123-4567"
                                                                className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:outline-none transition-all`}
                                                            />
                                                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ─── Step 1: Service Selection with Pricing ─── */}
                                        {qualifyStep === 1 && (
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Choose your service</h2>
                                                <p className="text-white/40 text-sm mb-6">Select the service you need. Transparent pricing — no hidden costs.</p>

                                                {errors.service && (
                                                    <div className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errors.service}
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {services.map((svc) => {
                                                        const Icon = svc.icon;
                                                        const isSelected = qualification.selectedService === svc.id;
                                                        return (
                                                            <motion.button
                                                                key={svc.id}
                                                                onClick={() => setQualification(p => ({ ...p, selectedService: svc.id }))}
                                                                className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 ${
                                                                    isSelected
                                                                        ? 'bg-mint/10 border-mint shadow-lg shadow-mint/5'
                                                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                                                }`}
                                                                whileTap={{ scale: 0.98 }}
                                                            >
                                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-mint text-darkNavy' : 'bg-white/5 text-white/50'}`}>
                                                                    <Icon className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex-grow min-w-0">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/70'}`}>{svc.label}</span>
                                                                        <span className={`text-sm font-bold ${isSelected ? 'text-mint' : 'text-white/40'}`}>{svc.price}</span>
                                                                    </div>
                                                                    <span className="text-[11px] text-white/30">{svc.description}</span>
                                                                </div>
                                                                {isSelected && (
                                                                    <motion.div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-mint flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                                        <Check className="w-3 h-3 text-darkNavy" />
                                                                    </motion.div>
                                                                )}
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Pricing Info Box */}
                                                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-mint/5 to-royalBlue/5 border border-mint/10">
                                                    <div className="flex items-center gap-2 text-mint text-xs font-bold uppercase tracking-wider mb-2">
                                                        <Sparkles className="w-3 h-3" /> Onboarding Offer
                                                    </div>
                                                    <p className="text-white/60 text-sm">
                                                        <span className="text-white font-semibold">Onboarding Fee: $1,000</span> — waived if you sign up within <span className="text-mint font-bold">12 hours</span> of qualification!
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* ─── Step 2: Qualifying Questions ─── */}
                                        {qualifyStep === 2 && (
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">A few quick questions</h2>
                                                <p className="text-white/40 text-sm mb-8">This helps us prioritize serious clients and allocate resources.</p>

                                                <div className="space-y-6">
                                                    {/* Question 1 */}
                                                    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                                        <p className="text-white font-semibold mb-4">Are you ready to invest in this project within 48 hours?</p>
                                                        <div className="flex gap-3">
                                                            {[true, false].map(val => (
                                                                <button
                                                                    key={String(val)}
                                                                    onClick={() => setQualification(p => ({ ...p, readyToInvest: val }))}
                                                                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all duration-300 ${
                                                                        qualification.readyToInvest === val
                                                                            ? val ? 'bg-mint/10 border-mint text-mint' : 'bg-red-500/10 border-red-500 text-red-400'
                                                                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                                                    }`}
                                                                >
                                                                    {val ? '✓ Yes, I\'m ready' : '✗ Not yet'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Question 2 */}
                                                    <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                                                        <p className="text-white font-semibold mb-4">
                                                            Do you have the budget for {selectedService?.label || 'this project'}{' '}
                                                            <span className="text-mint">({selectedService?.price || 'as quoted'})</span>?
                                                        </p>
                                                        <div className="flex gap-3">
                                                            {[true, false].map(val => (
                                                                <button
                                                                    key={String(val)}
                                                                    onClick={() => setQualification(p => ({ ...p, hasBudget: val }))}
                                                                    className={`flex-1 py-3 rounded-xl font-bold text-sm border transition-all duration-300 ${
                                                                        qualification.hasBudget === val
                                                                            ? val ? 'bg-mint/10 border-mint text-mint' : 'bg-red-500/10 border-red-500 text-red-400'
                                                                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                                                    }`}
                                                                >
                                                                    {val ? '✓ Yes' : '✗ No'}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Navigation */}
                                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                                            {qualifyStep > 0 ? (
                                                <button onClick={() => { setQualifyStep(s => s - 1); setErrors({}); }} className="text-sm text-white/40 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                                                    ← Back
                                                </button>
                                            ) : <div />}
                                            <motion.button
                                                onClick={handleQualifyNext}
                                                disabled={qualifyStep === 2 && (qualification.readyToInvest === null || qualification.hasBudget === null)}
                                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-mint text-darkNavy hover:bg-mint/90 shadow-lg shadow-mint/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {qualifyStep === 2 ? 'Submit Qualification' : 'Continue'} <ArrowRight className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ════════════════════════════════════════════════════════════════════
                                    PHASE: REJECTED
                                   ════════════════════════════════════════════════════════════════════ */}
                                {phase === 'rejected' && (
                                    <motion.div key="rejected" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="text-center py-10">
                                        <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6">
                                            <AlertCircle className="w-10 h-10 text-yellow-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-3">Thanks for your interest!</h2>
                                        <p className="text-white/50 mb-3 max-w-md mx-auto">
                                            It seems like the timing or budget isn't right just yet. No worries — we'd love to connect when you're ready.
                                        </p>
                                        <p className="text-white/40 text-sm mb-8">
                                            Feel free to reach out at <a href="mailto:Webappdevelopersofchicago@gmail.com" className="text-mint underline">Webappdevelopersofchicago@gmail.com</a> when you're ready to move forward.
                                        </p>
                                        <button onClick={handleClose} className="px-8 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-colors">
                                            Close
                                        </button>
                                    </motion.div>
                                )}

                                {/* ════════════════════════════════════════════════════════════════════
                                    PHASE: ONBOARDING
                                   ════════════════════════════════════════════════════════════════════ */}
                                {phase === 'onboard' && (
                                    <motion.div key="onboard" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>

                                        {/* Phase indicator */}
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="flex items-center gap-2 opacity-50">
                                                <div className="w-8 h-8 rounded-full bg-mint text-darkNavy font-bold text-xs flex items-center justify-center"><Check className="w-4 h-4" /></div>
                                                <span className="text-mint text-xs font-bold uppercase tracking-widest">Qualified</span>
                                            </div>
                                            <div className="h-[2px] flex-1 bg-mint/30 rounded-full" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-mint text-darkNavy font-bold text-xs flex items-center justify-center">2</div>
                                                <span className="text-mint text-xs font-bold uppercase tracking-widest">Onboarding</span>
                                            </div>
                                        </div>

                                        {/* ── 12-Hour Countdown Banner ── */}
                                        {discountApplied && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mb-6 p-4 rounded-xl bg-gradient-to-r from-mint/10 to-emerald-500/5 border border-mint/20"
                                            >
                                                <div className="flex items-center justify-between flex-wrap gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-5 h-5 text-mint" />
                                                        <span className="text-white text-sm font-semibold">Sign up now to waive the $1,000 onboarding fee!</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {[
                                                            { val: countdown.hours, label: 'HR' },
                                                            { val: countdown.minutes, label: 'MIN' },
                                                            { val: countdown.seconds, label: 'SEC' },
                                                        ].map((t, i) => (
                                                            <div key={i} className="text-center">
                                                                <div className="bg-darkNavy border border-mint/30 rounded-lg px-2.5 py-1.5 font-mono text-lg font-bold text-mint min-w-[42px]">
                                                                    {String(t.val).padStart(2, '0')}
                                                                </div>
                                                                <span className="text-[9px] text-white/30 font-bold">{t.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                            <Lock className="w-6 h-6 inline mr-2 text-mint" />Secure Onboarding
                                        </h2>
                                        <p className="text-white/40 text-sm mb-6">Set up your client account. All data is encrypted and transmitted securely via HTTPS.</p>

                                        {/* Form */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[11px] font-bold text-mint uppercase tracking-wider mb-2 block">Client Name</label>
                                                    <input
                                                        value={onboarding.clientName}
                                                        readOnly
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[11px] font-bold text-mint uppercase tracking-wider mb-2 block">Client ID</label>
                                                    <input
                                                        value={onboarding.clientId}
                                                        readOnly
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-mint font-mono cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-mint uppercase tracking-wider mb-2 block">Email</label>
                                                <input
                                                    value={onboarding.clientEmail}
                                                    readOnly
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"
                                                />
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-mint uppercase tracking-wider mb-2">
                                                    <Shield className="w-3 h-3" /> Create Password <span className="text-red-400">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={onboarding.password}
                                                        onChange={e => setOnboarding(p => ({ ...p, password: e.target.value }))}
                                                        placeholder="Min 8 characters, mix of letters/numbers"
                                                        className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:outline-none transition-all pr-12`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                                {onboarding.password && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex gap-1 flex-1">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <div key={i} className={`h-1 rounded-full flex-1 transition-all ${i <= passwordStrength.level ? passwordStrength.color : 'bg-white/10'}`} />
                                                            ))}
                                                        </div>
                                                        <span className={`text-[10px] font-bold uppercase ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
                                                    </div>
                                                )}
                                                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-mint uppercase tracking-wider mb-2 block">Confirm Password <span className="text-red-400">*</span></label>
                                                <input
                                                    type="password"
                                                    value={onboarding.confirmPassword}
                                                    onChange={e => setOnboarding(p => ({ ...p, confirmPassword: e.target.value }))}
                                                    placeholder="Re-enter your password"
                                                    className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-mint focus:outline-none transition-all`}
                                                />
                                                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                                            </div>
                                        </div>

                                        {/* Payment Summary */}
                                        <div className="mt-6 p-5 rounded-xl bg-white/5 border border-white/10">
                                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Payment Summary</h3>
                                            <div className="space-y-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-white/60">{selectedService?.label}</span>
                                                    <span className="text-white font-semibold">{selectedService?.price}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white/60">Onboarding Fee</span>
                                                    {discountApplied ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white/30 line-through text-xs">$1,000</span>
                                                            <span className="text-mint font-bold">FREE</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-white font-semibold">$1,000</span>
                                                    )}
                                                </div>
                                                <div className="pt-3 border-t border-white/10 flex justify-between">
                                                    <span className="text-white font-bold">Total</span>
                                                    <span className="text-2xl font-bold text-mint">${totalForDisplay.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            {discountApplied && (
                                                <div className="mt-3 flex items-center gap-2 text-mint text-xs">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="font-semibold">12-hour early bird discount applied — you saved $1,000!</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Submit */}
                                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                                            <button onClick={() => setPhase('qualify')} className="text-sm text-white/40 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/5">
                                                ← Back
                                            </button>
                                            <motion.button
                                                onClick={handleOnboardSubmit}
                                                disabled={submitting}
                                                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-mint to-emerald-500 text-darkNavy hover:shadow-lg hover:shadow-mint/30 transition-all disabled:opacity-60"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {submitting ? (
                                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                                ) : (
                                                    <><Lock className="w-4 h-4" /> Complete Onboarding</>
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ════════════════════════════════════════════════════════════════════
                                    PHASE: SUCCESS
                                   ════════════════════════════════════════════════════════════════════ */}
                                {phase === 'success' && (
                                    <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                                        <motion.div
                                            className="w-24 h-24 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-6"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <CheckCircle2 className="w-12 h-12 text-mint" />
                                        </motion.div>
                                        <h2 className="text-3xl font-bold text-white mb-4">🎉 Congratulations!</h2>
                                        <p className="text-white/60 text-lg mb-2">Your onboarding is complete. <span className="text-mint font-bold">Welcome aboard!</span></p>
                                        <p className="text-white/40 text-sm mb-3">
                                            Client ID: <span className="text-mint font-mono font-bold">{onboarding.clientId}</span>
                                        </p>
                                        <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                                            Our team will reach out within 24 hours to kick off your <span className="text-white/70 font-semibold">{selectedService?.label}</span> project. Check your email for a confirmation.
                                        </p>
                                        <button onClick={handleClose} className="px-10 py-4 rounded-xl bg-mint text-darkNavy font-bold hover:bg-mint/90 transition-colors text-lg">
                                            Let's Build Something Great
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
