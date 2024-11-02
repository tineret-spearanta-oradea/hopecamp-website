export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen bg-hope-green bg-[url('/assets/images/bg-auth.png')] bg-cover bg-center flex items-center"
      style={{
        backgroundBlendMode: "soft-light",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[400px] mx-auto">{children}</div>
      </div>
    </main>
  );
}
