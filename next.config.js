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
    ],
  },
  async redirects() {
    return [
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
