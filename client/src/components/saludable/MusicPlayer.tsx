/**
 * MusicPlayer — Floating minimalist Bossa Nova Latin Jazz player
 * Features: Play/Pause, Volume slider, track label
 * AUTOPLAY: Music starts automatically on page load
 */
import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedAutoplay = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/manus-storage/empresa-bossa-vocal-final_697c900f.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Attempt autoplay immediately
    if (!hasAttemptedAutoplay.current) {
      hasAttemptedAutoplay.current = true;
      audioRef.current.play().catch(() => {
        // Browser blocked autoplay - wait for first user interaction
        setIsPlaying(false);
        const startOnInteraction = () => {
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
          document.removeEventListener("click", startOnInteraction);
          document.removeEventListener("scroll", startOnInteraction);
          document.removeEventListener("touchstart", startOnInteraction);
        };
        document.addEventListener("click", startOnInteraction, { once: true });
        document.addEventListener("scroll", startOnInteraction, { once: true });
        document.addEventListener("touchstart", startOnInteraction, { once: true });
      });
    }

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

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  return (
    <div
      className="flex items-center gap-3"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Expanded controls panel */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-500 overflow-hidden"
        style={{
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(139, 158, 124, 0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
          maxWidth: showControls ? "280px" : "0px",
          opacity: showControls ? 1 : 0,
          padding: showControls ? undefined : "0",
        }}
      >
        {/* Track label */}
        <span className="text-xs text-white/80 whitespace-nowrap font-medium">
          <svg className="w-3 h-3 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg>Bossa Nova
        </span>

        {/* Volume slider */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolume}
          className="w-16 h-1 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #81C784 0%, #81C784 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`,
          }}
          title={`Volumen: ${Math.round(volume * 100)}%`}
        />

        {/* Volume icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-60 flex-shrink-0">
          {volume === 0 ? (
            <><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></>
          ) : volume < 0.5 ? (
            <><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></>
          ) : (
            <><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></>
          )}
        </svg>
      </div>

      {/* Main play/pause button */}
      <button
        onClick={toggleMusic}
        className="music-player-btn w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group relative"
        style={{
          background: isPlaying
            ? "linear-gradient(135deg, #66BB6A, #81C784)"
            : "rgba(45, 59, 45, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(139, 158, 124, 0.4)",
          boxShadow: isPlaying
            ? "0 0 25px rgba(102, 187, 106, 0.4), 0 4px 20px rgba(0,0,0,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
        aria-label={isPlaying ? "Pausar música" : "Reproducir Bossa Nova"}
        title={isPlaying ? "Pausar música" : "Bossa Nova Latin Jazz"}
      >
        {/* Breathing pulse ring when playing */}
        {isPlaying && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-15"
            style={{ background: "rgba(102, 187, 106, 0.5)", animationDuration: "3s" }}
          />
        )}
        {/* Play/Pause icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-white transition-transform duration-200 group-hover:scale-110"
        >
          {isPlaying ? (
            <>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </>
          ) : (
            <path d="M8 5v14l11-7z" />
          )}
        </svg>
      </button>
    </div>
  );
}
