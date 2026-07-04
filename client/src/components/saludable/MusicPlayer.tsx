/**
 * MusicPlayer — Floating inspirational ambient music toggle
 * Design: Botanical Sanctuary — organic, breathing pulse animation
 */
import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/manus-storage/inspirational-ambient_7e292ae3.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleMusic}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group"
      style={{
        background: isPlaying
          ? "linear-gradient(135deg, #8B9E7C, #A8C5A0)"
          : "rgba(45, 59, 45, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(139, 158, 124, 0.3)",
        boxShadow: isPlaying
          ? "0 0 20px rgba(139, 158, 124, 0.4), 0 4px 15px rgba(0,0,0,0.2)"
          : "0 4px 15px rgba(0,0,0,0.2)",
      }}
      aria-label={isPlaying ? "Pausar música" : "Reproducir música ambiental"}
      title={isPlaying ? "Pausar música" : "Música ambiental inspiracional"}
    >
      {/* Breathing pulse ring when playing */}
      {isPlaying && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: "rgba(139, 158, 124, 0.5)", animationDuration: "4s" }}
        />
      )}
      {/* Music icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#FDF8F0] transition-transform duration-300 group-hover:scale-110"
      >
        {isPlaying ? (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" fill="currentColor" />
            <circle cx="18" cy="16" r="3" fill="currentColor" />
          </>
        ) : (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" />
          </>
        )}
      </svg>
      {/* Label */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-[#FDF8F0]/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Ambiental
      </span>
    </button>
  );
}
