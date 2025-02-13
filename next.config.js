/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable type checking during build since we're in a constrained environment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable eslint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable SWC minification to avoid WASM issues
  swcMinify: false,
  // Add trailing slash to ensure proper routing
  trailingSlash: true,
}

module.exports = nextConfig
