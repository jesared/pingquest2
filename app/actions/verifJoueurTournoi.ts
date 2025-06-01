import { prisma } from "@/lib/prisma";

export async function verifJoueurTournoi(
  tournoiId: number,
  numeroLicence: string
) {
  // Vérifie si le joueur existe
  const joueur = await prisma.joueur.findUnique({
    where: { numeroLicence },
    include: {
      engagement: {
        include: {
          event: {
            select: { tournoiId: true },
          },
        },
      },
    },
  });

  if (!joueur) {
    return { status: "non_inscrit" };
  }

  // Vérifie s’il est déjà inscrit à un event du tournoi donné
  const dejaInscrit = joueur.engagement.some(
    (e) => e.event.tournoiId === tournoiId
  );

  if (dejaInscrit) {
    return { status: "deja_inscrit" };
  }

  return { status: "inscriptible", joueur }; // Optionnel : retourner les infos
}
