/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    deviceSizes: [640, 768, 1024, 1280, 1536],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
