import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = getPrismaClient();
  const body = await req.json();
  const {
    nom,
    jour,
    heure,
    tableau,
    categorie,
    minPoints,
    maxPoints,
    prixAnticipe,
    prixSurPlace,
    tournoiId,
    // etat, // facultatif
  } = body;

  if (
    nom === undefined ||
    nom === "" ||
    jour === undefined ||
    jour === "" ||
    heure === undefined ||
    heure === "" ||
    prixAnticipe === undefined ||
    prixSurPlace === undefined ||
    tournoiId === undefined
  ) {
    return NextResponse.json(
      { error: "Champs obligatoires manquants." },
      { status: 400 }
    );
  }

  const created = await prisma.event.create({
    data: {
      nom,
      date: new Date(),
      jour,
      heure,
      tableau: tableau || nom,
      categorie: categorie || null,
      minPoints: minPoints ? Number(minPoints) : null,
      maxPoints: maxPoints ? Number(maxPoints) : null,
      prixAnticipe: Number(prixAnticipe),
      prixSurPlace: Number(prixSurPlace),

      tournoiId: Number(tournoiId),
      // etat, // facultatif
    },
  });

  return NextResponse.json(created);
}
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

  try {
    const epreuves = await prisma.event.findMany({
      where: {
        tournoiId, // <- filtre ici
      },
      select: {
        id: true,
        nom: true,
        date: true,
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
