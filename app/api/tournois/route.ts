import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const prisma = getPrismaClient();
    const body = await req.json();

    // Validation des épreuves
    if (!body.epreuves || body.epreuves.length === 0) {
      return NextResponse.json(
        { error: "Aucune épreuve trouvée" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        clerkUserId: body.userId,
      },
    });

    console.log("user", user);
    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 400 }
      );
    }

    // Validation des dates (startDate et endDate)
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Dates de début ou de fin invalides" },
        { status: 400 }
      );
    }

    // Création du tournoi
    const tournoi = await prisma.tournoi.create({
      data: {
        nom: body.nom,
        lieu: body.lieu,
        afficheUrl: body.afficheUrl,
        reglementUrl: body.reglementUrl,
        description: body.description,
        responsableNom: body.responsableNom,
        responsableEmail: body.email,
        responsableTelephone: body.telephone,
        debut: startDate,
        fin: endDate,
        statut: "BROUILLON",
        user: {
          connect: {
            id: user.id,
          },
        },
        events: {
          create: body.epreuves.map(
            (epreuve: {
              nom: string;
              categorie: string;
              minPoints: string;
              maxPoints: string;
              jour: string;
              date: string;
              heure: string;
              tarif: string;
            }) => {
              return {
                nom: epreuve.nom,
                tableau: epreuve.nom,
                categorie: epreuve.categorie,
                minPoints: parseInt(epreuve.minPoints, 10),
                maxPoints: parseInt(epreuve.maxPoints, 10),
                jour: epreuve.jour,
                date: startDate,
                heure: epreuve.heure,
                prixAnticipe: parseFloat(epreuve.tarif),
                prixSurPlace: parseFloat(epreuve.tarif),
                placesMax: 0, // A ajuster selon ta logique
              };
            }
          ),
        },
      },
    });

    return NextResponse.json(tournoi);
  } catch (err) {
    console.error(err);
    const errorMessage =
      err instanceof Error ? err.message : "Erreur lors de la création";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
export async function GET() {
  try {
    const prisma = getPrismaClient();

    const tournois = await prisma.tournoi.findMany({
      where: {
        statut: "PUBLIE",
      },
      include: {
        events: true, // récupère les épreuves associées
        user: {
          select: {
            id: true,
            clerkUserId: true,
            email: true,
          },
        },
      },
      orderBy: {
        debut: "desc",
      },
    });

    return NextResponse.json(tournois);
  } catch (err) {
    console.error("Erreur lors de la récupération des tournois:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération" },
      { status: 500 }
    );
  }
}
