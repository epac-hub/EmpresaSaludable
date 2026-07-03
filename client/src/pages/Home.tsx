/**
 * WOW Website Showcase — Cinematic Scroll Film
 * Design: Neo-Cinematic, dark canvas, electric violet accent, Space Grotesk display
 * Animations: GSAP ScrollTrigger for reveals, Lenis for smooth scroll
 * Filter bar: Sticky category filter at top of gallery
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import SiteCard from "@/components/SiteCard";

gsap.registerPlugin(ScrollTrigger);

type Category = "all" | "3d" | "scroll" | "interactions";

const CATEGORIES: { id: Category; label: string; count: number }[] = [
  { id: "all", label: "All Sites", count: 11 },
  { id: "3d", label: "3D & WebGL", count: 4 },
  { id: "scroll", label: "Scroll Storytelling", count: 3 },
  { id: "interactions", label: "Interactions", count: 4 },
];

interface SiteData {
  name: string;
  studio: string;
  description: string;
  technique: string;
  url: string;
  award?: string;
  thumbnail?: string;
  category: Category;
}

const ALL_SITES: SiteData[] = [
  // 3D & WebGL
  {
    name: "Oryzo",
    studio: "Lusion",
    description: "A single cork coaster rendered with the gravity of a flagship device. Inertial physics, Z-axis depth scroll, and extreme material polish prove that restraint outperforms complexity.",
    technique: "Inertial 3D Product Render",
    url: "https://oryzo.ai/",
    award: "SOTM Apr 2026",
    thumbnail: "/manus-storage/j5hMb6X3rOBe_171c84fd.jpeg",
    category: "3d",
  },
  {
    name: "Cartier Watches & Wonders",
    studio: "Immersive Garden",
    description: "Six self-contained 3D alcoves — one per timepiece — navigated by scroll. GLSL shaders, GSAP, Lenis, and Web Audio create a museum-like digital pavilion.",
    technique: "Scene-Per-Product Architecture",
    url: "https://www.cartier.com/",
    award: "Awwwards SOTD",
    thumbnail: "/manus-storage/53FQBzoDXh8R_3d627155.jpg",
    category: "3d",
  },
  {
    name: "Explore Primland",
    studio: "Creative Studio",
    description: "A cinematic aerial flythrough of Blue Ridge Mountain terrain rendered in Three.js. Atmospheric fog and a gliding camera make a remote resort explorable from the browser.",
    technique: "3D Landscape Flythrough",
    url: "https://explore.ownprimland.com/",
    award: "Awwwards SOTD",
    thumbnail: "/manus-storage/W8EySgU5A9cT_abc1bda9.jpg",
    category: "3d",
  },
  {
    name: "IVRESS",
    studio: "Utsubo",
    description: "A cinematic brand experience using Three.js WebGPURenderer with WebGL fallback. TSL shaders compile to both backends from a single codebase — the future of 3D on the web.",
    technique: "WebGPU + TSL Shaders",
    url: "https://brand.ivress.co.jp/",
    award: "FWA SOTM May 2026",
    thumbnail: "/manus-storage/ggYLBVvoPHh2_7e9beb37.jpg",
    category: "3d",
  },
  // Scroll Storytelling
  {
    name: "Shopify Editions",
    studio: "Shopify",
    description: "A dense product changelog transformed into cinematic scroll storytelling. Particle-dispersing typography, depth-layered panels, and choreographed section transitions.",
    technique: "Scroll-Sequenced Reveal",
    url: "https://www.shopify.com/editions/spring2026",
    award: "Awwwards Nominee",
    thumbnail: "/manus-storage/2U4H9B637Byf_da8b7389.jpg",
    category: "scroll",
  },
  {
    name: "Sleep Well Creative",
    studio: "Independent",
    description: "Science-backed sleep content wrapped in a dreamlike, illustrated 3D world. Scroll advances both the narrative and the visuals together — editorial pacing in a 3D scene.",
    technique: "Illustrated Scroll Narrative",
    url: "https://sleep-well-creatives.com/",
    award: "Awwwards SOTD",
    thumbnail: "/manus-storage/7xmrDfVokpss_470517af.jpeg",
    category: "scroll",
  },
  {
    name: "The Monolith Project",
    studio: "Ethan Chiu",
    description: "A scroll-driven story across thirteen scenes, moving from hand-drawn sketches into fully lit 3D worlds. Custom shader framework, GPU particles, and React Three Fiber.",
    technique: "Multi-Scene Scroll Film",
    url: "https://themonolithproject.net/",
    award: "Featured on Codrops",
    thumbnail: "/manus-storage/GZKNwQHOWOa4_f374d41c.webp",
    category: "scroll",
  },
  // Interactions & Gamification
  {
    name: "Hubtown",
    studio: "Unseen Studio",
    description: "A glowing 3D monolith over a reflective landscape. The cursor acts as a light source, revealing detail in geometry and lighting — proving 3D can dignify B2B brands.",
    technique: "Mouse-Reveal Interaction",
    url: "https://hubtown.co.in/",
    award: "Awwwards SOTD",
    thumbnail: "/manus-storage/QWxEywA0l3OE_e8162a84.jpeg",
    category: "interactions",
  },
  {
    name: "Basement Studio",
    studio: "Basement Studio",
    description: "Dark-mode agency portfolio with aggressive micro-interactions: magnetic buttons, morphing cursors, and snappy Framer Motion transitions. React + Three.js + Tailwind.",
    technique: "Magnetic Buttons & Custom Cursor",
    url: "https://basement.studio/",
    award: "Awwwards SOTD",
    thumbnail: "/manus-storage/YQQiTb1fofyX_13df324a.jpg",
    category: "interactions",
  },
  {
    name: "Bruno Simon Portfolio",
    studio: "Bruno Simon",
    description: "A fully explorable 3D world controlled by driving a vehicle. Physics-based interactions, collectibles, and online multiplayer — the gold standard for creative dev portfolios.",
    technique: "Physics-Driven 3D World",
    url: "https://bruno-simon.com/",
    award: "Legendary Portfolio",
    thumbnail: "/manus-storage/HjJfQKHMksQB_e1bac139.png",
    category: "interactions",
  },
  {
    name: "Lacoste Ace Breaker",
    studio: "Merci-Michel",
    description: "A branded Three.js tennis brick-breaker game for Roland-Garros. One tight gameplay loop, real-world prizes, and a leaderboard — a micro-game that beats a hero video.",
    technique: "Branded WebGL Game",
    url: "https://members-play.lacoste.com/ace-breaker-rg/gb/en/",
    award: "Awwwards Nominee",
    thumbnail: "/manus-storage/XSkDXKuqYeby_d07b75ac.jpg",
    category: "interactions",
  },
];

const TECH_STACK = [
  { category: "Core Framework", tools: "React, Next.js, Nuxt", purpose: "Component architecture & routing" },
  { category: "Animation Engine", tools: "GSAP + ScrollTrigger", purpose: "Complex sequencing & scroll-linked motion" },
  { category: "3D Rendering", tools: "Three.js, React Three Fiber", purpose: "WebGL/WebGPU scenes & models" },
  { category: "Smooth Scrolling", tools: "Lenis", purpose: "Cross-browser scroll smoothing" },
  { category: "Styling", tools: "Tailwind CSS, Custom CSS", purpose: "Utility classes & complex layouts" },
  { category: "Shaders", tools: "GLSL, TSL", purpose: "Custom materials & post-processing" },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filteredSites = activeFilter === "all"
    ? ALL_SITES
    : ALL_SITES.filter((site) => site.category === activeFilter);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Hero animations
    const heroTl = gsap.timeline({ delay: 0.3 });
    heroTl
      .from("[data-hero-title] span", {
        y: 120,
        opacity: 0,
        rotateX: -40,
        stagger: 0.06,
        duration: 1,
        ease: "power3.out",
      })
      .from("[data-hero-subtitle]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.4")
      .from("[data-hero-cta]", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.3");

    // Intersection observer for sticky filter
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFilterSticky(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    if (filterRef.current) {
      observer.observe(filterRef.current);
    }

    // Section header animations
    gsap.utils.toArray<HTMLElement>("[data-section-header]").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
      });
    });

    // Parallax on section images
    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        y: -80,
        ease: "none",
      });
    });

    // Tech table row animations
    gsap.from("[data-tech-row]", {
      scrollTrigger: {
        trigger: "[data-tech-table]",
        start: "top 75%",
        toggleActions: "play none none none",
      },
      x: -40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
    });

    return () => {
      lenis.destroy();
      observer.disconnect();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Animate cards when filter changes
  useEffect(() => {
    const cards = document.querySelectorAll("[data-filtered-card]");
    gsap.fromTo(cards, {
      y: 40,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [activeFilter]);

  return (
    <div className="relative" style={{ cursor: "none" }}>
      <CustomCursor />
      <ScrollProgress />

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/manus-storage/hero-bg_4c8ceb7e.png"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
        </div>

        {/* Logo */}
        <div className="absolute top-8 left-8 z-20 flex items-center gap-3">
          <img
            src="/manus-storage/wow-logo_83951cf6.png"
            alt="WOW"
            className="w-10 h-10"
          />
          <span className="text-white/80 text-sm font-medium tracking-wider uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            WOW Showcase
          </span>
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1
            data-hero-title
            className="text-[clamp(2.5rem,8vw,7rem)] font-extrabold leading-[0.9] tracking-tight text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <span className="inline-block overflow-hidden"><span className="inline-block">Where</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="inline-block">Scroll</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="inline-block text-[#8b5cf6]">Becomes</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="inline-block">Story</span></span>
          </h1>

          <p
            data-hero-subtitle
            className="mt-8 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed"
          >
            A curated gallery of award-winning websites that push the boundaries of what's possible on the web — organized by the techniques that make them unforgettable.
          </p>

          <div data-hero-cta className="mt-10">
            <a
              href="#gallery"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white border border-[#8b5cf6]/50 rounded-full hover:bg-[#8b5cf6]/10 hover:border-[#8b5cf6] transition-all duration-300"
              data-cursor-hover
            >
              Explore the Gallery
              <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#8b5cf6]/50 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div ref={sectionsRef} id="gallery">

        {/* --- FILTER BAR SENTINEL (for intersection observer) --- */}
        <div ref={filterRef} className="h-0" />

        {/* --- STICKY FILTER BAR --- */}
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isFilterSticky
              ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              : "bg-transparent"
          }`}
        >
          <div className="container py-5">
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  data-cursor-hover
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeFilter === cat.id
                      ? "bg-[#8b5cf6] text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                      : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80 border border-white/[0.06]"
                  }`}
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {cat.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    activeFilter === cat.id
                      ? "bg-white/20 text-white"
                      : "bg-white/[0.06] text-white/30"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- FILTERED GALLERY VIEW --- */}
        {activeFilter !== "all" ? (
          <section className="relative py-20 md:py-28">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map((site) => (
                  <div key={site.name} data-filtered-card>
                    <SiteCard {...site} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* --- SECTION: 3D & WebGL --- */}
            <section className="relative py-32 md:py-40 overflow-hidden">
              {/* Section background */}
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none" data-parallax>
                <img
                  src="/manus-storage/section-3d_4656044a.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505]" />
              </div>

              <div className="container relative z-10">
                <div data-section-header className="mb-16 md:mb-20">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8b5cf6]/70 mb-4 block">01 — Technique</span>
                  <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    3D & WebGL Experiences
                  </h2>
                  <p className="mt-4 text-white/40 max-w-xl text-lg">
                    Three.js and WebGPU have become the medium for flagship brand storytelling — not just developer portfolios.
                  </p>
                </div>

                <div data-card-group className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ALL_SITES.filter(s => s.category === "3d").map((site) => (
                    <div key={site.name} data-card>
                      <SiteCard {...site} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- SECTION: Scroll Storytelling --- */}
            <section className="relative py-32 md:py-40 overflow-hidden">
              <div className="absolute top-0 left-0 w-1/2 h-full opacity-15 pointer-events-none" data-parallax>
                <img
                  src="/manus-storage/section-scroll_c9743b5e.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]" />
              </div>

              <div className="container relative z-10">
                <div data-section-header className="mb-16 md:mb-20 md:text-right">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8b5cf6]/70 mb-4 block">02 — Technique</span>
                  <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Scroll Storytelling
                  </h2>
                  <p className="mt-4 text-white/40 max-w-xl text-lg md:ml-auto">
                    GSAP ScrollTrigger turns the scroll bar into a narrative device — each section a beat in a cinematic sequence.
                  </p>
                </div>

                <div data-card-group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ALL_SITES.filter(s => s.category === "scroll").map((site) => (
                    <div key={site.name} data-card>
                      <SiteCard {...site} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* --- SECTION: Interactions & Gamification --- */}
            <section className="relative py-32 md:py-40 overflow-hidden">
              <div className="absolute bottom-0 right-0 w-2/3 h-full opacity-15 pointer-events-none" data-parallax>
                <img
                  src="/manus-storage/section-interactions_f7d6f7be.png"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#050505]/50 to-[#050505]" />
              </div>

              <div className="container relative z-10">
                <div data-section-header className="mb-16 md:mb-20">
                  <span className="text-xs uppercase tracking-[0.3em] text-[#8b5cf6]/70 mb-4 block">03 — Technique</span>
                  <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Interactions & Gamification
                  </h2>
                  <p className="mt-4 text-white/40 max-w-xl text-lg">
                    Custom cursors, magnetic buttons, mouse-reveal effects, and branded micro-games that make users stay and play.
                  </p>
                </div>

                <div data-card-group className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ALL_SITES.filter(s => s.category === "interactions").map((site) => (
                    <div key={site.name} data-card>
                      <SiteCard {...site} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* --- SECTION: Tech Stack --- */}
        <section className="relative py-32 md:py-40">
          <div className="container">
            <div data-section-header className="mb-16 md:mb-20 text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-[#8b5cf6]/70 mb-4 block">04 — Architecture</span>
              <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                The Modern WOW Stack
              </h2>
              <p className="mt-4 text-white/40 max-w-xl mx-auto text-lg">
                The dominant technologies powering award-winning creative websites in 2025–2026.
              </p>
            </div>

            <div data-tech-table className="max-w-4xl mx-auto">
              <div className="grid grid-cols-[1fr_1.5fr_2fr] gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06]">
                {/* Header */}
                <div className="bg-[#8b5cf6]/10 px-5 py-4 text-xs uppercase tracking-wider text-[#8b5cf6] font-semibold">Category</div>
                <div className="bg-[#8b5cf6]/10 px-5 py-4 text-xs uppercase tracking-wider text-[#8b5cf6] font-semibold">Technologies</div>
                <div className="bg-[#8b5cf6]/10 px-5 py-4 text-xs uppercase tracking-wider text-[#8b5cf6] font-semibold">Purpose</div>
                {/* Rows */}
                {TECH_STACK.map((row) => (
                  <div key={row.category} data-tech-row className="contents">
                    <div className="bg-white/[0.02] px-5 py-4 text-sm text-white/80 font-medium border-t border-white/[0.04]">{row.category}</div>
                    <div className="bg-white/[0.02] px-5 py-4 text-sm text-white/60 border-t border-white/[0.04]">{row.tools}</div>
                    <div className="bg-white/[0.02] px-5 py-4 text-sm text-white/40 border-t border-white/[0.04]">{row.purpose}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="relative py-20 border-t border-white/[0.04]">
          <div className="container text-center">
            <img
              src="/manus-storage/wow-logo_83951cf6.png"
              alt="WOW"
              className="w-12 h-12 mx-auto mb-6 opacity-60"
            />
            <p className="text-white/30 text-sm max-w-md mx-auto">
              Built with the techniques it showcases — GSAP, Lenis, and the principles of the <span className="text-[#8b5cf6]/60">wow-website-creator</span> skill.
            </p>
            <p className="text-white/15 text-xs mt-6">
              Curated by Manus AI — 2026
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
