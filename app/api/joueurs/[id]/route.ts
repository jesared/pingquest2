import { getPrismaClient } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const prisma = getPrismaClient();
  try {
    const joueurId = parseInt(params.id, 10);
    if (isNaN(joueurId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.joueur.delete({
      where: { id: joueurId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression joueur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du joueur" },
      { status: 500 }
    );
  }
}
