/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the output: 'export' line to enable server-side rendering
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;