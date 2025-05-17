import { getPrismaClient } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schéma de validation pour l'ID
const paramsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Validation des paramètres
    const { id } = await context.params;
    const result = paramsSchema.safeParse(id);

    if (!result.success) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const prisma = getPrismaClient();

    const tournoi = await prisma.tournoi.findUnique({
      where: { id: Number(id) },
      include: {
        events: {
          orderBy: {
            date: "asc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!tournoi) {
      return NextResponse.json(
        { error: "Tournoi non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: tournoi });
  } catch (error) {
    console.error("[TOURNOI_GET]", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const prisma = getPrismaClient();

  try {
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
    } = body;

    // Construction dynamique des champs à mettre à jour
    const dataToUpdate: Record<string, unknown> = {};
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
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    // Suppression des épreuves
    if (Array.isArray(deletedEpreuves) && deletedEpreuves.length > 0) {
      await prisma.event.deleteMany({
        where: {
          id: {
            in: deletedEpreuves,
          },
        },
      });
    }

    // Ajout ou mise à jour des épreuves
    if (Array.isArray(epreuves)) {
      for (const epreuve of epreuves) {
        if (epreuve.id) {
          await prisma.event.update({
            where: { id: epreuve.id },
            data: {
              nom: epreuve.nom,
              categorie: epreuve.categorie,
              jour: epreuve.jour,
              heure: epreuve.heure,
              tableau: epreuve.nom,
              prixAnticipe: epreuve.prixAnticipe ?? 8,
              prixSurPlace: epreuve.prixSurPlace ?? 8,
              date: new Date(), // ou epreuve.date ?
            },
          });
        } else {
          await prisma.event.create({
            data: {
              nom: epreuve.nom,
              categorie: epreuve.categorie,
              jour: epreuve.jour,
              heure: epreuve.heure,
              tableau: epreuve.nom,
              prixAnticipe: epreuve.prixAnticipe ?? 8,
              prixSurPlace: epreuve.prixSurPlace ?? 8,
              date: new Date(), // ou epreuve.date ?
              tournoi: { connect: { id: Number(id) } },
            },
          });
        }
      }
    }

    return NextResponse.json(updatedTournoi); // ✅ garde uniquement celui-ci
  } catch (error) {
    console.error("[TOURNOI_PUT]", error);
    return NextResponse.json(
      {
        message: "Erreur lors de la mise à jour du tournoi",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
