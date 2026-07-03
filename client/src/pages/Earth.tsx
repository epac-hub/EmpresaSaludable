/**
 * Earth Page — Nature & Organic WOW Showcase
 * Design: Warm terracotta, forest greens, sandy tones, organic textures
 * Sections: Hero, Nature Gallery, Philosophy, Earthy Tech Stack
 */
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface EarthSite {
  name: string;
  studio: string;
  description: string;
  technique: string;
  url: string;
  award?: string;
  thumbnail: string;
  category: "organic" | "botanical" | "wellness" | "sustainable";
}

const EARTH_SITES: EarthSite[] = [
  {
    name: "Aesop",
    studio: "In-house",
    description: "Minimalist luxury skincare brand with earthy tones, generous whitespace, and editorial typography. The site breathes — every element has room to exist. Warm neutrals and botanical photography create a sensory digital experience.",
    technique: "Editorial Minimalism",
    url: "https://www.aesop.com",
    award: "Ecommerce Design Award",
    thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    category: "organic",
  },
  {
    name: "Patagonia Stories",
    studio: "Patagonia",
    description: "Long-form environmental storytelling with immersive photography, earthy color grading, and scroll-driven narratives about conservation. The web as a medium for activism — raw, honest, grounded in the earth.",
    technique: "Scroll Storytelling",
    url: "https://www.patagonia.com/stories/",
    award: "Webby Award",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    category: "sustainable",
  },
  {
    name: "Vibrant Wellness",
    studio: "Creative Agency",
    description: "An interactive 3D journey through wellness diagnostics. Organic shapes, soft gradients, and flowing animations create a calming digital environment that mirrors the brand's holistic health philosophy.",
    technique: "3D Wellness Journey",
    url: "https://www.vibrantwellness.com",
    award: "Awwwards SOTD",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    category: "wellness",
  },
  {
    name: "Bloom & Wild",
    studio: "Design Studio",
    description: "Botanical e-commerce with lush photography, warm cream backgrounds, and delicate micro-interactions. Hover states bloom like flowers opening — the UI mirrors the product's organic nature.",
    technique: "Botanical Micro-interactions",
    url: "https://www.bloomandwild.com",
    award: "CSS Design Award",
    thumbnail: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80",
    category: "botanical",
  },
  {
    name: "Package Free Shop",
    studio: "Independent",
    description: "Zero-waste marketplace with raw kraft paper textures, hand-drawn illustrations, and earthy browns. The design philosophy mirrors the product ethos — nothing wasted, everything intentional.",
    technique: "Textured Minimalism",
    url: "https://packagefreeshop.com",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    category: "sustainable",
  },
  {
    name: "Le Labo",
    studio: "In-house",
    description: "Artisanal fragrance house with apothecary-inspired design. Sepia tones, typewriter fonts, and laboratory aesthetics create an intimate, handcrafted digital experience rooted in raw materials.",
    technique: "Apothecary Aesthetic",
    url: "https://www.lelabofragrances.com",
    award: "FWA Award",
    thumbnail: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=800&q=80",
    category: "organic",
  },
  {
    name: "Maitri Verde",
    studio: "Botanical Studio",
    description: "A botanical garden website with parallax leaf layers, organic scroll animations, and a deep forest green palette. Each section unfolds like walking deeper into a greenhouse.",
    technique: "Parallax Botanical Layers",
    url: "https://maitriverde.com",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    category: "botanical",
  },
  {
    name: "Headspace",
    studio: "Headspace Design",
    description: "Meditation app with soft organic illustrations, calming earth tones, and breathing animations synced to scroll. The interface itself becomes a mindfulness exercise — slow, intentional, grounding.",
    technique: "Breathing Animations",
    url: "https://www.headspace.com",
    award: "Apple Design Award",
    thumbnail: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80",
    category: "wellness",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Sites", count: EARTH_SITES.length },
  { key: "organic", label: "Organic", count: EARTH_SITES.filter(s => s.category === "organic").length },
  { key: "botanical", label: "Botanical", count: EARTH_SITES.filter(s => s.category === "botanical").length },
  { key: "wellness", label: "Wellness", count: EARTH_SITES.filter(s => s.category === "wellness").length },
  { key: "sustainable", label: "Sustainable", count: EARTH_SITES.filter(s => s.category === "sustainable").length },
];

export default function Earth() {
  const heroRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  // Hero animations
  useGSAP(() => {
    gsap.from(".earth-hero-title", {
      y: 80, opacity: 0, duration: 1.4,
      ease: "power3.out", stagger: 0.15,
    });
    gsap.from(".earth-hero-sub", {
      y: 40, opacity: 0, duration: 1.2,
      delay: 0.6, ease: "power3.out",
    });
  }, { scope: heroRef });

  // Gallery stagger
  useGSAP(() => {
    gsap.from(".earth-card", {
      y: 60, opacity: 0, duration: 0.8,
      ease: "power2.out", stagger: 0.12,
      scrollTrigger: {
        trigger: galleryRef.current,
        start: "top 80%",
      },
    });
  }, { scope: galleryRef });

  // Philosophy parallax
  useGSAP(() => {
    gsap.from(".philosophy-text", {
      y: 50, opacity: 0, duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: philosophyRef.current,
        start: "top 75%",
      },
    });
  }, { scope: philosophyRef });

  return (
    <div className="min-h-screen bg-[#1a1612] text-[#e8ddd0] overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between bg-[#1a1612]/80 backdrop-blur-md border-b border-[#3d3228]/30">
        <a href="/" className="flex items-center gap-3 group">
          <img src="/manus-storage/earth-logo_0b6a2f3d.png" alt="Earth" className="w-8 h-8 rounded-full" />
          <span className="text-sm uppercase tracking-[0.2em] text-[#c4956a] font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Earth Collection
          </span>
        </a>
        <a href="/" className="text-xs text-[#8b7355] hover:text-[#c4956a] transition-colors uppercase tracking-wider">
          ← Cosmic Gallery
        </a>
      </nav>

      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        <img
          src="/manus-storage/earth-hero-bg_9f2831ab.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1612]/60 via-[#1a1612]/30 to-[#1a1612]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="earth-hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-[#c4956a]">Rooted</span> in
            <br />
            <span className="text-[#7a9e7e]">Nature</span>
          </h1>
          <p className="earth-hero-sub text-lg md:text-xl text-[#b8a898]/80 max-w-2xl mx-auto leading-relaxed">
            A curated collection of websites that draw their power from the earth — organic textures, botanical palettes, and designs that breathe like living things.
          </p>
          <a href="#earth-gallery" className="earth-hero-sub inline-flex items-center gap-2 mt-10 px-6 py-3 border border-[#c4956a]/40 rounded-full text-[#c4956a] text-sm hover:bg-[#c4956a]/10 transition-all duration-300">
            Explore the Collection
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section ref={galleryRef} id="earth-gallery" className="relative py-24 md:py-32 px-6 md:px-10">
        <img
          src="/manus-storage/earth-section-nature_7d559cee.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1612] via-transparent to-[#1a1612]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section header */}
          <div className="mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#7a9e7e]/80">01 — Collection</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 text-[#e8ddd0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Earthy & Organic Websites
            </h2>
            <p className="text-[#b8a898]/60 mt-4 max-w-xl text-base leading-relaxed">
              Websites that honor natural materials, organic forms, and the quiet power of restraint. Each one proves that warmth and sophistication coexist.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className="px-4 py-2 text-xs uppercase tracking-wider rounded-full border border-[#3d3228] text-[#b8a898]/70 hover:border-[#c4956a]/50 hover:text-[#c4956a] transition-all duration-300 bg-[#1a1612]/50 backdrop-blur-sm"
              >
                {cat.label}
                <span className="ml-2 text-[10px] text-[#7a9e7e]">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {EARTH_SITES.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="earth-card group block"
              >
                <div className="relative rounded-2xl border border-[#3d3228]/50 bg-[#231e18]/60 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#c4956a]/30 hover:shadow-[0_0_50px_-15px_rgba(196,149,106,0.15)]">
                  {/* Thumbnail */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <img
                      src={site.thumbnail}
                      alt={`${site.name} preview`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.08]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] via-[#1a1612]/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* Award badge */}
                    {site.award && (
                      <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest text-[#c4956a] bg-[#1a1612]/80 backdrop-blur-sm border border-[#c4956a]/30 px-2.5 py-1 rounded-full">
                        {site.award}
                      </span>
                    )}

                    {/* Category badge */}
                    <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-[#7a9e7e] bg-[#1a1612]/80 backdrop-blur-sm border border-[#7a9e7e]/30 px-2.5 py-1 rounded-full">
                      {site.category}
                    </span>

                    {/* Hover description reveal */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] delay-75 z-10">
                      <p className="text-[#e8ddd0]/80 text-sm leading-relaxed line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {site.description}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-[#e8ddd0] group-hover:text-[#c4956a] transition-colors duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {site.name}
                    </h3>
                    <p className="text-xs text-[#7a9e7e]/80 mt-1">{site.studio}</p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[11px] text-[#b8a898]/40 uppercase tracking-wider group-hover:text-[#b8a898]/60 transition-all duration-500 group-hover:translate-x-1">
                        {site.technique}
                      </span>
                      <span className="text-xs text-[#c4956a] group-hover:text-[#d4a87a] transition-all duration-300 flex items-center gap-1">
                        Visit
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PHILOSOPHY ===== */}
      <section ref={philosophyRef} className="relative py-24 md:py-32 px-6 md:px-10">
        <img
          src="/manus-storage/earth-section-philosophy_b9a16502.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1612] via-[#1a1612]/80 to-[#1a1612]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#7a9e7e]/80">02 — Philosophy</span>
          <h2 className="philosophy-text text-3xl md:text-5xl font-bold mt-3 mb-12 text-[#e8ddd0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The <span className="text-[#c4956a]">Earthy</span> WOW
          </h2>

          <div className="philosophy-text space-y-8 text-[#b8a898]/80 text-base md:text-lg leading-relaxed">
            <p>
              Not every WOW needs to scream. The most powerful digital experiences often whisper — drawing you in with warmth, texture, and the quiet confidence of natural materials. An earthy website doesn't compete for attention; it earns trust through authenticity.
            </p>
            <p>
              The organic approach to web design borrows from nature's own principles: <span className="text-[#7a9e7e]">growth over time</span>, <span className="text-[#c4956a]">imperfection as beauty</span>, and <span className="text-[#e8ddd0]">restraint as strength</span>. Where cosmic sites dazzle with particles and shaders, earthy sites ground you with tactile surfaces, breathing whitespace, and colors pulled from soil, stone, and sky.
            </p>

            {/* Principles grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#3d3228]/50">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#7a9e7e]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#7a9e7e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </svg>
                </div>
                <h3 className="text-[#e8ddd0] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Breathe</h3>
                <p className="text-sm text-[#b8a898]/60">Generous whitespace. Let every element exist without crowding. The page inhales and exhales.</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#c4956a]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#c4956a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                  </svg>
                </div>
                <h3 className="text-[#e8ddd0] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Texture</h3>
                <p className="text-sm text-[#b8a898]/60">Grain, noise, paper, linen. Digital surfaces that feel tangible. Imperfection is the signature of craft.</p>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#8b7355]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-[#e8ddd0] font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Patience</h3>
                <p className="text-sm text-[#b8a898]/60">Slow reveals, gentle transitions. The user sets the pace. Nothing rushes — everything unfolds in its own time.</p>
              </div>
            </div>

            {/* Color palette showcase */}
            <div className="mt-12 pt-8 border-t border-[#3d3228]/50">
              <h3 className="text-sm uppercase tracking-[0.2em] text-[#b8a898]/50 mb-6">The Earthy Palette</h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { color: "#c4956a", name: "Terracotta" },
                  { color: "#7a9e7e", name: "Sage" },
                  { color: "#8b7355", name: "Umber" },
                  { color: "#d4b896", name: "Sand" },
                  { color: "#4a6741", name: "Forest" },
                  { color: "#e8ddd0", name: "Cream" },
                  { color: "#3d3228", name: "Dark Earth" },
                  { color: "#a67c52", name: "Ochre" },
                ].map((swatch) => (
                  <div key={swatch.name} className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-full border border-white/10 shadow-lg"
                      style={{ backgroundColor: swatch.color }}
                    />
                    <span className="text-[10px] text-[#b8a898]/50 uppercase tracking-wider">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-16 px-6 md:px-10 border-t border-[#3d3228]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/earth-logo_0b6a2f3d.png" alt="" className="w-6 h-6 rounded-full opacity-60" />
            <span className="text-xs text-[#8b7355]/60 uppercase tracking-wider">Earth Collection — WOW Showcase</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-xs text-[#8b7355] hover:text-[#c4956a] transition-colors">Cosmic Gallery</a>
            <span className="text-[#3d3228]">|</span>
            <span className="text-xs text-[#8b7355]/40">Built with the wow-website-creator skill</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
