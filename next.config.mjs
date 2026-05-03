/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/CardToo',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
