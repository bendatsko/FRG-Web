/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

}
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  output: 'standalone',
});

module.exports = withBundleAnalyzer({
  // other Next.js configurations
});

module.exports = nextConfig
