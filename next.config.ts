import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            {
                protocol: 'https',
                hostname:  'res.cloudinary.com',
                pathname:  '/**',           // allow all cloudinary paths
            },
        ],
    },
    async rewrites() {
        return [
            {
                source:      '/api/:path*',
                destination: 'http://localhost:5000/api/:path*',
            },
        ];
    },
};

export default nextConfig;