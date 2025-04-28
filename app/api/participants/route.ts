import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = getPrismaClient();

  try {
    const joueurs = await prisma.joueur.findMany({
      select: {
        id: true,
        dossard: true,
        numeroLicence: true,
        nom: true,
        prenom: true,
        club: true,
        pointsOfficiel: true,
        engagement: {
          select: {
            id: true,
            event: {
              select: {
                id: true,
                tableau: true,
              },
            },
          },
        },
      },
      orderBy: {
        nom: "asc", // Tri alphabétique par nom
      },
    });
    if (!joueurs.length) {
      return NextResponse.json(
        { message: "Aucun joueur trouvé" },
        { status: 200 } // 200 plutôt que 404 car une liste vide est valide
      );
    }

    return NextResponse.json(joueurs, {
      status: 200,

      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: process.env.NODE_ENV === "development",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
