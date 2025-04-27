import { getPrismaClient } from "@/lib/prisma"; // Ton client Prisma
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const prisma = getPrismaClient();
  try {
    const { searchParams } = new URL(request.url);
    const userClerkId = searchParams.get("userClerkId");

    if (!userClerkId) {
      return NextResponse.json(
        { error: "userClerkId manquant" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({ joueurs }, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /joueurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des joueurs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    const data = await request.json();

    // 1️⃣ Création du joueur
    const joueur = await prisma.joueur.create({
      data: {
        numeroLicence: data.numeroLicence,
        nom: data.nom,
        prenom: data.prenom,
        dossard: data.dossard || null,
        email: data.email || null,
        mobile: data.mobile || null,
        club: data.club || null,
        pointsOfficiel: parseInt(data.pointsOfficiel) || null,
        userClerkId: data.userClerkId || null, // Lier l'utilisateur Clerk
      },
    });

    // 2️⃣ Création des engagements si des épreuves sont sélectionnées
    if (
      data.epreuves &&
      Array.isArray(data.epreuves) &&
      data.epreuves.length > 0
    ) {
      const engagementsData = data.epreuves.map((epreuveId: string) => ({
        joueurId: joueur.id,
        eventId: parseInt(epreuveId, 10), // 👈 ici je force en number
      }));

      await prisma.engagement.createMany({
        data: engagementsData,
      });
    }

    return NextResponse.json({ joueur }, { status: 200 });
  } catch (error) {
    console.error("Erreur POST /joueurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du joueur ou des engagements" },
      { status: 500 }
    );
  }
}
