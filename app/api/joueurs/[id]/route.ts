import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Forcer la route à être dynamique (évite les optimisations statiques)
export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = getPrismaClient();
  try {
    const { id } = await params; // Attendre que `params` soit résolu

    // Convertir l'ID en nombre si nécessaire
    const joueurId = parseInt(id, 10);
    if (isNaN(joueurId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Supprimer le joueur depuis la base de données
    const joueur = await prisma.joueur.delete({
      where: { id: joueurId },
    });

    // Retourner une réponse avec succès
    return NextResponse.json({
      message: "Joueur supprimé avec succès",
      joueur,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du joueur", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
