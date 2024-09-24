/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    GOOGLE_CSE: process.env.GOOGLE_CSE,
  },
};

export default nextConfig;
