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
      {
        protocol: "https",
        hostname: "qzovkrnlkeunrzsqfohl.supabase.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tennis2table.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tournoi.cctt.fr",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
