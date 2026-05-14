/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "utfs.io", // Add UploadThing's domain
      "127.0.0.1",
      "hopecamp.ro",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.vercel.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: process.env.NODE_ENV === "production",
  },
  // other config options...
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/inscrie-te",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/inscrie-te/:path*",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/cont",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/cont/:path*",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/admin/:path*",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/login",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/login/:path*",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/reset-password",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
      {
        source: "/reset-password/:path*",
        destination: "https://app.camppromax.com/r/tso/hope-camp-7",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
