// @ts-ignore
//import withPWAInit from 'next-pwa';
import withPWAInit from '@ducanh2912/next-pwa';
const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
 // skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Adicione esta linha para autorizar o Turbopack junto ao Webpack
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withPWA(nextConfig);