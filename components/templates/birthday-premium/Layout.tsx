"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvitationData } from "../../context/InvitationDataContext";
import { Calendar, MapPin, Clock, Phone, MessageCircle, Volume2, VolumeX, Menu, X, HelpCircle } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Theme palette definitions for 10 premium birthday themes
const THEME_PALETTES: Record<string, { bg: string; text: string; accent: string; surface: string; border: string; gradient: string }> = {
  midnight:  { bg: "bg-[#0A0E1A]", text: "text-white", accent: "text-indigo-400", surface: "bg-white/[0.03]", border: "border-indigo-500/20", gradient: "from-indigo-400 to-blue-600" },
  marble:    { bg: "bg-[#F5F0EB]", text: "text-stone-800", accent: "text-stone-500", surface: "bg-white/60", border: "border-stone-300/40", gradient: "from-stone-400 to-stone-600" },
  emerald:   { bg: "bg-[#0B1F17]", text: "text-white", accent: "text-emerald-400", surface: "bg-white/[0.03]", border: "border-emerald-500/20", gradient: "from-emerald-400 to-teal-600" },
  navy:      { bg: "bg-[#0C1425]", text: "text-white", accent: "text-sky-400", surface: "bg-white/[0.03]", border: "border-sky-500/20", gradient: "from-sky-400 to-blue-600" },
  burgundy:  { bg: "bg-[#1A0A0F]", text: "text-white", accent: "text-rose-400", surface: "bg-white/[0.03]", border: "border-rose-500/20", gradient: "from-rose-400 to-red-600" },
  champagne: { bg: "bg-[#FAF6F0]", text: "text-amber-900", accent: "text-amber-600", surface: "bg-white/60", border: "border-amber-300/40", gradient: "from-amber-400 to-yellow-600" },
  glass:     { bg: "bg-[#0F0F1A]", text: "text-white", accent: "text-violet-400", surface: "bg-white/[0.04]", border: "border-violet-500/20", gradient: "from-violet-400 to-purple-600" },
  rosegold:  { bg: "bg-[#1A1015]", text: "text-white", accent: "text-pink-400", surface: "bg-white/[0.03]", border: "border-pink-500/20", gradient: "from-pink-400 to-rose-600" },
  artdeco:   { bg: "bg-[#0D0D0D]", text: "text-white", accent: "text-amber-400", surface: "bg-white/[0.03]", border: "border-amber-500/20", gradient: "from-amber-400 to-yellow-600" },
  botanical: { bg: "bg-[#F0F5ED]", text: "text-green-900", accent: "text-green-600", surface: "bg-white/60", border: "border-green-300/40", gradient: "from-green-500 to-emerald-600" },
};

export default function PremiumBirthdayTemplateLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPassed, setIsPassed] = useState(false);

  const isWrapped = invitationData && "category" in invitationData && "config" in invitationData;
  const config = isWrapped ? (invitationData as any).config : invitationData;

  const themeId = config?.themeId || "midnight";
  const palette = THEME_PALETTES[themeId] || THEME_PALETTES.midnight;
  const isDark = !["marble", "champagne", "botanical"].includes(themeId);

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
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [config]);

  if (!config) return null;

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playingMusic) { audioRef.current.pause(); } else { audioRef.current.play().catch(() => {}); }
    setPlayingMusic(!playingMusic);
  };

  if (!mounted) return null;

  const sectionLabels: Record<string, string> = {
    hero: "Home", celebrant: "Celebrant", events: "Party Details",
    countdown: "Countdown", gallery: "Memories", venue: "Location",
    rsvp: "RSVP", faq: "FAQs"
  };

  const sectionsOrder = config.sectionOrder || ["hero", "celebrant", "countdown", "events", "gallery", "venue", "rsvp", "faq", "footer"];

  return (
    <div className={`min-h-screen ${palette.bg} ${palette.text} flex flex-col font-sans relative overflow-x-hidden`}>
      {config.music?.enabled && config.music?.file && (
        <audio ref={audioRef} src={config.music.file} loop preload="auto" />
      )}

      {config.music?.enabled && (
        <button onClick={toggleMusic} className={`fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg transition-all border ${palette.border} ${isDark ? "bg-white/10 hover:bg-white/20 text-white" : "bg-black/5 hover:bg-black/10 text-current"}`}>
          {playingMusic ? <Volume2 size={20} className="animate-bounce" /> : <VolumeX size={20} />}
        </button>
      )}

      {/* Desktop sidebar */}
      <header className={`hidden lg:flex fixed left-0 top-0 bottom-0 w-64 ${isDark ? "bg-black/40" : "bg-white/60"} border-r ${palette.border} backdrop-blur-md z-40 p-8 flex-col justify-between`}>
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className={`text-xl font-bold tracking-[2px] text-transparent bg-clip-text bg-gradient-to-r ${palette.gradient}`}>AHVAANAM</span>
          </div>
          <nav className="flex flex-col gap-3">
            {sectionsOrder.map((sectionId: string) => {
              if (sectionId === "footer" || !config[sectionId]?.enabled) return null;
              return (
                <a key={sectionId} href={`#${sectionId}`}
                  className={`text-xs uppercase tracking-[1.5px] font-bold ${isDark ? "text-white/50 hover:text-white" : "text-current/50 hover:text-current"} py-2 transition-colors border-l border-transparent hover:${palette.border} pl-3`}>
                  {sectionLabels[sectionId] || sectionId}
                </a>
              );
            })}
          </nav>
        </div>
        <div className={`text-[10px] ${isDark ? "text-white/30" : "text-current/30"} uppercase tracking-[1px]`}>Birthday Celebration</div>
      </header>

      {/* Mobile nav */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 ${isDark ? "bg-black/40" : "bg-white/60"} border-b ${palette.border} backdrop-blur-md z-45 px-6 flex items-center justify-between`}>
        <span className={`text-sm font-bold tracking-[2px] text-transparent bg-clip-text bg-gradient-to-r ${palette.gradient}`}>CELEBRATION</span>
        <button onClick={() => setMenuOpen(!menuOpen)} className={`p-2 ${isDark ? "text-white/80 hover:text-white" : "text-current/80 hover:text-current"}`}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`lg:hidden fixed top-16 left-0 right-0 ${palette.bg}/95 border-b ${palette.border} backdrop-blur-lg z-40 p-6 flex flex-col gap-4 shadow-2xl`}>
            {sectionsOrder.map((sectionId: string) => {
              if (sectionId === "footer" || !config[sectionId]?.enabled) return null;
              return (
                <a key={sectionId} href={`#${sectionId}`} onClick={() => setMenuOpen(false)}
                  className={`text-xs uppercase tracking-[2px] font-bold ${isDark ? "text-white/70 hover:text-white" : "text-current/70 hover:text-current"} py-2`}>
                  {sectionLabels[sectionId] || sectionId}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-64 flex-1">
        {sectionsOrder.map((sectionId: string) => {
          const section = config[sectionId];
          if (!section || !section.enabled) return null;

          switch (sectionId) {
            case "hero":
              return (
                <section key={sectionId} id={sectionId} className={`min-h-screen relative flex items-center justify-center px-6 py-20 text-center border-b ${palette.border}`}>
                  <div className="max-w-3xl space-y-6 relative z-10">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}
                      className={`inline-block px-4 py-1.5 rounded-full ${palette.surface} border ${palette.border} ${palette.accent} text-[10px] font-bold uppercase tracking-[2.5px] shadow-sm mb-4`}>
                      {section.welcomeMessage || "Welcome to the Party"}
                    </motion.div>
                    <h1 className={`text-5xl md:text-7xl font-extrabold uppercase tracking-[1px] leading-tight text-transparent bg-clip-text bg-gradient-to-r ${palette.gradient}`}>
                      {section.title || "Celebrating Life"}
                    </h1>
                    <p className={`text-sm md:text-base ${isDark ? "text-white/70" : "text-current/70"} leading-relaxed max-w-xl mx-auto font-medium`}>{section.subtitle}</p>
                    <div className="pt-6">
                      <a href="#celebrant" className={`inline-flex items-center gap-2 bg-gradient-to-r ${palette.gradient} text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1.5px] transition-all hover:scale-105 shadow-md`}>
                        {section.ctaText || "View Invitation"}
                      </a>
                    </div>
                  </div>
                </section>
              );

            case "celebrant":
              return (
                <section key={sectionId} id={sectionId} className={`py-24 px-6 max-w-5xl mx-auto border-b ${palette.border} text-center`}>
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className={`text-xs uppercase tracking-[3px] font-bold ${palette.accent}`}>The Celebrant</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">Meet the Birthday Star</p>
                    </div>
                    <div className={`${palette.surface} border ${palette.border} p-8 md:p-12 rounded-3xl max-w-xl mx-auto space-y-6`}>
                      <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-tr ${palette.gradient} p-1`}>
                        <div className={`w-full h-full rounded-full ${palette.bg} flex items-center justify-center text-4xl`}>🎂</div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{config.celebrant?.name || "Celebrant Name"}</h3>
                        <p className={`text-xs uppercase tracking-[2px] font-bold ${palette.accent}`}>Turning {config.age || 25} Years Young</p>
                      </div>
                      <p className={`text-xs ${isDark ? "text-white/50" : "text-current/50"} max-w-md mx-auto leading-relaxed`}>
                        Join us as we raise a toast to another year of accomplishments, laughter, and beautiful memories!
                      </p>
                    </div>
                  </div>
                </section>
              );

            case "countdown":
              return (
                <section key={sectionId} id={sectionId} className={`py-20 px-6 border-b ${palette.border} text-center`}>
                  <div className="max-w-4xl mx-auto space-y-10">
                    <h3 className={`text-xs uppercase tracking-[3px] font-bold ${palette.accent}`}>{section.title || "Party Countdown"}</h3>
                    {isPassed ? (
                      <p className={`${palette.accent} text-lg uppercase tracking-[1.5px] font-bold`}>{section.postWeddingMessage || "The Celebration has begun!"}</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                        {Object.entries(timeLeft).map(([label, value]) => (
                          <div key={label} className={`${palette.surface} border ${palette.border} rounded-2xl py-4 flex flex-col justify-center`}>
                            <span className={`text-2xl md:text-3xl font-extrabold ${palette.accent}`}>{value}</span>
                            <span className={`text-[9px] uppercase tracking-[1px] ${isDark ? "text-white/40" : "text-current/40"} font-bold mt-1`}>{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );

            case "events":
              return (
                <section key={sectionId} id={sectionId} className={`py-24 px-6 max-w-5xl mx-auto border-b ${palette.border}`}>
                  <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <h2 className={`text-xs uppercase tracking-[3px] font-bold ${palette.accent}`}>Schedule</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">Celebration Program</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                      {(config.events || []).map((event: any, idx: number) => {
                        if (!event.enabled) return null;
                        return (
                          <div key={idx} className={`${palette.surface} border ${palette.border} p-6 rounded-2xl hover:scale-[1.02] transition-all space-y-4`}>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{event.icon || "🎉"}</span>
                              <h3 className="text-lg font-bold">{event.title}</h3>
                            </div>
                            <div className={`space-y-2 text-xs ${isDark ? "text-white/60" : "text-current/60"}`}>
                              <p className="flex items-center gap-2"><Calendar size={13} className={palette.accent} /> {event.date}</p>
                              <p className="flex items-center gap-2"><Clock size={13} className={palette.accent} /> {event.time}</p>
                              <p className="flex items-center gap-2"><MapPin size={13} className={palette.accent} /> {event.venue}</p>
                            </div>
                            {event.description && <p className={`text-xs ${isDark ? "text-white/40" : "text-current/40"} leading-relaxed pt-2`}>{event.description}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );

            case "gallery":
              return (
                <section key={sectionId} id={sectionId} className={`py-24 px-6 max-w-5xl mx-auto border-b ${palette.border} text-center`}>
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className={`text-xs uppercase tracking-[3px] font-bold ${palette.accent}`}>Gallery</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">{section.title || "Moments"}</p>
                    </div>
                    {section.images && section.images.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {section.images.map((img: string, idx: number) => (
                          <div key={idx} onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}
                            className={`aspect-square ${palette.surface} border ${palette.border} rounded-2xl overflow-hidden cursor-pointer transition-all group relative hover:scale-[1.02]`}>
                            <img src={img} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-12 border border-dashed ${palette.border} rounded-3xl ${palette.surface}`}>
                        <p className={`${isDark ? "text-white/30" : "text-current/30"} text-xs font-semibold uppercase tracking-[1.5px]`}>No images added yet.</p>
                      </div>
                    )}
                  </div>
                  <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} index={lightboxIndex}
                    slides={(section.images || []).map((img: string) => ({ src: img }))} />
                </section>
              );

            case "venue": {
              const getVenueText = () => {
                if (!config.venue) return "Grand Party Hall, City";
                if (typeof config.venue === "string") return config.venue;
                if (typeof config.venue === "object") {
                  const v = (config.venue as any).venues?.[0];
                  if (v) return `${v.venueName || ""}, ${v.address || ""}, ${v.city || ""}`;
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
                if (config.venue && typeof config.venue === "object") return (config.venue as any).venues?.[0]?.embedUrl || "";
                return "";
              };
              const venueText = getVenueText();
              const mapsUrl = getVenueMapsUrl();
              const embedUrl = getVenueEmbedUrl();

              return (
                <section key={sectionId} id={sectionId} className={`py-24 px-6 max-w-5xl mx-auto border-b ${palette.border} text-center`}>
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className={`text-xs uppercase tracking-[3px] font-bold ${palette.accent}`}>The Venue</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">Location Map</p>
                    </div>
                    <div className={`grid md:grid-cols-2 gap-8 items-center ${palette.surface} border ${palette.border} p-8 rounded-3xl text-left`}>
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold uppercase tracking-[0.5px]">Party Location</h3>
                        <p className={`text-xs ${isDark ? "text-white/60" : "text-current/60"} leading-relaxed`}>{venueText}</p>
                        {mapsUrl && (
                          <div className="pt-2">
                            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                              className={`inline-flex items-center gap-1.5 ${palette.surface} hover:opacity-80 border ${palette.border} px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[1px] transition-all`}>
                              <MapPin size={12} className={palette.accent} /> Open in Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                      {embedUrl ? (
                        <iframe src={embedUrl} className="w-full h-64 border-0 rounded-2xl" allowFullScreen loading="lazy" />
                      ) : (
                        <div className={`h-64 ${palette.surface} border ${palette.border} rounded-2xl flex items-center justify-center text-xs ${isDark ? "text-white/30" : "text-current/30"} font-bold tracking-[1.5px] uppercase`}>
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
                <section key={sectionId} id={sectionId} className={`py-24 px-6 max-w-5xl mx-auto border-b ${palette.border} text-center`}>
                  <div className="space-y-12">
                    <div className="max-w-2xl mx-auto space-y-3">
                      <h2 className={`text-xs uppercase tracking-[3px] font-bold ${palette.accent}`}>RSVP</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">{section.title || "Confirm Attendance"}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                      {(section.contacts || []).map((contact: any, idx: number) => (
                        <a key={idx} href={contact.type === "whatsapp" ? `https://wa.me/${contact.value}` : `tel:${contact.value}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[1px] transition-all shadow-md">
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
                <section key={sectionId} id={sectionId} className={`py-24 px-6 max-w-5xl mx-auto border-b ${palette.border}`}>
                  <div className="space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                      <h2 className={`text-xs uppercase tracking-[3px] font-bold ${palette.accent}`}>Info</h2>
                      <p className="text-3xl md:text-4xl font-extrabold uppercase tracking-[0.5px]">{section.title || "Celebration FAQs"}</p>
                    </div>
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {(section.entries || []).map((entry: any, idx: number) => (
                        <div key={idx} className={`${palette.surface} border ${palette.border} p-6 rounded-2xl space-y-2`}>
                          <h4 className="text-sm font-bold flex items-start gap-2">
                            <HelpCircle size={15} className={`${palette.accent} shrink-0 mt-0.5`} />
                            {entry.question}
                          </h4>
                          <p className={`text-xs ${isDark ? "text-white/50" : "text-current/50"} pl-6 leading-relaxed`}>{entry.answer}</p>
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

      {/* Footer */}
      {config.footer?.enabled && (
        <footer className={`lg:ml-64 ${isDark ? "bg-black/40" : "bg-white/40"} border-t ${palette.border} py-12 px-6 text-center space-y-4`}>
          <p className={`text-xs uppercase tracking-[2px] font-bold ${palette.accent}`}>{config.footer.salutation || "Cheers!"}</p>
          <p className={`text-[10px] ${isDark ? "text-white/30" : "text-current/30"} uppercase tracking-[1px]`}>{config.footer.creditText}</p>
        </footer>
      )}
    </div>
  );
}