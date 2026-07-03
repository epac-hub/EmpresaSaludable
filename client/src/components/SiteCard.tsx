import { useRef } from "react";

interface SiteCardProps {
  name: string;
  studio: string;
  description: string;
  technique: string;
  url: string;
  award?: string;
  thumbnail?: string;
  onClick?: () => void;
}

export default function SiteCard({ name, studio, description, technique, award, thumbnail, onClick }: SiteCardProps) {
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
      onClick={onClick}
      className="block"
      data-cursor-hover
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 ease-out hover:border-[#8b5cf6]/30 hover:bg-white/[0.04] hover:shadow-[0_0_60px_-15px_rgba(139,92,246,0.15)] overflow-hidden cursor-pointer"
      >
        {/* Gradient border glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#8b5cf6]/5 via-transparent to-[#6d28d9]/5 pointer-events-none z-10" />

        {/* Thumbnail */}
        {thumbnail && (
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <img
              src={thumbnail}
              alt={`${name} website preview`}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
            {/* Award badge overlay */}
            {award && (
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest text-[#8b5cf6] bg-black/70 backdrop-blur-sm border border-[#8b5cf6]/30 px-2.5 py-1 rounded-full whitespace-nowrap z-10">
                {award}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-5 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white/95" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {name}
              </h3>
              <p className="text-xs text-[#8b5cf6]/80 mt-0.5">{studio}</p>
            </div>
            {!thumbnail && award && (
              <span className="text-[10px] uppercase tracking-widest text-[#8b5cf6] border border-[#8b5cf6]/30 px-2 py-1 rounded-full whitespace-nowrap">
                {award}
              </span>
            )}
          </div>

          <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3">{description}</p>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/30 uppercase tracking-wider">{technique}</span>
            <span className="text-xs text-[#8b5cf6] group-hover:text-[#a78bfa] transition-colors duration-200 flex items-center gap-1">
              View Details
              <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
