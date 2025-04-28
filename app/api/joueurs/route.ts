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
  userClerkId: yup.string().optional(), // L'ID Clerk peut être optionnel à la création (géré par le backend)
  epreuves: yup.array().of(yup.string()).optional(), // Validation des épreuves (optionnel)
});

export async function POST(request: Request) {
  const { userId } = await auth(); // Authentification Clerk
  const prisma = getPrismaClient();

  if (!userId) {
    return NextResponse.json({ joueurs: [] }, { status: 200 });
  }

  try {
    const data = await request.json();

    // Validation des données avec Yup
    await joueurSchema.validate(data, { abortEarly: false });

    // Vérifier si l'utilisateur existe dans la base de données
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Si l'utilisateur n'existe pas dans la base de données
    if (!userExists) {
      // Récupérer les informations de l'utilisateur Clerk
      const clerkUser = await fetch(
        `https://api.clerk.com/v1/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());

      if (!clerkUser) {
        return NextResponse.json(
          { error: "Utilisateur Clerk non trouvé." },
          { status: 400 }
        );
      }

      // Créer un nouvel utilisateur dans la base de données
      await prisma.user.create({
        data: {
          id: clerkUser.id,
          nom: clerkUser.last_name || "Nom inconnu",
          prenom: clerkUser.first_name || "Prénom inconnu",
          email: clerkUser.email_addresses[0]?.email_address || "",
          description: "", // Vous pouvez ajouter d'autres informations si disponibles
          technologies: "",
          job: "",
        },
      });

      // Créer le joueur après avoir créé l'utilisateur Clerk
      const joueur = await prisma.joueur.create({
        data: {
          numeroLicence: data.numeroLicence,
          nom: data.nom,
          prenom: data.prenom,
          dossard: data.dossard || null,
          email: data.email || null,
          mobile: data.mobile || null,
          club: data.club || null,
          pointsOfficiel:
            data.pointsOfficiel !== undefined
              ? parseFloat(data.pointsOfficiel as string)
              : null,
          userClerkId: userId, // Lier l'utilisateur Clerk authentifié
        },
      });

      // Création des engagements si des épreuves sont sélectionnées
      if (
        data.epreuves &&
        Array.isArray(data.epreuves) &&
        data.epreuves.length > 0
      ) {
        const engagementsData = data.epreuves.map((epreuveId: string) => ({
          joueurId: joueur.id,
          eventId: parseInt(epreuveId, 10), // Forcer en nombre
        }));

        await prisma.engagement.createMany({
          data: engagementsData,
        });
      }

      return NextResponse.json({ joueur }, { status: 201 });
    }

    // Si l'utilisateur existe déjà, créer uniquement le joueur
    const joueur = await prisma.joueur.create({
      data: {
        numeroLicence: data.numeroLicence,
        nom: data.nom,
        prenom: data.prenom,
        dossard: data.dossard || null,
        email: data.email || null,
        mobile: data.mobile || null,
        club: data.club || null,
        pointsOfficiel:
          data.pointsOfficiel !== undefined
            ? parseFloat(data.pointsOfficiel as string)
            : null,
        userClerkId: userId, // Lier l'utilisateur Clerk authentifié
      },
    });

    // Création des engagements si des épreuves sont sélectionnées
    if (
      data.epreuves &&
      Array.isArray(data.epreuves) &&
      data.epreuves.length > 0
    ) {
      const engagementsData = data.epreuves.map((epreuveId: string) => ({
        joueurId: joueur.id,
        eventId: parseInt(epreuveId, 10), // Forcer en nombre
      }));

      await prisma.engagement.createMany({
        data: engagementsData,
      });
    }

    return NextResponse.json({ joueur }, { status: 200 });
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
  const { userId } = await auth(); // Authentification Clerk
  const prisma = getPrismaClient();
  console.log(userId);
  if (!userId) {
    // 🔥 NOUVEAU : Retourner un tableau vide si pas d'utilisateur connecté
    return NextResponse.json({ joueurs: [] }, { status: 200 });
  }

  try {
    // Récupérer tous les joueurs qui sont liés à l'utilisateur Clerk
    const joueurs = await prisma.joueur.findMany({
      where: {
        userClerkId: userId, // Filtrer les joueurs par l'ID Clerk de l'utilisateur authentifié
      },
      include: {
        engagement: {
          include: {
            event: true, // Inclure les événements associés aux engagements
          },
        },
      },
    });

    // Si aucun joueur n'est trouvé
    if (joueurs.length === 0) {
      return NextResponse.json(
        { message: "Aucun joueur trouvé pour cet utilisateur." },
        { status: 404 }
      );
    }

    return NextResponse.json({ joueurs }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des joueurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des joueurs." },
      { status: 500 }
    );
  }
}
