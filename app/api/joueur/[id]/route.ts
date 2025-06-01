// app/api/joueur/[id]/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  context: { params: Promise<{ id: string }> } // params est une PROMISE
) => {
  const resolvedParams = await context.params; // on AWAIT la promesse
  const joueurId = parseInt(resolvedParams.id);
  try {
    if (isNaN(joueurId)) {
      return NextResponse.json(
        { message: "ID de joueur invalide" },
        { status: 400 }
      );
    }

    await prisma.joueur.delete({
      where: {
        id: joueurId,
      },
    });

    return NextResponse.json({
      message: `Joueur avec l'ID ${joueurId} supprimé avec succès`,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du joueur:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la suppression du joueur" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
