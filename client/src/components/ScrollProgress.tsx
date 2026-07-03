import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (barRef.current) {
        barRef.current.style.height = `${progress}%`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 w-[3px] h-full z-[100] hidden md:block">
      <div className="absolute inset-0 bg-white/5" />
      <div
        ref={barRef}
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#8b5cf6] to-[#6d28d9] transition-none"
        style={{ height: "0%" }}
      />
    </div>
  );
}
