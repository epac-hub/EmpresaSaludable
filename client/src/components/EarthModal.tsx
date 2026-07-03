/**
 * EarthModal — Detail modal for Earth Collection cards
 * Earthy palette: terracotta (#c4956a), sage (#7a9e7e), cream (#e8ddd0), dark earth (#1a1612)
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface EarthSiteData {
  name: string;
  studio: string;
  description: string;
  technique: string;
  url: string;
  award?: string;
  thumbnail: string;
  category: string;
  techStack?: string[];
  highlights?: string[];
}

interface EarthModalProps {
  site: EarthSiteData | null;
  allSites: EarthSiteData[];
  onClose: () => void;
  onSelectSite: (site: EarthSiteData) => void;
}

export default function EarthModal({ site, allSites, onClose, onSelectSite }: EarthModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (site) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "power3.out" });
    }
    return () => { document.body.style.overflow = ""; };
  }, [site]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!site) return null;

  const relatedSites = allSites.filter(s => s.category === site.category && s.name !== site.name).slice(0, 3);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#0d0b09]/90 backdrop-blur-md" onClick={onClose} />

      {/* Modal content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-2xl bg-[#1a1612] border border-[#3d3228]/60 rounded-2xl overflow-hidden shadow-2xl my-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1612]/80 border border-[#3d3228] text-[#b8a898] hover:text-[#c4956a] hover:border-[#c4956a]/50 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <img src={site.thumbnail} alt={`${site.name} preview`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] via-[#1a1612]/50 to-transparent" />
          {/* Badges */}
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#7a9e7e] bg-[#1a1612]/80 backdrop-blur-sm border border-[#7a9e7e]/30 px-2.5 py-1 rounded-full">
              {site.category}
            </span>
            {site.award && (
              <span className="text-[10px] uppercase tracking-widest text-[#c4956a] bg-[#1a1612]/80 backdrop-blur-sm border border-[#c4956a]/30 px-2.5 py-1 rounded-full">
                {site.award}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#e8ddd0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {site.name}
            </h2>
            <p className="text-sm text-[#7a9e7e] mt-1">by {site.studio}</p>
          </div>

          {/* Description */}
          <p className="text-[#b8a898]/80 text-base leading-relaxed">{site.description}</p>

          {/* Tech Stack */}
          {site.techStack && site.techStack.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c4956a]/70 mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {site.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 text-xs text-[#e8ddd0]/80 bg-[#3d3228]/40 border border-[#3d3228] rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights */}
          {site.highlights && site.highlights.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c4956a]/70 mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {site.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#b8a898]/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7a9e7e] mt-1.5 shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-[#3d3228]/40">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#b8a898]/40">Technique</span>
              <p className="text-sm text-[#e8ddd0]/80 mt-1">{site.technique}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#b8a898]/40">Category</span>
              <p className="text-sm text-[#e8ddd0]/80 mt-1 capitalize">{site.category}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#b8a898]/40">Aesthetic</span>
              <p className="text-sm text-[#e8ddd0]/80 mt-1">Earthy</p>
            </div>
          </div>

          {/* Visit button */}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#c4956a] text-[#1a1612] font-semibold text-sm hover:bg-[#d4a87a] transition-colors duration-200"
          >
            Visit Live Site
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Related Sites */}
          {relatedSites.length > 0 && (
            <div className="pt-6 border-t border-[#3d3228]/40">
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#c4956a]/70 mb-4">
                Related in {site.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedSites.map((related) => (
                  <div
                    key={related.name}
                    className="group/rel cursor-pointer rounded-xl border border-[#3d3228]/40 bg-[#231e18]/60 overflow-hidden hover:border-[#c4956a]/30 transition-all duration-300"
                    onClick={() => onSelectSite(related)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={related.thumbnail}
                        alt={`${related.name} preview`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/rel:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612] to-transparent" />
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-[#e8ddd0] group-hover/rel:text-[#c4956a] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {related.name}
                      </h4>
                      <p className="text-[10px] text-[#7a9e7e]/70 mt-0.5">{related.studio}</p>
                      <a
                        href={related.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#c4956a] mt-2 hover:text-[#d4a87a]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit site
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
