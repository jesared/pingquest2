// actions/epreuves.ts

import { prisma } from "@/lib/prisma";

export async function getEpreuvesByTournoiId(tournoiId: string) {
  try {
    const epreuves = await prisma.event.findMany({
      where: {
        tournoiId: Number(tournoiId),
      },
      orderBy: {
        heure: "asc", // ou "nom" si tu veux
      },
    });

    return epreuves;
  } catch (error) {
    console.error("Erreur lors de la récupération des épreuves :", error);
    return [];
  }
}
