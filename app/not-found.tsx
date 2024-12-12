"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
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
      <div className="container relative mx-auto px-4">
        <div className="max-w-[500px] mx-auto bg-white rounded-xl p-8 text-center space-y-6">
          <h1 className="text-6xl font-bold text-hope-orange">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Pagină negăsită
          </h2>
          <p className="text-muted-foreground">
            Ne pare rău, dar pagina pe care o cauți nu există sau a fost mutată.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button>← Înapoi la pagina principală</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
