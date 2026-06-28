"use client";

import { invitation } from "../data/invitation";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from "react";

export default function PremiumGallery() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (invitation.gallery.length === 0) return null;

  return (
    <section className="py-24 px-6">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center text-5xl text-yellow-200 [font-family:var(--great)]"
      >
        Our Moments
      </motion.h2>

      <div className="mx-auto mb-12 flex w-48 items-center justify-center gap-3">
        <div className="h-px flex-1 bg-yellow-500/40" />
        <span className="text-yellow-300">✦ ✦ ✦</span>
        <div className="h-px flex-1 bg-yellow-500/40" />
        </div>

      <div className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#24161c] to-[#161015] p-3">
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop
        >
          {invitation.gallery.map((image, index) => (
            <SwiperSlide key={index}>

              <motion.div
                onClick={() => {
                    setIndex(index);
                    setOpen(true);
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="group relative cursor-pointer overflow-hidden rounded-[30px] border-2 border-[#d4af37]/40 bg-[#1b1418] p-2"
                >
                <div className="overflow-hidden rounded-[22px]">
                    <Image
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    width={500}
                    height={650}
                    className="h-[520px] w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
                    <span className="opacity-0 group-hover:opacity-100 text-4xl text-white transition duration-300">
                    🔍
                    </span>
                </div>

                {/* Gold Border */}
                <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-[#f5d57a]/20" />
                </motion.div>

            </SwiperSlide>
          ))}

        </Swiper>

      </div>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={index}
            slides={invitation.gallery.map((img) => ({
                src: img,
            }))}
            />
    </section>
  );
}