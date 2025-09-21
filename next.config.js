/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bearadventures.travel', 'i0.wp.com'],
    formats: ['image/webp', 'image/avif'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async redirects() {
    return [
      // Remove WordPress patterns
      {
        source: '/wp-admin/:path*',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/wp-content/:path*',
        destination: '/404',
        permanent: true,
      },
      {
        source: '/wp-includes/:path*',
        destination: '/404',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Clean URL rewrites (remove WordPress patterns)
      {
        source: '/group-trips',
        destination: '/group-trips',
      },
      {
        source: '/plan-your-trip',
        destination: '/plan-your-trip',
      },
      {
        source: '/blog',
        destination: '/blog',
      },
      {
        source: '/about-us',
        destination: '/about',
      },
      {
        source: '/contact',
        destination: '/contact',
      },
    ];
  },
}

module.exports = nextConfig;