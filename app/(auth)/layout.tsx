"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center overflow-hidden bg-[#0E7E6F]">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E7E6F] via-[#0E7E6F]/90 to-[#0E7E6F]/80" />

        {/* Animated gradient circles */}
        <div className="absolute -right-[40%] -top-[30%] w-[80%] aspect-square rounded-full bg-[#14A698]/20 blur-3xl animate-pulse" />
        <div
          className="absolute -left-[20%] -bottom-[20%] w-[60%] aspect-square rounded-full bg-[#14B6A8]/15 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute left-[30%] top-[20%] w-[40%] aspect-square rounded-full bg-[#0E7E6F]/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl">
          {children}
        </div>
      </div>
    </main>
  );
}
