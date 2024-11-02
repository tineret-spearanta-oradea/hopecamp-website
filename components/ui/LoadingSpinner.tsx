export default function LoadingSpinner() {
  return (
    <main
      className="min-h-screen bg-hope-green bg-[url('/assets/images/bg-auth.png')] bg-cover bg-center flex items-center"
      style={{
        backgroundBlendMode: "soft-light",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-hope-green border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Se încarcă...</p>
          </div>
        </div>
      </div>
    </main>
  );
}
