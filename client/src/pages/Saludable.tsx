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
import FuturisticCursor from "@/components/saludable/FuturisticCursor";
import MagneticButton from "@/components/saludable/MagneticButton";
// GreenParticles removed from hero (video background now)
// Interactive3DParticles removed — replaced with lightweight CSS floating dots

gsap.registerPlugin(ScrollTrigger);

const PharmacyMap = lazy(() => import("@/components/saludable/PharmacyMap"));
const ComplianceParticles3D = lazy(() => import("@/components/saludable/ComplianceParticles3D"));

// ─── Data ───────────────────────────────────────────────────────────────────

const AMBASSADORS = [
  {
    name: "Lcda. Mariana Colón, RDN",
    role: "Nutrición Clínica",
    image: "/manus-storage/nutricionista-boricua_b6ef4a1e.jpg",
    quote: "Una alimentación consciente es la base de toda transformación corporativa.",
    specialty: "Nutricionista clínica certificada con 12 años de experiencia diseñando planes alimentarios para empresas. Especialista en nutrición tropical y prevención de enfermedades metabólicas.",
    expertise: ["Planes nutricionales corporativos", "Talleres de cocina saludable", "Evaluaciones metabólicas"],
  },
  {
    name: "Dr. Rafael Méndez, MD, MPH",
    role: "Medicina Preventiva",
    image: "/manus-storage/dr-rafael-mendez-boricua_62f6369a.jpg",
    quote: "Prevenir es la inversión más inteligente que una empresa puede hacer en su capital humano.",
    specialty: "Médico internista con maestría en Salud Pública. 15 años en medicina preventiva y salud ocupacional. Consultor para programas de bienestar en empresas Fortune 500 en PR.",
    expertise: ["Evaluaciones preventivas", "Protocolos de salud ocupacional", "Gestión de riesgos clínicos"],
  },
  {
    name: "Valeria Santiago, CPT, CES",
    role: "Fitness Corporativo",
    image: "/manus-storage/valeria-boricua_0889189c.jpg",
    quote: "El movimiento diario transforma equipos completos — física, mental y emocionalmente.",
    specialty: "Entrenadora personal certificada por NASM con especialización en ejercicio correctivo. Diseña programas de actividad física adaptados al entorno de oficina y manufactura.",
    expertise: ["Clases grupales corporativas", "Ergonomía activa", "Programas de reducción de estrés"],
  },
  {
    name: "Lcdo. Carlos Rivera, MBA, CWPC",
    role: "Bienestar Corporativo",
    image: "/manus-storage/carlos-rivera-boricua_fb656031.jpg",
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
    color: "#7C6DC8",
    description: "Programas integrales de bienestar emocional que incluyen manejo del estrés laboral, apoyo psicológico profesional, mindfulness corporativo y prevención del burnout. Cada programa se adapta a la cultura organizacional de tu empresa.",
    stats: ["85% reducción en ausentismo por estrés", "Talleres semanales con psicólogos certificados", "Línea de apoyo emocional 24/7", "Evaluaciones de clima laboral trimestrales"],
  },
  {
    id: "fisica",
    title: "Salud Física",
    icon: "💪",
    color: "#E07B4C",
    description: "Actividad física estructurada, ergonomía activa y prevención de enfermedades crónicas. Nuestros programas incluyen clases grupales, evaluaciones físicas periódicas y planes de ejercicio adaptados al entorno laboral.",
    stats: ["112+ Farmacias de Comunidad con servicios de salud", "Clases grupales 3x por semana", "Evaluaciones físicas semestrales", "Programas de ergonomía en oficina"],
  },
  {
    id: "nutricional",
    title: "Salud Nutricional",
    icon: "🥗",
    color: "#4CAF50",
    description: "Nutrición basada en evidencia científica con enfoque tropical puertorriqueño. Planes alimentarios personalizados, talleres de cocina saludable, evaluaciones metabólicas y asesoría para comedores corporativos.",
    stats: ["Planes nutricionales individualizados", "Talleres de cocina saludable mensual", "Evaluaciones metabólicas completas", "Menús corporativos balanceados"],
  },
  {
    id: "financiera",
    title: "Salud Financiera",
    icon: "📊",
    color: "#2196F3",
    description: "Educación financiera práctica, planificación de retiro, gestión de beneficios y herramientas para la estabilidad económica de cada empleado. Reducimos el estrés financiero que impacta la productividad.",
    stats: ["ROI 3:1 comprobado en productividad", "Asesoría financiera personalizada", "Planes de ahorro y retiro", "Talleres de presupuesto familiar"],
  },
  {
    id: "corporativa",
    title: "Salud Corporativa",
    icon: "🏢",
    color: "#FF9800",
    description: "Cultura organizacional saludable, cumplimiento regulatorio con el Depto. de Salud y Depto. del Trabajo de PR, y programas de bienestar empresarial que mejoran retención y productividad.",
    stats: ["Cumplimiento Depto. de Salud de PR", "Cumplimiento Depto. del Trabajo de PR", "Certificación Empresa Saludable", "Clima laboral óptimo medible"],
  },
];

