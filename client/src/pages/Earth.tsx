/**
 * Earth Page — Nature & Organic WOW Showcase
 * Design: Warm terracotta, forest greens, sandy tones, organic textures
 * Sections: Hero, Nature Gallery (with modal), Philosophy, Earthy Palette
 */
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import EarthModal from "@/components/EarthModal";

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
  techStack: string[];
  highlights: string[];
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
    techStack: ["React", "Next.js", "Contentful CMS", "Styled Components", "Framer Motion", "Shopify"],
    highlights: [
      "Generous whitespace creates breathing room between every element",
      "Sepia-toned product photography with consistent warm color grading",
      "Typography-driven hierarchy using serif/sans-serif pairing",
      "Subtle page transitions that feel like turning pages in a book",
    ],
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
    techStack: ["React", "GSAP ScrollTrigger", "Contentful", "Cloudinary", "Tailwind CSS", "Vercel"],
    highlights: [
      "Full-bleed photography with scroll-driven parallax layers",
      "Long-form editorial layout that rewards slow reading",
      "Earthy color grading applied consistently across all imagery",
      "Activism-first content strategy woven into the design language",
    ],
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
    techStack: ["Three.js", "React Three Fiber", "GSAP", "Lenis", "WebGL Shaders", "Tailwind CSS"],
    highlights: [
      "Organic 3D shapes that morph and flow with scroll position",
      "Calming color transitions from sage to warm amber",
      "Particle systems that simulate natural phenomena (pollen, light)",
      "Breathing-pace animations that slow the user down intentionally",
    ],
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
    techStack: ["Vue.js", "Nuxt", "GSAP", "Shopify Storefront API", "Tailwind CSS", "Cloudinary"],
    highlights: [
      "Hover states that unfurl like petals opening — scale + opacity + color shift",
      "Warm cream (#FDF8F0) background that feels like linen paper",
      "Product cards with botanical illustration overlays on hover",
      "Seasonal color palette that shifts with the time of year",
    ],
  },
  {
    name: "Package Free Shop",
    studio: "Independent",
    description: "Zero-waste marketplace with raw kraft paper textures, hand-drawn illustrations, and earthy browns. The design philosophy mirrors the product ethos — nothing wasted, everything intentional.",
    technique: "Textured Minimalism",
    url: "https://packagefreeshop.com",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    category: "sustainable",
    techStack: ["Shopify", "Liquid", "Custom CSS", "SVG Illustrations", "Vanilla JS"],
    highlights: [
      "Kraft paper texture overlays that give a handmade feel",
      "Hand-drawn SVG illustrations instead of stock photography",
      "Intentionally limited color palette: browns, creams, forest green",
      "Zero visual waste — every pixel serves a purpose",
    ],
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
    techStack: ["React", "Next.js", "Sanity CMS", "Framer Motion", "Styled Components", "Shopify Plus"],
    highlights: [
      "Monospace typewriter typography for an apothecary laboratory feel",
      "Sepia-toned photography with high contrast and grain",
      "Ingredient-first storytelling — raw materials before finished product",
      "Minimal navigation that forces linear exploration like walking through a shop",
    ],
  },
  {
    name: "Maitri Verde",
    studio: "Botanical Studio",
    description: "A botanical garden website with parallax leaf layers, organic scroll animations, and a deep forest green palette. Each section unfolds like walking deeper into a greenhouse.",
    technique: "Parallax Botanical Layers",
    url: "https://maitriverde.com",
    thumbnail: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    category: "botanical",
    techStack: ["GSAP ScrollTrigger", "CSS Parallax", "SVG Animations", "Webflow", "Custom JS"],
    highlights: [
      "Multi-layer parallax with leaf silhouettes at different depths",
      "Deep forest green (#2D5016) as the dominant brand color",
      "Scroll-triggered growth animations — vines extending, leaves unfurling",
      "Immersive greenhouse atmosphere that deepens as you scroll",
    ],
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
    techStack: ["React", "Lottie Animations", "GSAP", "Custom Illustration System", "Tailwind CSS", "Vercel"],
    highlights: [
      "Breathing-pace animations (4s in, 4s out) synced to UI transitions",
      "Custom organic illustrations with rounded, soft geometry",
      "Calming micro-interactions that reward slow, deliberate interaction",
      "Sound design integration — ambient audio on hover and scroll",
    ],
  },
  {
    name: "Aman Resorts",
    studio: "CTI Digital",
    description: "Ultra-luxury resort brand where every pixel whispers quiet opulence. Full-bleed nature photography, cinematic video backgrounds, and a restrained palette of stone, sand, and deep forest. The site feels like stepping into a sanctuary — unhurried, intentional, breathtaking.",
    technique: "Cinematic Immersion",
    url: "https://www.aman.com",
    award: "Webby Award",
    thumbnail: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    category: "wellness",
    techStack: ["Drupal CMS", "GSAP", "Cloudinary", "Custom Video Player", "Lazy Loading", "Responsive Images"],
    highlights: [
      "Full-viewport cinematic video backgrounds with seamless autoplay",
      "Stone and sand color palette (#D4C5B0, #8B7355) with deep forest accents",
      "Scroll-triggered location reveals that unfold like a travel journal",
      "Typography so restrained it borders on silence — letting imagery speak",
    ],
  },
  {
    name: "Ritual",
    studio: "In-house",
    description: "Transparent supplement brand with a signature sunny yellow that evolved into warm amber. Clean scientific aesthetic meets organic warmth — ingredient traceability visualized through interactive supply chain maps and capsule cross-sections.",
    technique: "Transparent Science Design",
    url: "https://ritual.com",
    award: "Webby Award",
    thumbnail: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
    category: "organic",
    techStack: ["React", "Next.js", "Shopify Plus", "Three.js", "Framer Motion", "Sanity CMS"],
    highlights: [
      "Interactive ingredient traceability maps showing supply chain origins",
      "3D capsule cross-section animations revealing nutrient layers",
      "Warm amber (#F5A623) signature color evolved from pure yellow",
      "Scientific data visualization presented with organic warmth",
    ],
  },
  {
    name: "Stella McCartney",
    studio: "In-house Digital",
    description: "Sustainable luxury fashion house where environmental consciousness meets high-end editorial design. Earthy neutrals, recycled material textures, and bold sustainability messaging woven into every scroll — fashion as activism.",
    technique: "Sustainable Editorial",
    url: "https://www.stellamccartney.com",
    award: "FWA Award",
    thumbnail: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    category: "sustainable",
    techStack: ["React", "Next.js", "Contentful", "GSAP", "Cloudinary", "Shopify Plus"],
    highlights: [
      "Sustainability metrics embedded directly into product pages",
      "Earthy neutral palette with bold green activism accents",
      "Material innovation stories told through scroll-driven reveals",
      "Editorial photography with natural lighting and earth-toned backdrops",
    ],
  },
  {
    name: "Kinto",
    studio: "In-house",
    description: "Japanese tableware brand embodying wabi-sabi philosophy. Muted earth tones, generous negative space, and pottery-inspired rounded corners. Every interaction feels like holding a handmade ceramic — warm, imperfect, intentional.",
    technique: "Wabi-Sabi Minimalism",
    url: "https://kinto.co.jp/en/",
    award: "CSS Design Award",
    thumbnail: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
    category: "organic",
    techStack: ["Nuxt.js", "Vue.js", "GSAP", "Prismic CMS", "Custom Easing", "Intersection Observer"],
    highlights: [
      "Wabi-sabi philosophy expressed through intentional imperfection in layout",
      "Muted clay and stone palette (#B8A898, #8B7355, #E8DDD0)",
      "Pottery-inspired border-radius on all interactive elements",
      "Slow fade transitions (800ms+) that mirror the pace of tea ceremony",
    ],
  },
  {
    name: "Wildflower Cases",
    studio: "Creative Studio",
    description: "Phone case brand with hand-painted botanical patterns, watercolor textures, and a garden-party aesthetic. The site blooms with color — floral illustrations animate on scroll, product cards tilt like pressed flowers in a book.",
    technique: "Watercolor Botanical",
    url: "https://www.wildflowercases.com",
    thumbnail: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=800&q=80&fit=crop",
    category: "botanical",
    techStack: ["Shopify", "GSAP", "Custom Illustrations", "SVG Animations", "Tailwind CSS", "Liquid"],
    highlights: [
      "Hand-painted watercolor textures as section backgrounds",
      "Floral SVG illustrations that grow and bloom on scroll trigger",
      "Product cards with pressed-flower tilt effect on hover",
      "Pastel botanical palette: blush, sage, lavender, cream",
    ],
  },
  {
    name: "Reformation",
    studio: "In-house",
    description: "Sustainable fashion brand that makes eco-consciousness feel effortlessly cool. Clean grid layouts, environmental impact calculators on every product, and a warm neutral palette that says 'I care about the planet but I also look amazing.'",
    technique: "Eco-Chic Grid",
    url: "https://www.thereformation.com",
    award: "Webby Award",
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80",
    category: "sustainable",
    techStack: ["React", "Next.js", "Shopify Plus", "Custom Impact Calculator", "Contentful", "Vercel"],
    highlights: [
      "Real-time environmental impact calculator on every product page",
      "Warm neutral grid with generous whitespace between products",
      "Sustainability data visualized as simple, beautiful infographics",
      "Effortless cool tone — eco-consciousness without preachiness",
    ],
  },
  {
    name: "Olverum",
    studio: "We Are Goodness",
    description: "Luxury bath oil brand with an apothecary-meets-spa aesthetic. Deep forest greens, gold accents, and botanical illustration overlays create a sensory digital experience. The site smells expensive — every scroll feels like sinking into a warm bath.",
    technique: "Apothecary Luxury",
    url: "https://www.olverum.com",
    award: "Awwwards Honorable Mention",
    thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    category: "botanical",
    techStack: ["Shopify", "GSAP", "Custom Illustrations", "Lottie", "Tailwind CSS", "Cloudinary"],
    highlights: [
      "Deep forest green (#1a3a2a) with gold (#c4956a) accent system",
      "Botanical illustration overlays that layer over product photography",
      "Ingredient spotlight animations with hand-drawn plant diagrams",
      "Sensory copywriting paired with slow-reveal scroll animations",
    ],
  },
  {
    name: "Cereal Magazine",
    studio: "In-house",
    description: "Travel and lifestyle publication with the most restrained, contemplative web design in existence. Vast whitespace, whisper-quiet typography, and photography that makes you ache to be somewhere else. The digital equivalent of a perfectly still morning.",
    technique: "Contemplative Editorial",
    url: "https://www.readcereal.com",
    award: "Awwwards SOTD",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    category: "organic",
    techStack: ["Custom CMS", "Vanilla JS", "CSS Grid", "Lazy Loading", "WebP", "Minimal Framework"],
    highlights: [
      "80%+ whitespace ratio — content floats in vast empty space",
      "Typography so light it barely exists (300 weight, large tracking)",
      "No animations at all — stillness itself becomes the design statement",
      "Muted earth-toned photography with consistent desaturated grading",
    ],
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
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const [selectedSite, setSelectedSite] = useState<EarthSite | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredSites = activeFilter === "all"
    ? EARTH_SITES
    : EARTH_SITES.filter(s => s.category === activeFilter);

  // Animate cards when filter changes
  const handleFilterChange = (key: string) => {
    if (key === activeFilter) return;

    // Fade out current cards
    const cards = cardsGridRef.current?.querySelectorAll(".earth-card");
    if (cards && cards.length > 0) {
      gsap.to(cards, {
        opacity: 0,
        y: 20,
        scale: 0.96,
        duration: 0.25,
        ease: "power2.in",
        stagger: 0.03,
        onComplete: () => {
          setActiveFilter(key);
          // Fade in new cards after state update (next frame)
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const newCards = cardsGridRef.current?.querySelectorAll(".earth-card");
              if (newCards && newCards.length > 0) {
                gsap.fromTo(newCards,
                  { opacity: 0, y: 30, scale: 0.96 },
                  {
                    opacity: 1, y: 0, scale: 1,
                    duration: 0.45,
                    ease: "power2.out",
                    stagger: 0.06,
                  }
                );
              }
            });
          });
        },
      });
    } else {
      setActiveFilter(key);
    }
  };

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
                onClick={() => handleFilterChange(cat.key)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition-all duration-300 backdrop-blur-sm ${
                  activeFilter === cat.key
                    ? "border-[#c4956a] text-[#c4956a] bg-[#c4956a]/10 shadow-[0_0_20px_-5px_rgba(196,149,106,0.3)]"
                    : "border-[#3d3228] text-[#b8a898]/70 hover:border-[#c4956a]/50 hover:text-[#c4956a] bg-[#1a1612]/50"
                }`}
              >
                {cat.label}
                <span className={`ml-2 text-[10px] ${activeFilter === cat.key ? "text-[#c4956a]" : "text-[#7a9e7e]"}`}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredSites.map((site) => (
              <div
                key={site.name}
                className="earth-card group block cursor-pointer"
                onClick={() => setSelectedSite(site)}
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
                        Details
                        <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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

      {/* ===== MODAL ===== */}
      <EarthModal
        site={selectedSite}
        allSites={EARTH_SITES}
        onClose={() => setSelectedSite(null)}
        onSelectSite={(site) => setSelectedSite(site as EarthSite)}
      />
    </div>
  );
}
