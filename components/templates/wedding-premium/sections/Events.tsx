"use client";

import React from "react";
import { Clock, MapPin, Calendar, Heart, Music } from "lucide-react";
import { GoldDivider } from "../decorations";

interface EventItem {
  title?: string;
  date?: string;
  time?: string;
  venue?: string;
  description?: string;
  icon?: string;
  enabled?: boolean;
}

interface EventsProps {
  data: {
    title?: string;
    events?: EventItem[];
  };
}

export default function Events({ data }: EventsProps) {
  const titleVal = data?.title || "Wedding Program";
  const eventsVal = (data?.events || []).filter(e => e.enabled !== false);

  if (eventsVal.length === 0) return null;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case "music":
        return <Music size={18} className="text-[#E6A817]" />;
      case "heart":
        return <Heart size={18} className="text-[#E6A817]" fill="#E6A817" fillOpacity="0.1" />;
      case "calendar":
      default:
        return <Calendar size={18} className="text-[#E6A817]" />;
    }
  };

  return (
    <div className="py-8 text-center space-y-6 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">{titleVal}</h2>
      <GoldDivider />

      <div className="space-y-6">
        {eventsVal.map((event, idx) => (
          <div 
            key={idx} 
            className="border border-[#E6A817]/20 rounded-xl p-5 bg-black/25 relative overflow-hidden text-left space-y-3 shadow-lg"
          >
            {/* Top Event Title row */}
            <div className="flex items-center gap-3 border-b border-[#E6A817]/15 pb-2.5">
              <div className="w-8 h-8 rounded-full border border-[#E6A817]/30 bg-[#3A080A]/60 flex items-center justify-center shadow-md">
                {renderIcon(event.icon)}
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-[0.5px] text-[#FFF7E6] font-serif">
                  {event.title}
                </h3>
                <span className="text-[8px] text-[#E6A817] uppercase tracking-[1.5px] font-bold">
                  {event.date}
                </span>
              </div>
            </div>

            {/* Time & Venue row */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2 text-[#FFF7E6]/75 text-[9px] font-medium leading-none">
                <Clock size={11} className="text-[#E6A817]/70 shrink-0 mt-0.5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-start gap-2 text-[#FFF7E6]/75 text-[9px] leading-tight">
                <MapPin size={11} className="text-[#E6A817]/70 shrink-0 mt-0.5" />
                <span>{event.venue}</span>
              </div>
            </div>

            {/* Description text */}
            <p className="text-[#FFF7E6]/60 text-[9.5px] leading-relaxed font-sans pt-1">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
