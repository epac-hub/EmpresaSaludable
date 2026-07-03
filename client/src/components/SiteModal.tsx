import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SiteInfo {
  name: string;
  studio: string;
  description: string;
  technique: string;
  url: string;
  award?: string;
  thumbnail?: string;
  category: string;
  techStack?: string[];
  highlights?: string[];
  year?: string;
}

interface SiteModalProps {
  site: SiteInfo | null;
  allSites?: SiteInfo[];
  onClose: () => void;
  onSelectSite?: (site: SiteInfo) => void;
}

export default function SiteModal({ site, allSites = [], onClose, onSelectSite }: SiteModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!site) return;

    // Animate in
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(contentRef.current,
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", delay: 0.1 }
    );

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // ESC key handler
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);

    // Scroll modal content to top when site changes
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [site]);

  const handleClose = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" });
    gsap.to(contentRef.current, {
      y: 30, opacity: 0, scale: 0.97, duration: 0.25, ease: "power2.in",
      onComplete: onClose,
    });
  };

  if (!site) return null;

  const categoryLabel = site.category === "3d" ? "3D & WebGL"
    : site.category === "scroll" ? "Scroll Storytelling"
    : "Interactions & Gamification";

  // Get related sites (same category, excluding current)
  const relatedSites = allSites
    .filter((s) => s.category === site.category && s.name !== site.name)
    .slice(0, 3);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      style={{ cursor: "auto" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0c0c0c] shadow-[0_0_80px_-20px_rgba(139,92,246,0.2)]"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.12] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Thumbnail header */}
        {site.thumbnail && (
          <div className="relative w-full aspect-[2/1] overflow-hidden rounded-t-2xl">
            <img
              src={site.thumbnail}
              alt={`${site.name} preview`}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/30 to-transparent" />
            {/* Category + Award overlays */}
            <div className="absolute bottom-4 left-6 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-white/70 bg-white/[0.08] backdrop-blur-sm border border-white/[0.1] px-2.5 py-1 rounded-full">
                {categoryLabel}
              </span>
              {site.award && (
                <span className="text-[10px] uppercase tracking-widest text-[#8b5cf6] bg-[#8b5cf6]/10 backdrop-blur-sm border border-[#8b5cf6]/30 px-2.5 py-1 rounded-full">
                  {site.award}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 md:p-8">
          {/* Title row */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {site.name}
            </h2>
            <p className="text-sm text-[#8b5cf6]/80 mt-1">by {site.studio}</p>
          </div>

          {/* Description */}
          <p className="text-white/60 text-base leading-relaxed mb-8">
            {site.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#8b5cf6]/70 mb-4 font-semibold">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {(site.techStack || []).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-lg hover:bg-white/[0.08] hover:text-white/90 transition-colors duration-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights */}
          {site.highlights && site.highlights.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#8b5cf6]/70 mb-4 font-semibold">Key Highlights</h3>
              <ul className="space-y-2">
                {site.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/55">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8b5cf6]/60 shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">Technique</p>
              <p className="text-sm text-white/70">{site.technique}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">Category</p>
              <p className="text-sm text-white/70">{categoryLabel}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/30 mb-1">Year</p>
              <p className="text-sm text-white/70">{site.year || "2025–2026"}</p>
            </div>
          </div>

          {/* CTA */}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 w-full justify-center px-6 py-4 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] active:scale-[0.98]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Visit Live Site
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Related Sites Section */}
          {relatedSites.length > 0 && (
            <div className="mt-10 pt-8 border-t border-white/[0.06]">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#8b5cf6]/70 mb-5 font-semibold">
                Related in {categoryLabel}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedSites.map((related) => (
                  <div
                    key={related.name}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#8b5cf6]/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
                    onClick={() => onSelectSite?.(related)}
                  >
                    {/* Related thumbnail */}
                    {related.thumbnail && (
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <img
                          src={related.thumbnail}
                          alt={`${related.name} preview`}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent" />
                      </div>
                    )}
                    {/* Related info */}
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-white/90 mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {related.name}
                      </h4>
                      <p className="text-[11px] text-white/40 mb-2">{related.studio}</p>
                      {/* Visit link */}
                      <a
                        href={related.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-[#8b5cf6] hover:text-[#a78bfa] transition-colors duration-200"
                      >
                        Visit site
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
