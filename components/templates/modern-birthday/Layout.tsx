"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvitationData } from "../../context/InvitationDataContext";
import { Calendar, MapPin, Clock, Phone, MessageCircle, Volume2, VolumeX, Menu, X, ArrowLeft, HelpCircle } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Decorative canvas for twinkling stars and party balloons
const CelebrationBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Twinling stars + confetti particles
    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? "rgba(245, 158, 11, 0.4)" : "rgba(168, 85, 247, 0.4)", // amber/purple glow
      speed: Math.random() * 0.5 + 0.1,
      angle: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    let animationFrameId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += p.speed;
        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export default function ModernBirthdayLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPassed, setIsPassed] = useState(false);

  // Safely resolve nested config keys for both wrapped & flat layouts
  const isWrapped = invitationData && "category" in invitationData && "config" in invitationData;
  const config = isWrapped ? (invitationData as any).config : invitationData;

  useEffect(() => {
    if (!config) return;
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 1500);

    const targetDate = config.countdown?.targetDate 
      ? new Date(config.countdown.targetDate).getTime() 
      : config.date ? new Date(`${config.date}T${config.time || "18:00:00"}`).getTime() : 0;

    const updateCountdown = () => {
      if (!targetDate) return;
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference <= 0) {
        setIsPassed(true);
      } else {
        setIsPassed(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [config]);

  if (!config) return null;

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlayingMusic(!playingMusic);
  };

  if (!mounted) return null;

  const sectionLabels: Record<string, string> = {
    hero: "Home",
    celebrant: "Celebrant",
    events: "Party Details",
    countdown: "Countdown",
    gallery: "Memories",
    venue: "Location Map",
    rsvp: "RSVP",
    faq: "Guidelines"
  };

  const sectionsOrder = config.sectionOrder || ["hero", "celebrant", "countdown", "events", "gallery", "venue", "rsvp", "faq", "footer"];

  return (
    <div className="min-h-screen bg-[#0C0714] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-purple-500 selection:text-white">
      <CelebrationBackground />

      {/* Background Audio */}
      {config.music?.enabled && config.music?.file && (
        <audio ref={audioRef} src={config.music.file} loop preload="auto" />
      )}

      {/* --- FLOATING AUDIO CONTROL --- */}
      {config.music?.enabled && (
        <button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-50 p-3 bg-purple-600/90 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all border border-purple-500/30"
        >
          {playingMusic ? <Volume2 size={20} className="animate-bounce" /> : <VolumeX size={20} />}
        </button>
      )}

      {/* --- DESKTOP SIDEBAR NAVIGATION --- */}
      <header className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-black/40 border-r border-white/5 backdrop-blur-md z-40 p-8 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="text-xl font-bold tracking-[2px] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">AHVAANAM</span>
          </div>
          <nav className="flex flex-col gap-3">
            {sectionsOrder.map((sectionId: string) => {
              if (sectionId === "footer" || !config[sectionId]?.enabled) return null;
              return (
                <a
                  key={sectionId}
                  href={`#${sectionId}`}
                  className="text-xs uppercase tracking-[1.5px] font-bold text-white/50 hover:text-white py-2 transition-colors border-l border-transparent hover:border-purple-500 pl-3"
                >
                  {sectionLabels[sectionId] || sectionId}
                </a>
              );
            })}
          </nav>
        </div>
        <div className="text-[10px] text-white/30 uppercase tracking-[1px]">
          Birthday Celebration
        </div>
      </header>

      {/* --- MOBILE NAVIGATION PANEL --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/40 border-b border-white/5 backdrop-blur-md z-45 px-6 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[2px] text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">CELEBRATION</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-white/80 hover:text-white"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-16 left-0 right-0 bg-[#0C0714]/95 border-b border-white/5 backdrop-blur-lg z-40 p-6 flex flex-col gap-4 shadow-2xl"
          >
            {sectionsOrder.map((sectionId: string) => {
              if (sectionId === "footer" || !config[sectionId]?.enabled) return null;
              return (
                <a
                  key={sectionId}
                  href={`#${sectionId}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-xs uppercase tracking-[2px] font-bold text-white/70 hover:text-white py-2"
                >
                  {sectionLabels[sectionId] || sectionId}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN PAGE VIEWPORT --- */}
      <main className="lg:ml-64 flex-1">
        {sectionsOrder.map((sectionId: string) => {
          const section = config[sectionId];
          if (!section || !section.enabled) return null;

          switch (sectionId) {
            case "hero":
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="min-h-screen relative flex items-center justify-center px-6 py-20 text-center border-b border-white/5 bg-gradient-to-b from-purple-950/20 to-transparent"
                >
                  <div className="max-w-3xl space-y-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="inline-block px-4 py-1.5 rounded-full bg-purple-600/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-[2.5px] shadow-sm mb-4"
                    >
                      {section.welcomeMessage || "Welcome to the Party"}
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-[1px] leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-purple-400">
                      {section.title || "Celebrating Life"}
                    </h1>
                    <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xl mx-auto font-medium">
                      {section.subtitle}
                    </p>
                    <div className="pt-6">
                      <a
                        href="#celebrant"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1.5px] transition-all hover:scale-105 shadow-md shadow-purple-900/30"
                      >
                        {section.ctaText || "View Invitation"}
                      </a>
                    </div>
                  </div>
                </section>
              );

            case "celebrant":
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="py-24 px-6 max-w-5xl mx-auto border-b border-white/5 text-center"
                >
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className="text-xs uppercase tracking-[3px] font-bold text-amber-400">The Celebrant</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">Meet the Birthday Star</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl max-w-xl mx-auto space-y-6">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 p-1">
                        <div className="w-full h-full rounded-full bg-[#130B1E] flex items-center justify-center text-4xl">
                          🎂
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{config.celebrant?.name || "Celebrant Name"}</h3>
                        <p className="text-xs uppercase tracking-[2px] font-bold text-purple-400">Turning {config.age || 25} Years Young</p>
                      </div>
                      <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                        Join us as we raise a toast to another year of accomplishments, laughter, and beautiful memories!
                      </p>
                    </div>
                  </div>
                </section>
              );

            case "countdown":
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="py-20 px-6 bg-purple-950/10 border-b border-white/5 text-center"
                >
                  <div className="max-w-4xl mx-auto space-y-10">
                    <div className="space-y-2">
                      <h3 className="text-xs uppercase tracking-[3px] font-bold text-purple-400">{section.title || "Party Countdown"}</h3>
                    </div>
                    {isPassed ? (
                      <p className="text-amber-400 text-lg uppercase tracking-[1.5px] font-bold">{section.postWeddingMessage || "The Celebration has begun!"}</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                        {Object.entries(timeLeft).map(([label, value]) => (
                          <div key={label} className="bg-white/[0.03] border border-white/5 rounded-2xl py-4 flex flex-col justify-center">
                            <span className="text-2xl md:text-3xl font-extrabold text-amber-400">{value}</span>
                            <span className="text-[9px] uppercase tracking-[1px] text-white/40 font-bold mt-1">{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );

            case "events":
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="py-24 px-6 max-w-5xl mx-auto border-b border-white/5"
                >
                  <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <h2 className="text-xs uppercase tracking-[3px] font-bold text-amber-400">Schedule</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">Celebration Program</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {(config.events || []).map((event: any, idx: number) => {
                        if (!event.enabled) return null;
                        return (
                          <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:border-purple-500/20 transition-all space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{event.icon || "🎉"}</span>
                              <h3 className="text-lg font-bold">{event.title}</h3>
                            </div>
                            <div className="space-y-2 text-xs text-white/60">
                              <p className="flex items-center gap-2"><Calendar size={13} className="text-purple-400" /> {event.date}</p>
                              <p className="flex items-center gap-2"><Clock size={13} className="text-purple-400" /> {event.time}</p>
                              <p className="flex items-center gap-2"><MapPin size={13} className="text-purple-400" /> {event.venue}</p>
                            </div>
                            {event.description && <p className="text-xs text-white/40 leading-relaxed pt-2">{event.description}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

            case "gallery":
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="py-24 px-6 max-w-5xl mx-auto border-b border-white/5 text-center"
                >
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className="text-xs uppercase tracking-[3px] font-bold text-amber-400">Gallery</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">{section.title || "Moments"}</p>
                    </div>

                    {section.images && section.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {section.images.map((img: string, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setLightboxIndex(idx);
                              setLightboxOpen(true);
                            }}
                            className="aspect-square bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/30 transition-all group relative"
                          >
                            <img
                              src={img}
                              alt="Gallery Moment"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                        <p className="text-white/30 text-xs font-semibold uppercase tracking-[1.5px]">No images added yet.</p>
                      </div>
                    )}
                  </div>

                  <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={(section.images || []).map((img: string) => ({ src: img }))}
                  />
                </section>
              );

            case "venue": {
              const getVenueText = () => {
                if (!config.venue) return "Grand Party Hall, City";
                if (typeof config.venue === "string") return config.venue;
                if (typeof config.venue === "object") {
                  const v = (config.venue as any).venues?.[0];
                  if (v) {
                    return `${v.venueName || ""}, ${v.address || ""}, ${v.city || ""}`;
                  }
                }
                return "Grand Party Hall, City";
              };

              const getVenueMapsUrl = () => {
                if (!config.venue) return "";
                if (typeof config.venue === "string") return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.venue)}`;
                if (typeof config.venue === "object") {
                  const v = (config.venue as any).venues?.[0];
                  if (v?.mapsUrl) return v.mapsUrl;
                  if (v) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.venueName || ""} ${v.address || ""} ${v.city || ""}`)}`;
                }
                return "";
              };

              const getVenueEmbedUrl = () => {
                if (config.venue && typeof config.venue === "object") {
                  return (config.venue as any).venues?.[0]?.embedUrl || "";
                }
                return "";
              };

              const venueText = getVenueText();
              const mapsUrl = getVenueMapsUrl();
              const embedUrl = getVenueEmbedUrl();

              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="py-24 px-6 max-w-5xl mx-auto border-b border-white/5 text-center"
                >
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className="text-xs uppercase tracking-[3px] font-bold text-purple-400">The Venue</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">Location Map</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center bg-white/[0.01] border border-white/5 p-8 rounded-3xl text-left">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold uppercase tracking-[0.5px]">Party Location</h3>
                        <p className="text-xs text-white/60 leading-relaxed">{venueText}</p>
                        {mapsUrl && (
                          <div className="pt-2">
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[1px] transition-all"
                            >
                              <MapPin size={12} className="text-purple-400" /> Open in Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          className="w-full h-64 border-0 rounded-2xl"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-64 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-xs text-white/30 font-bold tracking-[1.5px] uppercase">
                          Google Map Embed
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );
            }

            case "rsvp":
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="py-24 px-6 max-w-5xl mx-auto border-b border-white/5 text-center"
                >
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className="text-xs uppercase tracking-[3px] font-bold text-amber-400">RSVP</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">{section.title || "Confirm Attendance"}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      {(section.contacts || []).map((contact: any, idx: number) => (
                        <a
                          key={idx}
                          href={contact.type === "whatsapp" ? `https://wa.me/${contact.value}` : `tel:${contact.value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1px] transition-all shadow-md"
                        >
                          {contact.type === "whatsapp" ? <MessageCircle size={16} /> : <Phone size={16} />}
                          {contact.label || "Confirm RSVP"}
                        </a>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case "faq":
              return (
                <section
                  key={sectionId}
                  id={sectionId}
                  className="py-24 px-6 max-w-5xl mx-auto border-b border-white/5"
                >
                  <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <h2 className="text-xs uppercase tracking-[3px] font-bold text-purple-400">Info</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">{section.title || "Celebration FAQs"}</p>
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto">
                      {(section.entries || []).map((entry: any, idx: number) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-2">
                          <h4 className="text-sm font-bold flex items-start gap-2">
                            <HelpCircle size={15} className="text-purple-400 shrink-0 mt-0.5" />
                            {entry.question}
                          </h4>
                          <p className="text-xs text-white/50 pl-6 leading-relaxed">{entry.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </main>

      {/* --- FOOTER CARD --- */}
      {config.footer?.enabled && (
        <footer className="lg:ml-64 bg-black/40 border-t border-white/5 py-12 px-6 text-center space-y-4">
          <p className="text-xs uppercase tracking-[2px] font-bold text-amber-400">{config.footer.salutation || "Cheers!"}</p>
          <p className="text-[10px] text-white/30 uppercase tracking-[1px]">{config.footer.creditText}</p>
        </footer>
      )}
    </div>
  );
}
