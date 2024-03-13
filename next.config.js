/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ipfs.io',
                port: '',
                pathname: '/ipfs/**',
            },
        ],
    },
    trailingSlash: true,
    compiler: {
        styledComponents: true,
        // Enables the styled-components SWC transform
    },
}

module.exports = nextConfig
