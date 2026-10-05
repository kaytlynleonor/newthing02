import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

// Place your video in the /public folder as-is.
// Vite serves public/ files at the root path.
const VIDEO_SRC = '/main video.mp4';

export const FashionVideo: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleToggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <section className="relative w-full bg-[#11100E] py-0 overflow-hidden">
      {/* Top editorial label */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-16 pt-8 pointer-events-none">
        <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#A99684]">
          Campaign Film
        </span>
        <span className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#A99684]">
          Autumn / Winter
        </span>
      </div>

      {/* Video Container — cinematic 16:9 */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {/* HTML5 local video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={VIDEO_SRC}
          playsInline
          loop
        />

        {/* Play/Pause overlay — always on top */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer group"
          onClick={handleToggle}
        >
          {/* Gradient overlay — lightens when paused */}
          <div
            className={`absolute inset-0 transition-all duration-700 ${
              playing
                ? 'bg-[#11100E]/0 group-hover:bg-[#11100E]/30'
                : 'bg-[#11100E]/55'
            }`}
          />

          {/* Play / Pause button */}
          <div
            className={`relative z-10 flex flex-col items-center gap-6 transition-opacity duration-500 ${
              playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#F5F1EB]/60 flex items-center justify-center bg-[#11100E]/30 backdrop-blur-sm group-hover:bg-[#A99684]/30 group-hover:border-[#A99684] transition-all duration-500 group-hover:scale-110">
              {playing ? (
                <Pause size={28} className="text-[#F5F1EB] fill-[#F5F1EB]" />
              ) : (
                <Play size={28} className="text-[#F5F1EB] ml-1 fill-[#F5F1EB]" />
              )}
            </div>

            {!playing && (
              <div className="text-center">
                <p className="font-serif text-[#F5F1EB] text-2xl md:text-4xl tracking-[0.25em] font-extralight uppercase">
                  The Autumn Campaign
                </p>
                <p className="text-[10px] font-sans uppercase tracking-[0.4em] text-[#A99684] mt-2">
                  KAYTLYN LEONOR • A/W COLLECTION FILM
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom editorial caption bar */}
      <div className="bg-[#0D0C0A] px-8 md:px-16 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-t border-[#2C2925]">
        <div>
          <p className="font-serif text-[#F5F1EB]/90 text-sm md:text-base tracking-[0.2em] font-light uppercase">
            KAYTLYN LEONOR — Autumn / Winter
          </p>
          <p className="text-[10px] font-sans text-[#A99684] tracking-[0.25em] uppercase mt-0.5">
            Quiet confidence. Timeless beauty.
          </p>
        </div>
        <span className="text-[9px] font-sans text-[#A99684]/60 uppercase tracking-[0.2em]">
          Campaign Film © 2026
        </span>
      </div>
    </section>
  );
};
