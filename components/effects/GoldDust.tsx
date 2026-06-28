"use client";

import { useEffect, useRef } from "react";

export default function GoldDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }

    const particles = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1,
      alpha: Math.random(),
    }));

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    window.addEventListener("resize", resize);

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {

        p.y -= p.speed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        p.alpha += (Math.random() - 0.5) * 0.03;

        if (p.alpha < 0.2) p.alpha = 0.2;
        if (p.alpha > 1) p.alpha = 1;

        ctx.beginPath();

        ctx.fillStyle = `rgba(255,215,120,${p.alpha})`;

        ctx.shadowBlur = 10;
        ctx.shadowColor = "#FFD700";

        ctx.arc(
          p.x,
          p.y,
          p.radius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}