import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = getPrismaClient();

  try {
    const data = await req.json();
    const { joueurId, tournoiId, eventIds } = data;

    if (!joueurId || !tournoiId || !Array.isArray(eventIds)) {
      return NextResponse.json(
        { error: "Données manquantes ou invalides" },
        { status: 400 }
      );
    }

    // 1. Récupère les engagements actuels du joueur pour ce tournoi
    const engagementsActuels = await prisma.engagement.findMany({
      where: {
        joueurId: Number(joueurId),
        event: { tournoiId: Number(tournoiId) },
      },
      select: { eventId: true },
    });

    const actuels = engagementsActuels.map((e) => e.eventId);
    const nouveaux = eventIds
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((e: any) => {
        if (typeof e === "object" && e !== null && "eventId" in e) {
          return (
            e.eventId !== undefined &&
            e.eventId !== null &&
            !isNaN(Number(e.eventId))
          );
        }
        return e !== null && e !== undefined && !isNaN(Number(e));
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((e: any) =>
        typeof e === "object" && e !== null ? Number(e.eventId) : Number(e)
      );
    console.log("aSupprimer", actuels, "nouveaux", nouveaux);
    // 2. Détecte ce qu'il faut ajouter ou supprimer
    const aAjouter = nouveaux.filter((eid) => !actuels.includes(eid));
    const aSupprimer = actuels.filter((eid) => !nouveaux.includes(eid));

    // 3. Ajoute les nouveaux engagements
    if (aAjouter.length > 0) {
      await prisma.engagement.createMany({
        data: aAjouter.map((eventId) => ({
          joueurId: Number(joueurId),
          eventId: Number(eventId),
        })),
        skipDuplicates: true,
      });
    }

    // 4. Supprime les engagements qui ne sont plus présents
    if (aSupprimer.length > 0) {
      await prisma.engagement.deleteMany({
        where: {
          joueurId: Number(joueurId),
          eventId: { in: aSupprimer },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ENGAGEMENTS_API_ERROR]", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour des engagements",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
