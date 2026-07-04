/**
 * FuturisticCursor — Glowing dot + trailing ring with state changes
 * Uses event delegation to avoid duplicate listener issues
 * Hides on touch devices via CSS media query
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function FuturisticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Move cursor elements
    const onMove = (e: MouseEvent) => {
      gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power2.out" });
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.25, ease: "power2.out" });
    };

    // Shrink on click
    const onMouseDown = () => {
      gsap.to(dot, { scale: 0.6, duration: 0.1 });
      gsap.to(ring, { scale: 0.8, duration: 0.1 });
    };
    const onMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
      gsap.to(ring, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
    };

    // Event delegation for hover state — no per-element listeners needed
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [data-cursor-hover], input, select, textarea, .magnetic-btn");
      if (isInteractive) {
        gsap.to(ring, { scale: 2.2, opacity: 0.6, borderColor: "rgba(107,175,141,0.8)", duration: 0.3 });
        gsap.to(dot, { scale: 1.5, backgroundColor: "#6BAF8D", duration: 0.3 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const isInteractive = target.closest("a, button, [data-cursor-hover], input, select, textarea, .magnetic-btn");
      const stillInside = relatedTarget?.closest("a, button, [data-cursor-hover], input, select, textarea, .magnetic-btn");
      if (isInteractive && !stillInside) {
        gsap.to(ring, { scale: 1, opacity: 1, borderColor: "rgba(107,175,141,0.5)", duration: 0.4, ease: "elastic.out(1, 0.4)" });
        gsap.to(dot, { scale: 1, backgroundColor: "#6BAF8D", duration: 0.3 });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      {/* Inner dot — glowing green */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          backgroundColor: "#6BAF8D",
          boxShadow: "0 0 12px rgba(107,175,141,0.8), 0 0 30px rgba(107,175,141,0.4)",
        }}
      />
      {/* Outer ring — trailing follower */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{
          border: "1.5px solid rgba(107,175,141,0.5)",
          boxShadow: "0 0 15px rgba(107,175,141,0.15)",
        }}
      />
    </>
  );
}
