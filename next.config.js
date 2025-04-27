// next.config.js
const nextConfig = {
  eslint: {
    ignorDeDuringBuilds: true,
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
