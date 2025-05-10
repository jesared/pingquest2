import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const prisma = getPrismaClient();

  const { searchParams } = new URL(req.url);

  const tournoiIdParam = searchParams.get("tournoiId");
  const tournoiId = tournoiIdParam ? parseInt(tournoiIdParam) : null;

  if (!tournoiId || isNaN(tournoiId)) {
    return NextResponse.json(
      { error: "Paramètre tournoiId manquant ou invalide" },
      { status: 400 }
    );
  }
  console.log("tournoiId", tournoiId);
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

    return NextResponse.json(epreuves, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Erreur API /api/epreuves:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
