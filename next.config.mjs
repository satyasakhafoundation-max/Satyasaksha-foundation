/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow external image domains used in the project
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    // Prefer WebP and AVIF modern formats for smaller file sizes
    formats: ['image/avif', 'image/webp'],
    // Cache images aggressively (1 week TTL)
    minimumCacheTTL: 604800,
  },
  // Enable response compression
  compress: true,
  // Disable X-Powered-By header for security
  poweredByHeader: false,
};

export default nextConfig;
