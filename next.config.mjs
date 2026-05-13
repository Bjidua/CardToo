const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  // basePath hanya digunakan saat produksi (deploy ke GitHub Pages)
  basePath: isProd ? '/CardToo' : '',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
