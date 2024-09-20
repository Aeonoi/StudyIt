/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY
  },
};

export default nextConfig;
