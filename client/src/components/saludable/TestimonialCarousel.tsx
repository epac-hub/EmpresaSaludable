import { useState, useEffect } from "react";

const TESTIMONIALS = [
  {
    quote: "Desde que implementamos el programa, el ausentismo bajó un 40%. El equipo está más motivado y productivo que nunca.",
    name: "Carmen L. Torres",
    role: "VP Recursos Humanos",
    company: "Grupo Farmacéutico del Caribe",
  },
  {
    quote: "La Dra. Santiago diseñó un programa de movilidad que eliminó las quejas de dolor de espalda en nuestra oficina. Increíble resultado.",
    name: "Roberto A. Velázquez",
    role: "Gerente de Operaciones",
    company: "TechPR Solutions",
  },
  {
    quote: "Los talleres de nutrición cambiaron la cultura de nuestra empresa. Ahora todos almuerzan mejor y la energía de la tarde es otra.",
    name: "Marta I. Figueroa",
    role: "Directora Ejecutiva",
    company: "Cooperativa de Salud Integral",
  },
  {
    quote: "El programa de bienestar financiero redujo el estrés de nuestros empleados notablemente. Un enfoque integral que realmente funciona.",
    name: "Luis E. Martínez",
    role: "Director de RRHH",
    company: "Pharma Solutions PR",
  },
  {
    quote: "Nuestros empleados esperan con entusiasmo las sesiones semanales. Ha transformado completamente el ambiente laboral.",
    name: "Patricia M. Colón",
    role: "Gerente General",
    company: "Distribuidora Médica del Este",
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section className="py-24 px-6" style={{ background: 'linear-gradient(180deg, #FDFCFB 0%, #F0F7F4 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#6BAF8D]/10 text-[#6BAF8D] text-xs font-bold uppercase tracking-[0.2em] mb-4 border border-[#6BAF8D]/20">
            Experiencias Reales
          </span>
          <h2 className="wow-title text-3xl md:text-4xl font-bold text-[#2D3B2D] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Lo Que Dicen Nuestros <span className="emphasis">Clientes</span>
          </h2>
          <p className="text-[#2D3B2D]/60 max-w-2xl mx-auto">
            Empresas de toda la isla confían en nuestro equipo para transformar la salud y productividad de sus empleados.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {TESTIMONIALS.map((testimonial, i) => (
              <div key={i} className="w-full flex-shrink-0 px-4">
                <div className="p-8 md:p-10 rounded-3xl bg-white/70 backdrop-blur-sm border border-[#A8C5A0]/15 shadow-lg">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6 justify-center">
                    {[...Array(5)].map((_, s) => (
                      <svg key={s} className="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-[#2D3B2D]/80 text-lg md:text-xl leading-relaxed text-center italic mb-8">
                    "​{testimonial.quote}​"
                  </p>
                  {/* Author */}
                  <div className="text-center border-t border-[#A8C5A0]/15 pt-6">
                    <p className="text-[#2D3B2D] font-bold text-base">{testimonial.name}</p>
                    <p className="text-[#2D3B2D]/50 text-sm">{testimonial.role}</p>
                    <p className="text-[#6BAF8D] text-sm font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#A8C5A0]/30 flex items-center justify-center text-[#2D3B2D]/60 hover:text-[#6BAF8D] hover:border-[#6BAF8D]/50 transition-all shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % TESTIMONIALS.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-[#A8C5A0]/30 flex items-center justify-center text-[#2D3B2D]/60 hover:text-[#6BAF8D] hover:border-[#6BAF8D]/50 transition-all shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-[#6BAF8D] w-8' : 'bg-[#2D3B2D]/20 hover:bg-[#6BAF8D]/50 w-2.5'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
