"use client";

import { cn } from "@/lib/utils";

interface IcyWaveDividerProps {
  variant?: "top" | "bottom";
  fromColor?: string;
  toColor?: string;
  toDark?: boolean; // Convenience prop: transitions from light to dark
  relative?: boolean; // Use relative positioning for use between sections
  className?: string;
  withGlow?: boolean;
  withParticles?: boolean;
}

export function IcyWaveDivider({
  variant = "bottom",
  fromColor,
  toColor,
  toDark = false,
  relative = false,
  className,
  withGlow = true,
  withParticles = false,
}: IcyWaveDividerProps) {
  // Apply toDark preset if no explicit colors provided
  const resolvedFromColor = fromColor ?? (toDark ? "#f0f7ff" : "#f0f7ff");
  const resolvedToColor = toColor ?? (toDark ? "#0d2847" : "#ffffff");
  const isTop = variant === "top";

  return (
    <div
      className={cn(
        "left-0 right-0 w-full overflow-hidden pointer-events-none z-10",
        relative ? "relative" : "absolute",
        !relative && (isTop ? "top-0" : "bottom-0"),
        className
      )}
      style={{ height: "80px" }}
    >
      {/* Frost glow line */}
      {withGlow && (
        <div
          className={cn(
            "absolute left-0 right-0 h-[2px]",
            "bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent",
            "shadow-[0_0_20px_rgba(200,230,255,0.5)]",
            isTop ? "bottom-0" : "top-0"
          )}
        />
      )}

      {/* Ice particles */}
      {withParticles && (
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-[10%] w-1 h-1 bg-white/60 rotate-45 animate-twinkle" />
          <div className="absolute top-1/2 left-[25%] w-1.5 h-1.5 bg-cyan-200/50 rotate-45 animate-twinkle animation-delay-300" />
          <div className="absolute top-1/3 left-[50%] w-1 h-1 bg-white/50 rotate-45 animate-twinkle animation-delay-500" />
          <div className="absolute top-1/4 left-[75%] w-1 h-1 bg-cyan-200/40 rotate-45 animate-twinkle animation-delay-700" />
          <div className="absolute top-1/2 left-[90%] w-1.5 h-1.5 bg-white/50 rotate-45 animate-twinkle animation-delay-200" />
        </div>
      )}

      {/* SVG Wave */}
      <svg
        className={cn(
          "absolute left-0 right-0 w-full h-full",
          isTop && "rotate-180"
        )}
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id={`frost-wave-${variant}-1`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={resolvedFromColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor="rgba(200, 230, 255, 0.9)" />
            <stop offset="100%" stopColor={resolvedFromColor} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient
            id={`frost-wave-${variant}-2`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={resolvedToColor} />
            <stop offset="100%" stopColor={resolvedToColor} />
          </linearGradient>
        </defs>

        {/* Back wave with frost gradient */}
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={`url(#frost-wave-${variant}-1)`}
        />

        {/* Front solid wave */}
        <path
          d="M0,55 C360,25 720,75 1080,35 C1260,15 1380,55 1440,50 L1440,80 L0,80 Z"
          fill={`url(#frost-wave-${variant}-2)`}
        />
      </svg>
    </div>
  );
}

// Simpler divider for subtle transitions
export function FrostDivider({
  className,
  variant = "gradient",
}: {
  className?: string;
  variant?: "gradient" | "line" | "dots";
}) {
  if (variant === "line") {
    return (
      <div
        className={cn(
          "w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent",
          "shadow-[0_0_15px_rgba(200,230,255,0.4)]",
          className
        )}
      />
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-3 py-4", className)}>
        <div className="w-1.5 h-1.5 bg-cyan-300/60 rounded-full animate-pulse" />
        <div className="w-2 h-2 bg-cyan-400/70 rounded-full animate-pulse animation-delay-200" />
        <div className="w-1.5 h-1.5 bg-cyan-300/60 rounded-full animate-pulse animation-delay-500" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full h-16 bg-gradient-to-b from-transparent via-cyan-100/20 to-transparent",
        className
      )}
    />
  );
}

export default IcyWaveDivider;
