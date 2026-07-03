import { useRef } from "react";

interface SiteCardProps {
  name: string;
  studio: string;
  description: string;
  technique: string;
  url: string;
  award?: string;
}

export default function SiteCard({ name, studio, description, technique, url, award }: SiteCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateZ(10px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative p-6 md:p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 ease-out hover:border-[#8b5cf6]/30 hover:bg-white/[0.04] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.15)]"
      data-cursor-hover
    >
      {/* Gradient border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#8b5cf6]/5 via-transparent to-[#6d28d9]/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white/95 font-[var(--font-display)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {name}
            </h3>
            <p className="text-sm text-[#8b5cf6]/80 mt-1">{studio}</p>
          </div>
          {award && (
            <span className="text-[10px] uppercase tracking-widest text-[#8b5cf6] border border-[#8b5cf6]/30 px-2 py-1 rounded-full whitespace-nowrap">
              {award}
            </span>
          )}
        </div>

        <p className="text-white/60 text-sm leading-relaxed mb-4">{description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40 uppercase tracking-wider">{technique}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] transition-colors duration-200 flex items-center gap-1"
          >
            Visit
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
