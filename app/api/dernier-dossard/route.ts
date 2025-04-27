import prisma from "@/lib/prisma"; // adapte selon ton setup DB
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dernierJoueur = await prisma.joueur.findFirst({
      orderBy: { dossard: "desc" }, // Le joueur avec le plus grand dossard
    });

    return NextResponse.json({ dernierDossard: dernierJoueur?.dossard || 0 });
  } catch (error) {
    console.error("Erreur récupération dernier dossard:", error);
    return NextResponse.json({ dernierDossard: 0 });
  }
}
