import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';

export const Hero: React.FC = () => {
  const { cmsConfig, setActiveView, setActiveCategoryFilter } = useStore();
  const [scrollY, setScrollY] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Attempt audible playback as soon as the media is ready, and retry after visibility changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.defaultMuted = false;
    video.removeAttribute('muted');

    const tryPlay = () => {
      if (document.visibilityState === 'hidden' || !video.paused) return;
      video.play().catch(() => {});
    };

    const retryWhenVisible = () => {
      if (document.visibilityState === 'visible') tryPlay();
    };

    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('canplaythrough', tryPlay);
    document.addEventListener('visibilitychange', retryWhenVisible);
    window.addEventListener('pageshow', tryPlay);
    window.addEventListener('pointerdown', tryPlay, { once: true, passive: true });
    window.addEventListener('keydown', tryPlay, { once: true });

    // Pause video when the hero section scrolls out of view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { root: null, threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    tryPlay();

    return () => {
      video.removeEventListener('loadedmetadata', tryPlay);
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('canplaythrough', tryPlay);
      document.removeEventListener('visibilitychange', retryWhenVisible);
      window.removeEventListener('pageshow', tryPlay);
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      observer.disconnect();
    };
  }, []);

  const handleCtaClick = () => {
    setActiveCategoryFilter('ALL');
    setActiveView('shop');
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !muted;
    videoRef.current.muted = nextMuted;
    setMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    const el = sectionRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Subtle slow parallax calculation (max 40px offset)
  const parallaxOffset = Math.min(scrollY * 0.15, 40);

  return (
    <section ref={sectionRef} className="relative w-full h-[88vh] min-h-[620px] max-h-[1080px] overflow-hidden bg-[#11100E]">
      {/* Background Video */}
      <div
        className="absolute inset-0 w-full h-full animate-fade-in-scale transition-transform duration-100 ease-out overflow-hidden"
        style={{ transform: `translateY(${parallaxOffset}px) scale(1.02)` }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/main video.mp4"
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
        />
        {/* Soft Dark Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/80 via-[#11100E]/30 to-[#11100E]/50" />
      </div>

      {/* Hero Content with Staggered Entrance Animations */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-end pt-8 pb-14 md:pt-0 md:pb-28 text-[#F5F1EB]">
        <div className="max-w-2xl space-y-3 md:space-y-4 -translate-y-20 md:translate-y-0">

          {/* Tagline / Subheadline - Fade Up 1 */}
          <p className="animate-fade-up text-[11px] md:text-xs font-sans uppercase tracking-[0.4em] text-[#D8C8B7] font-medium opacity-0 [animation-delay:300ms] [animation-fill-mode:forwards]">
            {cmsConfig.heroSubheadline}
          </p>

          {/* Main Brand Editorial Headline - Fade Up 2 */}
          <h2 className="animate-fade-up font-serif text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.2em] leading-tight uppercase opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]">
            {cmsConfig.heroHeadline}
          </h2>

          {/* CTA Button - Fade Up 4 */}
          <div className="animate-fade-up pt-4 opacity-0 [animation-delay:850ms] [animation-fill-mode:forwards]">
            <button
              onClick={handleCtaClick}
              className="group inline-flex items-center gap-4 bg-[#F5F1EB] text-[#11100E] px-8 py-4 text-xs font-sans uppercase tracking-[0.3em] font-medium hover:bg-[#EEE8DF] transition-all shadow-lg hover:shadow-xl"
            >
              <span>{cmsConfig.heroCtaText || 'SHOP COLLECTION'}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>


      </div>

      {/* ── Video Controls — fixed to bottom-left edge of hero ── */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-10 z-20 flex items-center gap-3">
        {/* Fullscreen */}
        <button
          id="hero-fullscreen"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#F5F1EB]/30 bg-[#11100E]/40 backdrop-blur-md hover:border-[#A99684] hover:bg-[#A99684]/20 transition-all duration-300"
        >
          {isFullscreen
            ? <Minimize size={14} className="text-[#F5F1EB]/80 group-hover:text-[#F5F1EB]" />
            : <Maximize size={14} className="text-[#F5F1EB]/80 group-hover:text-[#F5F1EB]" />
          }
        </button>

        {/* Mute / Unmute */}
        <button
          id="hero-mute-toggle"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#F5F1EB]/30 bg-[#11100E]/40 backdrop-blur-md hover:border-[#A99684] hover:bg-[#A99684]/20 transition-all duration-300"
        >
          {muted
            ? <VolumeX size={14} className="text-[#F5F1EB]/80 group-hover:text-[#F5F1EB]" />
            : <Volume2 size={14} className="text-[#F5F1EB]/80 group-hover:text-[#F5F1EB]" />
          }
        </button>

        {/* Status label */}
        <span className="hidden md:block text-[9px] font-sans uppercase tracking-[0.3em] text-[#D8C8B7]/50 select-none">
          {muted ? 'SOUND OFF' : 'SOUND ON'}
        </span>
      </div>

    </section>
  );
};
