import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Github, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
import type { MouseEvent } from 'react';
import { gsap } from '../utils/gsapConfig';
import greenImg from '../assets/green.png';
import keyeImg from '../assets/keye.png';
import videon8nImg from '../assets/videon8n.png';
import solanaImg from '../assets/solana.jpeg';
import linkedinImg from '../assets/linkedin.png';
import dawoodImg from '../assets/dawood.png';
import rhsImg from '../assets/rhs.png';
import cocoImg from '../assets/coco.png';
import totkyImg from '../assets/totky.png';
import libasImg from '../assets/libas.png';
import cartistan from '../assets/cartistan.png';
import flowImg from '../assets/flow.png';

const projects = [
  {
    id: 20260225,
    title: "NGO Assist",
    subtitle: "Aid Distribution Platform",
    description: "A full-stack aid distribution platform using Flutter (Web & Mobile), Node.js, and Prisma. Manages beneficiary registration, verification workflows, vendor-based assistance redemption, and audit monitoring with role-based access control. Login: admin@ngo.org | Pwd: admin123",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/Screenshot%202026-02-25%20204034.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9TY3JlZW5zaG90IDIwMjYtMDItMjUgMjA0MDM0LnBuZyIsImlhdCI6MTc3MjAzNDI1MywiZXhwIjoxODAzNTcwMjUzfQ.NV-sbWkxZb15E2zX83ZHuUzoBiPJ1d9eRpIb_JLxOIQ",
    category: "mobile-apps",
    tags: ["Flutter", "Node.js", "Prisma"],
    link: "https://ngo.virtuohr.com",
    github: ""
  },
  {
    id: 20260129,
    title: "Smart Pump",
    subtitle: "IoT Telemetry & ERP",
    description: "A secure ERP system for fuel stations that monitors real-time transaction pipelines to prevent revenue loss. Login: usman@gmail.com | Pwd: usman123",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/Screenshot%202026-01-29%20220645.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9TY3JlZW5zaG90IDIwMjYtMDEtMjkgMjIwNjQ1LnBuZyIsImlhdCI6MTc3MTg3OTM4NiwiZXhwIjoxODAzNDE1Mzg2fQ.7s7Y_XInBw1mi_QiiHKVJIWPWlELnxMfaK7e6U3LlVw",
    category: "web-apps",
    tags: ["Angular", "Supabase", "IoT"],
    link: "https://smart-pump-2eyt.vercel.app/login",
    github: "https://github.com/usmanimran-dev/SmartPump"
  },
  {
    id: 20260130,
    title: "Velora",
    subtitle: "Dating Discovery App",
    description: "A modern, secure dating platform featuring real-time matching and encrypted communication channels.",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/Screenshot%202026-01-30%20035558.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9TY3JlZW5zaG90IDIwMjYtMDEtMzAgMDM1NTU4LnBuZyIsImlhdCI6MTc3MTg3OTQyOSwiZXhwIjoxODAzNDE1NDI5fQ.4kGdL9utvVG8wS-08P1m3cx6SgXtcoMPmeJABUBM8bY",
    category: "mobile-apps",
    tags: ["Angular", "Firebase", "Logic"],
    link: "https://datingapp-arxi.vercel.app/signup",
    github: "https://github.com/usmanimran-dev/datingapp"
  },
  {
    id: 20260131,
    title: "Yelo Search",
    subtitle: "Market Discovery Engine",
    description: "A high-performance indexing engine for local market intelligence, optimized for low-latency search and data retrieval.",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/Screenshot%202026-01-30%20035500.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9TY3JlZW5zaG90IDIwMjYtMDEtMzAgMDM1NTAwLnBuZyIsImlhdCI6MTc3MTg3OTQ1MCwiZXhwIjoxODAzNDE1NDUwfQ.owfuUOWWmbTdUR1UeW1ZsnxBcjkmYen4hg_HHAZ5XOo",
    category: "web-apps",
    tags: ["React", "Cloud", "SEO"],
    link: "https://pakistan-finds-red.vercel.app/",
    github: "https://github.com/usmanimran-dev/pakistan-finds-red"
  },
  {
    id: 20260132,
    title: "Zyfloatix",
    subtitle: "Digital Treasury Ecosystem",
    description: "A high-fidelity platform for digital asset firms, featuring encrypted data visualization and ultra-modern terminal aesthetics.",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/Screenshot%202026-01-30%20035422.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9TY3JlZW5zaG90IDIwMjYtMDEtMzAgMDM1NDIyLnBuZyIsImlhdCI6MTc3MTg3OTQ3MywiZXhwIjoxODAzNDE1NDczfQ.eFbN5eP05R6asL0-AhaQ_etaNZ4qnqR3mRf0XiBf6OA",
    category: "web-apps",
    tags: ["Next.js", "Framer", "Tailwind"],
    link: "https://usmanimran.vercel.app/",
    github: "https://github.com/usmanimran-dev/UsmanImran"
  },
  {
    id: 20250813,
    title: "Green Vitality Bali",
    subtitle: "Wellness Shopify Store",
    description: "A wellness-focused Shopify store offering organic supplements with a clean, eco-conscious design for health-conscious customers.",
    image: greenImg,
    category: "shopify",
    tags: ["Shopify", "E-commerce", "Wellness"],
    link: "https://www.greenvitality-bali.com/",
    github: ""
  },
  {
    id: 131,
    title: "Kaycee's Premium",
    subtitle: "Luxury Personal Care",
    description: "An elegant Shopify site for luxury wellness products, featuring high-quality displays and seamless navigation.",
    image: keyeImg,
    category: "shopify",
    tags: ["Shopify", "E-commerce", "Luxury"],
    link: "https://www.kayceespremium.com/",
    github: ""
  },
  {
    id: 20250807,
    title: "AI Email Auto-Reply",
    subtitle: "n8n Automation",
    description: "A smart, fully automated email response system using n8n, GPT, and Gmail API to save time and ensure professional responses.",
    image: videon8nImg,
    category: "automation",
    tags: ["n8n", "AI", "Automation"],
    link: "https://vimeo.com/1107894672?share=copy#t=0",
    github: ""
  },
  {
    id: 20260312,
    title: "I See You Now",
    subtitle: "Storytelling Platform",
    description: "A mission-driven storytelling platform and studio to let people authentically share who they truly are and to protect human creativity and authenticity in the age of AI.",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/Screenshot%202026-03-12%20113355.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9TY3JlZW5zaG90IDIwMjYtMDMtMTIgMTEzMzU1LnBuZyIsImlhdCI6MTc3MzI5NzQ1MSwiZXhwIjoxODA0ODMzNDUxfQ._qshMrvM5kDM2yA30cySmzaMjuRGCO1BuNhVWgOPCJk",
    category: "web-apps",
    tags: ["Platform", "Storytelling", "AI"],
    link: "https://iseeyounow.org/",
    github: ""
  },
  {
    id: 20260313,
    title: "Bismillah Caters",
    subtitle: "Catering Service Platform",
    description: "A premium catering platform for weddings and corporate events, focused on delivering high-quality, fresh halal food with diverse menu options.",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/Screenshot%202026-03-12%20113432.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9TY3JlZW5zaG90IDIwMjYtMDMtMTIgMTEzNDMyLnBuZyIsImlhdCI6MTc3MzI5NzUxNSwiZXhwIjoxNzc1ODg5NTE1fQ.dxphjYuqdoSQ7rlWUQxOjCFqeFAMxDGy9QKoiXIFqj4",
    category: "web-apps",
    tags: ["Next.js", "Catering", "Events"],
    link: "https://www.bismillahcaters.com/",
    github: ""
  },
  {
    id: 999,
    title: "BECM Solana",
    subtitle: "NFT Marketplace",
    description: "A decentralized marketplace on Solana for minting and trading digital collectibles with real-time Phantom Wallet integration.",
    image: solanaImg,
    category: "web-apps",
    tags: ["Solana", "Rust", "NFT"],
    link: "https://github.com/usmanimran-dev/Master",
    github: "https://github.com/usmanimran-dev/Master"
  },
  {
    id: 1000,
    title: "LinkedIn Clone",
    subtitle: "Bubble.io Social Engine",
    description: "A feature-rich LinkedIn-style web app developed using Bubble.io, with real-time messaging and job listings.",
    image: linkedinImg,
    category: "web-apps",
    tags: ["Bubble.io", "No-Code", "Networking"],
    link: "https://bubble.io/page?id=linkedin-16318&tab=Design&name=index",
    github: ""
  },
  {
    id: 1,
    title: "Dawood Super Store",
    subtitle: "Shopify Grocery",
    description: "A comprehensive Shopify-based grocery platform optimized for everyday essentials and high-volume traffic.",
    image: dawoodImg,
    category: "shopify",
    tags: ["Shopify", "E-commerce", "Liquid"],
    link: "https://dawoodsuperstore.myshopify.com/",
    github: ""
  },
  {
    id: 10,
    title: "RHS Wellness",
    subtitle: "Natural Health Shop",
    description: "High-quality, doctor-recommended supplements supported by a science-focused Shopify storefront.",
    image: rhsImg,
    category: "shopify",
    tags: ["Shopify", "Health", "Wellness"],
    link: "https://shoprhswellness.com/",
    github: ""
  },
  {
    id: 23,
    title: "Cocoba Chocolate",
    subtitle: "UK Gourmet E-com",
    description: "Elegant Shopify customization for a UK-based chocolate brand, focusing on intuitive product presentation.",
    image: cocoImg,
    category: "shopify",
    tags: ["Shopify", "Gourmet", "UI/UX"],
    link: "https://www.cocobachocolate.com/collections/hot-chocolate-bombs",
    github: ""
  },
  {
    id: 22,
    title: "Totkay.com",
    subtitle: "Wellness Blog",
    description: "A wellness and lifestyle blog sharing natural home remedies in Urdu and English using a clean Shopify platform.",
    image: totkyImg,
    category: "shopify",
    tags: ["Shopify", "Blog", "Wellness"],
    link: "https://totkay.com/",
    github: ""
  },
  {
    id: 2,
    title: "Libaas By RM",
    subtitle: "Fashion Retail",
    description: "Modern fashion storefront built on Shopify with a focus on high-fidelity visual presentation and mobile optimization.",
    image: libasImg,
    category: "shopify",
    tags: ["Shopify", "Fashion", "Liquid"],
    link: "https://libaasbyrm.myshopify.com/",
    github: ""
  },
  {
    id: 11,
    title: "Solana CRUD",
    subtitle: "dApp Journal",
    description: "A decentralized journal app built on Solana using Anchor, allowing users to store data directly on-chain.",
    image: solanaImg,
    category: "web-apps",
    tags: ["Solana", "Rust", "dApp"],
    link: "https://github.com/usmanimran-dev/CRUD-Dapp-Project-Solana",
    github: "https://github.com/usmanimran-dev/CRUD-Dapp-Project-Solana"
  },
  {
    id: 5,
    title: "Cartistan",
    subtitle: "Grocery Delivery",
    description: "On-demand grocery delivery application prototype built with Bubble.io for rapid deployment and scale.",
    image: cartistan,
    category: "mobile-apps",
    tags: ["Bubble.io", "Delivery", "UX"],
    link: "https://cartistan-73886.bubbleapps.io/version-test",
    github: ""
  },
  {
    id: 6,
    title: "FlowNest",
    subtitle: "AI Project Manager",
    description: "AI-powered internal tool for project management, engineered with Bubble.io's advanced logic engine.",
    image: flowImg,
    category: "automation",
    tags: ["Bubble.io", "AI", "Management"],
    link: "https://demo-app-63324.bubbleapps.io/version-test/?&v=projects",
    github: ""
  },
  {
    id: 20260221,
    title: "Diamond Sync Engine",
    subtitle: "B2B Shopify Integration",
    description: "A custom Node.js desktop engine that bridges a B2B diamond supplier API to Shopify. Auto-syncs 1,200+ products daily with 60+ metafields, custom OAuth, and zero cloud hosting costs.",
    image: "https://oxputeaplbndzolsnyto.supabase.co/storage/v1/object/sign/Usman%20Imran/WhatsApp%20Image%202026-02-21%20at%207.14.23%20PM.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wNmIzYmExMi1hYzlhLTQ3YTQtOTNkNS0xYTEyMzE4NTM4NTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJVc21hbiBJbXJhbi9XaGF0c0FwcCBJbWFnZSAyMDI2LTAyLTIxIGF0IDcuMTQuMjMgUE0uanBlZyIsImlhdCI6MTc3MjAzNTI4NCwiZXhwIjoxODAzNTcxMjg0fQ.m3IUjzIuOCXRRl3pLEjrstbMiLFRRy7UzbCNGH2nlpQ",
    category: "automation",
    tags: ["Node.js", "Shopify API", "Automation"],
    link: "https://github.com/usmanimran-dev/CGD-API-Project",
    github: "https://github.com/usmanimran-dev/CGD-API-Project"
  }
];

