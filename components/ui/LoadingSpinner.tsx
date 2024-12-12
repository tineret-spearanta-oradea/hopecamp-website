"use client";

import { useState, useEffect } from "react";

export default function LoadingSpinner() {
  const [showPersistMessage, setShowPersistMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPersistMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="container relative mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto bg-white rounded-xl p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            <p className="text-muted-foreground font-medium">Se încarcă...</p>
            {showPersistMessage && (
              <p className="text-sm text-muted-foreground text-center">
                Dacă problema persistă, te rugăm să iei legătura cu noi la
                numarul de telefon de pe prima pagina sau la{" "}
                <a
                  href="mailto:dev@hopecamp.ro"
                  className="text-hope-lightcyan hover:underline"
                >
                  dev@hopecamp.ro
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
