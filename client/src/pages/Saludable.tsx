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
import { trpc } from "@/lib/trpc";
import TestimonialCarousel from "@/components/saludable/TestimonialCarousel";
// GreenParticles removed from hero (video background now)
// Interactive3DParticles removed — replaced with lightweight CSS floating dots

gsap.registerPlugin(ScrollTrigger);

const PharmacyMap = lazy(() => import("@/components/saludable/PharmacyMap"));
const ComplianceParticles3D = lazy(() => import("@/components/saludable/ComplianceParticles3D"));
const ShaderGradientBG = lazy(() => import("@/components/saludable/ShaderGradientBG"));

// ─── Data ───────────────────────────────────────────────────────────────────

/*
 * ═══ GUÍA PARA REEMPLAZAR FOTOS DE ESPECIALISTAS ═══
 *
 * Para reemplazar una imagen de IA con la foto real:
 * 1. Sube la foto con: manus-upload-file --webdev /ruta/a/foto.jpg
 * 2. Copia la URL devuelta (ej: /manus-storage/nombre_abc12345.jpg)
 * 3. Reemplaza el valor del campo "image" del especialista correspondiente
 *
 * ESPECIALISTA 1: Lcda. Mariana Colón → image: "/manus-storage/nutricionista-boricua_b6ef4a1e.jpg"
 * ESPECIALISTA 2: Dr. Rafael Méndez  → image: "/manus-storage/dr-rafael-mendez-boricua_62f6369a.jpg"
 * ESPECIALISTA 3: Dra. Valeria Santiago → image: "/manus-storage/valeria-boricua_0889189c.jpg"
 * ESPECIALISTA 4: Lcdo. Carlos Rivera → image: "/manus-storage/carlos-rivera-boricua_fb656031.jpg"
 *
 * Tamaño recomendado: 600x800px (retrato), formato JPG o WebP
 */
