"use client";

import { Cog } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full h-[450px] flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <Cog className="h-12 w-12 animate-spin-slow" />
      <h1 className="text-2xl font-semibold">Pagina este în lucru</h1>
      <p className="text-sm">Această secțiune va fi disponibilă în curând.</p>
    </div>
  );
}
