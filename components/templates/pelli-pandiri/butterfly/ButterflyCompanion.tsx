"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createButterfly, ButterflyInstance } from "./Butterfly3D";

/**
 * Helper: Computes the shortest angular difference between two angles in radians (-PI to +PI)
 */
function angleDifference(target: number, current: number): number {
  return Math.atan2(Math.sin(target - current), Math.cos(target - current));
}

/**
 * ButterflyCompanion
 *
 * A premium, genuine 3D butterfly companion rendered in WebGL that accompanies
 * guests as they explore the Ahvaanam wedding invitation.
 *
 * True Forward-Flight Aerodynamics:
 * - Direct Heading Steering: The butterfly always moves strictly along its heading vector.
 *   It is physically impossible to spin in place or rotate backwards.
 * - Smooth Cruising & Edge Repulsion: Flies in graceful, continuous wandering paths across the
 *   screen, gently steering away from edges before reaching them.
 * - Lag-Free Scrolling: Page scrolling is completely decoupled from physics kicks. Zero tug-of-war
 *   or velocity spikes, preserving silky 60fps scrolling on both mobile and desktop.
 * - Hardware Composited: Uses a dedicated GPU compositing layer to prevent mobile compositor lock.
 */
export const ButterflyCompanion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 768;

    // WebGL Renderer Setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: "high-performance",
        precision: isMobile ? "mediump" : "highp",
      });
    } catch {
      console.warn("WebGL unsupported; ButterflyCompanion disabled.");
      return;
    }

    // Adaptive pixel ratio: Desktop up to 2.0; Mobile capped at 1.25 for smooth fill-rate
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

    // Warm Wedding Lighting
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

    const baseScale = isMobile ? 0.70 : 0.86;
    butterfly.group.scale.set(baseScale, baseScale, baseScale);

    // Reduced motion support
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = reducedMotionQuery.matches;

    // Flight Dynamics State
    const pos = {
      x: isReducedMotion ? width - 80 : width * 0.72,
      y: isReducedMotion ? 120 : height * 0.32,
      z: 0,
    };

    // Heading in screen space (radians):
    // 0 = Right (+X), PI/2 = Down (+Y), PI = Left (-X), -PI/2 = Up (-Y)
    let heading = -Math.PI * 0.35; // initially gliding upwards/right
    let targetHeading = heading;
    let turnVelocity = 0;

    let currentYaw = -heading - Math.PI / 2;
    let currentBank = 0;
    let currentPitch = 0;

    let speed = isMobile ? 120 : 145; // pixels/sec
    let targetSpeed = speed;

    // Wander & Interaction State
    let wanderTimer = 0;
    let isUserInteracting = false;
    let lastInteractionTime = performance.now();
    const interactionTarget = { x: pos.x, y: pos.y };

    // Scroll state
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout | null = null;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const onScroll = () => {
      const curY = window.scrollY;
      const dy = curY - lastScrollY;
      lastScrollY = curY;
      isScrolling = true;

      // On mobile, active scrolling supersedes touch-tracking so scrolling stays 100% fluid
      if (isMobile) {
        isUserInteracting = false;
      }

      // Gentle aerodynamic drift: as the page scrolls beneath it,
      // the butterfly floats lightly with the air displacement without jerking or fighting physics
      if (Math.abs(dy) > 0.5) {
        pos.y -= Math.max(-12, Math.min(12, dy * 0.05));
      }

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pointer & Touch Handlers
    const onPointerMove = (e: MouseEvent) => {
      if (isReducedMotion || isMobile) return;
      isUserInteracting = true;
      lastInteractionTime = performance.now();
      interactionTarget.x = e.clientX;
      interactionTarget.y = e.clientY - 15;
    };

    const onPointerLeave = () => {
      isUserInteracting = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (isReducedMotion || e.touches.length === 0 || isScrolling) return;
      isUserInteracting = true;
      lastInteractionTime = performance.now();
      const touch = e.touches[0];
      interactionTarget.x = touch.clientX;
      interactionTarget.y = touch.clientY - 25;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isReducedMotion || e.touches.length === 0 || isScrolling) return;
      isUserInteracting = true;
      lastInteractionTime = performance.now();
      const touch = e.touches[0];
      interactionTarget.x = touch.clientX;
      interactionTarget.y = touch.clientY - 25;
    };

    const onTouchEnd = () => {
      // Resume autonomous flight smoothly after touch release
      isUserInteracting = false;
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    // Resize Handler with Mobile Dynamic Bar Guard
    let lastRecordedW = width;
    let lastRecordedH = height;

    const onResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const mob = newWidth < 768;

      // Ignore mobile address bar collapse/expansion during scroll
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

      const newScale = isMobile ? 0.70 : 0.86;
      butterfly.group.scale.set(newScale, newScale, newScale);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Reduced motion media query listener
    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    // Visibility Listener (saves 100% CPU/GPU when backgrounded)
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

    // Main 60fps Animation Loop
    const animate = (now: number) => {
      animId = requestAnimationFrame(animate);
      if (!isTabVisible) return;

      // Clamp delta to prevent physics jumps if browser suspends frame
      const delta = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      // Reduced Motion Mode: Gentle stationary hovering at top-right
      if (isReducedMotion) {
        pos.x = width - 75;
        pos.y = 100;
        butterfly.group.position.set(pos.x, -pos.y, 10);
        butterfly.group.rotation.set(-0.5, 0.3, 0.2);
        butterfly.update(delta * 0.15, 0, true);
        renderer.render(scene, camera);
        return;
      }

      // Check interaction timeout
      if (isUserInteracting && now - lastInteractionTime > 2000) {
        isUserInteracting = false;
      }

      /* ═══════════════════════════════════════════════════════
         1. HEADING & SPEED DETERMINATION
         ═══════════════════════════════════════════════════════ */
      if (isUserInteracting) {
        // STEER TOWARD USER INTERACTION TARGET
        const dx = interactionTarget.x - pos.x;
        const dy = interactionTarget.y - pos.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 55) {
          // Swift, direct flight toward guest's finger/cursor
          targetHeading = Math.atan2(dy, dx);
          targetSpeed = Math.min(isMobile ? 260 : 340, 150 + dist * 1.1);
        } else {
          // Playfully orbit/glide in proximity without abruptly freezing
          const orbitAngle = Math.atan2(dy, dx) + Math.PI * 0.48;
          targetHeading = orbitAngle;
          targetSpeed = isMobile ? 85 : 100;
        }
      } else {
        // AUTONOMOUS FLIGHT: Graceful, continuous meandering wander
        wanderTimer += delta;

        // Smooth low-frequency wandering curve
        const wanderDelta =
          Math.sin(wanderTimer * 0.65) * 0.022 +
          Math.cos(wanderTimer * 0.35) * 0.016;
        targetHeading += wanderDelta;

        // Viewport Padding Repulsion: gently curve away from screen boundaries
        const padX = Math.min(width * 0.16, 130);
        const padY = Math.min(height * 0.16, 110);

        if (pos.x < padX) {
          const steerRight = 0; // heading 0 rad = +X
          const diff = angleDifference(steerRight, targetHeading);
          targetHeading += diff * delta * 2.8;
        } else if (pos.x > width - padX) {
          const steerLeft = Math.PI; // heading PI rad = -X
          const diff = angleDifference(steerLeft, targetHeading);
          targetHeading += diff * delta * 2.8;
        }

        if (pos.y < padY) {
          const steerDown = Math.PI * 0.5; // heading PI/2 rad = +Y
          const diff = angleDifference(steerDown, targetHeading);
          targetHeading += diff * delta * 2.8;
        } else if (pos.y > height - padY) {
          const steerUp = -Math.PI * 0.5; // heading -PI/2 rad = -Y
          const diff = angleDifference(steerUp, targetHeading);
          targetHeading += diff * delta * 2.8;
        }

        targetSpeed = isMobile ? 115 : 138;
      }

      /* ═══════════════════════════════════════════════════════
         2. SMOOTH AERODYNAMIC TURNING & FORWARD MOTION
         ═══════════════════════════════════════════════════════ */
      // Smoothly steer heading toward targetHeading
      const headingDiff = angleDifference(targetHeading, heading);
      const maxTurnSpeed = isUserInteracting ? 5.5 : 2.6; // rad/sec
      const turnStep = Math.max(-maxTurnSpeed * delta, Math.min(maxTurnSpeed * delta, headingDiff * 4.8 * delta));
      heading += turnStep;
      turnVelocity = turnStep / Math.max(delta, 0.001);

      // Smooth acceleration / deceleration
      speed += (targetSpeed - speed) * Math.min(1, delta * 3.5);

      // FORWARD STEP: The butterfly always moves strictly along its current heading!
      // (This guarantees 0% chance of rotating in place or moving backwards)
      const forwardX = Math.cos(heading) * speed * delta;
      const forwardY = Math.sin(heading) * speed * delta;

      pos.x += forwardX;
      pos.y += forwardY;

      // Soft boundary clamp to keep butterfly visible inside viewport
      pos.x = Math.max(25, Math.min(width - 25, pos.x));
      pos.y = Math.max(25, Math.min(height - 25, pos.y));

      /* ═══════════════════════════════════════════════════════
         3. 3D ORIENTATION & BANKING INTO TURNS
         ═══════════════════════════════════════════════════════ */
      // Target yaw: In Three.js world space, world angle = -heading.
      // Since local model head is at +Y (PI/2), target yaw = -heading - PI/2.
      const targetYaw = -heading - Math.PI / 2;
      const yawDiff = angleDifference(targetYaw, currentYaw);
      currentYaw += yawDiff * Math.min(1, delta * 7.5);

      // Roll / Bank into curve: turns left/right create natural aerodynamic body banking
      const targetBank = THREE.MathUtils.clamp(-turnVelocity * 0.08, -0.38, 0.38);
      currentBank += (targetBank - currentBank) * Math.min(1, delta * 4.5);

      // Pitch: dip nose forward when gliding downward so dorsal wing art is visible
      const targetPitch = THREE.MathUtils.clamp(-forwardY * 0.06, -0.28, 0.15);
      currentPitch += (targetPitch - currentPitch) * Math.min(1, delta * 3.5);

      // Set 3D rotation in ZXY order:
      // Z = Heading / Yaw
      // X = Pitch (nose up/down)
      // Y = Bank / Roll along spine
      butterfly.group.rotation.set(currentPitch, currentBank, currentYaw);

      /* ═══════════════════════════════════════════════════════
         4. ORGANIC VISUAL FLUTTER & 3D PLACEMENT
         ═══════════════════════════════════════════════════════ */
      // Subtle visual breathing flutter (applied as position offset; NEVER pollutes velocity)
      const flutterX = Math.sin(now * 0.007) * 1.8;
      const flutterY = Math.cos(now * 0.008) * 1.8;

      butterfly.group.position.set(pos.x + flutterX, -(pos.y + flutterY), 15);
      goldPoint.position.set(pos.x - 20, -(pos.y - 20), 120);

      // Animate wing flapping mechanics
      const isHovering = speed < 90;
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
      style={{ willChange: "transform", transform: "translateZ(0)" }}
      className="fixed inset-0 pointer-events-none select-none z-35 overflow-hidden"
    />
  );
};
