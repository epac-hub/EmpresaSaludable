/**
 * Empresa Saludable — WOW Health & Wellness Website
 * Design: Light Botanical Sanctuary — soft sage, mint, cream, calming greens
 * Tech: GSAP ScrollTrigger, Lenis smooth scroll, floating particles, 3D flying cards
 * Section order: Hero → Celebrities → Pillars (3D) → Stats → Testimonials → Compliance (3D) → Plans → Pharmacy Map → Contact (LAST)
 */
import { useEffect, useRef, useState, Suspense, lazy } from "react";
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
    gradient: "from-[#A8C5A0] to-[#7EB89A]",
    description: "Programas de bienestar emocional, manejo del estrés y apoyo psicológico para empleados y comunidades.",
    stats: ["85% reducción en ausentismo", "Talleres semanales", "Línea de apoyo 24/7"],
  },
  {
    id: "fisica",
    title: "Salud Física",
    icon: "💪",
    color: "#7EB89A",
    gradient: "from-[#7EB89A] to-[#5A9E7D]",
    description: "Actividad física, nutrición personalizada y prevención de enfermedades crónicas para una vida activa.",
    stats: ["112+ farmacias aliadas", "Planes nutricionales", "Evaluaciones periódicas"],
  },
  {
    id: "financiera",
    title: "Salud Financiera",
    icon: "📊",
    color: "#B8D4A8",
    gradient: "from-[#B8D4A8] to-[#A8C5A0]",
    description: "Educación financiera, planificación de retiro y gestión de beneficios para estabilidad económica.",
    stats: ["ROI 3:1 comprobado", "Asesoría personalizada", "Planes de ahorro"],
  },
  {
    id: "corporativa",
    title: "Salud Corporativa",
    icon: "🏢",
    color: "#6BAF8D",
    gradient: "from-[#6BAF8D] to-[#4A9070]",
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
  { step: 1, title: "Evaluación Inicial", desc: "Diagnóstico completo del estado de salud organizacional y necesidades específicas.", icon: "🔍" },
  { step: 2, title: "Plan Estratégico", desc: "Diseño personalizado de intervenciones basadas en evidencia y mejores prácticas.", icon: "📋" },
  { step: 3, title: "Implementación", desc: "Ejecución coordinada con farmacias, proveedores y equipo interno.", icon: "⚙️" },
  { step: 4, title: "Monitoreo Continuo", desc: "Seguimiento de métricas, ajustes y reportes de cumplimiento regulatorio.", icon: "📊" },
  { step: 5, title: "Certificación", desc: "Validación de resultados y obtención de certificaciones de bienestar.", icon: "🏆" },
];

const PLANS = [
  {
    name: "Esencial",
    price: "Desde $2,500/mes",
    description: "Ideal para empresas pequeñas que inician su camino hacia el bienestar organizacional.",
    features: [
      "Evaluación básica de salud organizacional",
      "Acceso a red de 112+ farmacias aliadas",
      "Reportes trimestrales de cumplimiento",
      "Soporte por email en horario laboral",
      "1 taller mensual de bienestar",
      "Dashboard básico de métricas",
    ],
    highlighted: false,
    cta: "Comenzar",
  },
  {
    name: "Profesional",
    price: "Desde $5,800/mes",
    description: "Para organizaciones que buscan integrar los 4 pilares del bienestar de forma completa.",
    features: [
      "Todo lo incluido en Esencial",
      "4 Pilares integrados (Mental, Física, Financiera, Corporativa)",
      "Dashboard en tiempo real con KPIs",
      "4 talleres mensuales especializados",
      "Soporte prioritario 24/7",
      "Programa de nutrición personalizado",
      "Evaluaciones trimestrales individuales",
      "Certificación de Empresa Saludable",
    ],
    highlighted: true,
    cta: "Más Popular",
  },
  {
    name: "Empresarial",
    price: "Personalizado",
    description: "Solución a medida para corporaciones con necesidades complejas y múltiples localidades.",
    features: [
      "Todo lo incluido en Profesional",
      "Programa 100% personalizado",
      "Certificación completa con auditoría",
      "Gerente de cuenta dedicado",
      "API de integración con HRIS",
      "Reportes ejecutivos mensuales",
      "Eventos exclusivos de bienestar",
      "Consultoría regulatoria OSHA/HIPAA",
      "Multi-localidad sin costo adicional",
    ],
    highlighted: false,
    cta: "Contactar",
  },
];

