/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/creative-nest-website' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/creative-nest-website/' : '',
  trailingSlash: true,
};

export default nextConfig;
