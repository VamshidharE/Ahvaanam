"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createButterfly, ButterflyInstance } from "./Butterfly3D";

/**
 * ButterflyCompanion
 *
 * A premium 3D butterfly companion rendered in WebGL that accompanies
 * guests as they explore the Ahvaanam Gopuram wedding invitation.
 */
export const ButterflyCompanion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if WebGL is supported
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      console.warn("WebGL unsupported; ButterflyCompanion disabled.");
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // Scene & Orthographic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, width, 0, -height, 0.1, 2000);
    camera.position.set(0, 0, 800);
    camera.lookAt(0, 0, 0);

    // Warm Indian Wedding Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.4);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffd700, 2.2);
    goldKeyLight.position.set(200, -100, 500);
    scene.add(goldKeyLight);

    const warmRimLight = new THREE.DirectionalLight(0xff8c00, 1.6);
    warmRimLight.position.set(-200, -300, 200);
    scene.add(warmRimLight);

    // Instantiate 3D Butterfly
    const butterfly: ButterflyInstance = createButterfly();
    scene.add(butterfly.group);

    // Initial Position
    let currentX = width * 0.72;
    let currentY = height * 0.32;
    let targetX = currentX;
    let targetY = currentY;

    let velocityX = 0;
    let velocityY = 0;

    let lastMouseTime = 0;
    let isUserActive = false;

    // Autonomous Figure-8 Orbit Variables
    let autoFlightTime = Math.random() * 100;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      isUserActive = true;
      lastMouseTime = performance.now();

      let clientX = 0;
      let clientY = 0;

      if ("touches" in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ("clientX" in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      // Elegant diagonal flutter offset from cursor
      const offsetAngle = autoFlightTime * 1.4;
      const hoverDistance = 65 + Math.sin(autoFlightTime * 2.2) * 20;

      targetX = clientX + Math.cos(offsetAngle) * hoverDistance;
      targetY = clientY + Math.sin(offsetAngle) * hoverDistance;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.right = width;
      camera.bottom = -height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // Tab visibility handling (pause loop when hidden)
    let isTabVisible = !document.hidden;
    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Animation Loop
    let animationFrameId: number;
    let lastFrameTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const delta = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      // Check if user has been inactive for > 2.5s
      const isIdle = !isUserActive || now - lastMouseTime > 2500;

      if (isIdle) {
        // Autonomous flowing Lissajous ribbon orbit
        autoFlightTime += delta * 0.75;

        const centerX = width * 0.5;
        const centerY = height * 0.42;

        const radiusX = Math.min(width * 0.36, 420);
        const radiusY = Math.min(height * 0.26, 260);

        targetX = centerX + Math.sin(autoFlightTime) * radiusX + Math.sin(autoFlightTime * 2.4) * 45;
        targetY = centerY + Math.sin(autoFlightTime * 2) * radiusY * 0.65 + Math.cos(autoFlightTime * 1.8) * 35;
      }

      // Smooth damped spring motion towards target
      const ease = isIdle ? 0.038 : 0.075;
      const prevX = currentX;
      const prevY = currentY;

      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      velocityX = (currentX - prevX) / Math.max(delta, 0.001);
      velocityY = (currentY - prevY) / Math.max(delta, 0.001);

      const speed = Math.hypot(velocityX, velocityY);

      // Position in Screen-Space Orthographic Coordinates
      butterfly.group.position.x = currentX;
      butterfly.group.position.y = -currentY;

      // 3D Banking & Pitch Heading
      const moveAngle = Math.atan2(-velocityY, velocityX);
      const targetRoll = THREE.MathUtils.clamp((velocityX / 400) * 0.6, -0.65, 0.65);
      const targetPitch = THREE.MathUtils.clamp((-velocityY / 400) * 0.4, -0.5, 0.5);

      // Smooth angular interpolation
      butterfly.group.rotation.z = THREE.MathUtils.lerp(
        butterfly.group.rotation.z,
        moveAngle - Math.PI / 2,
        0.08
      );
      butterfly.group.rotation.y = THREE.MathUtils.lerp(butterfly.group.rotation.y, targetRoll, 0.08);
      butterfly.group.rotation.x = THREE.MathUtils.lerp(butterfly.group.rotation.x, targetPitch, 0.08);

      // Flapping Wing Animation
      const isHovering = speed < 35;
      butterfly.update(delta, speed, isHovering);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);

      butterfly.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-40 overflow-hidden"
    />
  );
};
