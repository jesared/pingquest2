import { getPrismaClient } from "@/lib/prisma";
import { Tournoi } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  const prisma = getPrismaClient();

  try {
    const { id } = context;

    if (!id) {
      return NextResponse.json({ error: "ID non fourni" }, { status: 400 });
    }
    const tournoi = await prisma.tournoi.findUnique({
      where: { id: Number(id) }, // Convertir l'ID en nombre
      include: {
        events: true,
        user: true,
      },
    });

    if (!tournoi) {
      return NextResponse.json(
        { error: "Tournoi non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(tournoi);
  } catch (error) {
    console.error("Erreur lors de la récupération du tournoi :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Fermer la connexion à Prisma
  }
}

export async function PUT(req: Request, context: any) {
  const prisma = getPrismaClient();
  try {
    const { id } = context;

    const body = await req.json();

    const {
      nom,
      lieu,
      description,
      statut,
      afficheUrl,
      responsableNom,
      responsableEmail,
      responsableTelephone,
      startDate,
      endDate,
      epreuves,
      deletedEpreuves,
      // Tableau d'épreuves depuis le formulaire
    } = body;

    const dataToUpdate: Partial<Tournoi> = {};
    if (nom !== undefined) dataToUpdate.nom = nom;
    if (lieu !== undefined) dataToUpdate.lieu = lieu;
    if (description !== undefined) dataToUpdate.description = description;
    if (statut !== undefined) dataToUpdate.statut = statut;
    if (afficheUrl !== undefined) dataToUpdate.afficheUrl = afficheUrl;
    if (responsableNom !== undefined)
      dataToUpdate.responsableNom = responsableNom;
    if (responsableEmail !== undefined)
      dataToUpdate.responsableEmail = responsableEmail;
    if (responsableTelephone !== undefined)
      dataToUpdate.responsableTelephone = responsableTelephone;
    if (startDate !== undefined) dataToUpdate.debut = new Date(startDate);
    if (endDate !== undefined) dataToUpdate.fin = new Date(endDate);

    const updatedTournoi = await prisma.tournoi.update({
      where: { id },
      data: dataToUpdate,
    });

    // Gestion des épreuves
    if (deletedEpreuves && Array.isArray(deletedEpreuves)) {
      await prisma.event.deleteMany({
        where: {
          id: {
            in: deletedEpreuves,
          },
        },
      });
    }

    if (epreuves && Array.isArray(epreuves)) {
      for (const epreuveData of epreuves) {
        if (epreuveData.id && typeof epreuveData.id === "number") {
          // Mise à jour d'une épreuve existante
          await prisma.event.update({
            where: { id: epreuveData.id },
            data: {
              nom: epreuveData.nom,
              categorie: epreuveData.categorie,
              jour: epreuveData.jour,
              heure: epreuveData.heure,
              tableau: epreuveData.nom,

              // ... autres propriétés
            },
          });
        } else {
          // Création d'une nouvelle épreuve
          await prisma.event.create({
            data: {
              nom: epreuveData.nom,
              categorie: epreuveData.categorie,
              jour: epreuveData.jour,
              heure: epreuveData.heure,
              date: new Date(),
              tableau: epreuveData.nom,
              prixAnticipe: 8,
              prixSurPlace: 8,
              tournoi: { connect: { id } },
              // ... autres propriétés (sans inclure l'ID)
            },
          });
        }
      }
    }

    return NextResponse.json(dataToUpdate);

    return NextResponse.json(updatedTournoi);
  } catch (error) {
    console.error("[TOURNOI_PUT]", error);
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la mise à jour du tournoi",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
