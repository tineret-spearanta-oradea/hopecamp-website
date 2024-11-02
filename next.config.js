/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com", // Add Firebase Storage domain
    ],
  },
  // other config options...
};

module.exports = nextConfig;
