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
import { BLOG_ARTICLES } from "./blogArticles";
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
    image: "/manus-storage/embajador-nutricionista-v2_6c218682.jpg",
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
    image: "/manus-storage/embajador-doctor-v2_3685bcd7.jpg",
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
    image: "/manus-storage/embajador-valeria-v2_38fbd6d7.jpg",
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
    image: "/manus-storage/embajador-carlos-v2_528c396b.jpg",
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
    icon: "mental",
    color: "#7C6DC8",
    description: "Programas integrales de bienestar emocional que incluyen manejo del estrés laboral, apoyo psicológico profesional, mindfulness corporativo y prevención del burnout. Cada programa se adapta a la cultura organizacional de tu empresa.",
    stats: ["85% reducción en ausentismo por estrés", "Talleres semanales con psicólogos certificados", "Línea de apoyo emocional 24/7", "Evaluaciones de clima laboral trimestrales"],
  },
  {
    id: "fisica",
    title: "Salud Física",
    icon: "fisica",
    color: "#E07B4C",
    description: "Actividad física estructurada, ergonomía activa y prevención de enfermedades crónicas. Nuestros programas incluyen clases grupales, evaluaciones físicas periódicas y planes de ejercicio adaptados al entorno laboral.",
    stats: ["112+ Farmacias de Comunidad con servicios de salud", "Clases grupales 3x por semana", "Evaluaciones físicas semestrales", "Programas de ergonomía en oficina"],
  },
  {
    id: "nutricional",
    title: "Salud Nutricional",
    icon: "nutricional",
    color: "#4CAF50",
    description: "Nutrición basada en evidencia científica con enfoque tropical puertorriqueño. Planes alimentarios personalizados, talleres de cocina saludable, evaluaciones metabólicas y asesoría para comedores corporativos.",
    stats: ["Planes nutricionales individualizados", "Talleres de cocina saludable mensual", "Evaluaciones metabólicas completas", "Menús corporativos balanceados"],
  },
  {
    id: "financiera",
    title: "Salud Financiera",
    icon: "financiera",
    color: "#2196F3",
    description: "Educación financiera práctica, planificación de retiro, gestión de beneficios y herramientas para la estabilidad económica de cada empleado. Reducimos el estrés financiero que impacta la productividad.",
    stats: ["ROI 3:1 comprobado en productividad", "Asesoría financiera personalizada", "Planes de ahorro y retiro", "Talleres de presupuesto familiar"],
  },
  {
    id: "corporativa",
    title: "Salud Corporativa",
    icon: "corporativa",
    color: "#FF9800",
    description: "Cultura organizacional saludable, cumplimiento regulatorio con el Depto. de Salud y Depto. del Trabajo de PR, y programas de bienestar empresarial que mejoran retención y productividad.",
    stats: ["Cumplimiento Depto. de Salud de PR", "Cumplimiento Depto. del Trabajo de PR", "Certificación Empresa Saludable", "Clima laboral óptimo medible"],
  },
];

const STATS = [
  { value: 112, suffix: "+", label: "Farmacias de Comunidad", icon: "farmacias" },
  { value: 70, suffix: "", label: "Municipios Cubiertos", icon: "municipios" },
  { value: 98, suffix: "%", label: "Satisfacción", icon: "satisfaccion" },
  { value: 12, suffix: "K+", label: "Beneficiarios", icon: "beneficiarios" },
];

