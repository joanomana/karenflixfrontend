const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
        { source: '/api/:path*', destination: `${BACKEND}/api/:path*` },
        { source: '/health', destination: `${BACKEND}/health` },
        { source: '/docs', destination: `${BACKEND}/docs` },
        ];
    },
};

export default nextConfig;