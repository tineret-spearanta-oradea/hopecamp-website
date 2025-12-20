"use client";

import { useEffect, useRef, useCallback } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

const colors = [
  "#a855f7", // purple
  "#ec4899", // pink
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
];

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
}

export default function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<number>();

  const createConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pieceCount = 150;
    piecesRef.current = Array.from({ length: pieceCount }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      size: Math.random() * 10 + 5,
      speedX: (Math.random() - 0.5) * 15,
      speedY: Math.random() * -15 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1,
    }));
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    createConfetti();

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      piecesRef.current.forEach((piece) => {
        // Update position
        piece.x += piece.speedX;
        piece.y += piece.speedY;
        piece.speedY += 0.3; // gravity
        piece.speedX *= 0.99; // air resistance
        piece.rotation += piece.rotationSpeed;

        // Fade out towards the end
        if (elapsed > duration * 0.7) {
          piece.opacity = Math.max(0, 1 - (elapsed - duration * 0.7) / (duration * 0.3));
        }

        // Draw confetti piece
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.globalAlpha = piece.opacity;
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
        ctx.restore();
      });

      if (elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, duration, createConfetti]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
