import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { nom, jour, heure, categorie, prixAnticipe, prixSurPlace, tournoiId } =
    await req.json();

  const updated = await prisma.event.update({
    where: { id: parseInt(id, 10) },
    data: {
      nom,
      jour,
      heure,
      categorie,
      prixAnticipe,
      prixSurPlace,
      tournoiId,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await prisma.event.delete({
    where: { id: parseInt(id) },
  });
  return NextResponse.json({ success: true });
}
