"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen flex items-center overflow-hidden bg-[#1B2A4A]">
      {/* Abstract Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circle */}
        <div className="absolute -right-[30%] -top-[20%] w-[80%] aspect-square rounded-full bg-third/10 blur-3xl" />
        {/* Small circle */}
        <div className="absolute -left-[10%] -bottom-[10%] w-[50%] aspect-square rounded-full bg-secondary/10 blur-3xl" />
        {/* Middle circle */}
        <div className="absolute left-[20%] top-[20%] w-[40%] aspect-square rounded-full bg-third/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto bg-white rounded-xl">
          {children}
        </div>
      </div>
    </main>
  );
}