// ─── Interactive Mouse-Reactive Floating Particles ──────────────────────────

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const PARTICLE_COUNT = 60;
    const MOUSE_RADIUS = 150;
    const MOUSE_FORCE = 3;

    interface Particle {
      x: number; y: number;
      baseX: number; baseY: number;
      vx: number; vy: number;
      size: number; baseSize: number;
      opacity: number; baseOpacity: number;
      hue: number; angle: number; speed: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 4 + 1.5;
        particles.push({
          x, y, baseX: x, baseY: y,
          vx: 0, vy: 0,
          size, baseSize: size,
          opacity: Math.random() * 0.5 + 0.15,
          baseOpacity: Math.random() * 0.5 + 0.15,
          hue: 120 + Math.random() * 50,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.1,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      particles.forEach((p) => {
        p.angle += p.speed * 0.02;
        const floatX = Math.cos(p.angle) * 0.3;
        const floatY = Math.sin(p.angle * 0.7) * 0.2 - 0.05;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * MOUSE_FORCE;
          p.vy += Math.sin(angle) * force * MOUSE_FORCE;
          p.size = p.baseSize + force * 3;
          p.opacity = Math.min(0.9, p.baseOpacity + force * 0.5);
        } else {
          p.size += (p.baseSize - p.size) * 0.05;
          p.opacity += (p.baseOpacity - p.opacity) * 0.05;
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx + floatX;
        p.y += p.vy + floatY;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = `hsla(${p.hue}, 50%, 65%, 0.6)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 45%, 72%, 1)`;
        ctx.fill();
        ctx.restore();

        particles.forEach((p2) => {
          if (p === p2) return;
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(140, 40%, 70%, ${(1 - d / 100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[2]"
      style={{ mixBlendMode: "screen", pointerEvents: "none" }}
    />
  );
}

// ─── 3D Flying Pillar Card ──────────────────────────────────────────────────

function Flying3DPillarCard({ pillar, index, isActive, onClick }: {
  pillar: typeof PILLARS[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    // Continuous floating animation
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(cardRef.current, {
      y: -12 - (index % 2) * 6,
      rotateX: 2 + (index % 3),
      rotateY: -2 + (index % 2) * 4,
      duration: 3 + index * 0.5,
      ease: "sine.inOut",
    });
    return () => { tl.kill(); };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`pillar-card group relative cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
      onClick={onClick}
      data-hover
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(cardRef.current, {
          rotateY: x * 20,
          rotateX: -y * 15,
          duration: 0.4,
          ease: "power2.out",
        });
      }}
      onMouseLeave={() => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        });
      }}
    >
      <div
        className={`relative p-8 rounded-3xl border-2 backdrop-blur-sm transition-all duration-500 overflow-hidden ${
          isActive
            ? "border-[#6BAF8D] bg-white shadow-2xl shadow-[#6BAF8D]/20 scale-[1.03]"
            : "border-[#A8C5A0]/30 bg-white/80 hover:border-[#6BAF8D]/60 hover:shadow-xl"
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Floating glow orb behind card */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: pillar.color }}
        />

        {/* 3D elevated icon */}
        <div
          className="relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2"
          style={{
            background: `linear-gradient(135deg, ${pillar.color}40, ${pillar.color}20)`,
            border: `2px solid ${pillar.color}50`,
            transform: "translateZ(30px)",
          }}
        >
          {pillar.icon}
        </div>

        {/* Content */}
        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          <h3
            className="text-2xl font-bold text-[#2D3B2D] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {pillar.title}
          </h3>
          <p className="text-[#2D3B2D]/70 leading-relaxed mb-4 text-sm">{pillar.description}</p>

          {/* Expanded stats with animation */}
          <div
            className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              isActive ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <div className="pt-4 border-t border-[#A8C5A0]/30 space-y-3">
              {pillar.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-[#2D3B2D]/80">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: pillar.color, boxShadow: `0 0 8px ${pillar.color}` }}
                  />
                  <span>{stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom gradient accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, ${pillar.color}, transparent)` }}
        />
      </div>
    </div>
  );
}

// ─── 3D Flying Compliance Card ──────────────────────────────────────────────

function Flying3DComplianceCard({ step, index, isActive, onClick }: {
  step: typeof COMPLIANCE_STEPS[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(cardRef.current, {
      y: -8 - (index % 3) * 4,
      rotateX: 1 + (index % 2) * 2,
      rotateY: -1 + (index % 3) * 2,
      duration: 2.5 + index * 0.4,
      ease: "sine.inOut",
    });
    return () => { tl.kill(); };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="compliance-step group cursor-pointer"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      onClick={onClick}
      data-hover
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(cardRef.current, {
          rotateY: x * 15,
          rotateX: -y * 10,
          duration: 0.3,
          ease: "power2.out",
        });
      }}
      onMouseLeave={() => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.6)",
        });
      }}
    >
      <div
        className={`relative p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-500 overflow-hidden ${
          isActive
            ? "border-[#6BAF8D] bg-white shadow-xl shadow-[#6BAF8D]/15 scale-[1.02]"
            : "border-[#A8C5A0]/20 bg-white/90 hover:border-[#6BAF8D]/50 hover:shadow-lg"
        }`}
      >
        {/* Floating step number */}
        <div className="flex items-start gap-5">
          <div
            className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 ${
              isActive
                ? "bg-[#6BAF8D] text-white shadow-lg shadow-[#6BAF8D]/30"
                : "bg-[#E8F5E0] text-[#6BAF8D] border border-[#A8C5A0]/30"
            }`}
            style={{ transform: "translateZ(25px)" }}
          >
            <span className="text-2xl">{step.icon}</span>
          </div>

          <div className="flex-1" style={{ transform: "translateZ(15px)" }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-[#6BAF8D]/60 uppercase tracking-wider">Paso {step.step}</span>
            </div>
            <h3 className="text-xl font-bold text-[#2D3B2D] mb-2">{step.title}</h3>
            <p
              className={`text-[#2D3B2D]/60 leading-relaxed text-sm transition-all duration-500 ${
                isActive ? "opacity-100 max-h-20" : "opacity-60 max-h-10 overflow-hidden"
              }`}
            >
              {step.desc}
            </p>
          </div>
        </div>

        {/* Progress line */}
        {index < 4 && (
          <div className="absolute -bottom-4 left-7 w-px h-8 bg-gradient-to-b from-[#6BAF8D]/30 to-transparent z-10" />
        )}
      </div>
    </div>
  );
}

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

    return () => { lenis.destroy(); };
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

    return () => { window.removeEventListener("mousemove", moveCursor); };
  }, []);

  // ─── GSAP Animations ─────────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero video parallax scroll
      if (heroRef.current) {
        gsap.to(".hero-video", {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
          scale: 1.2,
          y: 100,
          ease: "none",
        });
      }

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

      // Celebrity cards — WOW 3D entrance
      if (celebsRef.current) {
        gsap.from(".celeb-card", {
          scrollTrigger: { trigger: celebsRef.current, start: "top 80%" },
          y: 120,
          opacity: 0,
          rotateX: 15,
          rotateY: -10,
          scale: 0.85,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
        });
      }

      // Pillars stagger entrance
      if (pillarsRef.current) {
        gsap.from(".pillar-card", {
          scrollTrigger: { trigger: pillarsRef.current, start: "top 80%" },
          y: 80,
          opacity: 0,
          rotateX: 10,
          scale: 0.9,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
        });
      }

      // Stats counter
      if (statsRef.current) {
        gsap.from(".stat-item", {
          scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Compliance steps entrance
      if (complianceRef.current) {
        gsap.from(".compliance-step", {
          scrollTrigger: { trigger: complianceRef.current, start: "top 80%" },
          y: 60,
          opacity: 0,
          rotateX: 8,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        });
      }

      // Plans
      if (plansRef.current) {
        gsap.from(".plan-card", {
          scrollTrigger: { trigger: plansRef.current, start: "top 80%" },
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
          scrollTrigger: { trigger: contactRef.current, start: "top 80%" },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Map section
      if (mapRef.current) {
        gsap.from(".map-container", {
          scrollTrigger: { trigger: mapRef.current, start: "top 75%" },
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
        <FloatingParticles />

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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-[#6BAF8D]/60 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#6BAF8D]/60 to-transparent" />
        </div>
      </section>

      {/* ═══ CELEBRITY FITNESS SECTION — WOW 3D TILT + GSAP ═══ */}
      <section ref={celebsRef} className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Inspirados por los <span className="text-[#6BAF8D]">Mejores</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-6 max-w-2xl mx-auto">
            Nuestros programas están inspirados en el compromiso con la salud de los más grandes de Puerto Rico.
          </p>
          <p className="text-center text-[#2D3B2D]/50 mb-16 max-w-3xl mx-auto text-sm leading-relaxed">
            Desde el entrenamiento disciplinado de Chayanne hasta la práctica de yoga de Ricky Martin, pasando por los regímenes de nutrición de Zuleyka y Dayanara — cada pilar de Empresa Saludable refleja la excelencia que estos íconos representan para nuestra isla.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ perspective: '1200px' }}>
            {CELEBRITIES.map((celeb, i) => (
              <div
                key={i}
                className="celeb-card group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                data-hover
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(20px) scale(1.03)`;
                  const glow = card.querySelector('.celeb-glow') as HTMLElement;
                  if (glow) {
                    glow.style.left = `${e.clientX - rect.left}px`;
                    glow.style.top = `${e.clientY - rect.top}px`;
                    glow.style.opacity = '1';
                  }
                  const img = card.querySelector('.celeb-img') as HTMLElement;
                  if (img) {
                    img.style.transform = `scale(1.15) translate(${x * -15}px, ${y * -15}px)`;
                  }
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
                  const glow = card.querySelector('.celeb-glow') as HTMLElement;
                  if (glow) glow.style.opacity = '0';
                  const img = card.querySelector('.celeb-img') as HTMLElement;
                  if (img) img.style.transform = 'scale(1) translate(0px, 0px)';
                }}
              >
                <div
                  className="celeb-glow absolute w-40 h-40 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(107,175,141,0.5) 0%, transparent 70%)',
                    opacity: 0,
                    filter: 'blur(20px)',
                  }}
                />

                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={celeb.image}
                    alt={celeb.name}
                    className="celeb-img w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a]/95 via-[#2D3B2D]/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white" style={{ transform: 'translateZ(30px)' }}>
                  <h3 className="text-xl font-bold mb-1 group-hover:text-[#A8C5A0] transition-colors duration-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {celeb.name}
                  </h3>
                  <p className="text-[#A8C5A0] text-sm font-medium mb-3 group-hover:tracking-wider transition-all duration-500">{celeb.role}</p>
                  <p className="text-white/70 text-sm italic opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    "{celeb.quote}"
                  </p>
                  <div className="h-[2px] bg-gradient-to-r from-[#6BAF8D] to-[#A8C5A0] mt-3 w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                </div>

                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#6BAF8D]/0 group-hover:border-[#6BAF8D]/60 transition-all duration-500 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#6BAF8D]/0 group-hover:border-[#6BAF8D]/60 transition-all duration-500 rounded-bl-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4 PILLARS — 3D FLYING CARDS ═══ */}
      <section ref={pillarsRef} id="pilares" className="py-32 px-6 bg-gradient-to-b from-[#F4F9F2] to-[#EDF5EA]">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Los 4 Pilares del <span className="text-[#6BAF8D]">Bienestar</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Un enfoque holístico que integra todas las dimensiones de la salud para resultados sostenibles. Cada pilar flota independientemente pero trabaja en armonía.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PILLARS.map((pillar, i) => (
              <Flying3DPillarCard
                key={pillar.id}
                pillar={pillar}
                index={i}
                isActive={activePillar === pillar.id}
                onClick={() => setActivePillar(activePillar === pillar.id ? null : pillar.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS DASHBOARD ═══ */}
      <section ref={statsRef} className="py-24 px-6 bg-[#2D3B2D]">
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

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                  role: "Farmacéutica, Red Aliada",
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
                  <svg className="w-8 h-8 text-[#6BAF8D]/30 mb-4 group-hover:text-[#6BAF8D]/60 transition-colors duration-500" fill="currentColor" viewBox="0 0 24 24">
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
            <div className="flex justify-center mt-6 gap-2">
              <span className="text-xs text-[#2D3B2D]/40">← Desliza para ver más →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ COMPLIANCE STEPS — 3D FLYING CARDS ═══ */}
      <section ref={complianceRef} id="cumplimiento" className="py-32 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-[#2D3B2D]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Planificación y <span className="text-[#6BAF8D]">Cumplimiento</span>
          </h2>
          <p className="text-center text-[#2D3B2D]/60 mb-16 max-w-2xl mx-auto">
            Un proceso estructurado en 5 pasos para garantizar resultados medibles y cumplimiento regulatorio completo.
          </p>

          <div className="space-y-6">
            {COMPLIANCE_STEPS.map((step, i) => (
              <Flying3DComplianceCard
                key={step.step}
                step={step}
                index={i}
                isActive={activeStep === step.step}
                onClick={() => setActiveStep(step.step)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICE PLANS — FULL 3 PLANS ═══ */}
      <section ref={plansRef} id="planes" className="py-32 px-6 bg-gradient-to-b from-[#F4F9F2] to-[#EDF5EA]">
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
                className={`plan-card relative p-8 rounded-3xl border-2 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl ${
                  plan.highlighted
                    ? "border-[#6BAF8D] bg-white shadow-xl shadow-[#6BAF8D]/15"
                    : "border-[#A8C5A0]/30 bg-white hover:border-[#6BAF8D]/50"
                }`}
                data-hover
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-gradient-to-r from-[#6BAF8D] to-[#4A9070] text-white text-xs font-bold shadow-lg shadow-[#6BAF8D]/30">
                    Más Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2 text-[#2D3B2D]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-[#6BAF8D] mb-3">{plan.price}</p>
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
      <section ref={mapRef} id="farmacias" className="py-32 px-6 bg-white">
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

      {/* ═══ CONTACT FORM (LAST SECTION) ═══ */}
      <section ref={contactRef} id="contacto" className="py-32 px-6 bg-[#F4F9F2]">
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
              data-hover
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