const COMPLIANCE_STEPS = [
  {
    step: 1,
    title: "Evaluación Inicial",
    desc: "Diagnóstico completo del estado de salud organizacional, identificación de riesgos, análisis de clima laboral y evaluación de necesidades específicas de cada departamento.",
    icon: "search",
    deliverable: "Informe de diagnóstico + plan de acción",
  },
  {
    step: 2,
    title: "Plan Estratégico",
    desc: "Diseño personalizado de intervenciones basadas en evidencia científica, establecimiento de KPIs medibles y cronograma de implementación con hitos claros.",
    icon: "clipboard",
    deliverable: "Documento estratégico + cronograma",
  },
  {
    step: 3,
    title: "Implementación",
    desc: "Ejecución coordinada con Farmacias de Comunidad, proveedores certificados y equipo interno. Capacitación del personal y lanzamiento de programas piloto.",
    icon: "cog",
    deliverable: "Programas activos + capacitaciones",
  },
  {
    step: 4,
    title: "Monitoreo Continuo",
    desc: "Seguimiento en tiempo real de métricas de bienestar, ajustes basados en datos, reportes de cumplimiento regulatorio del Depto. de Salud y Depto. del Trabajo de PR, y alertas proactivas.",
    icon: "chart",
    deliverable: "Dashboard en vivo + reportes mensuales",
  },
  {
    step: 5,
    title: "Certificación",
    desc: "Validación independiente de resultados, auditoría de cumplimiento, obtención de certificaciones de bienestar corporativo y reconocimiento público.",
    icon: "badge",
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
    category: "Bienestar" as const,
    metric: "+35% productividad del equipo",
    caseStudy: {
      company: "Corporación del Caribe",
      industry: "Servicios Financieros",
      employees: 320,
      duration: "12 meses",
      challenge: "Alto nivel de estrés laboral, rotación de personal del 28% anual y baja moral del equipo de operaciones.",
      solution: "Programa integral de bienestar mental: talleres semanales de mindfulness, acceso a psicólogos corporativos, línea de apoyo 24/7 y capacitación a líderes en inteligencia emocional.",
      results: [
        { label: "Productividad del equipo", before: "62%", after: "97%", change: "+35%" },
        { label: "Rotación de personal", before: "28%", after: "11%", change: "-17pp" },
        { label: "Satisfacción laboral", before: "54/100", after: "87/100", change: "+33pts" },
        { label: "Días de licencia por estrés", before: "892/año", after: "234/año", change: "-74%" },
      ],
      roi: "$4.20 por cada $1 invertido",
    },
  },
  {
    quote: "La red de farmacias me permite acceder a mis medicamentos y consultas nutricionales cerca de casa. Es un servicio que realmente funciona.",
    name: "José Luis Rivera",
    role: "Beneficiario, Plan Profesional",
    municipality: "Carolina",
    category: "Farmacias" as const,
    metric: "92% adherencia a tratamientos",
    caseStudy: {
      company: "Red de Farmacias de Comunidad",
      industry: "Salud y Farmacia",
      employees: 1200,
      duration: "8 meses",
      challenge: "Baja adherencia a tratamientos crónicos (hipertensión, diabetes), pacientes no completaban sus recetas y faltaban a seguimientos nutricionales.",
      solution: "Integración de farmacias de comunidad con recordatorios automatizados, consultas nutricionales en farmacia, seguimiento personalizado y programa de recompensas por adherencia.",
      results: [
        { label: "Adherencia a tratamientos", before: "58%", after: "92%", change: "+34pp" },
        { label: "Consultas nutricionales/mes", before: "120", after: "480", change: "+300%" },
        { label: "Hospitalizaciones evitadas", before: "N/A", after: "67/año", change: "Nuevo" },
        { label: "Satisfacción del paciente", before: "71/100", after: "94/100", change: "+23pts" },
      ],
      roi: "$6.80 por cada $1 invertido (ahorro en hospitalizaciones)",
    },
  },
  {
    quote: "El programa de salud financiera me ayudó a planificar mi retiro con confianza. Nunca pensé que un programa de bienestar incluyera eso.",
    name: "Ana Sofía Méndez",
    role: "Empleada, Sector Farmacéutico",
    municipality: "Caguas",
    category: "Finanzas" as const,
    metric: "-60% estrés financiero reportado",
    caseStudy: {
      company: "Grupo Farmacéutico del Este",
      industry: "Farmacéutico",
      employees: 185,
      duration: "10 meses",
      challenge: "78% de empleados reportaban estrés financiero alto, bajo uso del plan de retiro (solo 23% participaba) y solicitudes frecuentes de adelantos de nómina.",
      solution: "Programa de educación financiera: talleres de presupuesto familiar, asesoría personalizada de retiro, herramientas digitales de ahorro y negociación de mejores tasas con cooperativas.",
      results: [
        { label: "Estrés financiero reportado", before: "78%", after: "31%", change: "-60%" },
        { label: "Participación en plan de retiro", before: "23%", after: "71%", change: "+48pp" },
        { label: "Adelantos de nómina/mes", before: "34", after: "8", change: "-76%" },
        { label: "Ahorro promedio mensual", before: "$45", after: "$280", change: "+522%" },
      ],
      roi: "$3.50 por cada $1 invertido",
    },
  },
  {
    quote: "Como farmacéutica aliada, veo el impacto directo en mis pacientes. Llegan más informados y comprometidos con su salud.",
    name: "Dra. Carmen Luisa Vega",
    role: "Farmacéutica, Red Aliada",
    municipality: "Carolina",
    category: "Farmacias" as const,
    metric: "+48% consultas preventivas",
    caseStudy: {
      company: "Farmacia Isla Verde & Red Aliada",
      industry: "Farmacia de Comunidad",
      employees: 45,
      duration: "6 meses",
      challenge: "Pacientes llegaban solo por medicamentos sin aprovechar servicios preventivos. Baja demanda de consultas clínicas en farmacia y desconocimiento de servicios disponibles.",
      solution: "Programa de prevención integrado: cernimientos de salud gratuitos, consultas farmacéuticas ampliadas, educación al paciente sobre manejo de condiciones crónicas y referidos cruzados con especialistas.",
      results: [
        { label: "Consultas preventivas/mes", before: "85", after: "126", change: "+48%" },
        { label: "Cernimientos realizados", before: "40/mes", after: "165/mes", change: "+312%" },
        { label: "Referidos a especialistas", before: "12/mes", after: "38/mes", change: "+217%" },
        { label: "Condiciones detectadas temprano", before: "N/A", after: "23/trimestre", change: "Nuevo" },
      ],
      roi: "$5.20 por cada $1 invertido (prevención vs. tratamiento)",
    },
  },
  {
    quote: "El cumplimiento regulatorio ya no es una carga. El equipo nos guía paso a paso y nos mantiene al día con cada requisito.",
    name: "Roberto Colón Torres",
    role: "CEO, Grupo Salud Integral",
    municipality: "Ponce",
    category: "Cumplimiento" as const,
    metric: "100% cumplimiento regulatorio",
    caseStudy: {
      company: "Grupo Salud Integral",
      industry: "Servicios de Salud",
      employees: 520,
      duration: "14 meses",
      challenge: "Múltiples hallazgos en auditorías de OSHA y Depto. de Salud, multas acumuladas de $45,000 y riesgo de cierre parcial de operaciones.",
      solution: "Auditoría integral de cumplimiento, plan correctivo con cronograma, capacitación continua al personal, sistema de monitoreo digital y acompañamiento en inspecciones regulatorias.",
      results: [
        { label: "Cumplimiento regulatorio", before: "64%", after: "100%", change: "+36pp" },
        { label: "Hallazgos en auditorías", before: "23", after: "0", change: "-100%" },
        { label: "Multas regulatorias", before: "$45,000/año", after: "$0", change: "-100%" },
        { label: "Tiempo de respuesta a requisitos", before: "45 días", after: "5 días", change: "-89%" },
      ],
      roi: "$8.90 por cada $1 invertido (multas evitadas + eficiencia)",
    },
  },
  {
    quote: "Implementamos el programa hace 6 meses y ya vemos resultados: menos ausentismo, mejor clima laboral y empleados más comprometidos con su salud.",
    name: "Lcda. Patricia Vázquez",
    role: "Gerente General, Distribuidora Nacional",
    municipality: "Bayamón",
    category: "Bienestar" as const,
    metric: "-42% ausentismo laboral",
    caseStudy: {
      company: "Distribuidora Nacional",
      industry: "Logística y Distribución",
      employees: 280,
      duration: "6 meses",
      challenge: "Ausentismo crónico del 18%, alta incidencia de lesiones musculoesqueléticas en almacén y baja participación en actividades de bienestar previas.",
      solution: "Programa de bienestar físico adaptado: ejercicios de calentamiento pre-turno, ergonomía en almacén, nutrición para trabajo físico, incentivos por asistencia y retos de salud grupales.",
      results: [
        { label: "Ausentismo laboral", before: "18%", after: "10.4%", change: "-42%" },
        { label: "Lesiones musculoesqueléticas", before: "34/año", after: "9/año", change: "-74%" },
        { label: "Participación en bienestar", before: "12%", after: "78%", change: "+66pp" },
        { label: "Clima laboral (encuesta)", before: "56/100", after: "82/100", change: "+26pts" },
      ],
      roi: "$3.80 por cada $1 invertido",
    },
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
  const [apptTouched, setApptTouched] = useState<Record<string, boolean>>({});

  // Real-time validation helpers
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => !phone || /^[\d\s\-().+]{7,15}$/.test(phone);
  const getFieldError = (field: string) => {
    if (!apptTouched[field]) return '';
    switch (field) {
      case 'name': return apptForm.name.length < 2 ? 'Nombre requerido (mínimo 2 caracteres)' : '';
      case 'email': return !apptForm.email ? 'Email requerido' : !validateEmail(apptForm.email) ? 'Formato de email inválido' : '';
      case 'phone': return !validatePhone(apptForm.phone) ? 'Formato: 787-000-0000' : '';
      default: return '';
    }
  };
  const isApptFormValid = apptForm.name.length >= 2 && validateEmail(apptForm.email) && validatePhone(apptForm.phone);

  // Pillar tap-to-expand state (mobile)
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  // Recursos filter state
  const [resourceFilter, setResourceFilter] = useState('Todos');

  // Solicitar Demo form state
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoForm, setDemoForm] = useState({ companyName: '', email: '', phone: '', employeeCount: '' });
  const [demoTouched, setDemoTouched] = useState<Record<string, boolean>>({});
  const [demoSuccess, setDemoSuccess] = useState(false);

  // Blog article modal state
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);


  // Preloader state
  const [preloaderDone, setPreloaderDone] = useState(false);
  const preloaderRef = useRef<HTMLDivElement>(null);

  // Scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll-proximity lazy loading: mount heavy components only when near viewport
  const [showParticles3D, setShowParticles3D] = useState(false);
  const [showTestimonialVideo, setShowTestimonialVideo] = useState(false);
  const testimonialSectionRef = useRef<HTMLElement>(null);
  // beneficiaryScrollRef removed - using static grid instead of marquee

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
      setFormError("Error al enviar. Intente de nuevo o escriba a hola@empresasaludable.org");
    },
  });

  // ─── Demo Request Mutation ───
  const demoMutation = trpc.demo.request.useMutation({
    onSuccess: () => {
      setDemoSuccess(true);
    },
    onError: (err) => {
      console.error("Demo request error:", err);
    },
  });

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoTouched({ companyName: true, email: true, phone: true, employeeCount: true });
    // Basic validation
    if (!demoForm.companyName || !demoForm.email || !demoForm.phone || !demoForm.employeeCount) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demoForm.email)) return;
    demoMutation.mutate(demoForm);
  };

  // Generate Case Study PDF
  const generateCaseStudyPDF = (testimonial: typeof TESTIMONIALS[number]) => {
    const cs = testimonial.caseStudy;
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                         EMPRESA SALUDABLE
                    CASO DE ESTUDIO — ${cs.company.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


📋 INFORMACIÓN GENERAL
─────────────────────────────────────────────────────────────────────────────────
  Empresa:          ${cs.company}
  Industria:        ${cs.industry}
  Empleados:        ${cs.employees.toLocaleString()}
  Duración:         ${cs.duration}
  Categoría:        ${testimonial.category}
  Ubicación:        ${testimonial.municipality}, Puerto Rico


⚠️  DESAFÍO
─────────────────────────────────────────────────────────────────────────────────
  ${cs.challenge}


✅ SOLUCIÓN IMPLEMENTADA
─────────────────────────────────────────────────────────────────────────────────
  ${cs.solution}


📊 RESULTADOS MEDIBLES
─────────────────────────────────────────────────────────────────────────────────
${cs.results.map(r => `  • ${r.label.padEnd(35)} Antes: ${r.before.padEnd(12)} Después: ${r.after.padEnd(12)} Cambio: ${r.change}`).join('\n')}


💰 RETORNO DE INVERSIÓN (ROI)
─────────────────────────────────────────────────────────────────────────────────
  ${cs.roi}


💬 TESTIMONIO
─────────────────────────────────────────────────────────────────────────────────
  "${testimonial.quote}"

  — ${testimonial.name}
    ${testimonial.role}


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Empresa Saludable | Bienestar Corporativo PR
  www.empresasaludable.com | info@empresasaludable.com
  Documento generado: ${new Date().toLocaleDateString('es-PR', { year: 'numeric', month: 'long', day: 'numeric' })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Caso_de_Estudio_${cs.company.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

      // ═══ WOW SCROLL REVEAL ON ALL SECTION TITLES ═══
      // Split .wow-title text into word spans and animate them on scroll
      const wowTitles = containerRef.current?.querySelectorAll('.wow-title') || [];
      wowTitles.forEach((title) => {
        const h2 = title as HTMLElement;
        const section = h2.closest('section') || h2.parentElement?.parentElement;
        if (!section) return;

        // Split text into word spans (preserve .emphasis spans as whole words)
        const childNodes = Array.from(h2.childNodes);
        h2.innerHTML = '';
        childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const words = (node.textContent || '').split(' ').filter(w => w);
            words.forEach((word) => {
              const wordSpan = document.createElement('span');
              wordSpan.className = 'word';
              wordSpan.textContent = word;
              h2.appendChild(wordSpan);
            });
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word ' + el.className;
            wordSpan.textContent = el.textContent || '';
            h2.appendChild(wordSpan);
          }
        });

        // Animate words on scroll — slide up with fade
        // Using gsap.from so the FINAL state is always visible (natural CSS state)
        // This prevents titles from staying invisible if ScrollTrigger fails
        const words = h2.querySelectorAll('.word');
        if (words.length > 0) {
          gsap.from(words, {
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            y: 35,
            opacity: 0,
            rotateX: -8,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
            immediateRender: false,
          });
        }
      });

      // Glass header containers — fade up with scale
      gsap.utils.toArray<HTMLElement>('.glass-header').forEach((glass) => {
        const section = glass.closest('section') || glass.parentElement;
        gsap.from(glass, {
          scrollTrigger: { trigger: section || glass, start: "top 85%" },
          y: 30,
          opacity: 0,
          scale: 0.97,
          duration: 0.8,
          ease: "power2.out",
          immediateRender: false,
        });
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
        const celebH2 = celebsRef.current.querySelector("h2");
        if (celebH2) {
          gsap.from(celebH2, {
            scrollTrigger: { trigger: celebsRef.current, start: "top 82%" },
            x: -100,
            opacity: 0,
            clipPath: 'inset(0 100% 0 0)',
            duration: 1.2,
            ease: "power3.out",
            clearProps: 'clipPath',
            immediateRender: false,
          });
        }

        const celebPs = celebsRef.current.querySelectorAll("p");
        if (celebPs.length > 0) {
          gsap.from(celebPs, {
            scrollTrigger: { trigger: celebsRef.current, start: "top 82%" },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out",
            immediateRender: false,
          });
        }

        // Specialist cards — staggered scroll-triggered entrance animation
        const celebCards = document.querySelectorAll(".celeb-card");
        if (celebCards.length > 0) {
          gsap.set(celebCards, { opacity: 0, y: 80, scale: 0.9, rotateY: 15, rotateX: 5 });
          ScrollTrigger.create({
            trigger: celebsRef.current,
            start: "top 70%",
            onEnter: () => {
              gsap.to(celebCards, {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateY: 0,
                rotateX: 0,
                duration: 1,
                stagger: {
                  each: 0.2,
                  from: "start",
                },
                ease: "power3.out",
                overwrite: true,
              });
            },
            once: true,
          });
        }

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
        const pillarNodes = pillarsRef.current?.querySelectorAll(".pillar-node");
        if (pillarNodes && pillarNodes.length > 0) {
          gsap.from(pillarNodes, {
            scrollTrigger: { trigger: pillarsRef.current, start: "top 75%" },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.7)",
            immediateRender: false,
          });
        }

        // Scroll-driven parallax — elements at DIFFERENT speeds for depth
        // Background orbs move slowly (far away)
        const bgOrbs = pillarsRef.current.querySelectorAll(".absolute.rounded-full");
        if (bgOrbs.length > 0) {
          gsap.to(bgOrbs, {
            scrollTrigger: {
              trigger: pillarsRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
            y: -60,
            ease: "none",
          });
        }

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
        const statItems = statsRef.current.querySelectorAll(".stat-item");
        if (statItems.length > 0) {
          gsap.from(statItems, {
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
      }

      // Resultados Medibles — animated bars and circles on scroll
      const resultadosBars = document.querySelectorAll(".resultados-bar");
      resultadosBars.forEach((bar) => {
        const targetWidth = (bar as HTMLElement).dataset.targetWidth || '50%';
        gsap.to(bar, {
          scrollTrigger: { trigger: bar, start: "top 85%" },
          width: targetWidth,
          duration: 1.4,
          ease: "power2.out",
        });
      });

      const resultadosCircles = document.querySelectorAll(".resultados-circle");
      resultadosCircles.forEach((circle) => {
        const targetOffset = (circle as SVGElement).dataset.targetOffset || '66';
        gsap.to(circle, {
          scrollTrigger: { trigger: circle, start: "top 85%" },
          strokeDashoffset: targetOffset,
          duration: 1.8,
          ease: "power2.out",
        });
      });

      const resultadosCards = document.querySelectorAll(".resultados-card");
      if (resultadosCards.length > 0) {
        gsap.from(resultadosCards, {
          scrollTrigger: { trigger: resultadosCards[0], start: "top 80%" },
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power2.out",
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
        const planCardEls = plansRef.current.querySelectorAll(".plan-card");
        if (planCardEls.length > 0) {
          gsap.from(planCardEls, {
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
        }

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
        const contactFormEl = contactRef.current.querySelector(".contact-form");
        if (contactFormEl) {
          gsap.from(contactFormEl, {
            scrollTrigger: { trigger: contactRef.current, start: "top 80%" },
            y: 60,
            opacity: 0,
            scale: 0.95,
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
          });
        }

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
        const mapContainerEl = mapRef.current.querySelector(".map-container");
        if (mapContainerEl) {
          gsap.from(mapContainerEl, {
            scrollTrigger: { trigger: mapRef.current, start: "top 80%" },
            y: 80,
            opacity: 0,
            scale: 0.92,
            duration: 1.2,
            ease: "power3.out",
            immediateRender: false,
          });
        }
      }

      // ═══ PARALLAX SCROLLING on interior section background images ═══
      gsap.utils.toArray<HTMLImageElement>('.section-parallax-img').forEach((img) => {
        const section = img.closest('section');
        if (section) {
          gsap.to(img, {
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
            y: '-25%',
            ease: 'none',
          });
        }
      });

      // Beneficiarios cards — now using static grid (no marquee needed)
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Filter change is handled reactively by the grid rendering filtered testimonials

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

            // Count-up with slower dramatic easing for more notable effect
            gsap.to(obj, {
              val: value,
              duration: 4,
              ease: "power3.out",
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

      {/* Music Player + Únete Ahora CTA — fixed bottom-left together */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <MusicPlayer />
        <a
          href="#planes"
          className="hero-cta unete-btn inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#43A047] to-[#66BB6A] text-white font-bold text-sm rounded-full shadow-[0_8px_32px_rgba(67,160,71,0.4)] relative overflow-hidden group"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">Únete Ahora</span>
          <svg className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

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
        {/* Hero image — Puerto Rico Wellness Center with Ken Burns animation */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/manus-storage/hero-corporate-v7_25bdf6e7.jpg"
            alt="Empresa Saludable - Profesionales boricuas fit y saludables en centro de bienestar premium"
            className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
            style={{ filter: 'brightness(1.2) saturate(1.2) contrast(1.05)' }}
          />
        </div>
        {/* Dark overlay for text readability — people still visible through it */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />

        {/* Interactive CTA Button */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <a
            href="#planes"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold text-lg tracking-wide overflow-hidden transition-all duration-500 hover:bg-white/25 hover:border-white/50 hover:scale-105 hover:shadow-[0_0_40px_rgba(107,175,141,0.3)] active:scale-95"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {/* Shimmer sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="relative z-10">Conoce Nuestros Servicios</span>
            <svg className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
          <div className="glass-header max-w-3xl mx-auto mb-16 text-center wow-title-shimmer">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#6BAF8D]/10 text-[#2E7D32] text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#6BAF8D]/20">Equipo de Excelencia</span>
            <h2
              className="wow-title text-3xl md:text-5xl font-bold mb-4 text-[#2D3B2D]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Inspirados por los <span className="emphasis">Mejores</span>
            </h2>
            <p className="text-[#2D3B2D]/60 max-w-2xl mb-3">
              Profesionales puertorriqueños de excelencia que lideran cada dimensión del bienestar en Empresa Saludable.
            </p>
            <p className="text-[#2D3B2D]/50 max-w-3xl text-sm leading-relaxed">
              Cada embajador aporta experiencia clínica, académica y corporativa real. Desde la nutrición basada en evidencia hasta la medicina preventiva, el fitness funcional y la consultoría en cultura organizacional — nuestro equipo diseña programas que transforman empresas en toda la isla.
            </p>
          </div>

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
                {/* Photo — click to open bio modal + hover biography overlay */}
                <div
                  className="w-full md:w-[220px] h-[320px] md:h-auto flex-shrink-0 overflow-hidden relative cursor-pointer"
                  onClick={() => setSelectedSpecialist(amb)}
                >
                  <img
                    src={amb.image}
                    alt={amb.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 group-hover:brightness-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 md:bg-gradient-to-b md:from-transparent md:to-[#2D3B2D]/20" />
                  {/* Hover biography overlay — slides up from bottom */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-none">
                    <div className="bg-gradient-to-t from-[#1B5E20]/95 via-[#2E7D32]/85 to-transparent p-4 pt-10">
                      <p className="text-white/90 text-[11px] leading-relaxed line-clamp-4">
                        {amb.specialty}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="inline-block w-4 h-[1px] bg-[#A5D6A7]/70" />
                        <span className="text-[#A5D6A7] text-[10px] font-medium uppercase tracking-wider">Ver Perfil</span>
                      </div>
                    </div>
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
                      onClick={() => { setAppointmentFor(amb.name.split(',')[0]); setApptSuccess(false); setApptForm({ name: '', email: '', phone: '', date: '', message: '' }); setApptTouched({}); }}
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
              <img src={selectedSpecialist.image} alt={selectedSpecialist.name} className="w-full h-full object-cover object-top" />
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
                      <svg className="w-3 h-3 inline-block mr-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>{cert}
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
                  setTimeout(() => { setAppointmentFor(name); setApptSuccess(false); setApptForm({ name: '', email: '', phone: '', date: '', message: '' }); setApptTouched({}); }, 300);
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
                    <div className="relative">
                      <input
                        required
                        value={apptForm.name}
                        onChange={(e) => setApptForm(p => ({ ...p, name: e.target.value }))}
                        onBlur={() => setApptTouched(p => ({ ...p, name: true }))}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-[#F9FBF9] text-sm focus:ring-2 outline-none transition-all pr-10 ${getFieldError('name') ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : apptTouched.name && apptForm.name.length >= 2 ? 'border-green-400 focus:ring-green-200 focus:border-green-400' : 'border-[#A8C5A0]/30 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D]'}`}
                        placeholder="Su nombre"
                      />
                      {apptTouched.name && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {apptForm.name.length >= 2 ? <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> : <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M15 9l-6 6M9 9l6 6"/></svg>}
                        </span>
                      )}
                    </div>
                    {getFieldError('name') && <p className="text-[10px] text-red-500 mt-1 ml-1">{getFieldError('name')}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Email *</label>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        value={apptForm.email}
                        onChange={(e) => setApptForm(p => ({ ...p, email: e.target.value }))}
                        onBlur={() => setApptTouched(p => ({ ...p, email: true }))}
                        className={`w-full px-4 py-2.5 rounded-xl border bg-[#F9FBF9] text-sm focus:ring-2 outline-none transition-all pr-10 ${getFieldError('email') ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : apptTouched.email && validateEmail(apptForm.email) ? 'border-green-400 focus:ring-green-200 focus:border-green-400' : 'border-[#A8C5A0]/30 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D]'}`}
                        placeholder="su@email.com"
                      />
                      {apptTouched.email && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validateEmail(apptForm.email) ? <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> : <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M15 9l-6 6M9 9l6 6"/></svg>}
                        </span>
                      )}
                    </div>
                    {getFieldError('email') && <p className="text-[10px] text-red-500 mt-1 ml-1">{getFieldError('email')}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#2D3B2D]/70 mb-1">Teléfono</label>
                      <div className="relative">
                        <input
                          value={apptForm.phone}
                          onChange={(e) => setApptForm(p => ({ ...p, phone: e.target.value }))}
                          onBlur={() => setApptTouched(p => ({ ...p, phone: true }))}
                          className={`w-full px-4 py-2.5 rounded-xl border bg-[#F9FBF9] text-sm focus:ring-2 outline-none transition-all pr-10 ${getFieldError('phone') ? 'border-red-400 focus:ring-red-200 focus:border-red-400' : apptTouched.phone && apptForm.phone && validatePhone(apptForm.phone) ? 'border-green-400 focus:ring-green-200 focus:border-green-400' : 'border-[#A8C5A0]/30 focus:ring-[#6BAF8D]/30 focus:border-[#6BAF8D]'}`}
                          placeholder="787-000-0000"
                        />
                        {apptTouched.phone && apptForm.phone && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            {validatePhone(apptForm.phone) ? <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> : <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M15 9l-6 6M9 9l6 6"/></svg>}
                          </span>
                        )}
                      </div>
                      {getFieldError('phone') && <p className="text-[10px] text-red-500 mt-1 ml-1">{getFieldError('phone')}</p>}
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
                    disabled={apptSubmitting || !isApptFormValid}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9B6F] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {apptSubmitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                        Procesando...
                      </>
                    ) : 'Solicitar Cita'}
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
      <section ref={pillarsRef} id="pilares" data-reveal="fade-up" className="relative overflow-visible" style={{ background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #E8F5E9 100%)' }}>
        {/* Parallax background image — luxury Caribbean wellness */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/manus-storage/section-pilares-v6_9fc64034.jpg"
            alt=""
            className="section-parallax-img absolute inset-0 w-full h-[120%] object-cover opacity-[0.35] scale-110"
            style={{ willChange: 'transform' }}
          />
        </div>
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
          <div className="glass-header max-w-3xl mx-auto mb-8 text-center wow-title-shimmer">
            <h2
              className="wow-title text-3xl md:text-5xl font-bold text-center mb-4 text-[#1B5E20]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Los 5 Pilares del <span className="emphasis">Bienestar</span>
            </h2>
            <p className="text-[#2E7D32]/70 max-w-3xl mx-auto text-lg leading-relaxed">
              Cada pilar apoya al siguiente en un ciclo continuo de bienestar integral — un sistema donde la salud mental fortalece la física, la física potencia la nutrición, y así sucesivamente.
            </p>
          </div>

          {/* Bienestar Integral Context Block */}
          <div id="bienestar-integral-info" data-bienestar-block className="max-w-4xl mx-auto mb-20 p-10 rounded-3xl bg-white/50 backdrop-blur-md border border-[#66BB6A]/30 shadow-xl relative overflow-hidden hover:shadow-2xl hover:shadow-[#43A047]/25 hover:border-[#66BB6A]/60 hover:scale-[1.04] hover:-translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-default group">
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
          <div className="relative w-full max-w-3xl mx-auto aspect-square flex items-center justify-center overflow-visible">
            {/* Rotating dashed circle */}
            <div className="absolute inset-[12%] rounded-full border-2 border-dashed border-[#66BB6A]/30 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-[18%] rounded-full border border-[#81C784]/15" />
            
            {/* Center hub */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="text-center">
                <button
                  onClick={() => {
                    // Scroll to the Bienestar Integral context block above
                    const el = document.getElementById('bienestar-integral-info');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className="pointer-events-auto w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/90 backdrop-blur-xl shadow-2xl flex items-center justify-center border-2 border-[#66BB6A]/30 mx-auto cursor-pointer hover:scale-110 hover:shadow-[0_0_40px_rgba(102,187,106,0.4)] transition-all duration-500"
                  data-cursor-hover
                >
                  <svg className="w-12 h-12 md:w-14 md:h-14 text-[#2E7D32]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9-4.97 0-9-4.03-9-9zM12 3c-4.97 0-9 4.03-9 9 4.97 0 9-4.03 9-9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18"/><path strokeLinecap="round" d="M12 8c-2 2-3 4-3 6"/><path strokeLinecap="round" d="M12 8c2 2 3 4 3 6"/></svg>
                </button>
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
                  className={`pillar-node absolute z-30 ${selectedPillar === pillar.id ? 'pillar-active z-[200]' : ''} group hover:z-[200]`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => setSelectedPillar(selectedPillar === pillar.id ? null : pillar.id)}
                >
                  {/* The node circle */}
                  <div
                    className={`pillar-circle relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 group-hover:scale-110 shadow-xl group-hover:shadow-2xl ${selectedPillar === pillar.id ? 'scale-[1.15] ring-4 ring-white/60 shadow-2xl' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${pillar.color}, ${pillar.color}CC)`,
                      boxShadow: `0 8px 30px ${pillar.color}40`,
                    }}
                    data-cursor-hover
                  >
                    {pillar.icon === 'mental' && <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3 6l-1 2H9l-1-2c-1.5-1.5-3-3.5-3-6a7 7 0 0 1 7-7z"/><path strokeLinecap="round" d="M9 17h6M10 20h4"/></svg>}
                    {pillar.icon === 'fisica' && <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 8h14M3 8h2l1 12h12l1-12h2M8 8v4m8-4v4"/></svg>}
                    {pillar.icon === 'nutricional' && <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c-4-2-8-6-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5-4 9-8 11z"/><path strokeLinecap="round" d="M12 8v6m0 0l-2-2m2 2l2-2"/></svg>}
                    {pillar.icon === 'financiera' && <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-4 3 3 5-5"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 10h4v4"/></svg>}
                    {pillar.icon === 'corporativa' && <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/></svg>}
                  </div>



                  {/* Title label below node */}
                  <p className="text-center mt-2 text-[10px] md:text-xs font-bold text-[#1B5E20] whitespace-nowrap transition-opacity duration-300">
                    {pillar.title}
                  </p>
                </div>
              );
            })}

            {/* Pillar info card — overlays centered on top of the wheel */}
            {selectedPillar && (
              <div key={selectedPillar} className="absolute inset-0 flex items-center justify-center z-[300] pointer-events-none">
              <div className="pointer-events-auto w-[85%] max-w-sm" style={{ animation: 'pillarCardIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards' }}>
              {(() => {
                const pillar = PILLARS.find(p => p.id === selectedPillar);
                if (!pillar) return null;
                return (
                  <div
                    className="bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border"
                    style={{ borderColor: `${pillar.color}40` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${pillar.color}20` }}
                      >
                        {pillar.icon === 'mental' && <svg className="w-5 h-5" style={{color: pillar.color}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 1 7 7c0 2.5-1.5 4.5-3 6l-1 2H9l-1-2c-1.5-1.5-3-3.5-3-6a7 7 0 0 1 7-7z"/><path strokeLinecap="round" d="M9 17h6M10 20h4"/></svg>}
                        {pillar.icon === 'fisica' && <svg className="w-5 h-5" style={{color: pillar.color}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 8h14M3 8h2l1 12h12l1-12h2M8 8v4m8-4v4"/></svg>}
                        {pillar.icon === 'nutricional' && <svg className="w-5 h-5" style={{color: pillar.color}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22c-4-2-8-6-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5-4 9-8 11z"/><path strokeLinecap="round" d="M12 8v6m0 0l-2-2m2 2l2-2"/></svg>}
                        {pillar.icon === 'financiera' && <svg className="w-5 h-5" style={{color: pillar.color}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-4 3 3 5-5"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 10h4v4"/></svg>}
                        {pillar.icon === 'corporativa' && <svg className="w-5 h-5" style={{color: pillar.color}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/></svg>}
                      </div>
                      <h3 className="text-lg font-bold text-[#1B5E20]" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[#2D3B2D]/70 leading-relaxed mb-3">{pillar.description}</p>
                    <div className="space-y-2 pt-3 border-t border-[#66BB6A]/20">
                      {pillar.stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-[#2D3B2D]/70">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: pillar.color }} />
                          <span>{stat}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedPillar(null)}
                      className="mt-4 w-full py-2 text-xs font-semibold text-[#2E7D32] bg-[#6BAF8D]/10 rounded-lg hover:bg-[#6BAF8D]/20 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                );
              })()}
              </div>
              </div>
            )}
          </div>

          {/* Holistic instruction */}
          <p className="text-center text-[#2E7D32]/60 mt-12 text-sm italic max-w-2xl mx-auto">
            Haz click en cada pilar para explorar cómo se integran en un ciclo continuo de bienestar.
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
              <div key={i} className="stat-item text-center group cursor-default">
                <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 flex items-center justify-center">
                  {stat.icon === 'farmacias' && <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M7 12h10"/></svg>}
                  {stat.icon === 'municipios' && <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>}
                  {stat.icon === 'satisfaccion' && <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                  {stat.icon === 'beneficiarios' && <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg transition-colors duration-500 group-hover:text-[#FFD54F]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-white/80 transition-colors duration-500 group-hover:text-white">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESULTADOS MEDIBLES — Animated Impact Metrics ═══ */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        {/* Background image like other sections */}
        <div className="absolute inset-0">
          <img
            src="/manus-storage/section-resultados-bg_49ab120c.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20]/85 via-[#2E7D32]/80 to-[#1B5E20]/90" />
        </div>
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px, 80px 80px' }} />
        </div>

        <div className="container relative z-10">
          {/* Section header */}
          <div data-section-header className="text-center mb-16 md:mb-20">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 border border-white/20 rounded-full mb-6">Impacto Comprobado</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Resultados <span className="text-[#A5D6A7]">Medibles</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Datos reales de empresas que implementaron nuestro programa integral de bienestar corporativo.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Metric 1: Ausentismo */}
            <div className="resultados-card group relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#A5D6A7]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 text-[#A5D6A7]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Reduccion</p>
                  <p className="text-3xl font-bold text-white">-40%</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Ausentismo Laboral</h4>
              <p className="text-white/60 text-sm leading-relaxed">Reduccion promedio en ausentismo no planificado durante los primeros 6 meses del programa.</p>
              {/* Animated bar */}
              <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="resultados-bar h-full rounded-full bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A]" style={{ width: '0%' }} data-target-width="60%" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>Antes</span>
                <span>Despues (-40%)</span>
              </div>
            </div>

            {/* Metric 2: ROI */}
            <div className="resultados-card group relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FFD54F]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 text-[#FFD54F]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Retorno</p>
                  <p className="text-3xl font-bold text-white">3:1</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">ROI Comprobado</h4>
              <p className="text-white/60 text-sm leading-relaxed">Por cada $1 invertido en bienestar corporativo, las empresas recuperan $3 en productividad y reduccion de costos.</p>
              {/* Animated circular progress */}
              <div className="mt-6 flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle className="resultados-circle" cx="50" cy="50" r="42" fill="none" stroke="#FFD54F" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="264" data-target-offset="66" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">75%</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-white/40 mt-3">Empresas que reportan ROI positivo en 12 meses</p>
            </div>

            {/* Metric 3: Satisfaccion */}
            <div className="resultados-card group relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#81C784]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 text-[#81C784]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Satisfaccion</p>
                  <p className="text-3xl font-bold text-white">98%</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Satisfaccion Empleados</h4>
              <p className="text-white/60 text-sm leading-relaxed">Indice de satisfaccion de empleados participantes en programas de bienestar integral.</p>
              {/* Animated bar */}
              <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="resultados-bar h-full rounded-full bg-gradient-to-r from-[#81C784] to-[#43A047]" style={{ width: '0%' }} data-target-width="98%" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>0%</span>
                <span>98%</span>
              </div>
            </div>

            {/* Metric 4: Productividad */}
            <div className="resultados-card group relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#4FC3F7]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 text-[#4FC3F7]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Aumento</p>
                  <p className="text-3xl font-bold text-white">+25%</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Productividad</h4>
              <p className="text-white/60 text-sm leading-relaxed">Incremento medido en productividad laboral tras implementar los 5 pilares de bienestar.</p>
              {/* Animated bar */}
              <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="resultados-bar h-full rounded-full bg-gradient-to-r from-[#4FC3F7] to-[#0288D1]" style={{ width: '0%' }} data-target-width="75%" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>Base</span>
                <span>+25% productividad</span>
              </div>
            </div>

            {/* Metric 5: Retencion */}
            <div className="resultados-card group relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#CE93D8]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 text-[#CE93D8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87"/><path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Mejora</p>
                  <p className="text-3xl font-bold text-white">+35%</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Retencion de Talento</h4>
              <p className="text-white/60 text-sm leading-relaxed">Mejora en retencion de empleados clave gracias a programas de bienestar y cultura organizacional.</p>
              {/* Animated bar */}
              <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="resultados-bar h-full rounded-full bg-gradient-to-r from-[#CE93D8] to-[#AB47BC]" style={{ width: '0%' }} data-target-width="85%" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>Industria PR</span>
                <span>+35% retencion</span>
              </div>
            </div>

            {/* Metric 6: Clima Laboral */}
            <div className="resultados-card group relative p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FFAB91]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 text-[#FFAB91]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/><circle cx="12" cy="12" r="4"/></svg>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider">Indice</p>
                  <p className="text-3xl font-bold text-white">9.2/10</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Clima Laboral</h4>
              <p className="text-white/60 text-sm leading-relaxed">Puntuacion promedio de clima laboral en empresas con programa activo de bienestar integral.</p>
              {/* Animated bar */}
              <div className="mt-6 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="resultados-bar h-full rounded-full bg-gradient-to-r from-[#FFAB91] to-[#FF7043]" style={{ width: '0%' }} data-target-width="92%" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>0</span>
                <span>9.2 / 10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRANSITION BRIDGE: Resultados → Testimonials Video ═══ */}
      <div className="relative h-20 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B5E20] to-[#E8F5E0]" />
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
            ref={(el) => { if (el) el.playbackRate = 1.5; }}
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
          <div className="glass-header max-w-3xl mx-auto mb-8 text-center wow-title-shimmer">
            <h2
              className="wow-title text-3xl md:text-5xl font-bold text-center mb-4 text-[#1B5E20]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Historias Reales de <span className="emphasis">Transformación</span>
            </h2>
            <p className="text-[#2E7D32]/70 text-lg max-w-xl mx-auto">
              Empresas y empleados de toda la isla comparten su experiencia.
            </p>
          </div>



          {/* RESPONSIVE GRID — all cards fully visible, no clipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {TESTIMONIALS.map((testimonial, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white/60 backdrop-blur-md border border-[#66BB6A]/25 shadow-lg hover:shadow-[0_20px_60px_rgba(67,160,71,0.3)] hover:-translate-y-3 hover:scale-[1.03] hover:bg-white/85 hover:border-[#43A047]/50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Hover glow overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#43A047]/0 via-[#66BB6A]/0 to-[#A5D6A7]/0 group-hover:from-[#43A047]/5 group-hover:via-[#66BB6A]/8 group-hover:to-[#A5D6A7]/10 transition-all duration-700 pointer-events-none" />
                {/* Shimmer sweep on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  {/* Impact metric badge */}
                  <div className="flex items-center justify-between mb-4">
                    <svg className="w-7 h-7 text-[#43A047]/40 group-hover:text-[#2E7D32] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />
                    </svg>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#2E7D32]/10 to-[#43A047]/10 border border-[#43A047]/25 group-hover:from-[#2E7D32]/20 group-hover:to-[#43A047]/20 group-hover:border-[#43A047]/40 transition-all duration-500">
                      <svg className="w-3.5 h-3.5 text-[#2E7D32]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-xs font-bold text-[#1B5E20] tracking-tight">{testimonial.metric}</span>
                    </span>
                  </div>
                  <p className="text-[#2D3B2D]/80 text-sm leading-relaxed mb-6 italic group-hover:text-[#1B5E20] transition-colors duration-500">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-[#66BB6A]/20 pt-4 group-hover:border-[#43A047]/40 transition-colors duration-500">
                    <p className="font-semibold text-[#1B5E20] text-sm group-hover:text-[#2E7D32] transition-all duration-300">{testimonial.name}</p>
                    <p className="text-xs text-[#43A047] mt-0.5 group-hover:text-[#1B5E20] transition-all duration-300">{testimonial.role}</p>
                    <p className="text-xs text-[#2D3B2D]/50 mt-0.5 group-hover:text-[#2E7D32]/70 transition-colors duration-300">{testimonial.municipality}, PR</p>
                    {/* Category badge */}
                    <span className="inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#43A047]/10 text-[#2E7D32] border border-[#43A047]/20">
                      {testimonial.category}
                    </span>
                    {/* Download Case Study button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateCaseStudyPDF(testimonial);
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] text-white text-xs font-semibold shadow-md hover:shadow-[0_8px_24px_rgba(46,125,50,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar Caso de Estudio
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
      <section ref={complianceRef} id="cumplimiento" data-reveal="fade-up" className="py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E8F5E0 0%, #C8E6C9 40%, #B9DEB5 70%, #E8F5E0 100%)' }}>
        {/* Parallax background image — compliance professionals */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/manus-storage/section-cumplimiento-v6_d4d511c0.jpg"
            alt=""
            className="section-parallax-img absolute inset-0 w-full h-[120%] object-cover opacity-[0.32] scale-110"
            style={{ willChange: 'transform' }}
          />
        </div>
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
          <div className="glass-header max-w-3xl mx-auto mb-20 text-center wow-title-shimmer">
            <h2
              className="wow-title text-3xl md:text-5xl font-bold text-center mb-4 text-[#1B5E20]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Planificación y <span className="emphasis">Cumplimiento</span>
            </h2>
            <p className="text-[#2E7D32]/70 max-w-3xl mx-auto text-lg leading-relaxed">
              Un proceso estructurado en 5 pasos para garantizar resultados medibles y cumplimiento regulatorio completo con el Depto. de Salud y Depto. del Trabajo de PR.
            </p>
          </div>

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
                    className="relative z-10 w-[80px] h-[80px] rounded-full flex items-center justify-center group-hover:scale-125 group-hover:rotate-6 transition-all duration-700"
                    data-cursor-hover
                    style={{
                      background: 'linear-gradient(135deg, #66BB6A, #43A047)',
                      border: '3px solid rgba(67,160,71,0.5)',
                      boxShadow: '0 8px 25px rgba(67,160,71,0.3), inset 0 0 15px rgba(255,255,255,0.1)',
                    }}
                  >
                    {step.icon === 'search' && <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/></svg>}
                    {step.icon === 'clipboard' && <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6M9 12h6m-6 4h4"/></svg>}
                    {step.icon === 'cog' && <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z"/><circle cx="12" cy="12" r="3"/></svg>}
                    {step.icon === 'chart' && <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-4 3 3 5-5"/></svg>}
                    {step.icon === 'badge' && <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697A3.42 3.42 0 0 0 9.78 3.89a3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"/></svg>}
                    {/* Orbiting ring */}
                    <div className="absolute inset-[-6px] rounded-full border border-[#43A047]/30 animate-spin" style={{ animationDuration: `${8 + i * 2}s` }} />
                  </div>
                </MagneticButton>



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
      <section ref={plansRef} id="planes" data-reveal="fade-up" className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-[#F4F9F2] to-[#EDF5EA]">
        {/* Parallax background image — corporate wellness celebration */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/manus-storage/section-planes-v6_2b0732b4.jpg"
            alt=""
            className="section-parallax-img absolute inset-0 w-full h-[120%] object-cover opacity-[0.30] scale-110"
            style={{ willChange: 'transform' }}
          />
        </div>
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
          <div className="glass-header max-w-3xl mx-auto mb-16 text-center wow-title-shimmer">
            <h2
              className="wow-title text-3xl md:text-4xl font-bold text-center mb-4 text-[#2D3B2D]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Planes de <span className="emphasis">Servicio</span>
            </h2>
            <p className="text-[#2D3B2D]/60 max-w-2xl mx-auto">
              Soluciones escalables adaptadas al tamaño y necesidades de tu organización. Todos incluyen acceso a nuestra red de Farmacias de Comunidad.
            </p>
          </div>

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

      {/* ═══ TRANSITION BRIDGE: Plans → Map ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDF5EA] to-white" />
        <svg className="absolute bottom-0 left-0 w-full h-10" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="none">
          <path d="M0,20 C360,40 720,0 1080,20 C1260,30 1380,25 1440,20 L1440,40 L0,40 Z" fill="white" />
        </svg>
      </div>



      {/* ═══ PHARMACY MAP ═══ */}
      <section ref={mapRef} id="farmacias" data-reveal="fade-up" className="py-24 px-6 bg-white relative overflow-hidden">
        {/* Parallax background image — modern community pharmacy */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/manus-storage/section-farmacias-v5_2d059e95.jpg"
            alt=""
            className="section-parallax-img absolute inset-0 w-full h-[120%] object-cover opacity-[0.28] scale-110"
            style={{ willChange: 'transform' }}
          />
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="glass-header max-w-3xl mx-auto mb-12 text-center wow-title-shimmer">
            <h2
              className="wow-title text-3xl md:text-4xl font-bold mb-4 text-[#2D3B2D]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Red de <span className="emphasis">Farmacias</span>
            </h2>
            <p className="text-[#2D3B2D]/60 max-w-2xl mx-auto">
              Más de 112 Farmacias de Comunidad en 70 municipios de Puerto Rico, listas para servirte.
            </p>
          </div>

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
      <section ref={contactRef} id="contacto" data-reveal="fade-up" className="py-24 px-6 bg-[#F4F9F2] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#66BB6A]/10 blur-[150px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="glass-header max-w-2xl mx-auto mb-12 text-center wow-title-shimmer">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#2D3B2D] typewriter-title"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="typewriter-text">Hablemos de </span><span className="emphasis typewriter-text">Bienestar</span>
            </h2>
            <p className="text-[#2D3B2D]/60">
              Escríbenos a{" "}
              <a href="mailto:hola@empresasaludable.org" className="text-[#6BAF8D] hover:underline">
                hola@empresasaludable.org
              </a>{" "}
              o completa el formulario.
            </p>
          </div>

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

      {/* ═══ TRANSITION BRIDGE: Contact → FAQ ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F9F2] to-[#F4F9F2]" />
      </div>

      {/* ═══ FAQ — PREGUNTAS FRECUENTES (GSAP Accordion) ═══ */}
      <section className="py-24 px-6 bg-[#F4F9F2]" data-reveal="fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="glass-header max-w-2xl mx-auto mb-12 text-center wow-title-shimmer">
            <h2
              className="wow-title text-2xl md:text-3xl font-bold text-center mb-4 text-[#2D3B2D]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Preguntas <span className="emphasis">Frecuentes</span>
            </h2>
            <p className="text-[#2D3B2D]/60 max-w-xl mx-auto">
              Resolvemos las dudas más comunes sobre nuestros programas de bienestar corporativo.
            </p>
          </div>

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

            {/* ═══ TRANSITION BRIDGE: FAQ → Casos de Éxito ═══ */}
      <div className="relative h-8 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F9F2] to-[#F0FAF0]" />
      </div>

      {/* ═══ CASOS DE ÉXITO ═══ */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#F0FAF0] to-white" data-reveal="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold tracking-wider uppercase mb-4">Resultados Reales</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Casos de <span className="text-[#4A9B6F]">Éxito</span>
            </h2>
            <p className="mt-4 text-[#2D3B2D]/60 max-w-xl mx-auto">
              Empresas que transformaron su cultura organizacional con nuestro programa integral de bienestar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Case 1 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-[#E8F5E9] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#4A9B6F]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3B2D] text-lg">Corporación Manufacturera</h3>
                  <p className="text-xs text-[#2D3B2D]/50">Sector Industrial • 450 empleados</p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">Reducción ausentismo</span>
                  <span className="font-bold text-[#2E7D32]">-52%</span>
                </div>
                <div className="w-full h-2 bg-[#E8F5E9] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9B6F] rounded-full" style={{ width: '52%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">ROI primer año</span>
                  <span className="font-bold text-[#2E7D32]">4.2:1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">Satisfacción empleados</span>
                  <span className="font-bold text-[#2E7D32]">96%</span>
                </div>
              </div>
              <p className="text-sm text-[#2D3B2D]/60 italic border-l-2 border-[#6BAF8D] pl-3">
                "El programa transformó nuestra cultura laboral. Los resultados superaron todas las expectativas."
              </p>
            </div>

            {/* Case 2 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-[#E8F5E9] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#E3F2FD] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#1976D2]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3B2D] text-lg">Grupo Financiero Regional</h3>
                  <p className="text-xs text-[#2D3B2D]/50">Sector Bancario • 1,200 empleados</p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">Retención de talento</span>
                  <span className="font-bold text-[#1976D2]">+38%</span>
                </div>
                <div className="w-full h-2 bg-[#E3F2FD] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#42A5F5] to-[#1976D2] rounded-full" style={{ width: '38%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">Productividad</span>
                  <span className="font-bold text-[#1976D2]">+31%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">Clima laboral</span>
                  <span className="font-bold text-[#1976D2]">9.4/10</span>
                </div>
              </div>
              <p className="text-sm text-[#2D3B2D]/60 italic border-l-2 border-[#42A5F5] pl-3">
                "Implementamos los 5 pilares y en 8 meses vimos mejoras medibles en todos los indicadores clave."
              </p>
            </div>

            {/* Case 3 */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-[#E8F5E9] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#FFF3E0] flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#E65100]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0V7.875C3 6.839 3.839 6 4.875 6h14.25C20.161 6 21 6.839 21 7.875v1.474" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#2D3B2D] text-lg">Cadena de Farmacias PR</h3>
                  <p className="text-xs text-[#2D3B2D]/50">Sector Salud • 180 empleados</p>
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">Reducción rotación</span>
                  <span className="font-bold text-[#E65100]">-45%</span>
                </div>
                <div className="w-full h-2 bg-[#FFF3E0] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FF9800] to-[#E65100] rounded-full" style={{ width: '45%' }} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">Ahorro anual</span>
                  <span className="font-bold text-[#E65100]">$340K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#2D3B2D]/70">NPS empleados</span>
                  <span className="font-bold text-[#E65100]">+72</span>
                </div>
              </div>
              <p className="text-sm text-[#2D3B2D]/60 italic border-l-2 border-[#FF9800] pl-3">
                "La inversión en bienestar se pagó sola en 6 meses. Nuestro equipo está más comprometido que nunca."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRANSITION BRIDGE: Casos de Éxito → Recursos ═══ */}
      <div className="relative h-8 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#FAFAFA]" />
      </div>

      {/* ═══ RECURSOS ═══ */}
      <section className="py-24 px-6 bg-[#FAFAFA]" data-reveal="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-semibold tracking-wider uppercase mb-4">Conocimiento</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Recursos de <span className="text-[#4A9B6F]">Bienestar</span>
            </h2>
            <p className="mt-4 text-[#2D3B2D]/60 max-w-xl mx-auto">
              Artículos, guías y herramientas para implementar una cultura de bienestar en tu organización.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['Todos', 'Salud Mental', 'Salud Física', 'Nutrición', 'Finanzas', 'Corporativo'].map((tab) => (
              <button
                key={tab}
                onClick={() => setResourceFilter(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${resourceFilter === tab ? 'bg-[#4A9B6F] text-white shadow-md' : 'bg-white text-[#2D3B2D]/70 border border-[#E8F5E9] hover:border-[#6BAF8D] hover:text-[#4A9B6F]'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Article Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_ARTICLES.filter(article => resourceFilter === 'Todos' || article.category === resourceFilter).map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article.id)}
                className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="h-2 w-full" style={{ backgroundColor: article.color }} />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: article.color }}>{article.category}</span>
                    <span className="text-[10px] text-[#2D3B2D]/40 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#2D3B2D] text-base group-hover:text-[#4A9B6F] transition-colors">{article.title}</h3>
                  <p className="mt-2 text-[#2D3B2D]/50 text-sm line-clamp-2">{article.excerpt}</p>
                  <div className="mt-4 flex items-center text-[#4A9B6F] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Leer artículo completo
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARTICLE MODAL ═══ */}
      {selectedArticle !== null && (() => {
        const article = BLOG_ARTICLES.find(a => a.id === selectedArticle);
        if (!article) return null;
        return (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setSelectedArticle(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            {/* Modal Content */}
            <div
              className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{ animation: 'pillarCardIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards' }}
            >
              {/* Color bar */}
              <div className="h-2 w-full rounded-t-2xl" style={{ backgroundColor: article.color }} />
              {/* Close button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              {/* Article Header */}
              <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: article.color }}>{article.category}</span>
                  <span className="text-xs text-[#2D3B2D]/40 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    {article.readTime} de lectura
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {article.title}
                </h2>
              </div>
              {/* Article Body */}
              <div className="px-8 pb-8">
                <div className="space-y-4">
                  {article.content.map((paragraph, pIdx) => {
                    // Parse bold markers
                    const parts = paragraph.split(/\*\*(.*?)\*\*/);
                    return (
                      <p key={pIdx} className="text-[#2D3B2D]/80 text-[15px] leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {parts.map((part, partIdx) =>
                          partIdx % 2 === 1
                            ? <strong key={partIdx} className="text-[#2D3B2D] font-semibold">{part}</strong>
                            : <span key={partIdx}>{part}</span>
                        )}
                      </p>
                    );
                  })}
                </div>
                {/* CTA at bottom */}
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-sm text-[#2D3B2D]/50 mb-3">¿Desea implementar estas estrategias en su empresa?</p>
                  <button
                    onClick={() => { setSelectedArticle(null); setShowDemoForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#1B5E20] to-[#43A047] text-white font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Solicitar Demo Gratuita
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ TRANSITION BRIDGE: Recursos → Colaboradores ═══ */}
      <div className="relative h-8 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-white" />
      </div>
      {/* ═══ NUESTROS COLABORADORES ═══ */}
      <section className="py-20 px-6 bg-white" data-reveal="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="glass-header max-w-2xl mx-auto mb-14 text-center wow-title-shimmer">
            <h2
              className="wow-title text-2xl md:text-3xl font-bold text-center mb-4 text-[#2D3B2D]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Nuestros <span className="emphasis">Colaboradores</span>
            </h2>
            <p className="text-[#2D3B2D]/60 max-w-xl mx-auto">
              Organizaciones líderes que confían en nuestro programa de bienestar corporativo.
            </p>
          </div>

          {/* ─── AUSPICIADOR PRINCIPAL ─── */}
          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2E7D32]/10 to-[#43A047]/10 text-[#1B5E20] text-xs font-bold tracking-wider uppercase mb-6 border border-[#43A047]/25">
              ★ Auspiciador Principal
            </span>
            <a href="https://www.farmaciaislaverde.com/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 group">
              <div className="p-6 rounded-2xl bg-white shadow-lg border-2 border-[#43A047]/30 group-hover:shadow-[0_12px_40px_rgba(46,125,50,0.2)] group-hover:border-[#2E7D32]/50 transition-all duration-500">
                <img src="/manus-storage/logo-farmacia-isla-verde_f8abca09.jpg" alt="Farmacia Isla Verde" className="h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-sm font-semibold text-[#1B5E20] group-hover:text-[#2E7D32] transition-colors">Farmacia Isla Verde</span>
              <span className="text-xs text-[#2D3B2D]/50">www.farmaciaislaverde.com</span>
            </a>
          </div>

          {/* Auto-scrolling marquee at medium speed */}
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="flex animate-[collab-scroll_15s_linear_infinite] hover:[animation-play-state:paused] gap-12 items-center py-4">
              {/* First set */}
              <a href="https://www.farmaciaislaverde.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-farmacia-isla-verde_f8abca09.jpg" alt="Farmacia Isla Verde" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Farmacia Isla Verde</span>
              </a>
              <a href="https://www.camarapr.org/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-camara-comercio_95450442.png" alt="Cámara de Comercio" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Cámara de Comercio</span>
              </a>
              <a href="https://www.rpsmedical.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-rps-medical_47faf98c.png" alt="RPS Medical" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">RPS Medical</span>
              </a>
              <a href="https://www.professionalhospital.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-professional-hospital_451eec14.png" alt="Professional Hospital" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Professional Hospital</span>
              </a>
              <a href="https://www.mcs.com.pr/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-mcs_ddb3acde.png" alt="MCS" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">MCS</span>
              </a>
              <a href="https://corepluspr.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-coreplus_f2cf11ef.png" alt="CORE PLUS" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">CORE PLUS</span>
              </a>
              <a href="https://varmedmanagement.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-varmed_36b690af.png" alt="VarMED" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">VarMED</span>
              </a>
              <a href="https://www.salud.pr.gov/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-depto-salud_48756c01.jpg" alt="Depto. de Salud de PR" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Depto. de Salud</span>
              </a>
              <a href="https://www.trabajo.pr.gov/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-dtrh_66a38ba0.png" alt="Depto. del Trabajo y RRHH" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Depto. del Trabajo</span>
              </a>
              <a href="https://www.osha.gov/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-osha_55ae4b19.png" alt="OSHA" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">OSHA</span>
              </a>
              <a href="https://www.merck.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-merck_74dc9884.png" alt="MERCK" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">MERCK</span>
              </a>
              <a href="https://www.empresariosporpr.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-empresarios-pr_6b7b8f35.jpg" alt="Empresarios por Puerto Rico" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Empresarios por PR</span>
              </a>
              {/* Duplicate set for seamless loop */}
              <a href="https://www.farmaciaislaverde.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-farmacia-isla-verde_f8abca09.jpg" alt="Farmacia Isla Verde" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Farmacia Isla Verde</span>
              </a>
              <a href="https://www.camarapr.org/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-camara-comercio_95450442.png" alt="Cámara de Comercio" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Cámara de Comercio</span>
              </a>
              <a href="https://www.rpsmedical.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-rps-medical_47faf98c.png" alt="RPS Medical" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">RPS Medical</span>
              </a>
              <a href="https://www.professionalhospital.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-professional-hospital_451eec14.png" alt="Professional Hospital" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Professional Hospital</span>
              </a>
              <a href="https://www.mcs.com.pr/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-mcs_ddb3acde.png" alt="MCS" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">MCS</span>
              </a>
              <a href="https://corepluspr.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-coreplus_f2cf11ef.png" alt="CORE PLUS" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">CORE PLUS</span>
              </a>
              <a href="https://varmedmanagement.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-varmed_36b690af.png" alt="VarMED" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">VarMED</span>
              </a>
              <a href="https://www.salud.pr.gov/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-depto-salud_48756c01.jpg" alt="Depto. de Salud de PR" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Depto. de Salud</span>
              </a>
              <a href="https://www.trabajo.pr.gov/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-dtrh_66a38ba0.png" alt="Depto. del Trabajo y RRHH" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Depto. del Trabajo</span>
              </a>
              <a href="https://www.osha.gov/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-osha_55ae4b19.png" alt="OSHA" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">OSHA</span>
              </a>
              <a href="https://www.merck.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-merck_74dc9884.png" alt="MERCK" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">MERCK</span>
              </a>
              <a href="https://www.empresariosporpr.com/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex flex-col items-center gap-2 hover:scale-110 transition-transform duration-300">
                <img src="/manus-storage/logo-empresarios-pr_6b7b8f35.jpg" alt="Empresarios por Puerto Rico" className="h-14 w-auto object-contain hover:scale-110 transition-all duration-500" />
                <span className="text-[10px] text-[#2D3B2D]/50 font-medium whitespace-nowrap">Empresarios por PR</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRANSITION BRIDGE: Colaboradores → Footer ═══ */}
      <div className="relative h-16 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#2D3B2D]" />
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
