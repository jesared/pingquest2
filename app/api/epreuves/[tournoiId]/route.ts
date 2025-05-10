import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const prisma = getPrismaClient();

  const { searchParams } = new URL(req.url);

  const tournoiIdParam = searchParams.get("tournoiId");
  console.log("tournoiIdParam reçu:", tournoiIdParam); // Log la valeur brute du paramètre

  const tournoiId = tournoiIdParam ? parseInt(tournoiIdParam) : null;
  console.log("tournoiId après parseInt:", tournoiId); // Log la valeur après la conversion

  if (!tournoiId || isNaN(tournoiId)) {
    console.log("Erreur: tournoiId manquant ou invalide"); // Log l'erreur de validation
    return NextResponse.json(
      { error: "Paramètre tournoiId manquant ou invalide" },
      { status: 400 }
    );
  }

  console.log("Recherche des épreuves pour le tournoiId:", tournoiId); // Log avant la requête Prisma

  try {
    const epreuves = await prisma.event.findMany({
      where: {
        tournoiId, // <- filtre ici
      },
      select: {
        id: true,
        nom: true,
        jour: true,
        heure: true,
        tableau: true,
        categorie: true,
        minPoints: true,
        maxPoints: true,
        prixAnticipe: true,
        prixSurPlace: true,
      },
      orderBy: [{ date: "asc" }, { minPoints: "asc" }],
    });

    console.log("Épreuves récupérées de la base de données:", epreuves); // Log les résultats de la requête

    return NextResponse.json(epreuves, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Erreur API /api/epreuves:", error); // Log l'erreur Prisma complète
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
