"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createButterfly, ButterflyInstance } from "./Butterfly3D";

/**
 * ButterflyCompanion
 *
 * A premium, genuine 3D butterfly companion rendered in WebGL that accompanies
 * guests as they explore the Ahvaanam wedding invitation.
 *
 * Features:
 * - Real 3D modeled anatomy: segmented body, antennae with gold tips, eyes, legs,
 *   and 4 independently flapping curved wings.
 * - Procedural translucent ivory/cream wing membranes with champagne-gold venation.
 * - Dynamic 3D banking, tilting, and yaw orientation in flight direction.
 * - Desktop: loosely trails cursor at variable distances with organic flutter.
 * - Mobile & Idle: graceful autonomous 3D flight path without blocking scrolling or touches.
 * - Respects prefers-reduced-motion with calm, stationary resting posture.
 * - Tab visibility detection to pause rendering and save 100% GPU/CPU when hidden.
 * - Non-blocking: fixed canvas with pointer-events-none.
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
      // Graceful fallback if WebGL is unavailable
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

    // Scene & Orthographic Camera (maps 1 unit to 1 screen pixel for exact positioning)
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, width, 0, -height, 0.1, 2000);
    camera.position.set(0, 0, 800);
    camera.lookAt(0, 0, 0);

    // Warm Indian Wedding Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffecd0, 2.4);
    sunLight.position.set(300, -200, 500);
    scene.add(sunLight);

    const goldPoint = new THREE.PointLight(0xffd700, 1.8, 600);
    goldPoint.position.set(0, 0, 300);
    scene.add(goldPoint);

    // Instantiate 3D Butterfly
    const butterfly: ButterflyInstance = createButterfly();
    scene.add(butterfly.group);

    // Scale according to screen size (subtle & elegant on both mobile and desktop)
    const isMobile = width < 768;
    const baseScale = isMobile ? 0.72 : 0.88;
    butterfly.group.scale.set(baseScale, baseScale, baseScale);

    // State & Physics Variables
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = reducedMotionQuery.matches;

    // Start position (initially near top-right / center)
    const currentPos = {
      x: isReducedMotion ? width - 80 : width * 0.75,
      y: isReducedMotion ? 120 : height * 0.35,
      z: 0,
    };
    const vel = { x: 0, y: 0, z: 0 };
    const targetPos = { x: currentPos.x, y: currentPos.y, z: 0 };

    let currentYaw = 0;
    let currentPitch = 0;
    let currentBank = 0;

    let orbitAngle = 0;
    let isUserInteracting = false;
    let lastInteractionTime = performance.now();
    let autoTime = 0;

    // Pointer & Touch Listeners
    const onPointerMove = (e: MouseEvent) => {
      if (isReducedMotion) return;
      isUserInteracting = true;
      lastInteractionTime = performance.now();

      // Variable distance orbit offset so it never blocks the cursor or clicks
      orbitAngle += 0.05;
      const rx = 60 + Math.sin(orbitAngle * 0.7) * 15;
      const ry = 42 + Math.cos(orbitAngle * 0.9) * 12;
      targetPos.x = e.clientX + Math.cos(orbitAngle) * rx;
      targetPos.y = e.clientY + Math.sin(orbitAngle) * ry - 24;
      targetPos.z = Math.sin(orbitAngle * 1.2) * 20;
    };

    const onPointerLeave = () => {
      isUserInteracting = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isReducedMotion || e.touches.length === 0) return;
      isUserInteracting = true;
      lastInteractionTime = performance.now();

      const touch = e.touches[0];
      targetPos.x = touch.clientX;
      targetPos.y = touch.clientY - 40;
    };

    const onTouchEnd = () => {
      // Resume autonomous flight after brief pause
      setTimeout(() => {
        isUserInteracting = false;
      }, 1200);
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // Reduced motion listener
    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    // Resize Handler
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      camera.right = width;
      camera.bottom = -height;
      camera.updateProjectionMatrix();

      const mobileNow = width < 768;
      const newScale = mobileNow ? 0.72 : 0.88;
      butterfly.group.scale.set(newScale, newScale, newScale);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Animation Loop with Visibility Handling
    let animId: number;
    let lastTime = performance.now();
    let isTabVisible = !document.hidden;

    const onVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // REDUCED MOTION MODE: Peaceful stationary rest with gentle slow breathing flutter
      if (isReducedMotion) {
        currentPos.x = width - 75;
        currentPos.y = 100;
        butterfly.group.position.set(currentPos.x, -currentPos.y, 10);
        butterfly.group.rotation.set(-0.6, 0.4, 0.2);
        butterfly.update(delta * 0.15, 0, true);
        renderer.render(scene, camera);
        return;
      }

      // Check if user has stopped moving pointer for > 2.2 seconds -> transition to autonomous mode
      if (isUserInteracting && now - lastInteractionTime > 2200) {
        isUserInteracting = false;
      }

      // AUTONOMOUS FLIGHT (Mobile or idle desktop)
      if (!isUserInteracting) {
        autoTime += delta;
        const cx = width * 0.5;
        const cy = height * 0.45;
        const rx = Math.min(width * 0.38, 380);
        const ry = Math.min(height * 0.32, 260);

        // Smooth multi-frequency Lissajous exploration
        targetPos.x = cx + Math.sin(autoTime * 0.38) * rx + Math.cos(autoTime * 0.85) * 50;
        targetPos.y = cy + Math.cos(autoTime * 0.32) * ry + Math.sin(autoTime * 0.7) * 35;
        targetPos.z = Math.sin(autoTime * 0.5) * 25;
      }

      // Spring-Damper Physics
      const dx = targetPos.x - currentPos.x;
      const dy = targetPos.y - currentPos.y;
      const dist = Math.hypot(dx, dy);

      const springK = isUserInteracting ? 0.048 : 0.024;
      vel.x += dx * springK;
      vel.y += dy * springK;

      // Subtle organic flight flutter
      const flutterX = Math.sin(now * 0.007) * 0.55;
      const flutterY = Math.cos(now * 0.0055) * 0.55;
      vel.x += flutterX;
      vel.y += flutterY;

      // Damping
      vel.x *= 0.88;
      vel.y *= 0.88;

      currentPos.x += vel.x;
      currentPos.y += vel.y;
      currentPos.z += (targetPos.z - currentPos.z) * 0.05;

      // Three.js Coordinate Mapping: Screen X -> World X, Screen Y -> World -Y
      butterfly.group.position.set(currentPos.x, -currentPos.y, currentPos.z);
      goldPoint.position.set(currentPos.x - 30, -currentPos.y + 30, currentPos.z + 100);

      const speed = Math.hypot(vel.x, vel.y);
      const isHovering = speed < 1.2 && dist < 35;

      // 3D ORIENTATION & BANKING
      if (speed > 0.3) {
        // Yaw in screen space (vel.y positive is moving downwards, vel.x positive is right)
        const targetYaw = Math.atan2(vel.y, vel.x) - Math.PI / 2;

        let diff = targetYaw - currentYaw;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        currentYaw += diff * Math.min(1, delta * 5.5);

        // Bank into turns
        const targetBank = THREE.MathUtils.clamp(-diff * 2.2, -0.65, 0.65);
        currentBank += (targetBank - currentBank) * Math.min(1, delta * 4.5);

        // Pitch up when ascending, dip slightly when descending
        const targetPitch = THREE.MathUtils.clamp(-vel.y * 0.028, -0.4, 0.4);
        currentPitch += (targetPitch - currentPitch) * Math.min(1, delta * 4.0);
      } else {
        currentBank += (0 - currentBank) * Math.min(1, delta * 3.0);
        currentPitch += (0 - currentPitch) * Math.min(1, delta * 3.0);
      }

      // Base three-quarter aesthetic tilt (-0.55 rad pitch towards viewer for natural depth)
      butterfly.group.rotation.set(
        -0.55 + currentPitch,
        currentBank,
        -currentYaw
      );

      // Animate wings
      butterfly.update(delta, speed, isHovering);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);

      butterfly.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-35 overflow-hidden"
    />
  );
};
