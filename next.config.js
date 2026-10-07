/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      'next/dist/build/polyfills/polyfill-module': './lib/modern-polyfill.js',
    },
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
    optimizeCss: true,
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'arohon.co', pathname: '/**' },
    ],
  },
  async redirects() {
    return [
      { source: '/services/go-anywhere', destination: '/ride', permanent: true },
      { source: '/services/ride-more', destination: '/services/airport', permanent: true },
      { source: '/services/daily', destination: '/services/ambulance', permanent: true },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.arohon.co' }],
        destination: 'https://arohon.co/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
