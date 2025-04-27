import prisma from "@/lib/prisma";

// Interfaces
interface Event {
  id: number;
  nom: string;
  date: Date;
  jour: string;
  heure: string;
  tableau: string;
  categorie: string | null;
  minPoints: number | null;
  maxPoints: number | null;
}

interface Engagement {
  id: number;
  event: Event;
}

interface Joueur {
  id: number;
  userClerkId: string | null;
  dossard: number;
  numeroLicence: string;
  nom: string;
  prenom: string;
  club: string | null;
  Engagement: Engagement[];
}

export async function getJoueursByUser(userClerkId: string): Promise<Joueur[]> {
  try {
    const joueurs = await prisma.joueur.findMany({
      where: {
        userClerkId: userClerkId,
      },
      include: {
        Engagement: {
          include: {
            event: true,
          },
        },
      },
    });
    return joueurs;
  } catch (error) {
    console.error("Erreur getJoueursByUser:", error);
    throw new Error("Impossible de récupérer les joueurs");
  }
}
