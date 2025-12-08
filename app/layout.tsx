import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";
import { editionName, title } from "@/lib/constants";
import { Snowfall } from "@/components/ui/Snowfall";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: `${title}: ${editionName} - Tineret Speranta Oradea`,
  description:
    "Tabăra de vară de la Tineret Speranta Oradea pentru tineri creștini care caută să își întărească relațiile cu Dumnezeu și cu cei din jur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Multi-layer snowfall for full winter effect */}
          {/* Background layer - large, slow, subtle */}
          <Snowfall
            color="rgba(200, 230, 255, 0.4)"
            snowflakeCount={10}
            style={{ zIndex: 5 }}
          />
          {/* Mid layer - medium */}
          <Snowfall
            color="rgba(255, 255, 255, 0.6)"
            snowflakeCount={20}
            style={{ zIndex: 500 }}
          />
          {/* Foreground layer - small, fast, bright */}
          <Snowfall
            color="#ffffff"
            snowflakeCount={40}
            style={{ zIndex: 1000 }}
          />
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
