import { getPrismaClient } from "@/lib/prisma"; // 👈 Ton fichier pour connecter à la base de données (ex: avec Prisma, mysql2, etc.)
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

    return NextResponse.json(epreuves);
  } catch (error) {
    console.error("Erreur API /api/epreuves:", error);
    return new NextResponse("Erreur serveur", { status: 500 });
  }
}
