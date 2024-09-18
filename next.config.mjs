/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
};

export default nextConfig;