const AMBASSADORS = [
  {
    id: "mariana-colon", // ← PLACEHOLDER: Reemplazar image con foto real
    name: "Lcda. Mariana Colón, RDN",
    role: "Nutrición Clínica",
    image: "/manus-storage/nutricionista-boricua_b6ef4a1e.jpg",
    quote: "Una alimentación consciente es la base de toda transformación corporativa.",
    specialty: "Nutricionista clínica certificada con 12 años de experiencia diseñando planes alimentarios para empresas. Especialista en nutrición tropical y prevención de enfermedades metabólicas.",
    expertise: ["Planes nutricionales corporativos", "Talleres de cocina saludable", "Evaluaciones metabólicas"],
    services: [
      "Diseño de planes alimentarios corporativos personalizados",
      "Talleres grupales de cocina saludable y nutrición tropical",
      "Evaluaciones metabólicas individuales y grupales",
      "Asesoría para comedores y máquinas expendedoras saludables",
      "Programas de prevención de diabetes y enfermedades cardiovasculares",
    ],
    linkedin: "#", // ← Reemplazar con URL real de LinkedIn
  },
  {
    id: "rafael-mendez", // ← PLACEHOLDER: Reemplazar image con foto real
    name: "Dr. Rafael Méndez, MD, MPH",
    role: "Medicina Preventiva",
    image: "/manus-storage/dr-rafael-mendez-boricua_62f6369a.jpg",
    quote: "Prevenir es la inversión más inteligente que una empresa puede hacer en su capital humano.",
    specialty: "Médico internista con maestría en Salud Pública. 15 años en medicina preventiva y salud ocupacional. Consultor para programas de bienestar en empresas Fortune 500 en PR.",
    expertise: ["Evaluaciones preventivas", "Protocolos de salud ocupacional", "Gestión de riesgos clínicos"],
    services: [
      "Exámenes médicos preventivos ejecutivos y grupales",
      "Diseño de protocolos de salud ocupacional (OSHA-compliant)",
      "Ferias de salud corporativas con cernimientos clínicos",
      "Gestión de riesgos y evaluación de factores de salud laboral",
      "Consultoría en cumplimiento regulatorio de salud (Depto. de Salud PR)",
    ],
    linkedin: "#", // ← Reemplazar con URL real de LinkedIn
  },
  {
    id: "valeria-santiago", // ← PLACEHOLDER: Reemplazar image con foto real
    name: "Dra. Valeria Santiago, PharmD, CPT, CES",
    role: "Salud Integral",
    image: "/manus-storage/valeria-boricua_0889189c.jpg",
    quote: "El movimiento diario transforma equipos completos — física, mental y emocionalmente.",
    specialty: "Farmacéutica y entrenadora personal certificada por la National Academy of Sports Medicine (NASM), con especialización en entrenamiento funcional, movilidad y prevención de lesiones. Diseña programas integrales de bienestar, prevención y actividad física, adaptados a las necesidades de los empleados dentro de su ambiente laboral.",
    expertise: ["Programas integrales de bienestar", "Entrenamiento funcional y movilidad", "Prevención de lesiones en ambiente laboral"],
    services: [
      "Programas de actividad física adaptados al ambiente laboral",
      "Sesiones de entrenamiento funcional y movilidad articular",
      "Evaluaciones de riesgo ergonómico y prevención de lesiones",
      "Consultoría farmacéutica en manejo de medicamentos y suplementación",
      "Talleres de bienestar integral: cuerpo, mente y prevención",
    ],
    linkedin: "#", // ← Reemplazar con URL real de LinkedIn
  },
  {
    id: "carlos-rivera", // ← PLACEHOLDER: Reemplazar image con foto real
    name: "Lcdo. Carlos Rivera, MBA, CWPC",
    role: "Bienestar Corporativo",
    image: "/manus-storage/carlos-rivera-boricua_fb656031.jpg",
    quote: "Una empresa saludable es una empresa rentable — los datos lo demuestran consistentemente.",
    specialty: "Consultor certificado en bienestar corporativo con MBA en Gestión Estratégica. Implementa programas de cultura organizacional saludable y cumplimiento regulatorio en toda la isla.",
    expertise: ["Cultura organizacional", "Cumplimiento Depto. de Salud", "ROI de bienestar"],
    services: [
      "Diagnóstico de cultura organizacional y clima laboral",
      "Diseño e implementación de programas de bienestar corporativo",
      "Cumplimiento regulatorio (Depto. de Salud, OSHA, ADA)",
      "Medición de ROI en programas de salud y bienestar",
      "Capacitación de líderes en gestión de bienestar empresarial",
    ],
    linkedin: "#", // ← Reemplazar con URL real de LinkedIn
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

const TESTIMONIAL_CATEGORIES = ["Todos", "Bienestar", "Farmacias", "Finanzas", "Cumplimiento"] as const;

const TESTIMONIALS = [
  {
    quote: "Desde que mi empresa se unió a Empresa Saludable, la energía del equipo cambió por completo. Los talleres de salud mental nos dieron herramientas reales.",
    name: "María del Carmen Ortiz",
    role: "Directora de RRHH, Corporación del Caribe",
    municipality: "San Juan",
    category: "Bienestar" as const,
  },
  {
    quote: "La red de farmacias me permite acceder a mis medicamentos y consultas nutricionales cerca de casa. Es un servicio que realmente funciona.",
    name: "José Luis Rivera",
    role: "Beneficiario, Plan Profesional",
    municipality: "Carolina",
    category: "Farmacias" as const,
  },
  {
    quote: "El programa de salud financiera me ayudó a planificar mi retiro con confianza. Nunca pensé que un programa de bienestar incluyera eso.",
    name: "Ana Sofía Méndez",
    role: "Empleada, Sector Farmacéutico",
    municipality: "Caguas",
    category: "Finanzas" as const,
  },
  {
    quote: "Como farmacéutica aliada, veo el impacto directo en mis pacientes. Llegan más informados y comprometidos con su salud.",
    name: "Dra. Carmen Luisa Vega",
    role: "Farmacéutica, Red Aliada",
    municipality: "Carolina",
    category: "Farmacias" as const,
  },
  {
    quote: "El cumplimiento regulatorio ya no es una carga. El equipo nos guía paso a paso y nos mantiene al día con cada requisito.",
    name: "Roberto Colón Torres",
    role: "CEO, Grupo Salud Integral",
    municipality: "Ponce",
    category: "Cumplimiento" as const,
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

  // Specialist bio modal state
  const [selectedSpecialist, setSelectedSpecialist] = useState<typeof AMBASSADORS[number] | null>(null);

  // Quick appointment popup state
  const [appointmentFor, setAppointmentFor] = useState<string | null>(null);
  const [apptForm, setApptForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [apptSubmitting, setApptSubmitting] = useState(false);
  const [apptSuccess, setApptSuccess] = useState(false);

  // Testimonial category filter
  const [testimonialFilter, setTestimonialFilter] = useState<typeof TESTIMONIAL_CATEGORIES[number]>("Todos");
  const filteredTestimonials = testimonialFilter === "Todos"
    ? TESTIMONIALS
    : TESTIMONIALS.filter(t => t.category === testimonialFilter);

  // Preloader state
  const [preloaderDone, setPreloaderDone] = useState(false);
  const preloaderRef = useRef<HTMLDivElement>(null);

  // Scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll-proximity lazy loading: mount heavy components only when near viewport
  const [showParticles3D, setShowParticles3D] = useState(false);
  const [showTestimonialVideo, setShowTestimonialVideo] = useState(false);
  const testimonialSectionRef = useRef<HTMLElement>(null);
  const beneficiaryScrollRef = useRef<HTMLDivElement>(null);

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

  const [formError, setFormError] = useState("");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setFormSubmitted(true);
      setFormError("");
    },
    onError: (err) => {
      console.error("Contact form error:", err);
      setFormError("Error al enviar. Intente de nuevo o escr\u00edba a hola@empresasaludable.org");
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    errors.name = validateField("name", formData.name);
    errors.email = validateField("email", formData.email);
    errors.message = validateField("message", formData.message);
    setFormErrors(errors);
    setFormTouched({ name: true, email: true, message: true });
    if (Object.values(errors).some(e => e)) return;
    // Submit via tRPC (saves to DB + notifies owner)
    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      company: formData.company || undefined,
      message: formData.message,
    });
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

    // Scroll-to-top visibility
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ─── Preloader Animation (transitions into cosmic portal) ─────────────────
  useEffect(() => {
    if (!preloaderRef.current) return;
    const tl = gsap.timeline({
      onComplete: () => setPreloaderDone(true),
    });
    tl.to(preloaderRef.current.querySelector('.preloader-logo'), {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
    })
    .to(preloaderRef.current.querySelector('.preloader-text'), {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }, "-=0.3")
    .to(preloaderRef.current.querySelector('.preloader-bar-fill'), {
      scaleX: 1,
      duration: 1.2,
      ease: "power2.inOut",
    }, "-=0.2")
    // Cosmic portal transition: logo shrinks + glow ring expands
    .to(preloaderRef.current.querySelector('.preloader-logo'), {
      scale: 0.6,
      opacity: 0.8,
      duration: 0.4,
      ease: "power2.in",
    }, "+=0.2")
    .to(preloaderRef.current.querySelector('.preloader-portal-ring'), {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    }, "-=0.3")
    .to(preloaderRef.current.querySelector('.preloader-text'), {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
    }, "-=0.4")
    .to(preloaderRef.current.querySelector('.preloader-bar-fill')?.parentElement || preloaderRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    }, "-=0.3")
    // Clip-path circle portal opens outward from center
    .to(preloaderRef.current, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 0.9,
      ease: "power3.inOut",
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── GSAP Animations (FIXED: immediateRender:false on all from() calls) ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero CTA entrance animation
      const kineticTl = gsap.timeline({ delay: 0.3 });
      kineticTl
        .from(".hero-cta", {
          y: 40,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          ease: "back.out(1.7)",
        });

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

      // Ambassador cards entrance — cinematic 3D with depth
      if (celebsRef.current) {
        // Section header — clip-path reveal from left
        gsap.from(celebsRef.current.querySelector("h2"), {
          scrollTrigger: { trigger: celebsRef.current, start: "top 82%" },
          x: -100,
          opacity: 0,
          clipPath: 'inset(0 100% 0 0)',
          duration: 1.2,
          ease: "power3.out",
          clearProps: 'clipPath',
          immediateRender: false,
        });

        gsap.from(celebsRef.current.querySelectorAll("p"), {
          scrollTrigger: { trigger: celebsRef.current, start: "top 82%" },
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
          immediateRender: false,
        });

        // Specialist cards — dramatic 3D flip entrance with stagger
        gsap.from(".celeb-card", {
          scrollTrigger: { trigger: celebsRef.current, start: "top 75%" },
          y: 100,
          opacity: 0,
          scale: 0.85,
          rotateY: 25,
          rotateX: 10,
          duration: 1.2,
          stagger: 0.25,
          ease: "back.out(1.2)",
          immediateRender: false,
        });

        // Parallax depth on ambassador cards while scrolling
        gsap.utils.toArray<HTMLElement>(".celeb-card").forEach((card, i) => {
          gsap.to(card, {
            scrollTrigger: {
              trigger: celebsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
            y: -15 - (i * 8),
            ease: "none",
          });
        });
      }

      // Pillars WOW entrance — 3D flip + stagger + glow burst
      if (pillarsRef.current) {
        // CLIP-PATH CIRCLE PORTAL REVEAL — cosmic portal opens on scroll
        gsap.set(pillarsRef.current, { clipPath: "circle(0% at 50% 50%)" });
        gsap.to(pillarsRef.current, {
          scrollTrigger: {
            trigger: pillarsRef.current,
            start: "top 90%",
            end: "top 40%",
            scrub: 1,
          },
          clipPath: "circle(100% at 50% 50%)",
          ease: "power2.inOut",
        });

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

        // Bienestar Integral block — parallax float + scale on scroll
        const bienestarBlock = pillarsRef.current.querySelector("[data-bienestar-block]");
        if (bienestarBlock) {
          gsap.from(bienestarBlock, {
            scrollTrigger: {
              trigger: bienestarBlock,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
          });
          gsap.to(bienestarBlock, {
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
            y: -25,
            ease: "none",
          });
        }
      }

      // Stats counter — dramatic scale + rotate entrance
      if (statsRef.current) {
        gsap.from(".stat-item", {
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
          y: 60,
          opacity: 0,
          scale: 0.8,
          rotateX: 20,
          duration: 0.9,
          stagger: 0.12,
          ease: "back.out(1.4)",
          immediateRender: false,
        });
      }

      // Compliance steps — cinematic stagger with slide from alternating sides
      if (complianceRef.current) {
        const steps = complianceRef.current.querySelectorAll(".compliance-step");
        steps.forEach((step, i) => {
          gsap.from(step, {
            scrollTrigger: { trigger: complianceRef.current, start: "top 80%" },
            x: i % 2 === 0 ? -60 : 60,
            y: 40,
            opacity: 0,
            scale: 0.9,
            duration: 0.9,
            delay: i * 0.15,
            ease: "power3.out",
            immediateRender: false,
          });
        });
      }

      // Plans — dramatic staggered entrance with rotation (one-by-one reveal)
      if (plansRef.current) {
        gsap.from(".plan-card", {
          scrollTrigger: { trigger: plansRef.current, start: "top 80%" },
          y: 100,
          opacity: 0,
          rotateY: 20,
          scale: 0.85,
          duration: 1.1,
          stagger: 0.3,
          ease: "back.out(1.4)",
          immediateRender: false,
        });

        // Feature list items stagger within each card
        plansRef.current.querySelectorAll('.plan-card').forEach((card, cardIdx) => {
          const items = card.querySelectorAll('li');
          gsap.from(items, {
            scrollTrigger: { trigger: card, start: "top 75%" },
            x: -20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            delay: 0.3 + cardIdx * 0.3,
            ease: "power2.out",
            immediateRender: false,
          });
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

      // Contact — cinematic scale + blur entrance
      if (contactRef.current) {
        gsap.from(".contact-form", {
          scrollTrigger: { trigger: contactRef.current, start: "top 80%" },
          y: 60,
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
        });

        // Stagger form fields entrance
        gsap.from(contactRef.current.querySelectorAll("input, textarea, select"), {
          scrollTrigger: { trigger: contactRef.current, start: "top 75%" },
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.3,
          ease: "power2.out",
          immediateRender: false,
        });
      }

      // Map — dramatic slide-up with scale
      if (mapRef.current) {
        gsap.from(".map-container", {
          scrollTrigger: { trigger: mapRef.current, start: "top 80%" },
          y: 80,
          opacity: 0,
          scale: 0.92,
          duration: 1.2,
          ease: "power3.out",
          immediateRender: false,
        });
      }

      // Beneficiarios horizontal scroll — vertical scroll drives horizontal movement
      if (beneficiaryScrollRef.current && testimonialSectionRef.current) {
        const track = beneficiaryScrollRef.current.querySelector('.beneficiary-track') as HTMLElement;
        if (track) {
          const totalWidth = track.scrollWidth - beneficiaryScrollRef.current.offsetWidth;
          if (totalWidth > 0) {
            gsap.to(track, {
              scrollTrigger: {
                trigger: testimonialSectionRef.current,
                start: "top top",
                end: () => `+=${totalWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
              },
              x: -totalWidth,
              ease: "none",
            });
          }
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Refresh horizontal scroll when filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (beneficiaryScrollRef.current && testimonialSectionRef.current) {
        const track = beneficiaryScrollRef.current.querySelector('.beneficiary-track') as HTMLElement;
        if (track) {
          ScrollTrigger.getAll().forEach(st => {
            if (st.trigger === testimonialSectionRef.current) st.kill();
          });
          gsap.set(track, { x: 0 });
          const totalWidth = track.scrollWidth - beneficiaryScrollRef.current.offsetWidth;
          if (totalWidth > 0) {
            gsap.to(track, {
              scrollTrigger: {
                trigger: testimonialSectionRef.current,
                start: "top top",
                end: () => `+=${totalWidth}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
              },
              x: -totalWidth,
              ease: "none",
            });
          }
          ScrollTrigger.refresh();
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [testimonialFilter]);

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
            const el = countRef.current!;
            const obj = { val: 0 };

            // Scale-in entrance
            gsap.from(el, {
              scale: 0.5,
              opacity: 0,
              duration: 0.5,
              ease: "back.out(1.7)",
            });

            // Count-up with dramatic easing
            gsap.to(obj, {
              val: value,
              duration: 2.5,
              ease: "power4.out",
              onUpdate: () => {
                if (countRef.current) {
                  countRef.current.textContent = Math.round(obj.val) + suffix;
                }
              },
              onComplete: () => {
                // Pulse on completion
                gsap.fromTo(el,
                  { scale: 1 },
                  { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" }
                );
              },
            });
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(countRef.current);
      return () => observer.disconnect();
    }, [value, suffix]);

    return <span ref={countRef} className="inline-block">0{suffix}</span>;
  }

  return (
    <>
    {/* ═══ PRELOADER ═══ */}
    {!preloaderDone && (
      <div ref={preloaderRef} className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#C8E6C9]" style={{ clipPath: 'circle(100% at 50% 50%)' }}>
        {/* Cosmic portal ring — expands during transition */}
        <div className="preloader-portal-ring absolute inset-0 flex items-center justify-center opacity-0 scale-[0.3] pointer-events-none">
          <div className="w-[300px] h-[300px] rounded-full border-4 border-[#43A047]/60 shadow-[0_0_60px_rgba(67,160,71,0.4),inset_0_0_60px_rgba(67,160,71,0.2)] animate-pulse" />
          <div className="absolute w-[220px] h-[220px] rounded-full border-2 border-[#66BB6A]/40 shadow-[0_0_40px_rgba(102,187,106,0.3)]" style={{ animation: 'sunRotate 3s linear infinite' }} />
          <div className="absolute w-[140px] h-[140px] rounded-full bg-gradient-radial from-[#43A047]/20 to-transparent" />
        </div>
        <div className="preloader-logo opacity-0 scale-[0.6] mb-6 relative z-10">
          <img src="/manus-storage/saludable-logo_630e22f3.png" alt="" className="w-24 h-24 drop-shadow-xl" />
        </div>
        <div className="preloader-text opacity-0 translate-y-4 relative z-10">
          <h2 className="text-3xl font-bold text-[#1B5E20]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Empresa <span className="text-[#43A047]">Saludable</span>
          </h2>
          <p className="text-sm text-[#2E7D32]/60 mt-1 text-center tracking-wider uppercase">Bienestar Corporativo PR</p>
        </div>
        <div className="mt-8 w-48 h-1 bg-[#C8E6C9] rounded-full overflow-hidden relative z-10">
          <div className="preloader-bar-fill h-full bg-gradient-to-r from-[#43A047] to-[#66BB6A] rounded-full origin-left scale-x-0" />
        </div>
      </div>
    )}

    <div ref={containerRef} className="relative bg-[#F4F9F2] text-[#2D3B2D] overflow-hidden">
      {/* Futuristic Custom Cursor */}
      <FuturisticCursor />

      {/* Music Player */}
      <MusicPlayer />

      {/* ═══ SCROLL TO TOP BUTTON ═══ */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-[#43A047] text-white shadow-lg shadow-[#43A047]/30 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-110 hover:shadow-xl hover:shadow-[#43A047]/40 active:scale-95 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Volver arriba"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* ═══ NAVIGATION — Frosted Glass + Animated Hover ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-2xl bg-white/60 border-b border-[#6BAF8D]/10 shadow-[0_4px_30px_rgba(107,175,141,0.08)] transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/80 p-1.5 shadow-md border border-[#6BAF8D]/20 hover:scale-110 hover:shadow-lg transition-all duration-300">
            <img
              src="/manus-storage/saludable-logo_630e22f3.png"
              alt="Empresa Saludable"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-[#1B3B1B] drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Empresa <span className="text-[#2E7D32] font-black">Saludable</span>
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#2E7D32] font-semibold -mt-0.5">Bienestar Corporativo PR</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm text-[#2D3B2D]/70">
          {[
            { href: '#pilares', label: 'Pilares' },
            { href: '#farmacias', label: 'Farmacias' },
            { href: '#cumplimiento', label: 'Cumplimiento' },
            { href: '#planes', label: 'Planes' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 rounded-full text-[#2D3B2D]/70 hover:text-[#6BAF8D] transition-all duration-300 hover:bg-[#6BAF8D]/8 group"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#6BAF8D] rounded-full transition-all duration-300 group-hover:w-[60%]" />
            </a>
          ))}
          <a
            href="#contacto"
            className="ml-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9070] text-white font-medium hover:shadow-lg hover:shadow-[#6BAF8D]/30 hover:scale-105 active:scale-95 transition-all duration-300"
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

        {/* Hero CTA only — no title text */}
        <div className="relative z-10 text-center px-6">

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

      {/* ═══ TRANSITION BRIDGE: Hero → Ambassadors ═══ */}
      <div className="relative h-40 -mt-1 overflow-hidden">
        {/* Clean gradient from dark hero to light ambassadors */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#2D3B2D]/40 via-50% to-[#F0F7F4]" />
        {/* Layered organic wave dividers for depth */}
        <svg className="absolute bottom-0 left-0 w-full h-28" viewBox="0 0 1440 112" preserveAspectRatio="none" fill="none">
          <path d="M0,56 C240,90 480,20 720,56 C960,90 1200,20 1440,56 L1440,112 L0,112 Z" fill="#F0F7F4" opacity="0.3" />
          <path d="M0,70 C360,100 720,35 1080,70 C1260,85 1380,75 1440,70 L1440,112 L0,112 Z" fill="#F0F7F4" opacity="0.6" />
          <path d="M0,85 C480,112 960,60 1440,85 L1440,112 L0,112 Z" fill="#F0F7F4" />
        </svg>
        {/* Decorative floating leaf accent */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[#6BAF8D]/10 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
          <svg className="w-6 h-6 text-[#6BAF8D]/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
          </svg>
        </div>
      </div>

      {/* ═══ INSPIRADOS POR LOS MEJORES — PROFESSIONAL AMBASSADORS ═══ */}
      <section ref={celebsRef} className="pt-16 pb-24 px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #F0F7F4 0%, #FDFCFB 15%, #F0F7F4 40%, #EBF5FB 100%)' }}>
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
                className="celeb-card group relative flex flex-col md:flex-row rounded-3xl overflow-hidden bg-white border border-[#A8C5A0]/20 shadow-md hover:shadow-[0_25px_60px_rgba(107,175,141,0.25)] transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] hover:border-[#6BAF8D]/50"
                style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  card.style.transform = `translateY(-12px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                  card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
                }}
              >
                {/* Photo — click to open bio modal */}
                <div
                  className="w-full md:w-[220px] h-[280px] md:h-auto flex-shrink-0 overflow-hidden relative cursor-pointer"
                  onClick={() => setSelectedSpecialist(amb)}
                >
                  <img
                    src={amb.image}
                    alt={amb.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:bg-gradient-to-b md:from-transparent md:to-[#2D3B2D]/20" />
                  {/* Click hint overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <span className="px-3 py-1.5 rounded-full bg-white/90 text-[#2D3B2D] text-xs font-semibold shadow-lg">Ver Perfil Completo</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#6BAF8D]/10 text-[#6BAF8D] border border-[#6BAF8D]/20 group-hover:bg-[#6BAF8D]/20 group-hover:border-[#6BAF8D]/40 group-hover:shadow-[0_0_12px_rgba(107,175,141,0.3)] transition-all duration-500">
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
                        <span key={j} className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-[#F4F9F2] text-[#2D3B2D]/70 border border-[#A8C5A0]/20 group-hover:bg-[#6BAF8D]/10 group-hover:border-[#6BAF8D]/30 group-hover:text-[#2D3B2D]/90 transition-all duration-300" style={{ transitionDelay: `${j * 80}ms` }}>
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="pt-4 border-t border-[#A8C5A0]/20">
                    <p className="text-[#2D3B2D]/70 text-sm italic leading-relaxed mb-4">
                      "{amb.quote}"
                    </p>
                    {/* Agendar Cita button */}
                    <button
                      onClick={() => { setAppointmentFor(amb.name.split(',')[0]); setApptSuccess(false); setApptForm({ name: '', email: '', phone: '', date: '', message: '' }); }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9B6F] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-[#6BAF8D]/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Agendar Cita
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SPECIALIST BIO MODAL ═══ */}
      {selectedSpecialist && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedSpecialist(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />
          {/* Modal */}
          <div
            className="relative bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-[scaleIn_0.3s_cubic-bezier(0.23,1,0.32,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedSpecialist(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#2D3B2D]/10 flex items-center justify-center hover:bg-[#2D3B2D]/20 transition-colors"
            >
              <svg className="w-4 h-4 text-[#2D3B2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Photo */}
            <div className="w-full h-[300px] overflow-hidden rounded-t-3xl">
              <img src={selectedSpecialist.image} alt={selectedSpecialist.name} className="w-full h-full object-cover" />
            </div>

            {/* Content */}
            <div className="p-8">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#6BAF8D]/10 text-[#6BAF8D] border border-[#6BAF8D]/20 mb-3">
                {selectedSpecialist.role}
              </span>
              <h3 className="text-2xl font-bold text-[#2D3B2D] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {selectedSpecialist.name}
              </h3>

              {/* Full biography */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#2D3B2D] uppercase tracking-wider mb-2">Biografía</h4>
                <p className="text-[#2D3B2D]/70 text-sm leading-relaxed">{selectedSpecialist.specialty}</p>
              </div>

              {/* Certifications */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-[#2D3B2D] uppercase tracking-wider mb-3">Certificaciones y Especialidades</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpecialist.expertise.map((cert, j) => (
                    <span key={j} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#6BAF8D]/10 text-[#6BAF8D] border border-[#6BAF8D]/20">
                      ✓ {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Services */}
              {selectedSpecialist.services && selectedSpecialist.services.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#2D3B2D] uppercase tracking-wider mb-3">Servicios que Ofrece</h4>
                  <ul className="space-y-2">
                    {selectedSpecialist.services.map((service: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[#2D3B2D]/70">
                        <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded-full bg-[#6BAF8D]/10 flex items-center justify-center">
                          <svg className="w-3 h-3 text-[#6BAF8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quote */}
              <div className="p-4 rounded-xl bg-[#F4F9F2] border border-[#A8C5A0]/20 mb-4">
                <p className="text-[#2D3B2D]/70 text-sm italic">"​{selectedSpecialist.quote}​"</p>
              </div>

              {/* LinkedIn */}
              {selectedSpecialist.linkedin && selectedSpecialist.linkedin !== '#' && (
                <a
                  href={selectedSpecialist.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] text-sm font-medium hover:bg-[#0A66C2]/20 transition-colors mb-4"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Ver perfil en LinkedIn
                </a>
              )}
              {selectedSpecialist.linkedin === '#' && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn (próximamente)
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => {
                  const name = selectedSpecialist.name.split(',')[0];
                  setSelectedSpecialist(null);
                  setTimeout(() => { setAppointmentFor(name); setApptSuccess(false); setApptForm({ name: '', email: '', phone: '', date: '', message: '' }); }, 300);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9B6F] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Agendar Cita con {selectedSpecialist.name.split(',')[0]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ QUICK APPOINTMENT POPUP ═══ */}
      {appointmentFor && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setAppointmentFor(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ animation: 'fadeIn 0.2s ease-out' }} />
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto"
            style={{ animation: 'scaleIn 0.3s cubic-bezier(0.23,1,0.32,1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={() => setAppointmentFor(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {apptSuccess ? (
              <div className="text-center py-8 relative overflow-hidden">
                {/* Animated celebration particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: ['#6BAF8D', '#43A047', '#81C784', '#FFD700', '#FF6B6B', '#7C4DFF'][i % 6],
                        left: `${50 + 40 * Math.cos((i * 2 * Math.PI) / 12)}%`,
                        top: `${50 + 40 * Math.sin((i * 2 * Math.PI) / 12)}%`,
                        animation: `confettiBurst 0.8s cubic-bezier(0.23,1,0.32,1) ${i * 0.05}s forwards`,
                        opacity: 0,
                      }}
                    />
                  ))}
                </div>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#6BAF8D] to-[#43A047] flex items-center justify-center shadow-lg" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.23,1,0.32,1) 0.1s both' }}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#2D3B2D] mb-2" style={{ animation: 'fadeIn 0.4s ease-out 0.3s both' }}>¡Solicitud Enviada!</h3>
                <p className="text-[#2D3B2D]/60 text-sm" style={{ animation: 'fadeIn 0.4s ease-out 0.5s both' }}>Nos comunicaremos contigo pronto para confirmar tu cita con <strong>{appointmentFor}</strong>.</p>
                <button onClick={() => setAppointmentFor(null)} className="mt-6 px-8 py-2.5 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9B6F] text-white font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300" style={{ animation: 'fadeIn 0.4s ease-out 0.7s both' }}>Cerrar</button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#6BAF8D]/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#6BAF8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#2D3B2D]">Agendar Cita</h3>
                  <p className="text-[#2D3B2D]/60 text-sm mt-1">con {appointmentFor}</p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setApptSubmitting(true);
                    try {
                      await contactMutation.mutateAsync({
                        name: apptForm.name,
                        email: apptForm.email,
                        company: `Cita: ${appointmentFor} | Tel: ${apptForm.phone} | Fecha: ${apptForm.date}`,
                        message: apptForm.message || `Solicitud de cita con ${appointmentFor}`,
                      });
                      setApptSuccess(true);
                    } catch {
                      alert('Error al enviar. Intente de nuevo.');
                    } finally {
                      setApptSubmitting(false);
                    }
                  }}
                  className="space-y-4"
                >
                  {/* Specialist Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Especialista *</label>
                    <select
                      required
                      value={appointmentFor}
                      onChange={(e) => setAppointmentFor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#A8C5A0]/30 bg-[#F9FBF9] text-sm focus:ring-2 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D] outline-none transition-all appearance-none cursor-pointer"
                    >
                      {AMBASSADORS.map((amb) => (
                        <option key={amb.id} value={amb.name.split(',')[0]}>{amb.name.split(',')[0]} — {amb.role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Nombre completo *</label>
                    <input
                      required
                      value={apptForm.name}
                      onChange={(e) => setApptForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#A8C5A0]/30 bg-[#F9FBF9] text-sm focus:ring-2 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D] outline-none transition-all"
                      placeholder="Su nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Email *</label>
                    <input
                      required
                      type="email"
                      value={apptForm.email}
                      onChange={(e) => setApptForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#A8C5A0]/30 bg-[#F9FBF9] text-sm focus:ring-2 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D] outline-none transition-all"
                      placeholder="su@email.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Teléfono</label>
                      <input
                        value={apptForm.phone}
                        onChange={(e) => setApptForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#A8C5A0]/30 bg-[#F9FBF9] text-sm focus:ring-2 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D] outline-none transition-all"
                        placeholder="787-000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Fecha preferida</label>
                      <input
                        type="date"
                        value={apptForm.date}
                        onChange={(e) => setApptForm(p => ({ ...p, date: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#A8C5A0]/30 bg-[#F9FBF9] text-sm focus:ring-2 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Mensaje (opcional)</label>
                    <textarea
                      value={apptForm.message}
                      onChange={(e) => setApptForm(p => ({ ...p, message: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#A8C5A0]/30 bg-[#F9FBF9] text-sm focus:ring-2 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D] outline-none transition-all resize-none"
                      placeholder="Detalles adicionales..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={apptSubmitting}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9B6F] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {apptSubmitting ? 'Enviando...' : 'Solicitar Cita'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ TRANSITION BRIDGE: Ambassadors → Testimonios Carousel ═══ */}
      <div className="relative h-20 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EBF5FB] to-[#FDFCFB]" />
        <svg className="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="none">
          <path d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,30 1440,24 L1440,48 L0,48 Z" fill="#FDFCFB" />
          <path d="M0,32 C480,48 960,12 1440,32 L1440,48 L0,48 Z" fill="#FDFCFB" opacity="0.6" />
        </svg>
      </div>

      {/* ═══ TESTIMONIOS DE CLIENTES — AUTO-ROTATING CAROUSEL ═══ */}
      <TestimonialCarousel />

      {/* ═══ TRANSITION BRIDGE: Testimonios → Pilares ═══ */}
      <div className="relative h-24 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F7F4] to-[#E8F5E9]" />
        <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
          <path d="M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z" fill="#E8F5E9" />
          <path d="M0,40 C480,56 960,16 1440,40 L1440,64 L0,64 Z" fill="#E8F5E9" opacity="0.6" />
        </svg>
      </div>

      {/* ═══ LOS 5 PILARES DEL BIENESTAR — SUMMER GREEN PARALLAX ═══ */}

      {/* ═══ LOS 5 PILARES DEL BIENESTAR — CIRCULAR HOLISTIC ═══ */}
      <section ref={pillarsRef} id="pilares" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #E8F5E9 100%)' }}>
        {/* GLSL Animated Noise Gradient Shader Background */}
        <Suspense fallback={null}>
          <ShaderGradientBG
            color1={[0.91, 0.96, 0.88]}
            color2={[0.78, 0.90, 0.79]}
            color3={[0.42, 0.68, 0.42]}
            opacity={0.45}
            speed={0.8}
          />
        </Suspense>
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
          <p className="text-center text-[#2E7D32]/70 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Cada pilar apoya al siguiente en un ciclo continuo de bienestar integral — un sistema donde la salud mental fortalece la física, la física potencia la nutrición, y así sucesivamente.
          </p>

          {/* Bienestar Integral Context Block */}
          <div data-bienestar-block className="max-w-4xl mx-auto mb-20 p-10 rounded-3xl bg-white/50 backdrop-blur-md border border-[#66BB6A]/30 shadow-xl relative overflow-hidden hover:shadow-2xl hover:shadow-[#43A047]/25 hover:border-[#66BB6A]/60 hover:scale-[1.04] hover:-translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-default group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#43A047] via-[#66BB6A] to-[#81C784]" />
            {/* Centered layout */}
            <div className="flex flex-col items-center text-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#43A047] to-[#66BB6A] flex items-center justify-center shadow-lg shadow-[#43A047]/30 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-white sun-icon-rotate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-5.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                  <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8a4 4 0 0 1 4 4m-4-4a4 4 0 0 0-4 4m4 4a4 4 0 0 1-4-4m4 4a4 4 0 0 0 4-4" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-[#1B5E20]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bienestar <span className="text-[#43A047]">Integral</span>
              </h3>
              <p className="text-[#2E7D32]/80 leading-relaxed max-w-2xl">
                La sinergia de los 5 pilares fundamentales — Salud Mental, Actividad Física, Nutrición, Bienestar Financiero y Salud Corporativa — funcionando como un sistema unificado. No se trata de atender cada dimensión por separado, sino de reconocer que están interconectadas: cuando un pilar se fortalece, los demás se elevan. Este enfoque holístico transforma un programa de bienestar convencional en una experiencia transformadora para el empleado y la organización.
              </p>
            </div>
          </div>

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

      {/* ═══ TRANSITION BRIDGE: Pilares → Stats ═══ */}
      <div className="relative h-20 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F5E9] to-[#43A047]" />
        <svg className="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="none">
          <path d="M0,24 C360,48 720,0 1080,24 C1260,36 1380,30 1440,24 L1440,48 L0,48 Z" fill="#43A047" />
        </svg>
      </div>

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

      {/* ═══ TRANSITION BRIDGE: Stats → Testimonials Video ═══ */}
      <div className="relative h-20 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#43A047] to-[#E8F5E0]" />
        <svg className="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="none">
          <path d="M0,20 C360,48 720,0 1080,28 C1260,40 1380,32 1440,24 L1440,48 L0,48 Z" fill="#E8F5E0" />
          <path d="M0,30 C480,48 960,12 1440,32 L1440,48 L0,48 Z" fill="#E8F5E0" opacity="0.5" />
        </svg>
      </div>

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
        {/* Light summer green overlay — reduced for more visible photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F5E0]/50 via-[#C8E6C9]/45 to-[#A5D6A7]/55" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#1B5E20]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Lo Que Dicen Nuestros <span className="text-[#43A047] drop-shadow-[0_0_15px_rgba(67,160,71,0.3)]">Beneficiarios</span>
          </h2>
          <p className="text-center text-[#2E7D32]/70 mb-8 max-w-xl mx-auto">
            Historias reales de transformación y bienestar en toda la isla.
          </p>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {TESTIMONIAL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setTestimonialFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  testimonialFilter === cat
                    ? 'bg-[#43A047] text-white shadow-lg shadow-[#43A047]/30 scale-105'
                    : 'bg-white/60 text-[#2E7D32] border border-[#66BB6A]/30 hover:bg-[#43A047]/10 hover:border-[#43A047]/50 hover:scale-105'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* HORIZONTAL SCROLL PANELS — vertical scroll triggers horizontal card movement */}
          <div ref={beneficiaryScrollRef} className="relative overflow-hidden">
            <div className="beneficiary-track flex gap-6 will-change-transform">
              {filteredTestimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="beneficiary-panel flex-shrink-0 w-[340px] md:w-[380px] p-8 rounded-2xl bg-white/35 backdrop-blur-sm border border-[#66BB6A]/20 shadow-xl hover:shadow-[0_20px_60px_rgba(67,160,71,0.35)] hover:-translate-y-4 hover:scale-[1.06] hover:bg-white/55 hover:border-[#43A047]/40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group cursor-pointer"
                >
                  <svg className="w-8 h-8 text-[#43A047]/50 mb-4 group-hover:text-[#2E7D32] group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                  </svg>
                  <p className="text-[#2D3B2D]/80 text-sm leading-relaxed mb-6 italic group-hover:text-[#1B5E20] transition-colors duration-500">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-[#66BB6A]/20 pt-4 group-hover:border-[#43A047]/40 transition-colors duration-500">
                    <p className="font-semibold text-[#1B5E20] text-sm group-hover:text-[#2E7D32] transition-colors duration-300">{testimonial.name}</p>
                    <p className="text-xs text-[#43A047] mt-0.5 group-hover:text-[#1B5E20] transition-colors duration-300">{testimonial.role}</p>
                    <p className="text-xs text-[#2D3B2D]/50 mt-0.5">{testimonial.municipality}, PR</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <span className="text-xs text-[#2E7D32]/50 animate-pulse">Scroll para descubrir más historias ↓</span>
          </div>
        </div>
      </section>

      {/* ═══ TRANSITION BRIDGE: Testimonials → Compliance ═══ */}
      <div className="relative h-24 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A5D6A7]/80 to-[#E8F5E0]" />
        <svg className="absolute bottom-0 left-0 w-full h-16" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="none">
          <path d="M0,28 C360,64 720,0 1080,36 C1260,50 1380,42 1440,32 L1440,64 L0,64 Z" fill="#E8F5E0" />
          <path d="M0,40 C480,56 960,20 1440,44 L1440,64 L0,64 Z" fill="#E8F5E0" opacity="0.5" />
        </svg>
      </div>

      {/* ═══ PLANIFICACIÓN Y CUMPLIMIENTO — WOW INTERACTIVE TIMELINE ═══ */}
      <section ref={complianceRef} id="cumplimiento" className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E8F5E0 0%, #C8E6C9 40%, #B9DEB5 70%, #E8F5E0 100%)' }}>
        {/* GLSL Animated Noise Gradient Shader Background */}
        <Suspense fallback={null}>
          <ShaderGradientBG
            color1={[0.91, 0.96, 0.88]}
            color2={[0.72, 0.87, 0.71]}
            color3={[0.40, 0.63, 0.40]}
            opacity={0.35}
            speed={0.6}
          />
        </Suspense>
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

      {/* ═══ TRANSITION BRIDGE: Compliance → Plans ═══ */}
      <div className="relative h-20 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#E8F5E0] to-[#F4F9F2]" />
        <svg className="absolute bottom-0 left-0 w-full h-12" viewBox="0 0 1440 48" preserveAspectRatio="none" fill="none">
          <path d="M0,24 C480,48 960,0 1440,24 L1440,48 L0,48 Z" fill="#F4F9F2" />
        </svg>
      </div>

      {/* ═══ PLANES DE SERVICIO — FULL 3 PLANS ═══ */}
      <section ref={plansRef} id="planes" className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-[#F4F9F2] to-[#EDF5EA]">
        {/* GLSL Animated Noise Gradient Shader Background */}
        <Suspense fallback={null}>
          <ShaderGradientBG
            color1={[0.96, 0.98, 0.95]}
            color2={[0.93, 0.96, 0.92]}
            color3={[0.85, 0.93, 0.84]}
            opacity={0.3}
            speed={0.5}
          />
        </Suspense>
        <div className="max-w-7xl mx-auto relative z-10">
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

      {/* ═══ TRANSITION BRIDGE: Plans → Logos ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDF5EA] to-white" />
        <svg className="absolute bottom-0 left-0 w-full h-10" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="none">
          <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,25 1440,20 L1440,40 L0,40 Z" fill="white" />
        </svg>
      </div>

      {/* ═══ LOGOS INSTITUCIONALES — CARRUSEL INTERACTIVO ═══ */}
      <section className="py-16 px-6 bg-white border-y border-[#A8C5A0]/10" data-reveal="fade-up">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-[#2D3B2D]/50 mb-8 uppercase tracking-wider font-medium">
            Alineados con las regulaciones de
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20">
            <a href="https://www.salud.gov.pr/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110 cursor-pointer">
              <img
                src="/manus-storage/logo-depto-salud_962431fe.png"
                alt="Departamento de Salud de Puerto Rico"
                className="h-20 md:h-24 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="text-xs text-[#2D3B2D]/50 font-medium group-hover:text-[#43A047] transition-colors duration-300">Depto. de Salud de PR</span>
            </a>
            <a href="https://www.trabajo.pr.gov/" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 transition-all duration-500 hover:scale-110 cursor-pointer">
              <img
                src="/manus-storage/logo-depto-trabajo_d62964d2.png"
                alt="Departamento del Trabajo y Recursos Humanos"
                className="h-20 md:h-24 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <span className="text-xs text-[#2D3B2D]/50 font-medium group-hover:text-[#43A047] transition-colors duration-300">Depto. del Trabajo y RRHH</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ TRANSITION BRIDGE: Logos → FAQ ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F4F9F2]" />
        <svg className="absolute bottom-0 left-0 w-full h-10" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="none">
          <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#F4F9F2" />
        </svg>
      </div>

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
                className="faq-item bg-white rounded-2xl border border-[#A8C5A0]/20 hover:border-[#6BAF8D]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#6BAF8D]/10 overflow-hidden"
                style={{ opacity: 0, transform: 'translateY(20px)' }}
                ref={(el) => {
                  if (el && !el.dataset.revealed) {
                    el.dataset.revealed = 'true';
                    gsap.to(el, {
                      scrollTrigger: { trigger: el, start: 'top 90%' },
                      opacity: 1,
                      y: 0,
                      duration: 0.6,
                      delay: i * 0.1,
                      ease: 'power3.out',
                    });
                  }
                }}
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
                      gsap.to(content, { maxHeight: 0, opacity: 0, paddingTop: 0, duration: 0.4, ease: 'power3.inOut' });
                      gsap.to(icon, { rotation: 0, scale: 1, duration: 0.3, ease: 'back.out(2)' });
                      item.classList.remove('ring-2', 'ring-[#6BAF8D]/20');
                    } else {
                      // Close all others first with smooth collapse
                      document.querySelectorAll('.faq-item .faq-content').forEach((el) => {
                        if (el !== content) {
                          gsap.to(el, { maxHeight: 0, opacity: 0, paddingTop: 0, duration: 0.35, ease: 'power3.inOut' });
                        }
                      });
                      document.querySelectorAll('.faq-item .faq-icon').forEach((el) => {
                        if (el !== icon) {
                          gsap.to(el, { rotation: 0, scale: 1, duration: 0.3, ease: 'back.out(2)' });
                        }
                      });
                      document.querySelectorAll('.faq-item').forEach((el) => {
                        if (el !== item) el.classList.remove('ring-2', 'ring-[#6BAF8D]/20');
                      });
                      document.querySelectorAll('.faq-item button').forEach((el) => {
                        if (el !== btn) el.setAttribute('aria-expanded', 'false');
                      });
                      btn.setAttribute('aria-expanded', 'true');
                      item.classList.add('ring-2', 'ring-[#6BAF8D]/20');
                      // Use scrollHeight for dynamic content height
                      const targetHeight = content.scrollHeight || 500;
                      gsap.to(content, { maxHeight: targetHeight, opacity: 1, duration: 0.5, ease: 'power2.out' });
                      gsap.to(icon, { rotation: 135, scale: 1.1, duration: 0.4, ease: 'back.out(2)' });
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

      {/* ═══ TRANSITION BRIDGE: FAQ → Map ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F9F2] to-white" />
        <svg className="absolute bottom-0 left-0 w-full h-10" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="none">
          <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,25 1440,20 L1440,40 L0,40 Z" fill="white" />
        </svg>
      </div>

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

      {/* ═══ TRANSITION BRIDGE: Map → Contact ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#F4F9F2]" />
        <svg className="absolute bottom-0 left-0 w-full h-10" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="none">
          <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" fill="#F4F9F2" />
        </svg>
      </div>

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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  onBlur={() => handleFieldBlur("name")}
                  className={`w-full px-5 py-4 pr-12 rounded-xl bg-white border text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none transition-all duration-300 glow-field ${
                    formErrors.name && formTouched.name
                      ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)]"
                      : formTouched.name && !formErrors.name
                      ? "border-[#66BB6A] focus:border-[#66BB6A] focus:shadow-[0_0_20px_rgba(102,187,106,0.4)]"
                      : "border-[#A8C5A0]/30 focus:border-[#6BAF8D] focus:shadow-[0_0_20px_rgba(107,175,141,0.4)]"
                  }`}
                />
                {formTouched.name && !formErrors.name && formData.name && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#66BB6A] animate-[scaleIn_0.3s_ease-out]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
                {formErrors.name && formTouched.name && (
                  <p className="mt-1 text-xs text-red-500 animate-[fadeIn_0.2s_ease-out]">{formErrors.name}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  className={`w-full px-5 py-4 pr-12 rounded-xl bg-white border text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none transition-all duration-300 glow-field ${
                    formErrors.email && formTouched.email
                      ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)]"
                      : formTouched.email && !formErrors.email
                      ? "border-[#66BB6A] focus:border-[#66BB6A] focus:shadow-[0_0_20px_rgba(102,187,106,0.4)]"
                      : "border-[#A8C5A0]/30 focus:border-[#6BAF8D] focus:shadow-[0_0_20px_rgba(107,175,141,0.4)]"
                  }`}
                />
                {formTouched.email && !formErrors.email && formData.email && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#66BB6A] animate-[scaleIn_0.3s_ease-out]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  </span>
                )}
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
            <div className="relative">
              <textarea
                placeholder="¿Cómo podemos ayudarte?"
                value={formData.message}
                onChange={(e) => handleFieldChange("message", e.target.value)}
                onBlur={() => handleFieldBlur("message")}
                rows={5}
                className={`w-full px-5 py-4 pr-12 rounded-xl bg-white border text-[#2D3B2D] placeholder-[#2D3B2D]/40 focus:outline-none transition-all duration-300 resize-none glow-field ${
                  formErrors.message && formTouched.message
                    ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)]"
                    : formTouched.message && !formErrors.message
                    ? "border-[#66BB6A] focus:border-[#66BB6A] focus:shadow-[0_0_20px_rgba(102,187,106,0.4)]"
                    : "border-[#A8C5A0]/30 focus:border-[#6BAF8D] focus:shadow-[0_0_20px_rgba(107,175,141,0.4)]"
                }`}
              />
              {formTouched.message && !formErrors.message && formData.message && (
                <span className="absolute right-4 top-6 text-[#66BB6A] animate-[scaleIn_0.3s_ease-out]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </span>
              )}
              {formErrors.message && formTouched.message && (
                <p className="mt-1 text-xs text-red-500 animate-[fadeIn_0.2s_ease-out]">{formErrors.message}</p>
              )}
            </div>
            {formError && (
              <p className="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 animate-[fadeIn_0.3s_ease-out]">
                {formError}
              </p>
            )}
            <MagneticButton strength={0.15} className="w-full">
              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#66BB6A] to-[#43A047] text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(67,160,71,0.5)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.95] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group/btn"
              >
                {contactMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </MagneticButton>
          </form>
          )}
        </div>
      </section>

      {/* ═══ TRANSITION BRIDGE: Contact → Footer ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F9F2] to-[#2D3B2D]" />
        <svg className="absolute bottom-0 left-0 w-full h-10" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="none">
          <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,25 1440,20 L1440,40 L0,40 Z" fill="#2D3B2D" />
        </svg>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 px-6 border-t-0 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Logo + Brand */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/manus-storage/saludable-logo_630e22f3.png" alt="Empresa Saludable" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-bold text-[#1B3B1B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Empresa <span className="text-[#2E7D32]">Saludable</span>
            </span>
          </div>

          {/* Tagline — centered */}
          <p className="text-[#4a6b4a] text-sm mb-8 text-center w-full">
            Transformando el bienestar corporativo en Puerto Rico, un pilar a la vez.
          </p>

          {/* Nav links */}
          <div className="flex items-center justify-center flex-wrap gap-6 md:gap-8 mb-8 text-sm text-[#3a5a3a]">
            <a href="#pilares" className="hover:text-[#2E7D32] transition-colors duration-300">Pilares</a>
            <a href="#farmacias" className="hover:text-[#2E7D32] transition-colors duration-300">Farmacias</a>
            <a href="#cumplimiento" className="hover:text-[#2E7D32] transition-colors duration-300">Cumplimiento</a>
            <a href="#planes" className="hover:text-[#2E7D32] transition-colors duration-300">Planes</a>
            <a href="#contacto" className="hover:text-[#2E7D32] transition-colors duration-300">Contacto</a>
          </div>

          {/* Contact */}
          <a href="mailto:hola@empresasaludable.org" className="inline-flex items-center gap-2 text-[#2E7D32] hover:text-[#1B5E20] transition-colors duration-300 text-sm mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            hola@empresasaludable.org
          </a>

          {/* Divider */}
          <div className="w-24 h-px bg-[#2E7D32]/20 mx-auto mb-6" />

          {/* Copyright */}
          <p className="text-[#6b8b6b] text-xs text-center">
            © {new Date().getFullYear()} Empresa Saludable. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
    </>
  );
}
