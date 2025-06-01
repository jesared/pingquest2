// api/joueurs/route.ts

import { getPrismaClient } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as yup from "yup";

// Définir un schéma de validation avec Yup
const joueurSchema = yup.object({
  numeroLicence: yup.string().required("Le numéro de licence est requis."),
  nom: yup.string().required("Le nom est requis."),
  prenom: yup.string().required("Le prénom est requis."),
  dossard: yup.number().optional(),
  email: yup.string().email("Email invalide").optional(),
  mobile: yup.string().optional(),
  club: yup.string().optional(),
  pointsOfficiel: yup.number().optional(),
  sexe: yup.string().optional(),
  userId: yup.string().optional(), // L'ID Clerk peut être optionnel à la création (géré par le backend)
  epreuves: yup.array().of(yup.string()).optional(), // Validation des épreuves (optionnel)
});

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth(); // Renommer pour plus de clarté
  const prisma = getPrismaClient();
  const data = await request.json();

  if (!clerkUserId) {
    return NextResponse.json(
      { error: "Utilisateur non authentifié." },
      { status: 401 }
    );
  }

  try {
    // Validation des données avec Yup
    await joueurSchema.validate(data, { abortEarly: false });

    // Rechercher l'utilisateur dans notre base de données par clerkUserId
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId || undefined },
    });

    if (!existingUser) {
      console.error(`Utilisateur non trouvé pour clerkUserId: ${clerkUserId}`);
      return NextResponse.json(
        { error: "L'utilisateur associé n'existe pas." },
        { status: 400 }
      );
    }

    const joueur = await prisma.joueur.create({
      data: {
        numeroLicence: data.numeroLicence,
        nom: data.nom,
        prenom: data.prenom,

        email: data.email || null,
        mobile: data.mobile || null,
        club: data.club || null,
        dossard: data.dossard ?? null,
        pointsOfficiel: data.pointsOfficiel
          ? parseFloat(data.pointsOfficiel)
          : null,

        userId: existingUser.id, // Utiliser l'ID de notre table User
      },
    });

    return NextResponse.json({ joueur }, { status: 201 });
  } catch (error) {
    console.error(
      "Erreur lors de la vérification/création de l'utilisateur:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { userId: clerkUserId } = await auth();

  const prisma = getPrismaClient();

  // if (!userId) {
  //   return NextResponse.json({ joueurs: [] }, { status: 200 });
  // }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId || undefined },
    });

    if (!existingUser) {
      console.error(`Utilisateur non trouvé pour clerkUserId: ${clerkUserId}`);
      return NextResponse.json(
        { error: "L'utilisateur associé n'existe pas." },
        { status: 400 }
      );
    }
    const joueurs = await prisma.joueur.findMany({
      where: {
        userId: existingUser.id, // Utiliser l'ID de notre table User // 🔥 Liaison entre joueur et utilisateur connecté
      },
      include: {
        engagement: {
          include: {
            event: {
              select: {
                id: true,
                tableau: true,
                categorie: true,
                tournoi: {
                  select: { id: true, nom: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ joueurs: joueurs ?? [] }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des joueurs :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des joueurs." },
      { status: 500 }
    );
  }
}
