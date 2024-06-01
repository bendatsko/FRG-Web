/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
   output: 'standalone',
}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // other Next.js configurations
});

module.exports = nextConfig
