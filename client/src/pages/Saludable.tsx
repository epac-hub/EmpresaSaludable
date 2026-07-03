/**
 * Empresa Saludable — WOW Health & Wellness Website
 * Design: Botanical Sanctuary — organic minimalism, tropical wellness, Puerto Rico
 * Tech: Three.js 3D orb, GSAP ScrollTrigger, Lenis smooth scroll, custom cursor, Bossa Nova
 */
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MusicPlayer from "@/components/saludable/MusicPlayer";

gsap.registerPlugin(ScrollTrigger);

// FloatingOrb removed
const PharmacyMap = lazy(() => import("@/components/saludable/PharmacyMap"));

// ─── Data ───────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    id: "mental",
    title: "Salud Mental",
    icon: "🧠",
    color: "#C4B5D4",
    description: "Programas de bienestar emocional, manejo del estrés y apoyo psicológico para empleados y comunidades.",
    stats: ["85% reducción en ausentismo", "Talleres semanales", "Línea de apoyo 24/7"],
  },
  {
    id: "fisica",
    title: "Salud Física",
    icon: "💪",
    color: "#8B9E7C",
    description: "Actividad física, nutrición personalizada y prevención de enfermedades crónicas para una vida activa.",
    stats: ["215+ farmacias aliadas", "Planes nutricionales", "Evaluaciones periódicas"],
  },
  {
    id: "financiera",
    title: "Salud Financiera",
    icon: "📊",
    color: "#D4A574",
    description: "Educación financiera, planificación de retiro y gestión de beneficios para estabilidad económica.",
    stats: ["ROI 3:1 comprobado", "Asesoría personalizada", "Planes de ahorro"],
  },
  {
    id: "corporativa",
    title: "Salud Corporativa",
    icon: "🏢",
    color: "#C4725F",
    description: "Cultura organizacional saludable, cumplimiento regulatorio y programas de bienestar empresarial.",
    stats: ["Cumplimiento OSHA", "Clima laboral óptimo", "Certificaciones"],
  },
];

