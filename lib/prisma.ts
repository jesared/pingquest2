import { PrismaClient } from "@prisma/client";

// Ajout d'un type pour global
declare global {
  let prisma: PrismaClient | undefined;
}

// Utiliser globalThis pour une meilleure compatibilité
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Crée une nouvelle instance de PrismaClient ou réutilise l'instance existante en développement
 */
export function getPrismaClient(): PrismaClient {
  // En production (comme sur Vercel), créer une nouvelle instance à chaque appel
  if (process.env.NODE_ENV === "production") {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }
    return globalForPrisma.prisma;
  }

  // En développement, réutiliser l'instance singleton pour éviter "too many connections"
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }

  return globalForPrisma.prisma;
}
