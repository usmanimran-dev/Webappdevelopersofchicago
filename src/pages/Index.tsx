import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import Projects from '@/components/Projects';
import WorkExperience from '@/components/WorkExperience';
import Blog from '@/components/Blog';
import AIAnnouncements from '@/components/AIAnnouncements';
import { Testimonials } from '@/components/Testimonials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import AdminFab from "@/components/AdminFab";
import Login from "./Login";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  useSmoothScroll();
  const [searchParams] = useSearchParams();
  const showLogin = searchParams.get("login") === "true";

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
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
    </div>
  );
};

export default Index;