const STATS = [
  { value: 215, suffix: "+", label: "Farmacias Aliadas" },
  { value: 56, suffix: "", label: "Municipios Cubiertos" },
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

// ─── Component ──────────────────────────────────────────────────────────────

export default function Saludable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
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
      gsap.to(ring, { scale: 1.5, borderColor: "#C4725F", duration: 0.3 });
    };
    const handleLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: "rgba(139,158,124,0.5)", duration: 0.3 });
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
    <div ref={containerRef} className="relative bg-[#1a2418] text-[#FDF8F0] overflow-hidden">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 rounded-full bg-[#8B9E7C] pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      />
      <div
        ref={cursorRingRef}
        className="fixed w-10 h-10 rounded-full border border-[#8B9E7C]/50 pointer-events-none z-[9998] hidden md:block"
      />

      {/* Music Player */}
      <MusicPlayer />

      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-[#1a2418]/80 border-b border-[#8B9E7C]/10">
        <div className="flex items-center gap-3">
          <img
            src="/manus-storage/saludable-logo_630e22f3.png"
            alt="Empresa Saludable"
            className="w-10 h-10 object-contain"
          />
          <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Empresa Saludable
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-[#FDF8F0]/70">
          <a href="#pilares" className="hover:text-[#8B9E7C] transition-colors" data-hover>Pilares</a>
          <a href="#farmacias" className="hover:text-[#8B9E7C] transition-colors" data-hover>Farmacias</a>
          <a href="#cumplimiento" className="hover:text-[#8B9E7C] transition-colors" data-hover>Cumplimiento</a>
          <a href="#planes" className="hover:text-[#8B9E7C] transition-colors" data-hover>Planes</a>
          <a
            href="#contacto"
            className="px-4 py-2 rounded-full bg-[#8B9E7C]/20 border border-[#8B9E7C]/40 hover:bg-[#8B9E7C]/30 transition-all"
            data-hover
          >
            Contacto
          </a>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url(/manus-storage/saludable-hero_452d30b2.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2418]/60 via-[#1a2418]/40 to-[#1a2418]" />



        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center lg:text-left lg:ml-[10%]">
          <h1
            className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block">Tu bienestar</span>
            <span className="block text-[#8B9E7C]">comienza</span>
            <span className="block">aquí</span>
          </h1>
          <p className="hero-subtitle text-lg md:text-xl text-[#FDF8F0]/70 max-w-xl leading-relaxed">
            Red integral de bienestar conectando comunidades, farmacias y servicios de salud en todo Puerto Rico.
          </p>
          <div className="hero-subtitle mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#pilares"
              className="px-8 py-4 rounded-full bg-[#8B9E7C] text-[#1a2418] font-semibold hover:bg-[#9BAF8C] transition-all duration-300 hover:scale-105"
              data-hover
            >
              Explorar Pilares
            </a>
            <a
              href="#farmacias"
              className="px-8 py-4 rounded-full border border-[#8B9E7C]/40 text-[#8B9E7C] hover:bg-[#8B9E7C]/10 transition-all duration-300"
              data-hover
            >
              Encuentra tu Farmacia
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-[#8B9E7C]/60 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#8B9E7C]/60 to-transparent" />
        </div>
      </section>

      {/* ═══ 4 PILLARS SECTION ═══ */}
      <section ref={pillarsRef} id="pilares" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Los 4 Pilares del <span className="text-[#8B9E7C]">Bienestar</span>
          </h2>
          <p className="text-center text-[#FDF8F0]/60 mb-16 max-w-2xl mx-auto">
            Un enfoque holístico que integra todas las dimensiones de la salud para resultados sostenibles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className={`pillar-card group relative p-8 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  activePillar === pillar.id
                    ? "border-[color:var(--pillar-color)] bg-[color:var(--pillar-color)]/5 scale-[1.02]"
                    : "border-[#8B9E7C]/15 bg-[#2D3B2D]/20 hover:border-[#8B9E7C]/40"
                }`}
                style={{ "--pillar-color": pillar.color } as React.CSSProperties}
                onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
                data-hover
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${pillar.color}10, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{pillar.icon}</span>
                    <h3 className="text-2xl font-bold" style={{ color: pillar.color }}>
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-[#FDF8F0]/70 leading-relaxed mb-4">{pillar.description}</p>

                  {/* Expanded stats */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      activePillar === pillar.id ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 border-t border-[#8B9E7C]/20 space-y-2">
                      {pillar.stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#FDF8F0]/80">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: pillar.color }} />
                          {stat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Toggle hint */}
                  <div className="mt-4 text-xs text-[#8B9E7C]/50 flex items-center gap-1">
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

      {/* ═══ STATS DASHBOARD ═══ */}
      <section ref={statsRef} className="py-24 px-6 bg-[#2D3B2D]/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: ["#8B9E7C", "#C4725F", "#C4B5D4", "#D4A574"][i] }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[#FDF8F0]/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHARMACY MAP ═══ */}
      <section ref={mapRef} id="farmacias" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Red de <span className="text-[#8B9E7C]">Farmacias</span>
          </h2>
          <p className="text-center text-[#FDF8F0]/60 mb-12 max-w-2xl mx-auto">
            Más de 215 farmacias aliadas en 56 municipios de Puerto Rico, listas para servirte.
          </p>

          <div className="map-container">
            <Suspense
              fallback={
                <div className="h-[500px] rounded-2xl bg-[#2D3B2D]/30 border border-[#8B9E7C]/20 flex items-center justify-center">
                  <div className="animate-pulse text-[#8B9E7C]/60">Cargando mapa...</div>
                </div>
              }
            >
              <PharmacyMap />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ═══ COMPLIANCE STEPS ═══ */}
      <section ref={complianceRef} id="cumplimiento" className="py-32 px-6 bg-[#2D3B2D]/20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planificación y <span className="text-[#C4725F]">Cumplimiento</span>
          </h2>
          <p className="text-center text-[#FDF8F0]/60 mb-16 max-w-2xl mx-auto">
            Un proceso estructurado para garantizar resultados medibles y cumplimiento regulatorio.
          </p>

          <div className="space-y-4">
            {COMPLIANCE_STEPS.map((item) => (
              <div
                key={item.step}
                className={`compliance-step group flex items-start gap-6 p-6 rounded-xl border transition-all duration-500 cursor-pointer ${
                  activeStep === item.step
                    ? "border-[#C4725F]/50 bg-[#C4725F]/5"
                    : "border-[#8B9E7C]/10 bg-[#2D3B2D]/20 hover:border-[#8B9E7C]/30"
                }`}
                onClick={() => setActiveStep(item.step)}
                data-hover
              >
                {/* Step number */}
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    activeStep === item.step
                      ? "bg-[#C4725F] text-[#FDF8F0]"
                      : "bg-[#2D3B2D] text-[#8B9E7C] border border-[#8B9E7C]/30"
                  }`}
                >
                  {item.step}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p
                    className={`text-[#FDF8F0]/60 leading-relaxed transition-all duration-500 ${
                      activeStep === item.step ? "max-h-20 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>

                {/* Progress line */}
                <div
                  className={`hidden md:block w-1 h-full absolute right-8 top-0 transition-all duration-500 ${
                    activeStep >= item.step ? "bg-[#C4725F]/30" : "bg-transparent"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICE PLANS ═══ */}
      <section ref={plansRef} id="planes" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planes de <span className="text-[#D4A574]">Servicio</span>
          </h2>
          <p className="text-center text-[#FDF8F0]/60 mb-16 max-w-2xl mx-auto">
            Soluciones escalables adaptadas al tamaño y necesidades de tu organización.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`plan-card relative p-8 rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${
                  plan.highlighted
                    ? "border-[#8B9E7C] bg-[#8B9E7C]/10 shadow-lg shadow-[#8B9E7C]/10"
                    : "border-[#8B9E7C]/15 bg-[#2D3B2D]/20"
                }`}
                data-hover
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#8B9E7C] text-[#1a2418] text-xs font-semibold">
                    Recomendado
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-[#8B9E7C] mb-6">{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#FDF8F0]/70">
                      <svg className="w-4 h-4 text-[#8B9E7C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      ? "bg-[#8B9E7C] text-[#1a2418] hover:bg-[#9BAF8C]"
                      : "border border-[#8B9E7C]/40 text-[#8B9E7C] hover:bg-[#8B9E7C]/10"
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
      <section ref={contactRef} id="contacto" className="py-32 px-6 bg-[#2D3B2D]/20">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hablemos de <span className="text-[#8B9E7C]">Bienestar</span>
          </h2>
          <p className="text-center text-[#FDF8F0]/60 mb-12">
            Escríbenos a{" "}
            <a href="mailto:hola@empresasaludable.org" className="text-[#8B9E7C] hover:underline" data-hover>
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
                className="w-full px-5 py-4 rounded-xl bg-[#2D3B2D]/50 border border-[#8B9E7C]/20 text-[#FDF8F0] placeholder-[#8B9E7C]/40 focus:outline-none focus:border-[#8B9E7C] transition-colors"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-[#2D3B2D]/50 border border-[#8B9E7C]/20 text-[#FDF8F0] placeholder-[#8B9E7C]/40 focus:outline-none focus:border-[#8B9E7C] transition-colors"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Empresa / Organización"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-[#2D3B2D]/50 border border-[#8B9E7C]/20 text-[#FDF8F0] placeholder-[#8B9E7C]/40 focus:outline-none focus:border-[#8B9E7C] transition-colors"
            />
            <textarea
              placeholder="¿Cómo podemos ayudarte?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-5 py-4 rounded-xl bg-[#2D3B2D]/50 border border-[#8B9E7C]/20 text-[#FDF8F0] placeholder-[#8B9E7C]/40 focus:outline-none focus:border-[#8B9E7C] transition-colors resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#8B9E7C] text-[#1a2418] font-semibold text-lg hover:bg-[#9BAF8C] transition-all duration-300 hover:scale-[1.02]"
              data-hover
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-6 border-t border-[#8B9E7C]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/manus-storage/saludable-logo_630e22f3.png" alt="" className="w-8 h-8" />
            <span className="text-sm text-[#FDF8F0]/60">Empresa Saludable — Puerto Rico</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#FDF8F0]/40">
            <a href="mailto:hola@empresasaludable.org" className="hover:text-[#8B9E7C] transition-colors">
              hola@empresasaludable.org
            </a>
            <a href="/" className="hover:text-[#8B9E7C] transition-colors">
              WOW Showcase
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
