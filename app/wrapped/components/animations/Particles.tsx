"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

// Brighter colors to compensate for removing mixBlendMode
const colors = [
  "rgba(192, 132, 252, 0.7)", // purple (brighter)
  "rgba(244, 114, 182, 0.7)", // pink (brighter)
  "rgba(251, 176, 100, 0.6)", // orange (brighter)
  "rgba(96, 165, 250, 0.6)", // blue (brighter)
];

// Detect if device is mobile/touch
const isMobile = () => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 768
  );
};

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Target 30fps on mobile, 60fps on desktop
  const targetFPS = isMobile() ? 30 : 60;
  const frameInterval = 1000 / targetFPS;

  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Skip frame if not enough time has passed (frame rate limiting)
    const elapsed = timestamp - lastFrameTimeRef.current;
    if (elapsed < frameInterval) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);

    // Skip rendering if page is not visible
    if (!isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((particle) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(animate);
  }, [frameInterval]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = isMobile();

    // Use device pixel ratio but cap it for performance on mobile
    const dpr = mobile ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set display size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set actual size in memory (scaled for retina, but capped on mobile)
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Scale context to match
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Visibility change handler - pause when tab is hidden
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Reduce particle count significantly on mobile
    const particleCount = mobile
      ? Math.min(20, Math.floor(window.innerWidth / 30))
      : Math.min(50, Math.floor(window.innerWidth / 20));

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * (mobile ? 3 : 4) + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      // Removed mixBlendMode: "screen" - major performance gain on mobile
    />
  );
}
