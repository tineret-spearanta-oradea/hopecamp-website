"use client";

import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create random positioned shapes for the background
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Primary background with gradient - Winter theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d2847] to-[#1a3a5c]"></div>

      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient blobs - Winter colors */}
        <div
          className="absolute -right-[30%] sm:-right-[35%] -top-[35%] w-[80%] sm:w-[70%] aspect-square rounded-full bg-cyan-500/20 blur-3xl animate-blob"
          style={{ animationDuration: "15s" }}
        />
        <div
          className="absolute -left-[25%] sm:-left-[15%] -bottom-[25%] w-[70%] sm:w-[50%] aspect-square rounded-full bg-blue-500/15 blur-3xl animate-blob"
          style={{ animationDuration: "25s", animationDelay: "2s" }}
        />
        <div
          className="absolute left-[25%] sm:left-[35%] top-[25%] sm:top-[15%] w-[40%] sm:w-[30%] aspect-square rounded-full bg-cyan-400/10 blur-3xl animate-blob"
          style={{ animationDuration: "20s", animationDelay: "5s" }}
        />
        <div
          className="absolute right-[10%] sm:right-[20%] bottom-[15%] sm:bottom-[20%] w-[45%] sm:w-[40%] aspect-square rounded-full bg-purple-500/10 blur-3xl animate-blob"
          style={{ animationDuration: "18s", animationDelay: "7s" }}
        />

        {/* Geometric abstract shapes - Winter theme */}
        {isClient && (
          <>
            {/* Triangle */}
            <div
              className="absolute w-24 sm:w-40 h-24 sm:h-40 opacity-20 animate-float-slow"
              style={{
                top: "20%",
                left: "5%",
                background: "linear-gradient(45deg, rgba(6, 182, 212, 0.3), rgba(59, 130, 246, 0.3))",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                transform: "rotate(15deg)",
                animationDelay: "1s",
              }}
            />

            {/* Rectangle */}
            <div
              className="absolute w-20 sm:w-32 h-32 sm:h-48 opacity-10 animate-float-slow"
              style={{
                bottom: "15%",
                left: "65%",
                background: "linear-gradient(135deg, rgba(34, 211, 238, 0.2), transparent)",
                borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                transform: "rotate(-10deg)",
                animationDelay: "3s",
              }}
            />

            {/* Circle */}
            <div
              className="absolute w-16 sm:w-24 h-16 sm:h-24 opacity-15 rounded-full animate-float-slow"
              style={{
                top: "55%",
                right: "10%",
                background: "linear-gradient(to right, rgba(6, 182, 212, 0.3), transparent)",
                animationDelay: "2s",
              }}
            />

            {/* Ring */}
            <div
              className="absolute w-32 sm:w-64 h-32 sm:h-64 border-2 sm:border-4 border-cyan-300/10 rounded-full animate-spin-slow"
              style={{
                top: "35%",
                right: "15%",
              }}
            />
          </>
        )}

        {/* Floating particles effect - fewer particles for mobile */}
        <div className="absolute inset-0 opacity-10">
          <div className="particles-container">
            {isClient &&
              Array.from({ length: 15 }).map((_, index) => (
                <div
                  key={index}
                  className="particle bg-white rounded-full absolute"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.5 + 0.3,
                    animation: `float-y ${
                      Math.random() * 10 + 15
                    }s infinite ease-in-out alternate, float-x ${
                      Math.random() * 15 + 10
                    }s infinite ease-in-out alternate`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
          </div>
        </div>

        {/* Modern dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Subtle wave effect at bottom - Winter theme (inverted) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 opacity-20"
          style={{
            background:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23FFFFFF'/%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23FFFFFF'/%3E%3C/svg%3E\")",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scaleY(-1)",
          }}
        />
      </div>

      {/* Content Container - improved for mobile */}
      <div className="container relative max-w-md mx-auto px-4 py-8 z-10">
        <div className="w-full overflow-hidden bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-300">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/70 to-transparent"></div>
          {children}
        </div>
      </div>

      {/* Add styles for animations */}
      <style jsx global>{`
        @keyframes float-y {
          0% {
            transform: translateY(0px);
          }
          100% {
            transform: translateY(60px);
          }
        }
        @keyframes float-x {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(30px);
          }
        }
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-15px, 15px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }
        .animate-blob {
          animation: blob 20s infinite alternate ease-in-out;
        }
        .animate-float-slow {
          animation: float 10s infinite alternate ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(10px, -10px) rotate(5deg);
          }
          100% {
            transform: translate(-10px, 10px) rotate(-5deg);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Optimize animations for devices with reduced motion preference */
        @media (prefers-reduced-motion) {
          .animate-blob,
          .animate-float-slow,
          .animate-spin-slow,
          .particle {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
  );
}