const STATS = [
  { value: 112, suffix: "+", label: "Farmacias de Comunidad" },
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
    desc: "Ejecución coordinada con Farmacias de Comunidad, proveedores certificados y equipo interno. Capacitación del personal y lanzamiento de programas piloto.",
    icon: "⚙️",
    deliverable: "Programas activos + capacitaciones",
  },
  {
    step: 4,
    title: "Monitoreo Continuo",
    desc: "Seguimiento en tiempo real de métricas de bienestar, ajustes basados en datos, reportes de cumplimiento regulatorio del Depto. de Salud y Depto. del Trabajo de PR, y alertas proactivas.",
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
      "Acceso a red de 112+ Farmacias de Comunidad",
      "Reportes trimestrales de cumplimiento",
      "Soporte por email en horario laboral",
      "1 taller mensual de bienestar",
      "Dashboard básico de métricas",
      "Guía de nutrición general",
      "Descuentos en Farmacias de Comunidad",
    ],
    highlighted: false,
    cta: "Comenzar",
  },
  {
    name: "Profesional",
    price: "$5,800",
    period: "/mes",
    description: "Para organizaciones medianas (50-200 empleados) que buscan integrar los 5 pilares del bienestar de forma completa.",
    features: [
      "Todo lo incluido en Esencial",
      "5 Pilares integrados (Mental, Física, Nutricional, Financiera, Corporativa)",
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

  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Scroll-proximity lazy loading: mount heavy components only when near viewport
  const [showParticles3D, setShowParticles3D] = useState(false);
  const [showTestimonialVideo, setShowTestimonialVideo] = useState(false);
  const testimonialSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = { rootMargin: '400px 0px', threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).dataset.lazyId;
          if (id === 'particles3d') setShowParticles3D(true);
          if (id === 'testimonial-video') setShowTestimonialVideo(true);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (complianceRef.current) {
      complianceRef.current.dataset.lazyId = 'particles3d';
      observer.observe(complianceRef.current);
    }
    if (testimonialSectionRef.current) {
      testimonialSectionRef.current.dataset.lazyId = 'testimonial-video';
      observer.observe(testimonialSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const validateField = (field: string, value: string) => {
    if (field === "name" && !value.trim()) return "Nombre es requerido";
    if (field === "email") {
      if (!value.trim()) return "Email es requerido";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
    }
    if (field === "message" && !value.trim()) return "Mensaje es requerido";
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (formTouched[field]) {
      const error = validateField(field, value);
      setFormErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setFormTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setFormErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    errors.name = validateField("name", formData.name);
    errors.email = validateField("email", formData.email);
    errors.message = validateField("message", formData.message);
    setFormErrors(errors);
    setFormTouched({ name: true, email: true, message: true });
    if (Object.values(errors).some(e => e)) return;
    // Success!
    setFormSubmitted(true);
    setTimeout(() => {
      window.location.href = `mailto:hola@empresasaludable.org?subject=Consulta de ${formData.name} - ${formData.company}&body=${formData.message}`;
    }, 2000);
  };

  // ─── Lenis Smooth Scroll (FIXED: single RAF via gsap.ticker only) ────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const rafCallback = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);


  // ─── GSAP Animations (FIXED: immediateRender:false on all from() calls) ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic Typography — staggered word reveal with motion
      const kineticTl = gsap.timeline({ delay: 0 });
      kineticTl
        .from(".hero-title", {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(".kinetic-word", {
          y: 120,
          rotateX: -45,
          opacity: 0,
          scale: 0.8,
          stagger: 0.2,
          duration: 1.4,
          ease: "power4.out",
        }, "-=0.3")
        .to(".kinetic-word", {
          letterSpacing: "0.02em",
          duration: 2,
          ease: "power1.inOut",
          stagger: 0.15,
        }, "-=0.8")
        .from(".hero-cta", {
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "back.out(1.7)",
        }, "-=1.2");

      // ═══ CINEMATIC SECTION TRANSITIONS ═══
      // Each major section reveals with a unique cinematic entrance
      const sectionRefs = [
        { ref: celebsRef, direction: 'left' },
        { ref: pillarsRef, direction: 'bottom' },
        { ref: statsRef, direction: 'right' },
        { ref: complianceRef, direction: 'bottom' },
        { ref: plansRef, direction: 'scale' },
        { ref: mapRef, direction: 'left' },
        { ref: contactRef, direction: 'right' },
      ];

      sectionRefs.forEach(({ ref, direction }) => {
        if (!ref.current) return;
        const el = ref.current;

        // Section header cinematic reveal
        const header = el.querySelector('h2');
        if (header) {
          const fromVars: Record<string, unknown> = {
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
          };
          if (direction === 'left') { fromVars.x = -80; fromVars.clipPath = 'inset(0 100% 0 0)'; }
          else if (direction === 'right') { fromVars.x = 80; fromVars.clipPath = 'inset(0 0 0 100%)'; }
          else if (direction === 'scale') { fromVars.scale = 0.85; fromVars.y = 40; }
          else { fromVars.y = 60; }

          gsap.from(header, {
            scrollTrigger: { trigger: el, start: "top 80%" },
            ...fromVars,
            clearProps: 'clipPath',
          });
        }

        // Subtitle/paragraph reveal with slight delay
        const subtitle = el.querySelector('p');
        if (subtitle) {
          gsap.from(subtitle, {
            scrollTrigger: { trigger: el, start: "top 78%" },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.15,
            ease: "power2.out",
            immediateRender: false,
          });
        }
      });

      // Sections with data-reveal attribute get a full-section cinematic fade-up
      gsap.utils.toArray<HTMLElement>('[data-reveal="fade-up"]').forEach((section) => {
        gsap.from(section, {
          scrollTrigger: { trigger: section, start: "top 85%" },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
        });
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

      // Pillars WOW entrance — 3D flip + stagger + glow burst
      if (pillarsRef.current) {
        // Entrance animation for pillar nodes
        gsap.from(".pillar-node", {
          scrollTrigger: { trigger: pillarsRef.current, start: "top 75%" },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          immediateRender: false,
        });

        // Scroll-driven parallax — elements at DIFFERENT speeds for depth
        // Background orbs move slowly (far away)
        gsap.to(pillarsRef.current.querySelectorAll(".absolute.rounded-full"), {
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
          y: -60,
          ease: "none",
        });

        // Center hub moves at medium speed
        const centerHub = pillarsRef.current.querySelector(".absolute.inset-0.flex");
        if (centerHub) {
          gsap.to(centerHub, {
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            y: -30,
            ease: "none",
          });
        }

        // Pillar nodes move faster (foreground) with individual speeds
        gsap.utils.toArray<HTMLElement>(".pillar-node").forEach((node, i) => {
          gsap.to(node, {
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
            y: -20 - (i * 12),
            rotation: (i % 2 === 0) ? 3 : -3,
            ease: "none",
          });
        });

        // Rotating dashed circle spins faster on scroll
        const dashedCircle = pillarsRef.current.querySelector(".animate-\\[spin_60s_linear_infinite\\]");
        if (dashedCircle) {
          gsap.to(dashedCircle, {
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
            rotation: 180,
            ease: "none",
          });
        }

        // Section title parallax (moves slower = anchored feel)
        const sectionTitle = pillarsRef.current.querySelector("h2");
        if (sectionTitle) {
          gsap.to(sectionTitle, {
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
            y: -15,
            ease: "none",
          });
        }
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

      // Plans — dramatic staggered entrance with rotation
      if (plansRef.current) {
        gsap.from(".plan-card", {
          scrollTrigger: { trigger: plansRef.current, start: "top 80%" },
          y: 80,
          opacity: 0,
          rotateY: 15,
          scale: 0.9,
          duration: 0.9,
          stagger: 0.2,
          ease: "power4.out",
          immediateRender: false,
        });

        // Add 3D tilt effect to plan cards on mouse move
        const planCards = plansRef.current.querySelectorAll('.plan-card');
        planCards.forEach((card) => {
          const cardEl = card as HTMLElement;
          const inner = cardEl.querySelector('.plan-card-inner') as HTMLElement;
          if (!inner) return;

          cardEl.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = cardEl.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(inner, {
              rotateY: x * 12,
              rotateX: -y * 8,
              duration: 0.4,
              ease: 'power2.out',
            });
          });

          cardEl.addEventListener('mouseleave', () => {
            gsap.to(inner, {
              rotateY: 0,
              rotateX: 0,
              duration: 0.6,
              ease: 'elastic.out(1, 0.5)',
            });
          });
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
      {/* Futuristic Custom Cursor */}
      <FuturisticCursor />

      {/* Music Player */}
      <MusicPlayer />

      {/* ═══ NAVIGATION ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-[#F4F9F2]/80 border-b border-[#A8C5A0]/20 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/manus-storage/saludable-logo_630e22f3.png"
            alt="Empresa Saludable"
            className="w-12 h-12 object-contain drop-shadow-md"
          />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Empresa <span className="text-[#6BAF8D]">Saludable</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#6BAF8D]/70 font-medium -mt-0.5">Bienestar Corporativo PR</span>
          </div>
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
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Hero video — people moving, with poster for instant first frame */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/manus-storage/hero-boricua-poster_e1973084.jpg"
            className="hero-video absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(1.05) saturate(1.2)' }}
          >
            <source src="/manus-storage/hero-boricua-people-moving_848eae57.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Dark overlay for text readability — people still visible through it */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/50" />

        {/* Kinetic Typography — Empresa Saludable */}
        <div className="relative z-10 text-center px-6">
          <span className="hero-title block text-3xl md:text-5xl lg:text-6xl tracking-[0.3em] uppercase text-white font-bold mb-8" style={{ fontFamily: "'Space Grotesk', sans-serif", textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
            Bienvenido a
          </span>
          <h1 className="hero-title overflow-hidden">
            <span
              className="kinetic-word block text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.85] tracking-tight text-white drop-shadow-[0_6px_40px_rgba(0,0,0,0.6)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Empresa
            </span>
            <span
              className="kinetic-word block text-7xl md:text-9xl lg:text-[11rem] font-black leading-[0.85] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#81C784] via-[#66BB6A] to-[#43A047] drop-shadow-[0_6px_40px_rgba(76,175,80,0.6)]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Saludable
            </span>
          </h1>

          {/* Animated CTA button — scrolls to services */}
          <a
            href="#planes"
            className="hero-cta inline-flex items-center gap-3 mt-12 px-8 py-4 bg-gradient-to-r from-[#43A047] to-[#66BB6A] text-white font-bold text-lg rounded-full shadow-[0_8px_32px_rgba(67,160,71,0.4)] hover:shadow-[0_12px_48px_rgba(67,160,71,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10">Únete Ahora</span>
            <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-white/60 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </section>

      {/* ═══ INSPIRADOS POR LOS MEJORES — PROFESSIONAL AMBASSADORS ═══ */}
      <section ref={celebsRef} className="py-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(135deg, #FDFCFB 0%, #F0F7F4 40%, #EBF5FB 100%)' }}>
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
                className="celeb-card group relative flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white border border-[#A8C5A0]/20 shadow-md hover:shadow-2xl hover:shadow-[#6BAF8D]/10 transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.5deg]"
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {/* Photo */}
                <div className="w-full md:w-[220px] h-[280px] md:h-auto flex-shrink-0 overflow-hidden relative">
                  <img
                    src={amb.image}
                    alt={amb.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-105"
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

      {/* ═══ LOS 5 PILARES DEL BIENESTAR — SUMMER GREEN PARALLAX ═══ */}

      {/* ═══ LOS 5 PILARES DEL BIENESTAR — CIRCULAR HOLISTIC ═══ */}
      <section ref={pillarsRef} id="pilares" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #E8F5E9 100%)' }}>
        {/* Soft background orbs */}
        <div className="absolute top-20 left-10 w-[400px] h-[400px] rounded-full bg-[#66BB6A]/15 blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-[350px] h-[350px] rounded-full bg-[#81C784]/20 blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-7xl mx-auto relative z-10 py-32 px-6">
          <div className="text-center mb-8">
            <span className="inline-block px-5 py-2 rounded-full bg-white/60 text-[#2E7D32] text-xs font-bold uppercase tracking-[0.25em] mb-6 border border-[#66BB6A]/40 backdrop-blur-sm shadow-sm">
              Enfoque Holístico Circular
            </span>
          </div>
          <h2
            className="text-5xl md:text-7xl font-bold text-center mb-6 text-[#1B5E20]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Los 5 Pilares del <span className="text-[#43A047] drop-shadow-[0_0_20px_rgba(67,160,71,0.4)]">Bienestar</span>
          </h2>
          <p className="text-center text-[#2E7D32]/70 mb-20 max-w-3xl mx-auto text-lg leading-relaxed">
            Cada pilar apoya al siguiente en un ciclo continuo de bienestar integral — un sistema donde la salud mental fortalece la física, la física potencia la nutrición, y así sucesivamente.
          </p>

          {/* CIRCULAR HOLISTIC LAYOUT */}
          <div className="relative w-full max-w-3xl mx-auto aspect-square flex items-center justify-center">
            {/* Rotating dashed circle */}
            <div className="absolute inset-[12%] rounded-full border-2 border-dashed border-[#66BB6A]/30 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-[18%] rounded-full border border-[#81C784]/15" />
            
            {/* Center hub */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="text-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl flex items-center justify-center border-2 border-[#66BB6A]/30 mx-auto">
                  <span className="text-4xl md:text-5xl">🌿</span>
                </div>
                <p className="mt-4 text-sm font-bold text-[#2E7D32] tracking-wider uppercase">Bienestar<br/>Integral</p>
              </div>
            </div>

            {/* SVG connecting arcs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100">
              {PILLARS.map((_, index) => {
                const angle1 = (index * 72 - 90) * (Math.PI / 180);
                const angle2 = (((index + 1) % 5) * 72 - 90) * (Math.PI / 180);
                const r = 36;
                const x1 = 50 + r * Math.cos(angle1);
                const y1 = 50 + r * Math.sin(angle1);
                const x2 = 50 + r * Math.cos(angle2);
                const y2 = 50 + r * Math.sin(angle2);
                const midAngle = ((index * 72 + 36) - 90) * (Math.PI / 180);
                const cx = 50 + (r + 4) * Math.cos(midAngle);
                const cy = 50 + (r + 4) * Math.sin(midAngle);
                return (
                  <path
                    key={index}
                    d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                    fill="none"
                    stroke="rgba(102,187,106,0.3)"
                    strokeWidth="0.4"
                    strokeDasharray="1.5 1"
                  />
                );
              })}
            </svg>

            {/* Pillar nodes positioned in a circle */}
            {PILLARS.map((pillar, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180);
              const radius = 36;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              
              return (
                <div
                  key={pillar.id}
                  className="pillar-node absolute group z-10"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* The node circle */}
                  <div
                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 group-hover:scale-[1.6] group-hover:z-50 shadow-xl group-hover:shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.color}, ${pillar.color}CC)`,
                      boxShadow: `0 8px 30px ${pillar.color}40`,
                    }}
                    data-cursor-hover
                  >
                    <span className="text-2xl md:text-3xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{pillar.icon}</span>
                  </div>

                  {/* Expanded info panel — appears on hover, expands outward LARGE */}
                  <div
                    className="absolute opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 ease-out z-[100]"
                    style={{
                      width: '340px',
                      left: x > 55 ? '110%' : x < 45 ? 'auto' : '50%',
                      right: x < 45 ? '110%' : 'auto',
                      top: y > 55 ? '-20%' : y < 45 ? 'auto' : '50%',
                      bottom: y < 45 ? '-20%' : 'auto',
                      transform: `translate(${x > 55 ? '0' : x < 45 ? '0' : '-50%'}, ${y > 55 ? '0' : y < 45 ? '0' : '-50%'})`,
                    }}
                  >
                    <div
                      className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border scale-90 group-hover:scale-100 transition-transform duration-500 ease-out"
                      style={{ borderColor: `${pillar.color}40` }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                          style={{ background: `${pillar.color}20` }}
                        >
                          {pillar.icon}
                        </div>
                        <h3 className="text-lg font-bold text-[#1B5E20]" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[#2D3B2D]/70 leading-relaxed mb-4">{pillar.description}</p>
                      <div className="space-y-2 pt-3 border-t border-[#66BB6A]/20">
                        {pillar.stats.map((stat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-[#2D3B2D]/70">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pillar.color }} />
                            <span>{stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Title label below node */}
                  <p className="text-center mt-2 text-[10px] md:text-xs font-bold text-[#1B5E20] whitespace-nowrap group-hover:opacity-0 transition-opacity duration-300">
                    {pillar.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Holistic instruction */}
          <p className="text-center text-[#2E7D32]/60 mt-12 text-sm italic max-w-2xl mx-auto">
            Pasa el cursor sobre cada pilar para explorar cómo se integran en un ciclo continuo de bienestar.
          </p>
        </div>
      </section>

      {/* ═══ STATS DASHBOARD ═══ */}
      <section ref={statsRef} className="py-20 px-6 bg-gradient-to-r from-[#43A047] via-[#66BB6A] to-[#43A047]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="stat-item text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — VIDEO BACKGROUND ═══ */}
      <section ref={testimonialSectionRef} className="relative py-32 px-6 overflow-hidden">
        {/* Full-section background video — scroll-proximity lazy loaded */}
        {showTestimonialVideo ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster="/manus-storage/testimonial-bg-keyframe_dae63de5.png"
          >
            <source src="/manus-storage/testimonial-bg-video_0077eed0.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="/manus-storage/testimonial-bg-keyframe_dae63de5.png"
            alt=""
          />
        )}
        {/* Light summer green overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F5E0]/75 via-[#C8E6C9]/70 to-[#A5D6A7]/80" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#1B5E20]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lo Que Dicen Nuestros <span className="text-[#43A047] drop-shadow-[0_0_15px_rgba(67,160,71,0.3)]">Beneficiarios</span>
          </h2>
          <p className="text-center text-[#2E7D32]/70 mb-16 max-w-xl mx-auto">
            Historias reales de transformación y bienestar en toda la isla.
          </p>

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6" style={{ scrollbarWidth: 'none' }}>
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[340px] md:w-[380px] snap-center p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#66BB6A]/30 shadow-xl hover:shadow-[0_20px_60px_rgba(67,160,71,0.2)] hover:-translate-y-3 hover:scale-[1.02] transition-all duration-700 group"
              >
                <svg className="w-8 h-8 text-[#43A047]/50 mb-4 group-hover:text-[#2E7D32] group-hover:scale-110 transition-all duration-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                </svg>
                <p className="text-[#2D3B2D]/80 text-sm leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-[#66BB6A]/20 pt-4">
                  <p className="font-semibold text-[#1B5E20] text-sm">{testimonial.name}</p>
                  <p className="text-xs text-[#43A047] mt-0.5">{testimonial.role}</p>
                  <p className="text-xs text-[#2D3B2D]/50 mt-0.5">{testimonial.municipality}, PR</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <span className="text-xs text-[#2E7D32]/50">← Desliza para ver más →</span>
          </div>
        </div>
      </section>

      {/* ═══ PLANIFICACIÓN Y CUMPLIMIENTO — WOW INTERACTIVE TIMELINE ═══ */}
      <section ref={complianceRef} id="cumplimiento" className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E8F5E0 0%, #C8E6C9 40%, #B9DEB5 70%, #E8F5E0 100%)' }}>
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-[20%] w-[300px] h-[300px] rounded-full bg-[#66BB6A]/15 blur-[100px] animate-pulse" />
          <div className="absolute bottom-10 right-[20%] w-[400px] h-[400px] rounded-full bg-[#81C784]/15 blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(46,125,50,1) 1px, transparent 1px), linear-gradient(90deg, rgba(46,125,50,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* NOISE GRAIN animated overlay — cinematic texture */}
        <div className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, animation: 'grain 0.5s steps(8) infinite' }} />

        {/* Three.js 3D Particles + Wireframe Mesh Background (scroll-proximity lazy loaded) */}
        {showParticles3D && (
          <Suspense fallback={null}>
            <ComplianceParticles3D />
          </Suspense>
        )}

        {/* Subtle floating dots — lightweight CSS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#66BB6A]/25 animate-[float_8s_ease-in-out_infinite]"
              style={{
                left: `${5 + i * 9}%`,
                top: `${10 + (i % 5) * 18}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${7 + (i % 3) * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <span className="inline-block px-5 py-2 rounded-full bg-white/60 text-[#2E7D32] text-xs font-bold uppercase tracking-[0.25em] mb-6 border border-[#66BB6A]/40 backdrop-blur-sm shadow-sm">
              Proceso Certificado
            </span>
          </div>
          <h2
            className="text-5xl md:text-7xl font-bold text-center mb-6 text-[#1B5E20]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planificación y <span className="text-[#43A047] drop-shadow-[0_0_20px_rgba(67,160,71,0.4)]">Cumplimiento</span>
          </h2>
          <p className="text-center text-[#2E7D32]/70 mb-20 max-w-3xl mx-auto text-lg leading-relaxed">
            Un proceso estructurado en 5 pasos para garantizar resultados medibles y cumplimiento regulatorio completo con el Depto. de Salud y Depto. del Trabajo de PR.
          </p>

          {/* Animated connecting line */}
          <div className="hidden md:block absolute top-[calc(50%+80px)] left-[8%] right-[8%] h-[2px] z-0">
            <div className="w-full h-full bg-gradient-to-r from-[#43A047]/20 via-[#43A047]/60 to-[#43A047]/20 rounded-full" />
            <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-[#43A047] to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-5 relative z-10">
            {COMPLIANCE_STEPS.map((step, i) => (
              <div key={step.step} className="compliance-step relative flex flex-col items-center text-center group" style={{ perspective: '800px' }}>
                {/* Step circle with magnetic hover */}
                <MagneticButton strength={0.4} className="mb-6">
                  <div
                    className="relative z-10 w-[80px] h-[80px] rounded-full flex items-center justify-center text-3xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-700"
                    data-cursor-hover
                    style={{
                      background: 'linear-gradient(135deg, #66BB6A, #43A047)',
                      border: '3px solid rgba(67,160,71,0.5)',
                      boxShadow: '0 8px 25px rgba(67,160,71,0.3), inset 0 0 15px rgba(255,255,255,0.1)',
                    }}
                  >
                    <span className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">{step.icon}</span>
                    {/* Orbiting ring */}
                    <div className="absolute inset-[-6px] rounded-full border border-[#43A047]/30 animate-spin" style={{ animationDuration: `${8 + i * 2}s` }} />
                  </div>
                </MagneticButton>

                {/* Step number */}
                <div className="absolute top-0 right-[calc(50%-56px)] w-7 h-7 rounded-full bg-gradient-to-br from-[#43A047] to-[#2E7D32] text-white text-xs font-bold flex items-center justify-center shadow-lg shadow-[#43A047]/40 z-20">
                  {step.step}
                </div>

                {/* Content card */}
                <div
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-[#66BB6A]/25 w-full transition-all duration-700 group-hover:-translate-y-3 group-hover:border-[#43A047]/60 group-hover:shadow-[0_20px_50px_rgba(67,160,71,0.15)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <h3 className="text-lg font-bold text-[#1B5E20] mb-3 group-hover:text-[#2E7D32] transition-colors duration-500" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-[#2D3B2D]/60 text-xs leading-relaxed mb-4 group-hover:text-[#2D3B2D]/80 transition-colors duration-500">
                    {step.desc}
                  </p>
                  <div className="pt-3 border-t border-[#66BB6A]/20">
                    <p className="text-[10px] font-bold text-[#43A047] uppercase tracking-wider mb-1">
                      Entregable
                    </p>
                    <p className="text-xs text-[#2D3B2D]/60 font-medium group-hover:text-[#2D3B2D]/80 transition-colors duration-500">
                      {step.deliverable}
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
            Soluciones escalables adaptadas al tamaño y necesidades de tu organización. Todos incluyen acceso a nuestra red de Farmacias de Comunidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className="plan-card group relative perspective-[1200px]"
              >
                {/* Main card with 3D tilt inner wrapper */}
                <div
                  className="plan-card-inner"
                  style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                >
                <div
                  className={`relative p-8 rounded-3xl border-2 transition-all duration-500 group-hover:-translate-y-4 group-hover:shadow-2xl group-hover:scale-[1.03] ${
                    plan.highlighted
                      ? "border-[#6BAF8D] bg-white shadow-xl shadow-[#6BAF8D]/15 scale-[1.02] ring-2 ring-[#6BAF8D]/20 group-hover:ring-4 group-hover:ring-[#6BAF8D]/30"
                      : "border-[#A8C5A0]/30 bg-white group-hover:border-[#6BAF8D]/50 group-hover:ring-2 group-hover:ring-[#6BAF8D]/15"
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
                    Solicitar Cotización
                  </a>
                </div>
                </div>{/* close plan-card-inner */}

                {/* Popup overlay — expands outward on hover */}
                <div className="absolute inset-0 z-20 pointer-events-none group-hover:pointer-events-auto">
                  <div className="absolute -inset-4 rounded-[2rem] bg-white/95 backdrop-blur-xl border-2 border-[#6BAF8D]/40 shadow-2xl shadow-[#6BAF8D]/20 p-8 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6BAF8D] to-[#4A9070] flex items-center justify-center text-white font-bold text-lg">
                        {plan.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[#2D3B2D]">{plan.name}</h4>
                        <p className="text-xs text-[#6BAF8D] font-medium uppercase tracking-wider">Plan Detallado</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#2D3B2D]/70 mb-4 leading-relaxed">{plan.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {plan.features.slice(0, 6).map((f, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs text-[#2D3B2D]/80 bg-[#E8F5E9] rounded-lg px-3 py-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6BAF8D] flex-shrink-0" />
                          <span className="truncate">{f}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href="#contacto"
                      className="mt-5 block text-center py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-[#6BAF8D] to-[#4A9070] text-white hover:shadow-lg transition-all duration-300"
                    >
                      Solicitar Cotización →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LOGOS INSTITUCIONALES — CARRUSEL INTERACTIVO ═══ */}
      <section className="py-16 px-6 bg-white border-y border-[#A8C5A0]/10" data-reveal="fade-up">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-[#2D3B2D]/50 mb-8 uppercase tracking-wider font-medium">
            Alineados con las regulaciones de
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            <div className="group flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110">
              <img
                src="/manus-storage/logo-depto-salud_962431fe.png"
                alt="Departamento de Salud de Puerto Rico"
                className="h-20 md:h-24 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="text-xs text-[#2D3B2D]/50 font-medium">Depto. de Salud de PR</span>
            </div>
            <div className="group flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110">
              <img
                src="/manus-storage/logo-depto-trabajo_d62964d2.png"
                alt="Departamento del Trabajo y Recursos Humanos"
                className="h-20 md:h-24 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="text-xs text-[#2D3B2D]/50 font-medium">Depto. del Trabajo y RRHH</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ — PREGUNTAS FRECUENTES (GSAP Accordion) ═══ */}
      <section className="py-24 px-6 bg-[#F4F9F2]" data-reveal="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Preguntas <span className="text-[#6BAF8D]">Frecuentes</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-12 max-w-xl mx-auto">
            Resolvemos las dudas más comunes sobre nuestros programas de bienestar corporativo.
          </p>

          <div className="space-y-3" data-faq-accordion>
            {[
              {
                q: "¿Cuánto tiempo toma implementar un programa de bienestar?",
                a: "La implementación básica toma entre 4-6 semanas. Comenzamos con la evaluación inicial, diseñamos el plan estratégico personalizado, y lanzamos los primeros programas piloto. El programa completo con certificación se logra en 6-12 meses dependiendo del tamaño de la organización."
              },
              {
                q: "¿Qué incluye la red de Farmacias de Comunidad?",
                a: "Acceso a más de 112 farmacias en 70 municipios de Puerto Rico con servicios de salud preventiva, consultas nutricionales, monitoreo de presión arterial, vacunaciones, y descuentos en medicamentos y suplementos para todos los beneficiarios del programa."
              },
              {
                q: "¿Cómo se mide el ROI del programa?",
                a: "Medimos el retorno de inversión a través de métricas verificables: reducción en ausentismo, disminución de reclamaciones de salud, mejora en productividad medida por KPIs departamentales, retención de talento, y encuestas de satisfacción. Nuestros clientes reportan un ROI promedio de 3:1."
              },
              {
                q: "¿El programa cumple con las regulaciones del Depto. de Salud y Depto. del Trabajo?",
                a: "Sí. Todos nuestros programas están diseñados para cumplir con las regulaciones del Departamento de Salud de Puerto Rico y el Departamento del Trabajo y Recursos Humanos. Incluimos auditorías de cumplimiento regulatorio como parte del servicio."
              },
              {
                q: "¿Puedo personalizar el programa para mi industria específica?",
                a: "Absolutamente. Cada programa se adapta a la industria, tamaño y cultura de tu organización. Tenemos experiencia en manufactura, servicios financieros, tecnología, salud, gobierno y retail. El Plan Empresarial incluye personalización completa."
              },
              {
                q: "¿Qué diferencia a Empresa Saludable de otros programas de bienestar?",
                a: "Nuestro enfoque integra los 5 pilares del bienestar (mental, físico, nutricional, financiero y corporativo) en un solo programa coordinado. Además, contamos con una red física de Farmacias de Comunidad en toda la isla, embajadores profesionales certificados, y un sistema de cumplimiento regulatorio integrado."
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="faq-item bg-white rounded-2xl border border-[#A8C5A0]/20 hover:border-[#6BAF8D]/40 transition-all duration-300 hover:shadow-lg overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-6 cursor-pointer text-left"
                  aria-expanded="false"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const item = btn.parentElement!;
                    const content = item.querySelector('.faq-content') as HTMLElement;
                    const icon = item.querySelector('.faq-icon') as HTMLElement;
                    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
                    
                    if (isOpen) {
                      btn.setAttribute('aria-expanded', 'false');
                      gsap.to(content, { maxHeight: 0, opacity: 0, duration: 0.4, ease: 'power2.inOut' });
                      gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'back.out(2)' });
                    } else {
                      // Close all others first
                      document.querySelectorAll('.faq-item .faq-content').forEach((el) => {
                        if (el !== content) {
                          gsap.to(el, { maxHeight: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut' });
                        }
                      });
                      document.querySelectorAll('.faq-item .faq-icon').forEach((el) => {
                        if (el !== icon) {
                          gsap.to(el, { rotation: 0, duration: 0.3, ease: 'back.out(2)' });
                        }
                      });
                      document.querySelectorAll('.faq-item button').forEach((el) => {
                        if (el !== btn) el.setAttribute('aria-expanded', 'false');
                      });
                      btn.setAttribute('aria-expanded', 'true');
                      // Use scrollHeight for dynamic content height
                      const targetHeight = content.scrollHeight || 500;
                      gsap.to(content, { maxHeight: targetHeight, opacity: 1, duration: 0.5, ease: 'power2.out' });
                      gsap.to(icon, { rotation: 135, duration: 0.4, ease: 'back.out(2)' });
                    }
                  }}
                >
                  <span className="font-semibold text-[#2D3B2D] text-sm md:text-base pr-4">{faq.q}</span>
                  <span className="faq-icon flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#6BAF8D]/20 to-[#81C784]/10 flex items-center justify-center text-[#6BAF8D] transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className="faq-content overflow-hidden" style={{ maxHeight: '0px', opacity: 0 }}>
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-sm text-[#2D3B2D]/70 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
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
            Más de 112 Farmacias de Comunidad en 70 municipios de Puerto Rico, listas para servirte.
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
      <section ref={contactRef} id="contacto" className="py-24 px-6 bg-[#F4F9F2] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#66BB6A]/10 blur-[150px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D] typewriter-title"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="typewriter-text">Hablemos de </span><span className="text-[#6BAF8D] typewriter-text">Bienestar</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-12">
            Escríbenos a{" "}
            <a href="mailto:hola@empresasaludable.org" className="text-[#6BAF8D] hover:underline">
              hola@empresasaludable.org
            </a>{" "}
            o completa el formulario.
          </p>

          {formSubmitted ? (
            <div className="contact-form text-center py-16 animate-[fadeIn_0.6s_ease-out] relative">
              {/* Confetti burst particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => {
                  const angle = (i * 18) * (Math.PI / 180);
                  const radius = 80 + Math.random() * 60;
                  const tx = Math.cos(angle) * radius;
                  const ty = Math.sin(angle) * radius - 40;
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: ['#66BB6A', '#43A047', '#81C784', '#A5D6A7', '#FFD54F', '#4FC3F7'][i % 6],
                        left: '50%',
                        top: '40%',
                        '--tx': `${tx}px`,
                        '--ty': `${ty}px`,
                        animation: `confetti-particle 1s cubic-bezier(0.23,1,0.32,1) ${i * 0.04}s forwards`,
                        opacity: 0,
                      } as React.CSSProperties}
                    />
                  );
                })}
              </div>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#66BB6A] to-[#43A047] flex items-center justify-center animate-[bounceIn_0.6s_ease-out] shadow-lg shadow-[#43A047]/30">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1B5E20] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Mensaje Enviado</h3>
              <p className="text-[#2D3B2D]/60">Gracias por contactarnos. Te responderemos pronto.</p>
            </div>
          ) : (
          <form
            className="contact-form space-y-6"
            onSubmit={handleFormSubmit}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={() => handleFieldBlur("name")}
                  className={`w-full px-5 py-4 rounded-xl bg-white border text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none transition-all duration-300 glow-field ${
                    formErrors.name && formTouched.name
                      ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)]"
                      : formTouched.name && !formErrors.name
                      ? "border-[#66BB6A] focus:border-[#66BB6A] focus:shadow-[0_0_20px_rgba(102,187,106,0.4)]"
                      : "border-[#A8C5A0]/30 focus:border-[#6BAF8D] focus:shadow-[0_0_20px_rgba(107,175,141,0.4)]"
                  }`}
                />
                {formErrors.name && formTouched.name && (
                  <p className="mt-1 text-xs text-red-500 animate-[fadeIn_0.2s_ease-out]">{formErrors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  className={`w-full px-5 py-4 rounded-xl bg-white border text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none transition-all duration-300 glow-field ${
                    formErrors.email && formTouched.email
                      ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)]"
                      : formTouched.email && !formErrors.email
                      ? "border-[#66BB6A] focus:border-[#66BB6A] focus:shadow-[0_0_20px_rgba(102,187,106,0.4)]"
                      : "border-[#A8C5A0]/30 focus:border-[#6BAF8D] focus:shadow-[0_0_20px_rgba(107,175,141,0.4)]"
                  }`}
                />
                {formErrors.email && formTouched.email && (
                  <p className="mt-1 text-xs text-red-500 animate-[fadeIn_0.2s_ease-out]">{formErrors.email}</p>
                )}
              </div>
            </div>
            <input
              type="text"
              placeholder="Empresa / Organización"
              value={formData.company}
              onChange={(e) => handleFieldChange("company", e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-white border border-[#A8C5A0]/30 text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none focus:border-[#6BAF8D] focus:shadow-[0_0_20px_rgba(107,175,141,0.4)] transition-all duration-300 glow-field"
            />
            <div>
              <textarea
                placeholder="¿Cómo podemos ayudarte?"
                value={formData.message}
                onChange={(e) => handleFieldChange("message", e.target.value)}
                onBlur={() => handleFieldBlur("message")}
                rows={5}
                className={`w-full px-5 py-4 rounded-xl bg-white border text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none transition-all duration-300 resize-none glow-field ${
                  formErrors.message && formTouched.message
                    ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)]"
                    : formTouched.message && !formErrors.message
                    ? "border-[#66BB6A] focus:border-[#66BB6A] focus:shadow-[0_0_20px_rgba(102,187,106,0.4)]"
                    : "border-[#A8C5A0]/30 focus:border-[#6BAF8D] focus:shadow-[0_0_20px_rgba(107,175,141,0.4)]"
                }`}
              />
              {formErrors.message && formTouched.message && (
                <p className="mt-1 text-xs text-red-500 animate-[fadeIn_0.2s_ease-out]">{formErrors.message}</p>
              )}
            </div>
            <MagneticButton strength={0.15} className="w-full">
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#66BB6A] to-[#43A047] text-white font-semibold text-lg hover:shadow-lg hover:shadow-[#43A047]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
              >
                Enviar Mensaje
              </button>
            </MagneticButton>
          </form>
          )}
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
