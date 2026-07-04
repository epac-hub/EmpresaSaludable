/**
 * FuturisticCursor — Glowing dot + trailing ring + particle trail
 * Uses event delegation to avoid duplicate listener issues
 * Particle trail: small dots spawn at cursor position and fade out with physics
 * Hides on touch devices via CSS media query
 */
import { useEffect, useRef } from "react";
import gsap from "gsap";

const TRAIL_COUNT = 12; // Number of trail particles

export default function FuturisticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const trailContainer = trailRef.current;
    if (!dot || !ring || !trailContainer) return;

    // Create trail particle elements
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const p = document.createElement("div");
      p.className = "fixed top-0 left-0 rounded-full pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 hidden md:block";
      p.style.width = `${4 + Math.random() * 4}px`;
      p.style.height = p.style.width;
      p.style.backgroundColor = "rgba(107,175,141,0.7)";
      p.style.boxShadow = "0 0 6px rgba(107,175,141,0.5)";
      p.style.opacity = "0";
      trailContainer.appendChild(p);
      particles.push(p);
    }

    let particleIndex = 0;
    let lastX = 0;
    let lastY = 0;
    let frameCount = 0;

    // Move cursor elements + spawn trail particles
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      gsap.to(dot, { x, y, duration: 0.08, ease: "power2.out" });
      gsap.to(ring, { x, y, duration: 0.25, ease: "power2.out" });

      // Spawn particle every 3 frames for performance
      frameCount++;
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (frameCount % 2 === 0 && dist > 3) {
        const p = particles[particleIndex % TRAIL_COUNT];
        // Random offset for organic feel
        const offsetX = (Math.random() - 0.5) * 8;
        const offsetY = (Math.random() - 0.5) * 8;

        gsap.killTweensOf(p);
        gsap.set(p, {
          x: x + offsetX,
          y: y + offsetY,
          opacity: 0.8,
          scale: 1,
        });
        gsap.to(p, {
          opacity: 0,
          scale: 0.2,
          x: x + offsetX + (Math.random() - 0.5) * 30,
          y: y + offsetY + Math.random() * 20 + 10, // slight gravity
          duration: 0.6 + Math.random() * 0.4,
          ease: "power2.out",
        });

        particleIndex++;
      }

      lastX = x;
      lastY = y;
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

    // Event delegation for hover state
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
      // Clean up particles
      particles.forEach((p) => p.remove());
    };
  }, []);

  return (
    <>
      {/* Particle trail container */}
      <div ref={trailRef} className="fixed inset-0 pointer-events-none z-[9997]" />
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
