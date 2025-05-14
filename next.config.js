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
    unoptimized: process.env.NODE_ENV === "production",
  },
  // other config options...
};

module.exports = nextConfig;
