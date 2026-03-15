import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import Projects from '@/components/Projects';
import TrustedBrands from '@/components/TrustedBrands';
import WorkExperience from '@/components/WorkExperience';
import Blog from '@/components/Blog';
import AIAnnouncements from '@/components/AIAnnouncements';
import { Testimonials } from '@/components/Testimonials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import AdminFab from "@/components/AdminFab";
import Login from "./Login";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

const Index = () => {
  useSmoothScroll();
  const [searchParams, setSearchParams] = useSearchParams();
  const showLogin = searchParams.get("login") === "true";
  const paymentStatus = searchParams.get("payment");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    if (paymentStatus === 'success') {
      setShowPaymentSuccess(true);
      // Clean the URL so refreshing doesn't re-show
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      newParams.delete('session_id');
      setSearchParams(newParams, { replace: true });
    }
  }, [paymentStatus]);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TrustedBrands />
        <Section>
          <Container>
            <Services />
          </Container>
        </Section>
        <Projects />
        <About />
        {/* <WorkExperience /> — temporarily hidden */}
        <Blog />
        {/* <AIAnnouncements /> */}
        <Testimonials />
        {/* <Contact /> — temporarily hidden */}
      </main>
      <Footer />
      {/* Admin access via direct URL: /admin */}
      {showLogin && <Login />}

      {/* Payment Success Overlay */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowPaymentSuccess(false)} />
            <motion.div
              className="relative w-full max-w-lg bg-[#0a0f1e] border border-white/10 rounded-3xl shadow-2xl shadow-mint/10 p-8 md:p-10 text-center"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button
                onClick={() => setShowPaymentSuccess(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                className="w-24 h-24 rounded-full bg-mint/20 flex items-center justify-center mx-auto mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="w-12 h-12 text-mint" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-4">🎉 Payment Successful!</h2>
              <p className="text-white/60 text-lg mb-2">
                Your payment has been processed. <span className="text-mint font-bold">Welcome aboard!</span>
              </p>
              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                Our team will reach out within 24 hours to kick off your project. Check your email for a confirmation receipt from Stripe.
              </p>
              <button
                onClick={() => setShowPaymentSuccess(false)}
                className="px-10 py-4 rounded-xl bg-mint text-darkNavy font-bold hover:bg-mint/90 transition-colors text-lg"
              >
                Let's Build Something Great
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;