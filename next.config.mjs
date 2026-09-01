/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'dttraining.co.nz',
            },
            {
                protocol: 'https',
                hostname: 'stepanyan.me',
            },
            {
                protocol: 'https',
                hostname: 'dt-dtus.stepanyan.me',
            },
            {
                protocol: 'https',
                hostname: 'www.drivingtests.co.nz',
            },


        ]

    },
};

export default nextConfig;
