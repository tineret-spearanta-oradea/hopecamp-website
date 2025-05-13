/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "utfs.io", // Add UploadThing's domain
      "127.0.0.1",
    ],
  },
  // other config options...
};

module.exports = nextConfig;