const ScrambleText = ({ text, hovered }: { text: string; hovered: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  useEffect(() => {
    if (!hovered) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_char, index) => {
            if (index < iterations) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }

      iterations += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [hovered, text]);

  return <span>{displayText}</span>;
};

const MagneticButton = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className="relative z-50"
    >
      {children}
    </motion.div>
  );
};

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const imageX = useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"]);
  const imageY = useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      className={`portfolio-card group relative h-[420px] rounded-2xl perspective-1000 cursor-pointer ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
    >
      <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full w-full relative preserve-3d">
        <div className="absolute inset-0 rounded-2xl overflow-hidden bg-darkNavy shadow-2xl border border-white/5">

          <motion.div
            className="absolute inset-[-5%] bg-darkNavy flex items-center justify-center p-4"
            style={{ x: imageX, y: imageY }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-darkNavy via-darkNavy/40 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
          </motion.div>

          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20 mix-blend-overlay"
            style={{
              background: useMotionTemplate`
                                  radial-gradient(
                                      600px circle at ${mouseX}px ${mouseY}px,
                                      rgba(16, 185, 129, 0.15),
                                      rgba(37, 99, 235, 0.15),
                                      transparent 40%
                                  )
                              `,
            }}
          />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-30 translate-z-20">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 transition-transform duration-500 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-mint font-mono text-xs tracking-wider uppercase mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 min-h-[2.25rem]">
                    <ScrambleText text={project.title} hovered={isHovered} />
                  </h3>
                </div>
                <div className="flex gap-2">
                  {project.github && (
                    <MagneticButton>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm border border-white/10">
                        <Github className="w-5 h-5 text-white" />
                      </a>
                    </MagneticButton>
                  )}
                  <MagneticButton>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-mint group-hover:text-darkNavy transition-colors duration-300 backdrop-blur-sm border border-white/10">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                  </MagneticButton>
                </div>
              </div>

              <p className="text-sm text-white/70 mb-4 line-clamp-2 transition-opacity duration-500">
                {project.subtitle} - {project.description}
              </p>

              <div className="flex flex-wrap gap-2 transition-opacity duration-500">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState("web-apps");
  const [showAll, setShowAll] = useState(false);

  const filters = [
    { id: "mobile-apps", label: "Mobile Apps" },
    { id: "web-apps", label: "Web Apps" },
    { id: "automation", label: "Automation" },
    { id: "shopify", label: "Shopify" }
  ];

  const filteredProjects = useMemo(() => {
    const base = projects.filter(project => project.category === activeFilter);
    return showAll ? base : base.slice(0, 4);
  }, [activeFilter, showAll]);

  const hasMore = useMemo(() => {
    const base = projects.filter(project => project.category === activeFilter);
    return base.length > 4;
  }, [activeFilter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.portfolio-card', {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);
    // Cleanup trigger when filters change to avoid orphaned animations
    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 bg-darkNavy overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-royalBlue/5 via-darkNavy to-black pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12">
          <div>
            <motion.h2
              className="text-6xl md:text-8xl font-bold font-display leading-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Selected <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-royalBlue">Works</span>
            </motion.h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setShowAll(false);
                }}
                className={`px-6 py-3 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 border ${activeFilter === filter.id
                  ? "bg-mint text-darkNavy border-mint shadow-[0_4px_20px_-5px_rgba(16,185,129,0.3)]"
                  : "bg-white/5 text-white/60 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 perspective-2000">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-32 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex flex-col items-center gap-2 mx-auto py-6 text-white/70 hover:text-mint transition-colors"
            >
              <span className="text-sm font-medium tracking-widest uppercase">{showAll ? "SHOW LESS" : "VIEW ALL PROJECTS"}</span>
              {showAll ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6 group-hover:translate-y-2 transition-transform duration-300" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;