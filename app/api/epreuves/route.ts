import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = getPrismaClient();

  try {
    const epreuves = await prisma.event.findMany({
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
