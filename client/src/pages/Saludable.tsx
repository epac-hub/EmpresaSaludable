/**
 * Empresa Saludable — WOW Health & Wellness Website
 * Design: Light Botanical Sanctuary — soft sage, mint, cream, calming greens
 * Tech: GSAP ScrollTrigger, Lenis smooth scroll, floating particles
 * Section order: Hero → Ambassadors → Pillars → Stats → Testimonials → Compliance → Plans → Pharmacy Map → Contact (LAST)
 * FIXED: All content always visible, no hidden states, proper layouts
 */
import { useEffect, useRef, useState, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import MusicPlayer from "@/components/saludable/MusicPlayer";

gsap.registerPlugin(ScrollTrigger);

const PharmacyMap = lazy(() => import("@/components/saludable/PharmacyMap"));

// ─── Data ───────────────────────────────────────────────────────────────────

const AMBASSADORS = [
  {
    name: "Lcda. Mariana Colón, RDN",
    role: "Nutrición Clínica",
    image: "/manus-storage/amb-nutricion_5ee6a936.png",
    quote: "Una alimentación consciente es la base de toda transformación corporativa.",
    specialty: "Nutricionista clínica certificada con 12 años de experiencia diseñando planes alimentarios para empresas. Especialista en nutrición tropical y prevención de enfermedades metabólicas.",
    expertise: ["Planes nutricionales corporativos", "Talleres de cocina saludable", "Evaluaciones metabólicas"],
  },
  {
    name: "Dr. Rafael Méndez, MD, MPH",
    role: "Medicina Preventiva",
    image: "/manus-storage/amb-medico_a51cfbb9.png",
    quote: "Prevenir es la inversión más inteligente que una empresa puede hacer en su capital humano.",
    specialty: "Médico internista con maestría en Salud Pública. 15 años en medicina preventiva y salud ocupacional. Consultor para programas de bienestar en empresas Fortune 500 en PR.",
    expertise: ["Evaluaciones preventivas", "Protocolos de salud ocupacional", "Gestión de riesgos clínicos"],
  },
  {
    name: "Valeria Santiago, CPT, CES",
    role: "Fitness Corporativo",
    image: "/manus-storage/amb-fitness_76026c92.png",
    quote: "El movimiento diario transforma equipos completos — física, mental y emocionalmente.",
    specialty: "Entrenadora personal certificada por NASM con especialización en ejercicio correctivo. Diseña programas de actividad física adaptados al entorno de oficina y manufactura.",
    expertise: ["Clases grupales corporativas", "Ergonomía activa", "Programas de reducción de estrés"],
  },
  {
    name: "Lcdo. Carlos Rivera, MBA, CWPC",
    role: "Bienestar Corporativo",
    image: "/manus-storage/amb-bienestar_9cde3ade.png",
    quote: "Una empresa saludable es una empresa rentable — los datos lo demuestran consistentemente.",
    specialty: "Consultor certificado en bienestar corporativo con MBA en Gestión Estratégica. Implementa programas de cultura organizacional saludable y cumplimiento regulatorio en toda la isla.",
    expertise: ["Cultura organizacional", "Cumplimiento Depto. de Salud", "ROI de bienestar"],
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
    stats: ["Depto. de Salud de PR", "Depto. del Trabajo de PR", "Clima laboral óptimo"],
  },
];

const STATS = [
  { value: 112, suffix: "+", label: "Farmacias Aliadas" },
  { value: 70, suffix: "", label: "Municipios Cubiertos" },
  { value: 98, suffix: "%", label: "Satisfacción" },
  { value: 12, suffix: "K+", label: "Beneficiarios" },
];

const COMPLIANCE_STEPS = [
  {
    step: 1,
    title: "Evaluación Inicial",
    desc: "Diagnóstico completo del estado de salud organizacional, identificación de riesgos, análisis de clima laboral y evaluación de necesidades específicas de cada departamento.",
    icon: "🔍",
    deliverable: "Informe de diagnóstico + plan de acción",
  },
  {
    step: 2,
    title: "Plan Estratégico",
    desc: "Diseño personalizado de intervenciones basadas en evidencia científica, establecimiento de KPIs medibles y cronograma de implementación con hitos claros.",
    icon: "📋",
    deliverable: "Documento estratégico + cronograma",
  },
  {
    step: 3,
    title: "Implementación",
    desc: "Ejecución coordinada con farmacias aliadas, proveedores certificados y equipo interno. Capacitación del personal y lanzamiento de programas piloto.",
    icon: "⚙️",
    deliverable: "Programas activos + capacitaciones",
  },
  {
    step: 4,
    title: "Monitoreo Continuo",
    desc: "Seguimiento en tiempo real de métricas de bienestar, ajustes basados en datos, reportes de cumplimiento regulatorio OSHA/HIPAA y alertas proactivas.",
    icon: "📊",
    deliverable: "Dashboard en vivo + reportes mensuales",
  },
  {
    step: 5,
    title: "Certificación",
    desc: "Validación independiente de resultados, auditoría de cumplimiento, obtención de certificaciones de bienestar corporativo y reconocimiento público.",
    icon: "🏆",
    deliverable: "Certificado Empresa Saludable",
  },
];

const PLANS = [
  {
    name: "Esencial",
    price: "$2,500",
    period: "/mes",
    description: "Ideal para empresas pequeñas (10-50 empleados) que inician su camino hacia el bienestar organizacional.",
    features: [
      "Evaluación básica de salud organizacional",
      "Acceso a red de 112+ farmacias aliadas",
      "Reportes trimestrales de cumplimiento",
      "Soporte por email en horario laboral",
      "1 taller mensual de bienestar",
      "Dashboard básico de métricas",
      "Guía de nutrición general",
      "Descuentos en farmacias aliadas",
    ],
    highlighted: false,
    cta: "Comenzar",
  },
  {
    name: "Profesional",
    price: "$5,800",
    period: "/mes",
    description: "Para organizaciones medianas (50-200 empleados) que buscan integrar los 4 pilares del bienestar de forma completa.",
    features: [
      "Todo lo incluido en Esencial",
      "4 Pilares integrados (Mental, Física, Financiera, Corporativa)",
      "Dashboard en tiempo real con KPIs",
      "4 talleres mensuales especializados",
      "Soporte prioritario 24/7",
      "Programa de nutrición personalizado",
      "Evaluaciones trimestrales individuales",
      "Certificación de Empresa Saludable",
      "Línea de apoyo emocional 24/7",
      "Consultoría regulatoria básica",
    ],
    highlighted: true,
    cta: "Más Popular",
  },
  {
    name: "Empresarial",
    price: "Personalizado",
    period: "",
    description: "Solución a medida para corporaciones (200+ empleados) con necesidades complejas y múltiples localidades.",
    features: [
      "Todo lo incluido en Profesional",
      "Programa 100% personalizado",
      "Certificación completa con auditoría",
      "Gerente de cuenta dedicado",
      "API de integración con HRIS",
      "Reportes ejecutivos mensuales",
      "Eventos exclusivos de bienestar",
      "Consultoría regulatoria integral",
      "Multi-localidad sin costo adicional",
      "Embajadores de bienestar in-house",
    ],
    highlighted: false,
    cta: "Contactar",
  },
];

const TESTIMONIALS = [
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
    role: "Farmacéutica, Red Aliada",
    municipality: "Carolina",
  },
  {
    quote: "El cumplimiento regulatorio ya no es una carga. El equipo nos guía paso a paso y nos mantiene al día con cada requisito.",
    name: "Roberto Colón Torres",
    role: "CEO, Grupo Salud Integral",
    municipality: "Ponce",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function Saludable() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const celebsRef = useRef<HTMLElement>(null);
  const pillarsRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const complianceRef = useRef<HTMLElement>(null);
  const plansRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });

  // ─── Lenis Smooth Scroll (FIXED: single RAF via gsap.ticker only) ────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
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

    window.addEventListener("mousemove", moveCursor);
    return () => { window.removeEventListener("mousemove", moveCursor); };
  }, []);

  // ─── GSAP Animations (FIXED: immediateRender:false on all from() calls) ──
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

      // Ambassador cards entrance
      if (celebsRef.current) {
        gsap.from(".celeb-card", {
          scrollTrigger: { trigger: celebsRef.current, start: "top 85%" },
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      // Pillars entrance
      if (pillarsRef.current) {
        gsap.from(".pillar-card", {
          scrollTrigger: { trigger: pillarsRef.current, start: "top 85%" },
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      // Stats counter
      if (statsRef.current) {
        gsap.from(".stat-item", {
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          immediateRender: false,
        });
      }

      // Compliance steps
      if (complianceRef.current) {
        gsap.from(".compliance-step", {
          scrollTrigger: { trigger: complianceRef.current, start: "top 85%" },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      // Plans
      if (plansRef.current) {
        gsap.from(".plan-card", {
          scrollTrigger: { trigger: plansRef.current, start: "top 85%" },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      // Contact
      if (contactRef.current) {
        gsap.from(".contact-form", {
          scrollTrigger: { trigger: contactRef.current, start: "top 85%" },
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      // Map
      if (mapRef.current) {
        gsap.from(".map-container", {
          scrollTrigger: { trigger: mapRef.current, start: "top 85%" },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          immediateRender: false,
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
          <a href="#pilares" className="hover:text-[#6BAF8D] transition-colors">Pilares</a>
          <a href="#farmacias" className="hover:text-[#6BAF8D] transition-colors">Farmacias</a>
          <a href="#cumplimiento" className="hover:text-[#6BAF8D] transition-colors">Cumplimiento</a>
          <a href="#planes" className="hover:text-[#6BAF8D] transition-colors">Planes</a>
          <a
            href="#contacto"
            className="px-4 py-2 rounded-full bg-[#6BAF8D] text-white hover:bg-[#5A9E7D] transition-all"
          >
            Contacto
          </a>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(1.1) saturate(0.9)' }}
        >
          <source src="/manus-storage/tropical-pr-beach_72dca1ca.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E0]/85 via-[#F4F9F2]/75 to-[#DFF0D8]/80" />

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
            >
              Explorar Pilares
            </a>
            <a
              href="#farmacias"
              className="px-8 py-4 rounded-full border-2 border-[#6BAF8D] text-[#6BAF8D] hover:bg-[#6BAF8D]/10 transition-all duration-300"
            >
              Encuentra tu Farmacia
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-[#6BAF8D]/60 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#6BAF8D]/60 to-transparent" />
        </div>
      </section>

      {/* ═══ INSPIRADOS POR LOS MEJORES — PROFESSIONAL AMBASSADORS ═══ */}
      <section ref={celebsRef} className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Inspirados por los <span className="text-[#6BAF8D]">Mejores</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-6 max-w-2xl mx-auto">
            Profesionales puertorriqueños de excelencia que lideran cada dimensión del bienestar en Empresa Saludable.
          </p>
          <p className="text-center text-[#2D3B2D]/50 mb-16 max-w-3xl mx-auto text-sm leading-relaxed">
            Cada embajador aporta experiencia clínica, académica y corporativa real. Desde la nutrición basada en evidencia hasta la medicina preventiva, el fitness funcional y la consultoría en cultura organizacional — nuestro equipo diseña programas que transforman empresas en toda la isla.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {AMBASSADORS.map((amb, i) => (
              <div
                key={i}
                className="celeb-card group relative flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white border border-[#A8C5A0]/20 shadow-md hover:shadow-2xl hover:shadow-[#6BAF8D]/10 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Photo */}
                <div className="w-full md:w-[220px] h-[280px] md:h-auto flex-shrink-0 overflow-hidden relative">
                  <img
                    src={amb.image}
                    alt={amb.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:bg-gradient-to-b md:from-transparent md:to-[#2D3B2D]/20" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#6BAF8D]/10 text-[#6BAF8D] border border-[#6BAF8D]/20">
                        {amb.role}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#2D3B2D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {amb.name}
                    </h3>
                    <p className="text-[#2D3B2D]/60 text-sm leading-relaxed mb-4">{amb.specialty}</p>

                    {/* Expertise tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {amb.expertise.map((exp, j) => (
                        <span key={j} className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#F4F9F2] text-[#2D3B2D]/70 border border-[#A8C5A0]/20">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="pt-4 border-t border-[#A8C5A0]/20">
                    <p className="text-[#2D3B2D]/70 text-sm italic leading-relaxed">
                      “{amb.quote}”
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4 PILLARS — ALWAYS VISIBLE GRID ═══ */}
      <section ref={pillarsRef} id="pilares" className="py-24 px-6 bg-gradient-to-b from-[#F4F9F2] to-[#EDF5EA]">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="pillar-card group relative p-8 rounded-3xl border-2 border-[#A8C5A0]/30 bg-white hover:border-[#6BAF8D] hover:shadow-2xl hover:shadow-[#6BAF8D]/10 transition-all duration-500 hover:-translate-y-1"
              >
                {/* Glow orb */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"
                  style={{ background: pillar.color }}
                />

                {/* Icon */}
                <div
                  className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-md group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${pillar.color}40, ${pillar.color}20)`,
                    border: `2px solid ${pillar.color}50`,
                  }}
                >
                  {pillar.icon}
                </div>

                {/* Content — ALWAYS VISIBLE */}
                <div className="relative z-10">
                  <h3
                    className="text-2xl font-bold text-[#2D3B2D] mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-[#2D3B2D]/70 leading-relaxed mb-5 text-sm">{pillar.description}</p>

                  {/* Stats — ALWAYS VISIBLE */}
                  <div className="pt-4 border-t border-[#A8C5A0]/30 space-y-3">
                    {pillar.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-[#2D3B2D]/80">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ background: pillar.color, boxShadow: `0 0 8px ${pillar.color}` }}
                        />
                        <span className="font-medium">{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS DASHBOARD ═══ */}
      <section ref={statsRef} className="py-20 px-6 bg-[#2D3B2D]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[#A8C5A0]">{stat.label}</p>
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

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6" style={{ scrollbarWidth: 'none' }}>
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[340px] md:w-[380px] snap-center p-8 rounded-2xl bg-white border border-[#A8C5A0]/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
              >
                <svg className="w-8 h-8 text-[#6BAF8D]/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                </svg>
                <p className="text-[#2D3B2D]/80 text-sm leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-[#A8C5A0]/20 pt-4">
                  <p className="font-semibold text-[#2D3B2D] text-sm">{testimonial.name}</p>
                  <p className="text-xs text-[#6BAF8D] mt-0.5">{testimonial.role}</p>
                  <p className="text-xs text-[#2D3B2D]/40 mt-0.5">{testimonial.municipality}, PR</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-xs text-[#2D3B2D]/40">← Desliza para ver más →</span>
          </div>
        </div>
      </section>

      {/* ═══ PLANIFICACIÓN Y CUMPLIMIENTO — HORIZONTAL TIMELINE ═══ */}
      <section ref={complianceRef} id="cumplimiento" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planificación y <span className="text-[#6BAF8D]">Cumplimiento</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Un proceso estructurado en 5 pasos para garantizar resultados medibles y cumplimiento regulatorio completo.
          </p>

          {/* Timeline - responsive: vertical on mobile, horizontal visual on desktop */}
          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#A8C5A0] via-[#6BAF8D] to-[#4A9070] rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
              {COMPLIANCE_STEPS.map((step, i) => (
                <div key={step.step} className="compliance-step relative flex flex-col items-center text-center group">
                  {/* Step circle */}
                  <div className="relative z-10 w-[72px] h-[72px] rounded-full bg-white border-[3px] border-[#6BAF8D] flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500 mb-5">
                    {step.icon}
                  </div>

                  {/* Step number badge */}
                  <div className="absolute top-0 right-[calc(50%-52px)] w-6 h-6 rounded-full bg-[#6BAF8D] text-white text-xs font-bold flex items-center justify-center shadow-md z-20">
                    {step.step}
                  </div>

                  {/* Content card */}
                  <div className="bg-[#F4F9F2] rounded-2xl p-5 border border-[#A8C5A0]/20 hover:border-[#6BAF8D]/50 hover:shadow-lg transition-all duration-500 w-full">
                    <h3 className="text-base font-bold text-[#2D3B2D] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {step.title}
                    </h3>
                    <p className="text-[#2D3B2D]/60 text-xs leading-relaxed mb-3">
                      {step.desc}
                    </p>
                    <div className="pt-2 border-t border-[#A8C5A0]/20">
                      <p className="text-[10px] font-semibold text-[#6BAF8D] uppercase tracking-wider">
                        Entregable
                      </p>
                      <p className="text-xs text-[#2D3B2D]/70 mt-1 font-medium">
                        {step.deliverable}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PLANES DE SERVICIO — FULL 3 PLANS ═══ */}
      <section ref={plansRef} id="planes" className="py-24 px-6 bg-gradient-to-b from-[#F4F9F2] to-[#EDF5EA]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planes de <span className="text-[#6BAF8D]">Servicio</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Soluciones escalables adaptadas al tamaño y necesidades de tu organización. Todos incluyen acceso a nuestra red de farmacias aliadas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={`plan-card relative p-8 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  plan.highlighted
                    ? "border-[#6BAF8D] bg-white shadow-xl shadow-[#6BAF8D]/15 scale-[1.02]"
                    : "border-[#A8C5A0]/30 bg-white hover:border-[#6BAF8D]/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9070] text-white text-xs font-bold shadow-lg shadow-[#6BAF8D]/30">
                    Más Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2 text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {plan.name}
                </h3>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-[#6BAF8D]">{plan.price}</span>
                  <span className="text-sm text-[#2D3B2D]/50">{plan.period}</span>
                </div>
                <p className="text-sm text-[#2D3B2D]/60 mb-6 leading-relaxed">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-[#2D3B2D]/70">
                      <svg className="w-5 h-5 text-[#6BAF8D] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contacto"
                  className={`block text-center py-4 rounded-full font-semibold transition-all duration-300 text-lg ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#6BAF8D] to-[#4A9070] text-white hover:shadow-lg hover:shadow-[#6BAF8D]/30 hover:scale-105"
                      : "border-2 border-[#6BAF8D] text-[#6BAF8D] hover:bg-[#6BAF8D]/10"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PHARMACY MAP ═══ */}
      <section ref={mapRef} id="farmacias" className="py-24 px-6 bg-white">
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

      {/* ═══ HABLEMOS DE BIENESTAR — CONTACT FORM (LAST) ═══ */}
      <section ref={contactRef} id="contacto" className="py-24 px-6 bg-[#F4F9F2]">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Hablemos de <span className="text-[#6BAF8D]">Bienestar</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-12">
            Escríbenos a{" "}
            <a href="mailto:hola@empresasaludable.org" className="text-[#6BAF8D] hover:underline">
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
                className="w-full px-5 py-4 rounded-xl bg-white border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 rounded-xl bg-white border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Empresa / Organización"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-5 py-4 rounded-xl bg-white border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all"
            />
            <textarea
              placeholder="¿Cómo podemos ayudarte?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-5 py-4 rounded-xl bg-white border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:ring-2 focus:ring-[#6BAF8D]/20 transition-all resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9070] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#6BAF8D]/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Enviar Mensaje
            </button>
          </form>
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
