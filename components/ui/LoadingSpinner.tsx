"use client";

export default function LoadingSpinner() {
  return (
    <>
      <div className="container relative mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto bg-white rounded-xl p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent"></div>
            <p className="text-muted-foreground font-medium">Se încarcă...</p>
          </div>
        </div>
      </div>
    </>
  );
}
