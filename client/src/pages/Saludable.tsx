/**
 * Empresa Saludable — WOW Health & Wellness Website
 * Design: Light Botanical Sanctuary — soft sage, mint, cream, calming greens
 * Tech: GSAP ScrollTrigger, Lenis smooth scroll, floating particles, Bossa Nova
 * Section order: Hero → Celebrities → Pillars → Stats → Compliance → Plans → Contact → Pharmacy Map (last)
 */
import { useEffect, useRef, useState, Suspense, lazy, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MusicPlayer from "@/components/saludable/MusicPlayer";

gsap.registerPlugin(ScrollTrigger);

const PharmacyMap = lazy(() => import("@/components/saludable/PharmacyMap"));

// ─── Data ───────────────────────────────────────────────────────────────────

const CELEBRITIES = [
  {
    name: "Chayanne",
    role: "Entrenamiento de Fuerza",
    image: "/manus-storage/fitness-chayanne_62488a49.png",
    quote: "La disciplina física transforma la mente.",
  },
  {
    name: "Ricky Martin",
    role: "Yoga & Meditación",
    image: "/manus-storage/fitness-ricky_0737be02.png",
    quote: "El bienestar comienza con la calma interior.",
  },
  {
    name: "Zuleyka Rivera",
    role: "Fitness & Nutrición",
    image: "/manus-storage/fitness-zuleyka_6b53e95a.png",
    quote: "Cuerpo fuerte, mente poderosa.",
  },
  {
    name: "Dayanara Torres",
    role: "Nutrición & Bienestar",
    image: "/manus-storage/fitness-dayanara_4d0aa017.png",
    quote: "Alimentar el cuerpo es alimentar el alma.",
  },
];

const PILLARS = [
  {
    id: "mental",
    title: "Salud Mental",
    icon: "🧠",
    color: "#A8C5A0",
    description: "Programas de bienestar emocional, manejo del estrés y apoyo psicológico para empleados y comunidades.",
    stats: ["85% reducción en ausentismo", "Talleres semanales", "Línea de apoyo 24/7"],
  },
  {
    id: "fisica",
    title: "Salud Física",
    icon: "💪",
    color: "#7EB89A",
    description: "Actividad física, nutrición personalizada y prevención de enfermedades crónicas para una vida activa.",
    stats: ["112+ farmacias aliadas", "Planes nutricionales", "Evaluaciones periódicas"],
  },
  {
    id: "financiera",
    title: "Salud Financiera",
    icon: "📊",
    color: "#B8D4A8",
    description: "Educación financiera, planificación de retiro y gestión de beneficios para estabilidad económica.",
    stats: ["ROI 3:1 comprobado", "Asesoría personalizada", "Planes de ahorro"],
  },
  {
    id: "corporativa",
    title: "Salud Corporativa",
    icon: "🏢",
    color: "#6BAF8D",
    description: "Cultura organizacional saludable, cumplimiento regulatorio y programas de bienestar empresarial.",
    stats: ["Cumplimiento OSHA", "Clima laboral óptimo", "Certificaciones"],
  },
];

const STATS = [
  { value: 112, suffix: "+", label: "Farmacias Aliadas" },
  { value: 70, suffix: "", label: "Municipios Cubiertos" },
  { value: 98, suffix: "%", label: "Satisfacción" },
  { value: 12, suffix: "K+", label: "Beneficiarios" },
];

const COMPLIANCE_STEPS = [
  { step: 1, title: "Evaluación Inicial", desc: "Diagnóstico completo del estado de salud organizacional y necesidades específicas." },
  { step: 2, title: "Plan Estratégico", desc: "Diseño personalizado de intervenciones basadas en evidencia y mejores prácticas." },
  { step: 3, title: "Implementación", desc: "Ejecución coordinada con farmacias, proveedores y equipo interno." },
  { step: 4, title: "Monitoreo Continuo", desc: "Seguimiento de métricas, ajustes y reportes de cumplimiento regulatorio." },
  { step: 5, title: "Certificación", desc: "Validación de resultados y obtención de certificaciones de bienestar." },
];

const PLANS = [
  {
    name: "Esencial",
    price: "Consultar",
    features: ["Evaluación básica", "Acceso a red de farmacias", "Reportes trimestrales", "Soporte por email"],
    highlighted: false,
  },
  {
    name: "Profesional",
    price: "Consultar",
    features: ["Todo en Esencial", "4 Pilares integrados", "Dashboard en tiempo real", "Talleres mensuales", "Soporte prioritario"],
    highlighted: true,
  },
  {
    name: "Empresarial",
    price: "Consultar",
    features: ["Todo en Profesional", "Programa a medida", "Certificación completa", "Gerente dedicado", "API de integración"],
    highlighted: false,
  },
];

// ─── Floating Particles Component ───────────────────────────────────────────

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.1,
        hue: 130 + Math.random() * 30, // green hues
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 40%, 70%, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Saludable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const celebsRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLElement>(null);
  const complianceRef = useRef<HTMLElement>(null);
  const plansRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });

  // ─── Lenis Smooth Scroll ──────────────────────────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  // ─── Custom Cursor ────────────────────────────────────────────────────────
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = cursorRingRef.current;
    if (!cursor || !ring) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, { x: e.clientX - 4, y: e.clientY - 4, duration: 0.1 });
      gsap.to(ring, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.3 });
    };

    const handleHover = () => {
      gsap.to(ring, { scale: 1.5, borderColor: "#6BAF8D", duration: 0.3 });
    };
    const handleLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: "rgba(168,197,160,0.5)", duration: 0.3 });
    };

    window.addEventListener("mousemove", moveCursor);
    document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  // ─── GSAP Animations ─────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal
      gsap.from(".hero-title span", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.5,
      });

      gsap.from(".hero-subtitle", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.2,
      });

      // Celebrity cards
      if (celebsRef.current) {
        gsap.from(".celeb-card", {
          scrollTrigger: {
            trigger: celebsRef.current,
            start: "top 80%",
          },
          y: 80,
          opacity: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
        });
      }

      // Pillars stagger
      if (pillarsRef.current) {
        gsap.from(".pillar-card", {
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 80%",
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        });
      }

      // Stats counter animation
      if (statsRef.current) {
        gsap.from(".stat-item", {
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Compliance steps
      if (complianceRef.current) {
        gsap.from(".compliance-step", {
          scrollTrigger: {
            trigger: complianceRef.current,
            start: "top 80%",
          },
          x: -40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
        });
      }

      // Plans
      if (plansRef.current) {
        gsap.from(".plan-card", {
          scrollTrigger: {
            trigger: plansRef.current,
            start: "top 80%",
          },
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
        });
      }

      // Contact
      if (contactRef.current) {
        gsap.from(".contact-form", {
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Map section
      if (mapRef.current) {
        gsap.from(".map-container", {
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 75%",
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ─── Animated Counter ─────────────────────────────────────────────────────
  function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const countRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
      if (!countRef.current || hasAnimated.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const obj = { val: 0 };
            gsap.to(obj, {
              val: value,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                if (countRef.current) {
                  countRef.current.textContent = Math.round(obj.val) + suffix;
                }
              },
            });
          }
        },
        { threshold: 0.5 }
      );

      observer.observe(countRef.current);
      return () => observer.disconnect();
    }, [value, suffix]);

    return <span ref={countRef}>0{suffix}</span>;
  }

  return (
    <div ref={containerRef} className="relative bg-[#F4F9F2] text-[#2D3B2D] overflow-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 rounded-full bg-[#6BAF8D] pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      />
      <div
        ref={cursorRingRef}
        className="fixed w-10 h-10 rounded-full border border-[#A8C5A0]/50 pointer-events-none z-[9998] hidden md:block"
      />

      {/* Music Player */}
      <MusicPlayer />

      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-[#F4F9F2]/80 border-b border-[#A8C5A0]/20 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/manus-storage/saludable-logo_630e22f3.png"
            alt="Empresa Saludable"
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Empresa Saludable
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#2D3B2D]/70">
          <a href="#pilares" className="hover:text-[#6BAF8D] transition-colors" data-hover>Pilares</a>
          <a href="#farmacias" className="hover:text-[#6BAF8D] transition-colors" data-hover>Farmacias</a>
          <a href="#cumplimiento" className="hover:text-[#6BAF8D] transition-colors" data-hover>Cumplimiento</a>
          <a href="#planes" className="hover:text-[#6BAF8D] transition-colors" data-hover>Planes</a>
          <a
            href="#contacto"
            className="px-4 py-2 rounded-full bg-[#6BAF8D] text-white hover:bg-[#5A9E7D] transition-all"
            data-hover
          >
            Contacto
          </a>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Light gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E0] via-[#F4F9F2] to-[#DFF0D8]" />
        {/* Floating particles */}
        <FloatingParticles />
        {/* Subtle hero image overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "url(/manus-storage/hero-light-green_948fb9ea.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1
            className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block text-[#2D3B2D]">Tu bienestar</span>
            <span className="block text-[#6BAF8D]">comienza</span>
            <span className="block text-[#2D3B2D]">aquí</span>
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-[#2D3B2D]/70 max-w-xl mx-auto leading-relaxed">
            Red integral de bienestar conectando comunidades, farmacias y servicios de salud en todo Puerto Rico.
          </p>
          <div className="hero-subtitle mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#pilares"
              className="px-8 py-4 rounded-full bg-[#6BAF8D] text-white font-semibold hover:bg-[#5A9E7D] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#6BAF8D]/20"
              data-hover
            >
              Explorar Pilares
            </a>
            <a
              href="#farmacias"
              className="px-8 py-4 rounded-full border-2 border-[#6BAF8D] text-[#6BAF8D] hover:bg-[#6BAF8D]/10 transition-all duration-300"
              data-hover
            >
              Encuentra tu Farmacia
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-[#6BAF8D]/60 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#6BAF8D]/60 to-transparent" />
        </div>
      </section>

      {/* ═══ CELEBRITY FITNESS SECTION ═══ */}
      <section ref={celebsRef} className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Inspirados por los <span className="text-[#6BAF8D]">Mejores</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Nuestros programas están inspirados en el compromiso con la salud de los más grandes de Puerto Rico.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CELEBRITIES.map((celeb, i) => (
              <div
                key={i}
                className="celeb-card group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                data-hover
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={celeb.image}
                    alt={celeb.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D3B2D]/90 via-[#2D3B2D]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {celeb.name}
                  </h3>
                  <p className="text-[#A8C5A0] text-sm font-medium mb-3">{celeb.role}</p>
                  <p className="text-white/70 text-sm italic opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    "{celeb.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4 PILLARS SECTION ═══ */}
      <section ref={pillarsRef} id="pilares" className="py-32 px-6 bg-[#F4F9F2]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Los 4 Pilares del <span className="text-[#6BAF8D]">Bienestar</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Un enfoque holístico que integra todas las dimensiones de la salud para resultados sostenibles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className={`pillar-card group relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                  activePillar === pillar.id
                    ? "border-[#6BAF8D] bg-white shadow-lg scale-[1.02]"
                    : "border-[#A8C5A0]/30 bg-white/60 hover:border-[#6BAF8D]/50 hover:bg-white"
                }`}
                onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
                data-hover
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${pillar.color}20, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: `${pillar.color}20` }}
                    >
                      {pillar.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-[#2D3B2D]/70 leading-relaxed mb-4">{pillar.description}</p>

                  {/* Expanded stats */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      activePillar === pillar.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-[#A8C5A0]/30 space-y-2">
                      {pillar.stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#2D3B2D]/80">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.color }} />
                          {stat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle hint */}
                  <div className="mt-4 text-xs text-[#6BAF8D] flex items-center gap-1 font-medium">
                    <span>{activePillar === pillar.id ? "Cerrar" : "Ver más"}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${activePillar === pillar.id ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS CAROUSEL ═══ */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#F4F9F2] to-[#EDF5EA] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lo Que Dicen Nuestros <span className="text-[#6BAF8D]">Beneficiarios</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-xl mx-auto">
            Historias reales de transformación y bienestar en toda la isla.
          </p>

          {/* Carousel */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {[
                {
                  quote: "Desde que mi empresa se unió a Empresa Saludable, la energía del equipo cambió por completo. Los talleres de salud mental nos dieron herramientas reales.",
                  name: "María del Carmen Ortiz",
                  role: "Directora de RRHH, Corporación del Caribe",
                  municipality: "San Juan",
                },
                {
                  quote: "La red de farmacias me permite acceder a mis medicamentos y consultas nutricionales cerca de casa. Es un servicio que realmente funciona.",
                  name: "José Luis Rivera",
                  role: "Beneficiario, Plan Profesional",
                  municipality: "Carolina",
                },
                {
                  quote: "El programa de salud financiera me ayudó a planificar mi retiro con confianza. Nunca pensé que un programa de bienestar incluyera eso.",
                  name: "Ana Sofía Méndez",
                  role: "Empleada, Sector Farmacéutico",
                  municipality: "Caguas",
                },
                {
                  quote: "Como farmacéutica aliada, veo el impacto directo en mis pacientes. Llegan más informados y comprometidos con su salud.",
                  name: "Dra. Carmen Luisa Vega",
                  role: "Farmacéutica, Super Farmacia Isla Verde",
                  municipality: "Carolina",
                },
                {
                  quote: "El cumplimiento regulatorio ya no es una carga. El equipo nos guía paso a paso y nos mantiene al día con cada requisito.",
                  name: "Roberto Colón Torres",
                  role: "CEO, Grupo Salud Integral",
                  municipality: "Ponce",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[340px] md:w-[400px] snap-center p-8 rounded-2xl bg-white border border-[#A8C5A0]/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 group"
                >
                  {/* Quote icon */}
                  <svg className="w-8 h-8 text-[#6BAF8D]/30 mb-4 group-hover:text-[#6BAF8D]/60 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                  </svg>
                  {/* Quote text */}
                  <p className="text-[#2D3B2D]/80 text-sm leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  {/* Author */}
                  <div className="border-t border-[#A8C5A0]/20 pt-4">
                    <p className="font-semibold text-[#2D3B2D] text-sm">{testimonial.name}</p>
                    <p className="text-xs text-[#6BAF8D] mt-0.5">{testimonial.role}</p>
                    <p className="text-xs text-[#2D3B2D]/40 mt-0.5">{testimonial.municipality}, PR</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="flex justify-center mt-6 gap-2">
              <span className="text-xs text-[#2D3B2D]/40">← Desliza para ver más →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS DASHBOARD ═══ */}
      <section ref={statsRef} className="py-24 px-6 bg-[#2D3B2D]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div
                  className="text-4xl md:text-5xl font-bold mb-2 text-white"
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[#A8C5A0]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPLIANCE STEPS ═══ */}
      <section ref={complianceRef} id="cumplimiento" className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planificación y <span className="text-[#6BAF8D]">Cumplimiento</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Un proceso estructurado para garantizar resultados medibles y cumplimiento regulatorio.
          </p>

          <div className="space-y-4">
            {COMPLIANCE_STEPS.map((item) => (
              <div
                key={item.step}
                className={`compliance-step group flex items-start gap-6 p-6 rounded-xl border transition-all duration-500 cursor-pointer ${
                  activeStep === item.step
                    ? "border-[#6BAF8D] bg-[#6BAF8D]/5 shadow-md"
                    : "border-[#A8C5A0]/20 bg-[#F4F9F2] hover:border-[#6BAF8D]/40 hover:shadow-sm"
                }`}
                onClick={() => setActiveStep(item.step)}
                data-hover
              >
                {/* Step number */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    activeStep === item.step
                      ? "bg-[#6BAF8D] text-white"
                      : "bg-[#E8F5E0] text-[#6BAF8D] border border-[#A8C5A0]/30"
                  }`}
                >
                  {item.step}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#2D3B2D] mb-1">{item.title}</h3>
                  <p
                    className={`text-[#2D3B2D]/60 leading-relaxed transition-all duration-500 ${
                      activeStep === item.step ? "max-h-20 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICE PLANS ═══ */}
      <section ref={plansRef} id="planes" className="py-32 px-6 bg-[#F4F9F2]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planes de <span className="text-[#6BAF8D]">Servicio</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Soluciones escalables adaptadas al tamaño y necesidades de tu organización.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`plan-card relative p-8 rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl ${
                  plan.highlighted
                    ? "border-[#6BAF8D] bg-white shadow-lg shadow-[#6BAF8D]/10"
                    : "border-[#A8C5A0]/30 bg-white hover:border-[#6BAF8D]/50"
                }`}
                data-hover
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#6BAF8D] text-white text-xs font-semibold">
                    Recomendado
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2 text-[#2D3B2D]">{plan.name}</h3>
                <p className="text-3xl font-bold text-[#6BAF8D] mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#2D3B2D]/70">
                      <svg className="w-4 h-4 text-[#6BAF8D] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contacto"
                  className={`block text-center py-3 rounded-full font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-[#6BAF8D] text-white hover:bg-[#5A9E7D]"
                      : "border-2 border-[#6BAF8D] text-[#6BAF8D] hover:bg-[#6BAF8D]/10"
                  }`}
                >
                  Solicitar Info
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT FORM ═══ */}
      <section ref={contactRef} id="contacto" className="py-32 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hablemos de <span className="text-[#6BAF8D]">Bienestar</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-12">
            Escríbenos a{" "}
            <a href="mailto:hola@empresasaludable.org" className="text-[#6BAF8D] hover:underline" data-hover>
              hola@empresasaludable.org
            </a>{" "}
            o completa el formulario.
          </p>

          <form
            className="contact-form space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `mailto:hola@empresasaludable.org?subject=Consulta de ${formData.name} - ${formData.company}&body=${formData.message}`;
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-[#F4F9F2] border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-[#F4F9F2] border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Empresa / Organización"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-[#F4F9F2] border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all"
            />
            <textarea
              placeholder="¿Cómo podemos ayudarte?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-5 py-4 rounded-xl bg-[#F4F9F2] border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#6BAF8D] text-white font-semibold text-lg hover:bg-[#5A9E7D] transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[#6BAF8D]/20"
              data-hover
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      {/* ═══ PHARMACY MAP (LAST SECTION) ═══ */}
      <section ref={mapRef} id="farmacias" className="py-32 px-6 bg-[#F4F9F2]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Red de <span className="text-[#6BAF8D]">Farmacias</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-12 max-w-2xl mx-auto">
            Más de 112 farmacias aliadas en 70 municipios de Puerto Rico, listas para servirte.
          </p>

          <div className="map-container">
            <Suspense
              fallback={
                <div className="h-[500px] rounded-2xl bg-white border border-[#A8C5A0]/30 flex items-center justify-center shadow-inner">
                  <div className="animate-pulse text-[#6BAF8D]">Cargando mapa...</div>
                </div>
              }
            >
              <PharmacyMap />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-6 border-t border-[#A8C5A0]/20 bg-[#2D3B2D]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/saludable-logo_630e22f3.png" alt="" className="w-8 h-8" />
            <span className="text-sm text-white/60">Empresa Saludable — Puerto Rico</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <a href="mailto:hola@empresasaludable.org" className="hover:text-[#A8C5A0] transition-colors">
              hola@empresasaludable.org
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
