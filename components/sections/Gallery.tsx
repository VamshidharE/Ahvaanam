"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { invitation } from "../data/invitation";

export default function Gallery() {
  const images = invitation.gallery;

  if (images.length === 0) return null;

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

      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">

        {images.map((image, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, scale: .9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.04,
              y: -8,
            }}
            className="
              overflow-hidden
              rounded-3xl
              border
              border-yellow-500/20
            "
          >

            
              <motion.div
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-[30px] border-2 border-[#d4af37]/40 bg-[#1b1418] p-2"
                >
                <div className="overflow-hidden rounded-[22px]">
                    <Image
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    width={500}
                    height={650}
                    className="h-[340px] w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-[30px] border border-[#f5d57a]/20" />
                </motion.div>
                

          </motion.div>

        ))}

      </div>

    </section>
  );
}