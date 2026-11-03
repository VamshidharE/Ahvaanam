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
 * Performance-Optimized:
 * - Desktop: Full 60fps, crisp 3D rendering, interactive cursor following, banking & flutter.
 * - Mobile: Adaptive rendering (1.25x pixel ratio cap, avoiding 3x/4x DPR fill-rate exhaustion).
 * - Mobile Scroll Awareness: Passive scroll tracking. During active scrolling, touch tracking is
 *   decoupled so page scrolling never competes with butterfly flight. Frame rate adapts smoothly
 *   to preserve 60fps scroll compositing on the main thread.
 * - Anti-Jank Resize Guard: Ignores mobile dynamic URL bar fluctuations (50-80px) to prevent WebGL
 *   framebuffer recreation during scrolling.
 * - Reduced motion & tab visibility detection for 100% idle power savings.
 */
export const ButterflyCompanion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 768;

    // Check if WebGL is supported
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile, // On mobile high-DPI screens, MSAA is redundant and very costly
        powerPreference: "high-performance",
        precision: isMobile ? "mediump" : "highp",
      });
    } catch {
      console.warn("WebGL unsupported; ButterflyCompanion disabled.");
      return;
    }

    // Adaptive pixel ratio: Desktop up to 2.0; Mobile capped at 1.25 (saves ~65% fill-rate)
    const getTargetPixelRatio = (mob: boolean) =>
      mob ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 2);

    renderer.setSize(width, height);
    renderer.setPixelRatio(getTargetPixelRatio(isMobile));
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
    butterfly.group.rotation.order = "ZXY";
    scene.add(butterfly.group);

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

    // SCROLL-ADAPTIVE STATE
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout | null = null;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let scrollVelocity = 0;
    let lastScrollTime = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime);
      const dy = Math.abs(window.scrollY - lastScrollY);
      scrollVelocity = dy / dt; // px/ms
      lastScrollY = window.scrollY;
      lastScrollTime = now;
      isScrolling = true;

      // When user starts scrolling, disengage touch tracking immediately so butterfly doesn't chase thumb
      if (isMobile) {
        isUserInteracting = false;
      }

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        scrollVelocity = 0;
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pointer & Touch Listeners
    const onPointerMove = (e: MouseEvent) => {
      if (isReducedMotion || isMobile) return;
      isUserInteracting = true;
      lastInteractionTime = performance.now();

      // Fluid, natural orbiting envelope around cursor (free and organic, not rigidly glued)
      orbitAngle += 0.038;
      const rx = 60 + Math.sin(orbitAngle * 0.65) * 20;
      const ry = 42 + Math.cos(orbitAngle * 0.85) * 16;
      targetPos.x = e.clientX + Math.cos(orbitAngle) * rx;
      targetPos.y = e.clientY + Math.sin(orbitAngle) * ry - 22;
      targetPos.z = Math.sin(orbitAngle * 1.1) * 18;
    };

    const onPointerLeave = () => {
      isUserInteracting = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isReducedMotion || e.touches.length === 0) return;
      if (!isScrolling) {
        isUserInteracting = true;
        lastInteractionTime = performance.now();
        targetPos.x = e.touches[0].clientX;
        targetPos.y = e.touches[0].clientY - 30;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isReducedMotion || e.touches.length === 0) return;
      // If user is actively scrolling page, let native scroll take precedence
      if (isScrolling) {
        isUserInteracting = false;
        return;
      }

      isUserInteracting = true;
      lastInteractionTime = performance.now();
      const touch = e.touches[0];
      targetPos.x = touch.clientX;
      targetPos.y = touch.clientY - 30;
    };

    const onTouchEnd = () => {
      setTimeout(() => {
        isUserInteracting = false;
      }, 700);
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // Reduced motion listener
    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    // Resize Handler with anti-jank mobile URL-bar guard
    let lastRecordedW = width;
    let lastRecordedH = height;

    const onResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const mob = newWidth < 768;

      // Guard: On mobile, address bar collapsing/expanding alters height by ~60-80px.
      // Avoid destroying and re-allocating WebGL framebuffer during scrolling.
      if (Math.abs(newWidth - lastRecordedW) < 4 && Math.abs(newHeight - lastRecordedH) < (mob ? 130 : 12)) {
        return;
      }

      lastRecordedW = newWidth;
      lastRecordedH = newHeight;
      width = newWidth;
      height = newHeight;
      isMobile = mob;

      renderer.setSize(width, height);
      renderer.setPixelRatio(getTargetPixelRatio(isMobile));

      camera.right = width;
      camera.bottom = -height;
      camera.updateProjectionMatrix();

      const newScale = isMobile ? 0.72 : 0.88;
      butterfly.group.scale.set(newScale, newScale, newScale);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Animation Loop with Visibility Handling
    let animId: number;
    let lastTime = performance.now();
    let isTabVisible = !document.hidden;
    let frameCounter = 0;

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

      frameCounter++;

      // Adaptive throttle: During fast mobile scrolling, render every 2nd RAF frame (30fps)
      // giving 100% composite headroom to the browser scroll engine while keeping wing flutter visible.
      if (isMobile && isScrolling && scrollVelocity > 0.4 && frameCounter % 2 !== 0) {
        return;
      }

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
        // During active mobile scroll, advance path at calm, stable speed (avoid jerky path jumps)
        const timeRate = (isMobile && isScrolling) ? 0.5 : 1.0;
        autoTime += delta * timeRate;

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

      // Fluid, natural spring dynamics with organic momentum
      const baseSpring = isUserInteracting ? 0.040 : 0.016;
      const springK = (isMobile && isScrolling) ? 0.010 : baseSpring;

      vel.x += dx * springK;
      vel.y += dy * springK;

      // Natural velocity ceiling: swift and nimble, but with organic glide
      const maxSpeed = isUserInteracting ? (isMobile ? 12.0 : 18.0) : 4.8;
      const currentSpeed = Math.hypot(vel.x, vel.y);
      if (currentSpeed > maxSpeed) {
        vel.x = (vel.x / currentSpeed) * maxSpeed;
        vel.y = (vel.y / currentSpeed) * maxSpeed;
      }

      // Organic buoyant lift & air-draft wander (gives free, living flight dynamics)
      if (!isMobile || !isScrolling) {
        const flutterX = Math.sin(now * 0.007) * 0.75 + Math.cos(now * 0.003) * 0.45;
        const flutterY = Math.cos(now * 0.006) * 0.65 + Math.sin(now * 0.004) * 0.35;
        vel.x += flutterX;
        vel.y += flutterY;
      }

      // Fluid aerodynamic momentum damping (glides naturally rather than locking strictly)
      const damping = (isMobile && isScrolling) ? 0.93 : (isUserInteracting ? 0.915 : 0.90);
      vel.x *= damping;
      vel.y *= damping;

      currentPos.x += vel.x;
      currentPos.y += vel.y;
      currentPos.z += (targetPos.z - currentPos.z) * 0.05;

      // Three.js Coordinate Mapping: Screen X -> World X, Screen Y -> World -Y
      butterfly.group.position.set(currentPos.x, -currentPos.y, currentPos.z);
      goldPoint.position.set(currentPos.x - 30, -currentPos.y + 30, currentPos.z + 100);

      const speed = Math.hypot(vel.x, vel.y);
      const isHovering = speed < 1.0 && dist < 45;

      // 3D ORIENTATION & NATURAL FLIGHT DYNAMICS
      if (speed > 0.25) {
        // Heading in world space:
        // World coordinates: +X is Right, +Y is Up (-vel.y).
        // Butterfly head is modeled along local +Y (angle +π/2).
        // To point head in the direction of motion: targetHeading = moveAngle - π/2
        const moveAngle = Math.atan2(-vel.y, vel.x);
        const targetHeading = moveAngle - Math.PI / 2;

        let diff = targetHeading - currentYaw;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        // Smooth aerodynamic turn (carves natural curving flight path rather than rigid snap)
        currentYaw += diff * Math.min(1, delta * 6.5);

        // Fluid banking into turns (along local spine/Y axis, clamped to ±0.38 rad ~22deg)
        const targetBank = THREE.MathUtils.clamp(-diff * 1.8, -0.38, 0.38);
        currentBank += (targetBank - currentBank) * Math.min(1, delta * 4.5);

        // Pitch along local X axis:
        // When coming down from top (vel.y > 0), dip nose forward slightly (-0.3 rad)
        // so the upper dorsal wing patterns remain beautifully visible to the viewer!
        const targetPitch = vel.y > 0.6
          ? THREE.MathUtils.clamp(-vel.y * 0.04, -0.32, -0.05)
          : THREE.MathUtils.clamp(-vel.y * 0.02, 0, 0.18);
        currentPitch += (targetPitch - currentPitch) * Math.min(1, delta * 3.0);
      } else {
        currentBank += (0 - currentBank) * Math.min(1, delta * 2.5);
        currentPitch += (0.05 - currentPitch) * Math.min(1, delta * 2.5);
      }

      // In "ZXY" rotation order:
      // 1. Z rotates heading so head points forward in flight direction
      // 2. X rotates pitch (nose up/down)
      // 3. Y rotates roll/bank (along spine)
      butterfly.group.rotation.set(
        currentPitch,
        currentBank,
        currentYaw
      );

      // Animate wings
      butterfly.update(delta, speed, isHovering);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("touchstart", onTouchStart);
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
