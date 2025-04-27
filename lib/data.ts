import { getPrismaClient } from "@/lib/prisma";

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
  engagement: Engagement[];
}

export async function getJoueursByUser(userClerkId: string): Promise<Joueur[]> {
  const prisma = getPrismaClient();
  try {
    const joueurs = await prisma.joueur.findMany({
      where: {
        userClerkId: userClerkId,
      },
      include: {
        engagement: {
          include: {
            event: true,
          },
        },
      },
    });
    return joueurs;
  } catch (error) {
    console.error("Erreur getJoueursByUser:", error);
    if (error instanceof Error) {
      throw new Error(`Impossible de récupérer les joueurs: ${error.message}`);
    } else {
      throw new Error(
        "Impossible de récupérer les joueurs: une erreur inconnue s'est produite."
      );
    }
  } finally {
    await prisma.$disconnect(); // Ferme la connexion
  }
}
