/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for Vercel deployment
  compress: true,
  poweredByHeader: false,

  // External packages that should not be bundled by webpack
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
};

export default nextConfig;
