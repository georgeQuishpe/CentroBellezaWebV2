/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        forceSwcTransforms: true,
    },
    env: {
        SOCKET_SERVER_URL: process.env.SOCKET_SERVER_URL || 'http://localhost:5000'
    }
}

export default nextConfig