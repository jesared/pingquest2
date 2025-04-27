// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore les erreurs ESLint pendant le build
  },
  experimental: {
    serverActions: {}, // ← objet vide, plus "true"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
