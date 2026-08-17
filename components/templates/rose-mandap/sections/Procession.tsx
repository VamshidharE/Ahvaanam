"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRoseMandap } from "../context";

export default function Procession() {
    const invitation = useRoseMandap();
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [aspectRatio, setAspectRatio] = useState(0.25); // Default fallback aspect ratio (4:1)
    const [isIntersecting, setIsIntersecting] = useState(false);

    // Audio volume and playback state calculation
    const updateAudioVolume = useCallback(() => {
        const audio = audioRef.current;
        const video = videoRef.current;
        const section = sectionRef.current;
        if (!audio || !section) return;

        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const sectionMid = rect.top + rect.height / 2;
        const viewportMid = viewportHeight / 2;
        const distFromCenter = Math.abs(sectionMid - viewportMid);
        const maxAudibleDist = viewportHeight * 0.9; // Audible within range

        // 1. Proximity volume: increases when scrolling near, fades when scrolling away
        let scrollVolume = 0;
        if (distFromCenter < maxAudibleDist) {
            scrollVolume = Math.pow(1 - distFromCenter / maxAudibleDist, 1.4);
        }

        // 2. Video loop progression fade: fades in as procession enters, fades out as it exits
        let loopFade = 1;
        if (video && video.duration > 0) {
            const progress = video.currentTime / video.duration;
            if (progress < 0.12) {
                // Entering screen: smooth fade in
                loopFade = progress / 0.12;
            } else if (progress > 0.88) {
                // Exiting screen: smooth fade out
                loopFade = Math.max(0, (1 - progress) / 0.12);
            } else {
                loopFade = 1;
            }
        }

        const combinedVolume = Math.min(1, Math.max(0, scrollVolume * loopFade * 0.85));

        // Set audio volume
        audio.volume = combinedVolume;

        // Manage play/pause based on audible volume
        if (combinedVolume > 0.01) {
            if (audio.paused) {
                audio.play().catch(() => {});
            }
        } else {
            if (!audio.paused) {
                audio.pause();
            }
        }
    }, []);

    // 1. Observe if the procession section is in the user's viewport
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            { threshold: 0.01 }
        );

        observer.observe(section);

        return () => {
            observer.unobserve(section);
        };
    }, []);

    // 2. Listen to scroll events to update proximity volume
    useEffect(() => {
        const handleScroll = () => {
            updateAudioVolume();
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll, { passive: true });

        // Unlock browser audio on first user gesture
        const unlockAudio = () => {
            const audio = audioRef.current;
            if (audio && audio.paused) {
                updateAudioVolume();
            }
        };

        document.addEventListener("click", unlockAudio, { once: true });
        document.addEventListener("touchstart", unlockAudio, { once: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
        };
    }, [updateAudioVolume]);

    // 3. Manage the canvas rendering loop, video processing, and continuous audio updates
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const audio = audioRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        let animationFrameId: number;
        let lastRenderTime = 0;
        const fpsInterval = 1000 / 30; // Throttle processing to 30 frames per second

        const updateAspectRatio = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                setAspectRatio(video.videoHeight / video.videoWidth);
            }
        };

        video.addEventListener("loadedmetadata", updateAspectRatio);

        const renderFrame = (timestamp: number) => {
            // Continuously update audio volume in sync with video progression & scroll
            updateAudioVolume();

            // Throttling step: skip rendering if target FPS interval hasn't elapsed
            const elapsed = timestamp - lastRenderTime;
            if (elapsed < fpsInterval) {
                animationFrameId = requestAnimationFrame(renderFrame);
                return;
            }
            lastRenderTime = timestamp - (elapsed % fpsInterval);

            // Halt loop processing and pause playback if the element is out of the viewport
            if (!isIntersecting) {
                if (!video.paused) {
                    video.pause();
                }
                if (audio && !audio.paused) {
                    audio.pause();
                }
                animationFrameId = requestAnimationFrame(renderFrame);
                return;
            }

            // Resume video play when returning to viewport
            if (video.paused) {
                video.play().catch(() => {});
            }

            if (video.readyState >= 2) {
                const maxProcessingWidth = 540;
                let targetWidth = video.videoWidth;
                let targetHeight = video.videoHeight;

                if (targetWidth > maxProcessingWidth) {
                    const scale = maxProcessingWidth / targetWidth;
                    targetWidth = maxProcessingWidth;
                    targetHeight = Math.round(targetHeight * scale);
                }

                if (canvas.width !== targetWidth && targetWidth > 0) {
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;
                    updateAspectRatio();
                }

                if (canvas.width > 0 && canvas.height > 0) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw current video frame onto the canvas directly
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = frame.data;
                    const length = data.length;

                    for (let i = 0; i < length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        if (g > 95 && g > r * 1.35 && g > b * 1.35) {
                            data[i + 3] = 0; // Set transparent
                        }
                    }

                    ctx.putImageData(frame, 0, 0);
                }
            }

            animationFrameId = requestAnimationFrame(renderFrame);
        };

        // Start render frame loop
        animationFrameId = requestAnimationFrame(renderFrame);

        // Auto-play checks
        const playVideo = () => {
            if (isIntersecting) {
                video.play().catch(() => {});
            }
        };

        playVideo();

        const handleUserInteraction = () => {
            if (isIntersecting && video.paused) {
                video.play().catch(() => {});
            }
            updateAudioVolume();
        };

        document.addEventListener("click", handleUserInteraction);
        document.addEventListener("touchstart", handleUserInteraction);

        return () => {
            video.removeEventListener("loadedmetadata", updateAspectRatio);
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
            if (audio) {
                audio.pause();
            }
        };
    }, [isIntersecting, updateAudioVolume]);

    return (
        <section 
            ref={sectionRef}
            className="procession-section"
            style={{ height: `calc(clamp(320px, 35vw, 550px) * ${aspectRatio})` }}
        >
            <div className="procession-container">
                <canvas 
                    ref={canvasRef} 
                    className="procession-canvas" 
                />
            </div>
            
            {/* Source video */}
            <video
                ref={videoRef}
                src="/wedding/procession/procession.mp4"
                muted
                autoPlay
                loop
                playsInline
                style={{ display: "none" }}
            />

            {/* Wedding music audio */}
            <audio
                ref={audioRef}
                src={invitation.music?.processionMusic || "/wedding/rose-mandap/wed music.MP3"}
                loop
                preload="auto"
            />
        </section>
    );
}
