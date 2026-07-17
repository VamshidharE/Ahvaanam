"use client";

import React, { useEffect, useState } from "react";
import { GoldDivider } from "../decorations";

interface CountdownProps {
  data: {
    title?: string;
    targetDate?: string;
    postWeddingMessage?: string;
  };
}

export default function Countdown({ data }: CountdownProps) {
  const titleVal = data?.title || "Days until the celebrations";
  const targetDateVal = data?.targetDate || "2026-07-24T09:00:00";
  const postMsgVal = data?.postWeddingMessage || "We are officially married! Thank you for your blessings.";

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDateVal) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateVal]);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds }
  ];

  return (
    <div className="py-8 text-center space-y-5 select-none">
      <h2 className="text-xl font-bold uppercase tracking-[2.5px] text-[#E6A817] font-serif">{titleVal}</h2>
      <GoldDivider />

      {timeLeft.isOver ? (
        <p className="text-[#FFF7E6] text-xs font-serif font-bold p-4 border border-[#E6A817]/25 rounded-xl bg-black/20 animate-pulse">
          {postMsgVal}
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2.5 max-w-[350px] mx-auto pt-2">
          {timeBlocks.map((block, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center p-3 border border-[#E6A817]/25 bg-black/25 rounded-xl min-w-[70px] shadow-lg relative overflow-hidden"
            >
              <span className="text-2xl font-extrabold tracking-[0.5px] text-[#FFF7E6] font-serif leading-none">
                {String(block.value).padStart(2, "0")}
              </span>
              <span className="text-[7px] text-[#E6A817] uppercase tracking-[1.5px] font-bold mt-2">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
