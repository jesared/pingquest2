// app/api/verif-joueur/route.ts
import { verifJoueurTournoi } from "@/app/actions/verifJoueurTournoi";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { tournoiId, numeroLicence } = await req.json();

    if (!tournoiId || !numeroLicence) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const result = await verifJoueurTournoi(tournoiId, numeroLicence);

    switch (result.status) {
      case "non_inscrit":
      case "inscriptible":
        return NextResponse.json(result);
      case "deja_inscrit":
        return NextResponse.json(
          { error: "Joueur déjà inscrit à ce tournoi" },
          { status: 409 }
        );
      default:
        return NextResponse.json({ error: "Statut inconnu" }, { status: 500 });
    }
  } catch (error) {
    console.error("Erreur API verif-joueur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
