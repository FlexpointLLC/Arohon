/** @type {import('next').NextConfig} */
const nextConfig = {
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
