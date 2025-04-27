// next.config.js
const nextConfig = {
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
