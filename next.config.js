/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        {
          protocol: 'https',
          hostname: 'uploadthing.com',
        },
        {
          protocol: 'https',
          hostname: 'utfs.io',
        },
        {
          protocol: 'https',
          hostname: 'img.clerk.com',
        },
        {
          protocol: 'https',
          hostname: 'subdomain',
        },
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        ],
      },
    experimental: {
      googleMaps: true
    },
      reactStrictMode: false,
}

module.exports = nextConfig
