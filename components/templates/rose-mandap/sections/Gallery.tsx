"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoseMandap } from "../context";

export default function Gallery() {
    const invitation = useRoseMandap();
    const images = invitation.gallery;
    const sliderRef = useRef<HTMLDivElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Duplicate images list for infinite loop marquee scrolling
    const duplicatedImages = images && images.length > 0 ? [...images, ...images] : [];

    useEffect(() => {
        if (!images || images.length === 0) return;

        const slider = sliderRef.current;
        if (!slider) return;

        let animationFrameId: number;
        // speed is pixels per frame (controls slow scrolling)
        const speed = 0.55; 

        const autoScroll = () => {
            if (!isHovered && !previewImage) {
                slider.scrollLeft += speed;
                
                // If scroll reaches half the scrollable width (end of first list), loop back to 0
                const halfWidth = slider.scrollWidth / 2;
                if (slider.scrollLeft >= halfWidth) {
                    slider.scrollLeft -= halfWidth;
                }
            }
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        animationFrameId = requestAnimationFrame(autoScroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [images, isHovered, previewImage]);

    return (
        <section className="invitation-section gallery-section">
            <div className="invitation-inner">
                <div className="section-heading">
                    <p className="section-kicker">Moments To Remember</p>
                    <h2>Our Memories</h2>
                    <span className="heading-ornament">✦</span>
                </div>

                {images && images.length > 0 ? (
                    <div className="gallery-slider-wrapper">
                        <div 
                            className="gallery-slider-container" 
                            ref={sliderRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onTouchStart={() => setIsHovered(true)}
                            onTouchEnd={() => setIsHovered(false)}
                        >
                            {duplicatedImages.map((image, index) => (
                                <figure 
                                    className="gallery-slider-card" 
                                    key={`${image.src}-${index}`}
                                    onClick={() => setPreviewImage(image.src)}
                                >
                                    <div className="gallery-img-wrapper">
                                        <img
                                            src={image.src}
                                            alt={image.alt || `Wedding memory ${index + 1}`}
                                            className="gallery-img"
                                            loading="lazy"
                                        />
                                    </div>
                                </figure>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="gallery-empty">
                        <span>✦</span>
                        <h3>Our beautiful memories</h3>
                        <p>
                            Our photographs will be added here to tell the story of
                            this beautiful journey.
                        </p>
                    </div>
                )}
            </div>

            {/* Enlarged Image Lightbox Preview */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div 
                        className="gallery-lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewImage(null)}
                    >
                        <button 
                            className="gallery-lightbox-close"
                            onClick={() => setPreviewImage(null)}
                            aria-label="Close preview"
                        >
                            ✕
                        </button>
                        <motion.div 
                            className="gallery-lightbox-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img 
                                src={previewImage} 
                                alt="Wedding memory preview" 
                                className="gallery-lightbox-img"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}